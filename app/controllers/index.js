
/*!
  controller::index
 */

/*!
  module dependencies
 */

var MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/test';

/*!
  middleware
 */

var checkConnected = require(__dirname + '/../middleware/checkConnected');

/*!
  export controllers
  Preserve `mongoose` & `mongoose.connection` context
 */

module.exports = function(app, mongoose) {
  
  // index page
  app.get('/', function(request, response) {
    response.render('index',  {
      MONGO_DB : MONGO_DB
    });
  });

  // connect to mongoose
  app.post('/', function(request, response) {
    mongoose.connect(request.body['connection-string']);
    mongoose.connection.on('open', function(){
      request.session.connected = true;
      var db_name = request.body['connection-string'].split('/');
      db_name = db_name[db_name.length - 1];
      var db_route = '/database/' + db_name;
      response.redirect(db_route);
    });
    mongoose.connection.on('error', function(error){
      throw new Error(error);
    });
  });

};

/* EOF */