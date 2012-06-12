
/**
 * @list module dependencies
 **/

var fs = require('fs')
  , path = require('path')
  , express = require('express')
  , mongoose = require('mongoose')
  , app = exports.app = express.createServer()
  , SECRET = process.env.SECRET || 'DONT/TAZE/ME/BRO!'
  , MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/test';

/**
 * @middleware checkConnected
 **/

var checkConnected = require(__dirname + '/../middleware/checkConnected');

/**
 * configure express
 **/

app.configure(function() {
  app.use(express.static(path.normalize(__dirname + '/../../public')));
  app.set('views', path.normalize(__dirname + '/../views'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret:SECRET
  }));
  app.set('view engine', 'ejs');
  app.set('view options', { layout: false });
});

// serve javascript assets
app.get('/js/app.min.js', function(request, response) {
  var compiledJavascript = '';
  var __jsdirname = __dirname + '/../../public/js';
  // vendored js
  var vendorDependencies = [
    __jsdirname + '/vendor/jquery-1.7.2.min.js',
    __jsdirname + '/vendor/jquery.tmpl.js',
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
    __jsdirname + '/mongodbviewer.js'
  ];
  // merge dependencies in order
  var applicationDependencies = vendorDependencies.concat(projectDependencies);
  // iterate over files reading them in
  applicationDependencies.map(function(_file) {
    compiledJavascript += fs.readFileSync(_file, 'utf8');
  });
  fs.writeFile(__jsdirname + '/app.compiled.js', compiledJavascript, function(error) {
    if (error) {
      throw new Error(error);
    } else {
      console.log('> mongodb-viewer serving js ....');
      response.writeHead({
        contentType: 'text/javascript'
      });
      response.end(compiledJavascript);
    }
  });
});

// index page
app.get('/', function(request, response) {
  response.render('index');
});

// connect to mongoose
app.post('/api/connect', function(_request, _response) {
  var MONGO_DB = _request.body['connection-string'];
  mongoose.connect(MONGO_DB);
  // wait for connection to open
  mongoose.connection.on('open', function() {
    // set session MONGO_DB (we're connected)
    _request.session.MONGO_DB = MONGO_DB;
    var db_name = _request.body['connection-string'].split('/');
    db_name = db_name[db_name.length - 1];
    _request.session.db_name = db_name;
    _response.redirect('/database/' + db_name);
  });
  // send error on emit
  mongoose.connection.on('error', function(error) {
    _response.send(error, 500);
  });
});

// get database collections with collection counts
app.get('/api/database/:database', checkConnected, function(request, response) {
  mongodb.getCollectionsWithCount(mongoose, function(error, collections) {
    if (error) {
      response.send(error, 500);
    } else {
      response.render('collections', {
        locals : {
          collections : collections,
          db_name     : request.params.database
        }
      });
    };
  });
});

// display collection item
app.get('/api/database/:database/collection/:collection', checkConnected, function(request, response) {
  mongodb.find(mongoose, request.params.collection, {}, function(error, collection) {
    if (error) {
      response.send(error, 500);
    } else {
      response.render('collection', {
        locals : {
          collectionName : request.params.collection,
          collection     : collection
        }
      });
    }
  });
});

// display individual collection item
app.get('/api/database/:database/collection/:collection/:id', checkConnected, function(request, response) {
  mongodb.findItem(mongoose, request.params.collection, request.params.id, {}, function(error, item) {
    if (error) {
      response.send(error, 500);
    } else {
      response.render('item', {
        locals : {
          item           : item,
          id             : request.params.id,
          collectionName : request.params.collection
        }
      });
    }
  });
});

/**
 * REST
 **/

// PUT
app.put('/api/database/:database/collections/:collection/create', checkConnected, function(request, response) {
  mongodb.create(mongoose, request.params['collection'], request.body, function(error, doc) {
    if (error) {
      response.send(error, 500);
    } else {
      response.send(doc);
    }
  });
});

// GET
app.get('/api/database/:database/collections/:collection/all', checkConnected, function(request, response) {
  mongodb.find(mongoose, request.params.collection, {}, function(error, collection) {
    if (error) {
      response.send(error, 500);
    } else {
      response.send(collection);
    };
  });
});

app.get('/api/database/:database/collections/:collection/find/:params', function(request, response) {
  var params = querystring.parse(request.params['params']);
  mongodb.find(mongoose, request.params.collection, params, function(error, collection) {
    if (error) {
      response.send(error, 500);
    } else {
      response.send(collection);
    };
  });
});

// POST
app.post('/api/database/:database/collections/:collection/update', checkConnected, function(request, response) {
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
});

// DELETE
app['delete']('/database/:database/collections/:collection/delete', checkConnected, function(request, response) {
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
});

/**
 * @description Catch-All for HTML5
 **/

// index page
app.get('*', function(request, response) {
  response.render('index');
});

/* EOF */

/* EOF */