
/*!
  @class utils
  MongoDB Utility Methods
*/

var complete = 0
  , mongoose = require('mongoose')

/*!
  @method find
  @public
  .find within a collection
 */

exports.find = function(mongoose, collection, query, callback) {
  if ('_id' in params) {
    params['_id'] = mongoose.mongo.BSONPure.ObjectID.fromString(params['_id']);
  };
  mongoose.connection.db.collection(collection, function(error, collection) {
    collection.find(query).toArray(callback);
  });
};

/*!
  @method getCollectionsWithCount
  @public
  @param {Function} callback
 */

exports.getCollectionsWithCount = function(mongoose, callback) {
  mongoose.connection.db.collectionNames(function(error, collections) {
    if (error) {
      callback(error, null);
    } else {
      collections.map(function(item, i){
        item.name = item.name.split('.').pop();
        if (item.name === 'indexes') {
          delete collections[i];
        }
        mongoose.connection.db.collection(item.name, function(error, collection) {
          if (error) {
            callback(error, null);
          } else {
            collection.find({}).count(function(error, cnt) {
              if (error) {
                callback(error, null);
              } else {
                item.count = cnt;
                complete++;
                if (complete === collections.length) {
                  callback(null, collections);
                };
              }
            });
          }
        });
      });
    };
  });
};

/*!
  @method create
  @public
  @param {Function} callback
 */

exports.create = function(mongoose, collectionName, params, callback) {
  mongoose.connection.db.collection(collectionName, function(error, collection) {
    if (error) {
      callback(error);
    } else {
      collection.insert(params, callback);
    };
  });
};

/*!
  @method update
  @public
  @param {Function} callback
 */

exports.update = function(mongoose, collectionName, params, callback) {
  if ('_id' in params) {
    params['_id'] = mongoose.mongo.BSONPure.ObjectID.fromString(params['_id']);
  };
  mongoose.connection.db.collection(collectionName, function(error, collection) {
    if (error) {
      callback(error);
    } else {
      collection.findAndUpdate(params, callback);
    };
  });
};

/* EOF */