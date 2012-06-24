
/**
 * @controller assets
 **/

module.exports = function(app) {

  // serve javascript
  app.get('/js/app.min.js', function(request, response, next) {
    console.log('> mongo-view serving DEVELOPMENT javascript'.yellow);
    var compiledJavascript = '';
    var __jsdirname = __dirname + '/../../public/js';
    // vendored js
    var vendorDependencies = [
      __jsdirname + '/vendor/jquery-1.7.2.min.js',
      __jsdirname + '/vendor/handlebars-1.0.0.beta.6.js',
      __jsdirname + '/vendor/notify.jquery.js',
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
      __jsdirname + '/mongo-view.js'
    ];
    // merge dependencies in order
    var applicationDependencies = vendorDependencies.concat(projectDependencies);
    // iterate over files reading them in
    applicationDependencies.map(function(_file) {
      compiledJavascript += fs.readFileSync(_file, 'utf8');
    });
    // send
    response.writeHead(200, {
      'Content-Type': 'application/javascript'
    });
    response.end(compiledJavascript);
  });

  // serve css
  app.get('/css/app.min.css', function(request, response, next) {
    console.log('> mongo-view serving DEVELOPMENT styles'.yellow);
    // lessc
    var CMD = 'lessc public/less/index.less public/css/app.min.css -compress';
    exec(CMD, function (error, stdout, stderr) {
      if (error) {
        throw new Error(error);
      } else {
        var __cssdirname = __dirname + '/../../public/css';
        var CSS = fs.readFileSync(__cssdirname + '/app.min.css', 'utf8');
        fs.unlinkSync(__cssdirname + '/app.min.css');
        // send
        response.writeHead(200, {
          'Content-Type' : 'text/css'
        });
        response.end(CSS);
      };
    });
  });

};

/* EOF */