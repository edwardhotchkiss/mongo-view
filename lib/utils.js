
/*!
  @class utils
  MongoDB Utility Methods
*/

var complete = 0;

/*!
  @method find
  @public
  .find within a collection
 */

exports.find = function(mongoose, collection, query, callback) {
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