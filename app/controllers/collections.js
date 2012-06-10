
/**
 * @list deps
 */

var path = require('path')
  , mongodb = require(path.normalize(__dirname + '/../lib/mongodb'))
  , MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/test';

/**
 * @description export controllers
 * Preserve `mongoose` & `mongoose.connection` context
 */

module.exports = function(app, mongoose) {
  
  // get database collections with collection counts
  app.get('/database/:database', function(request, response) {
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
  app.get('/database/:database/collections/:collection', function(request, response) {
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

};

/* EOF */