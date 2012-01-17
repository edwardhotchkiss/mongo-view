
/*!
  @class utils
  MongoDB Utility Methods
 */

/*!
  @method find
  .find within a collection
 */

var find = exports.find = function(collection, query, callback) {
  mongoose.connection.db.collection(collection, function(error, collection) {
    collection.find(query).toArray(callback);
  });
};

/* EOF */