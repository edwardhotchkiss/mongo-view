
/**
 * @list module dependencies
 **/

var db
  , client
  , fs = require('fs')
  , path = require('path')
  , mongodb = require('mongodb')
  , express = require('express')
  , querystring = require('querystring')
  , exec = require('child_process').exec
  , RedisStore = require('connect-redis')(express)
  , MemoryStore = express.session.MemoryStore
  , app = exports.app = express.createServer()
  , sessionSecret = 'DONT/TAZE/ME/BRO!';

/**
 * @middleware checkConnected
 **/

var checkConnected = require(__dirname + '/../middleware/checkConnected');

/**
 * @lib mongodb
 **/

var mongo_util = require('./mongo-util');

/**
 * configure express
 **/

app.configure('development', function() {
  console.log('> mongo-view configuring for DEVELOPMENT'.yellow);
  // prevent public from being hit
  /*var cssFile = __dirname + '/../../public/css/app.min.css';
  var jsFile = __dirname + '/../../public/js/app.min.js';
  fs.unlinkSync(cssFile);
  fs.unlinkSync(jsFile);*/
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({
    secret : sessionSecret,
    maxAge : new Date(Date.now() + 3600000),
    store  : new MemoryStore() 
  }));
  app.use(express.logger('tiny'));
  app.use(express.static(__dirname + '/../../public'));
});

app.configure('production', function() {
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({
    secret : sessionSecret,
    maxAge : new Date(Date.now() + 3600000),
    store  : new RedisStore({ host : '127.0.0.1', port : 6379 })
  }));
  app.use(express.logger());
  app.use(express.static(__dirname + '/../../public'));
});

// serve javascript
app.get('/js/app.min.js', function(request, response, next) {
  if (process.env.NODE_ENV == 'production') {
    next();
  } else {
    console.log('> mongo-view serving DEVELOPMENT javascript'.yellow);
    var compiledJavascript = '';
    var __jsdirname = __dirname + '/../../public/js';
    // vendored js
    var vendorDependencies = [
      __jsdirname + '/vendor/jquery-1.7.2.min.js',
      __jsdirname + '/vendor/jquery.mustache.js',
      __jsdirname + '/vendor/notify.jquery.js',
      __jsdirname + '/vendor/spine/spine.js',
      __jsdirname + '/vendor/spine/route.js',
      __jsdirname + '/vendor/spine/ajax.js',
      __jsdirname + '/vendor/spine/list.js',
      __jsdirname + '/vendor/spine/manager.js',
      __jsdirname + '/vendor/spine/local.js',
      __jsdirname + '/vendor/spine/relation.js'
    ];
    // our project's js
    var projectDependencies = [
      __jsdirname + '/mongo-view.js'
    ];
    // merge dependencies in order
    var applicationDependencies = vendorDependencies.concat(projectDependencies);
    // iterate over files reading them in
    applicationDependencies.map(function(_file) {
      compiledJavascript += fs.readFileSync(_file, 'utf8');
    });
    // send
    response.writeHead(200, {
      'Content-Type': 'application/javascript'
    });
    response.end(compiledJavascript);
  }
});

// serve css
app.get('/css/app.min.css', function(request, response, next) {
  if (process.env.NODE_ENV == 'production') {
    next();
  } else {
    console.log('> mongo-view serving DEVELOPMENT styles'.yellow);
    // lessc
    var CMD = 'lessc public/less/index.less public/css/app.min.css -compress';
    exec(CMD, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error);
      } else {
        var __cssdirname = __dirname + '/../../public/css';
        var CSS = fs.readFileSync(__cssdirname + '/app.min.css', 'utf8');
        fs.unlinkSync(__cssdirname + '/app.min.css');
        // send
        response.writeHead(200, {
          'Content-Type' : 'text/css'
        });
        response.end(CSS);
      };
    });
  };
});

// connect to mongodb
app.get('/api/connect', function(_request, _response) {
  var MONGO_DB = _request.query['connection-string'];
  var db_name = MONGO_DB.split('/')[3];
  var _client = mongodb.connect(MONGO_DB, function(_error, _db) {
    if (_error) {
      _response.send(_error);
    } else {
      db = _db;
      client = _client;
      _request.session.connected = true;
      _request.session.MONGO_DB = MONGO_DB;
      _response.send({
        db_name : db_name
      });
    };
  });
});

// disconnect from mongodb
app.get('/api/disconnect', function(_request, _response) {
  mongo_util.disconnect(db, function(_error) {
    if (_error) {
      _response.send(_error, 500);
    } else {
      _request.session.destroy(function(){
        _response.send({ message : 'disconnected' });
      });
    }
  });
});

// get database collections with collection counts
app.get('/api/database/:database', checkConnected, function(_request, _response) {
  mongo_util.getCollectionsWithCount(db, function(_error, _collections) {
    if (_error) {
      _response.send(_error, 500);
    } else {
      _response.send(_collections);
    };
  });
});

// display collection item
app.get('/api/database/:database/collection/:collection', checkConnected, function(_request, _response) {
  mongo_util.find(db, _request.params.collection, {}, function(error, collection) {
    if (error) {
      _response.send(error, 500);
    } else {
      _response.send(collection);
    }
  });
});

// display individual collection item
app.get('/api/database/:database/collection/:collection/:id', checkConnected, function(_request, _response) {
  mongo_util.findItem(db, _request.params.collection, _request.params.id, {}, function(error, item) {
    if (error) {
      _response.send(error, 500);
    } else {
      _response.send(item);
    }
  });
});

/**
 * REST
 **/

// PUT
app.put('/api/database/:database/collections/:collection/create', checkConnected, function(_request, _response) {
  mongo_util.create(db, _request.params['collection'], _request.body, function(error, doc) {
    if (error) {
      response.send(error, 500);
    } else {
      response.send(doc);
    }
  });
});

// POST
app.post('/api/database/:database/collections/:collection/update', checkConnected, function(_request, _response) {
  var params = querystring.parse(_request.params['params']);
  mongo_util.update(db, _request.params['collection'], params, function(error, doc) {
    if (error) {
      _response.send(error, 500);
    } else {
      _response.send(doc);
    }
  });
});

// DELETE
app['delete']('/database/:database/collections/:collection/delete', checkConnected, function(_request, _response) {
  var params = querystring.parse(_request.params['params']);
  mongo_util.remove(db, _request.params['collection'], params, function(error, result) {
    if (error) {
      _response.send(error, 500);
    } else {
      _response.send(result);
    }
  });
});

/**
 * @description Catch-All for HTML5
 **/

app.get('/database/*', function(_request, _response) {
  var html = path.normalize(__dirname + '/../../public/index.html');
  _response.sendfile(html);
});

/* EOF */