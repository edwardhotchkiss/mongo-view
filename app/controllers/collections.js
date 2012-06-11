
/**
 * @list deps
 */

var path = require('path')
  , mongodb = require(path.normalize(__dirname + '/../lib/mongodb'))
  , MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/test';

/**
 * @middleware checkConnected
 **/

var checkConnected = require(__dirname + '/../middleware/checkConnected');

/**
 * @description export controllers
 * Preserve `mongoose` & `mongoose.connection` context
 */

module.exports = function(app, mongoose) {

  // get database collections with collection counts
  app.get('/database/:database', checkConnected, function(request, response) {
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
  app.get('/database/:database/collection/:collection', checkConnected, function(request, response) {
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
  app.get('/database/:database/collection/:collection/:id', checkConnected, function(request, response) {
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

};

/* EOF */