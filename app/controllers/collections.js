
/*!
  module dependencies
 */

var path = require('path')
  , mongodb = require(path.normalize(__dirname + '/../lib/mongodb'))
  , MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/test';

/*!
  middleware
 */

var checkConnected = require(__dirname + '/../middleware/checkConnected');

/*!
  export controllers
  Preserve `mongoose` & `mongoose.connection` context
 */

module.exports = function(app, mongoose) {
  
  // get database collections with collection counts
  app.get('/database/:database', checkConnected, function(request, response) {
    mongodb.getCollectionsWithCount(mongoose, function(error, collections) {
      response.render('collections', {
        locals : { 
          collections : collections,
          db_name     : request.params.database
        }
      });
    });
  });

  // display collection item
  app.get('/database/:database/collections/:collection', checkConnected, function(request, response) {
    mongodb.find(mongoose, request.params.collection, {}, function(error, collection) {
      if (error) {
        throw new Error(error);
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