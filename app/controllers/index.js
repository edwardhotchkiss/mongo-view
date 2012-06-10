
/**
 * @list dependencies
 **/

var MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/dash';

/**
 * @description export controllers
 * Preserve `mongoose` & `mongoose.connection` context
 **/

module.exports = function(app, mongoose) {
  
  // index page
  app.get('/', function(request, response) {
    response.render('index',  {
      locals : {
        MONGO_DB : MONGO_DB
      }
    });
  });

  // connect to mongoose
  app.post('/', function(_request, _response) {
    var MONGO_DB = _request.body['connection-string'];
    mongoose.connect(MONGO_DB);
    mongoose.connection.on('open', function(){
      _request.session.connected = true;
      var db_name = _request.body['connection-string'].split('/');
      db_name = db_name[db_name.length - 1];
      var db_route = '/database/' + db_name;
      _response.redirect(db_route);
    });
    mongoose.connection.on('error', function(error){
      _response.send(error, 500);
    });
  });

};

/* EOF */