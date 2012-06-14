
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
  , app = exports.app = express.createServer()
  , SECRET = process.env.SECRET || 'DONT/TAZE/ME/BRO!'
  , MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/dash';

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

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({
    secret : SECRET,
    maxAge : new Date(Date.now() + 3600000),
    store : new RedisStore({ host : '127.0.0.1', port : 6379 })
  }));
  app.use(express.logger('tiny'));
  app.use(express.static(__dirname + '/../../public'));
});

// serve javascript
app.get('/js/app.min.js', function(request, response, next) {
  if (process.env.NODE_ENV == 'production') {
    return next();
  };
  var compiledJavascript = '';
  var __jsdirname = __dirname + '/../../public/js';
  // vendored js
  var vendorDependencies = [
    __jsdirname + '/vendor/jquery-1.7.2.min.js',
    __jsdirname + '/vendor/jquery.mustache.js',
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
  response.writeHead({
    contentType: 'text/javascript'
  });
  response.end(compiledJavascript);
});

// serve css
app.get('/css/app.min.css', function(request, response, next) {
  if (process.env.NODE_ENV == 'production') {
    return next();
  };
  // lessc
  var CMD = 'lessc public/less/main.less public/css/app.min.css -compress';
  exec(CMD, function (error, stdout, stderr) {
    if (error) {
      throw new Error(error);
    } else {
      var __cssdirname = __dirname + '/../../public/css';
      var CSS = fs.readFileSync(__cssdirname + '/app.min.css', 'utf8');
      fs.unlinkSync(__cssdirname + '/app.min.css');
      // send
      response.writeHead({
        contentType: 'text/css'
      });
      response.end(CSS);
    };
  });
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
app.get('/api/database/:database/collection/:collection', checkConnected, function(request, response) {
  mongo_util.find(db, request.params.collection, {}, function(error, collection) {
    if (error) {
      response.send(error, 500);
    } else {
      response.send(collection);
    }
  });
});

// display individual collection item
app.get('/api/database/:database/collection/:collection/:id', checkConnected, function(request, response) {
  mongo_util.findItem(db, request.params.collection, request.params.id, {}, function(error, item) {
    if (error) {
      response.send(error, 500);
    } else {
      response.send(item);
    }
  });
});

/**
 * REST
 **/

// GET
/*app.get('/api/database/:database/collections/:collection/all', checkConnected, function(request, response) {
  mongodb.find(mongoose, request.params.collection, {}, function(error, collection) {
    if (error) {
      response.send(error, 500);
    } else {
      response.send(collection);
    };
  });
});*/

// PUT
/*app.put('/api/database/:database/collections/:collection/create', checkConnected, function(request, response) {
  mongodb.create(mongoose, request.params['collection'], request.body, function(error, doc) {
    if (error) {
      response.send(error, 500);
    } else {
      response.send(doc);
    }
  });
});*/

/*app.get('/api/database/:database/collections/:collection/find/:params', function(request, response) {
  var params = querystring.parse(request.params['params']);
  mongodb.find(mongoose, request.params.collection, params, function(error, collection) {
    if (error) {
      response.send(error, 500);
    } else {
      response.send(collection);
    };
  });
});*/

// POST
/*app.post('/api/database/:database/collections/:collection/update', checkConnected, function(request, response) {
  var params = querystring.parse(request.params['params']);
  if ('_id' in params) {
    params['_id'] = mongoose.mongo.BSONPure.ObjectID.fromString(params['_id']);
  };
  mongodb.update(mongoose, request.params['collection'], params, function(error, doc) {
    if (error) {
      response.send(error, 500);
    } else {
      response.send(doc);
    }
  });
});*/

// DELETE
/*app['delete']('/database/:database/collections/:collection/delete', checkConnected, function(request, response) {
  var params = querystring.parse(request.params['params']);
  if ('_id' in params) {
    params['_id'] = mongoose.mongo.BSONPure.ObjectID.fromString(params['_id']);
  };
  mongodb.remove(mongoose, request.params['collection'], params, function(error, result) {
    if (error) {
      response.send(error, 500);
    } else {
      response.send(result);
    }
  });
});*/

/**
 * @description Catch-All for HTML5
 **/

app.get('/database/*', function(request, response) {
  var html = path.normalize(__dirname + '/../../public/index.html');
  response.sendfile(html);
});

/* EOF */