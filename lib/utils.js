
/*!
  @class utils
  MongoDB Utility Methods
*/

var complete = 0;

/*!
  @method find
  .find within a collection
 */

exports.find = function(mongoose, collection, query, callback) {
  mongoose.connection.db.collection(collection, function(error, collection) {
    collection.find(query).toArray(callback);
  });
};

/*!
  @method getCollectionsWithCount
  @param {Function} callback
 */

exports.getCollectionsWithCount = function(mongoose, callback) {
  mongoose.connection.db.collectionNames(function(error, collections) {
    if (error) {
      throw new Error(error);
    } else {
      collections.map(function(item, i){
        item.name = item.name.split('.').pop();
        mongoose.connection.db.collection(item.name, function(error, collection) {
          if (error) {
            throw new Error(error);
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