
/**
 * @list dependencies
 **/
 
var fs = require('fs')
  , express = require('express')
  , app = express.createServer();

module.exports = function(app, mongoose) {

  app.get('/js/app.min.js', function(request, response) {
    var compiledJavascript = '';
    var __jsdirname = __dirname + '/../../public/js';
    // vendored js
    var vendorDependencies = [
      __jsdirname + '/vendor/jquery-1.7.2.min.js'
    ];
    // our project's js
    var projectDependencies = [
      __jsdirname + '/mongodbviewer.js'
    ];
    // merge dependencies in order
    var applicationDependencies = vendorDependencies.concat(projectDependencies);
    // iterate over files reading them in
    applicationDependencies.map(function(_file) {
      compiledJavascript += fs.readFileSync(_file, 'utf8');
    });
    fs.writeFile(__jsdirname + '/app.compiled.js', compiledJavascript, function(error) {
      if (error) {
        throw new Error(error);
      } else {
        console.log('> mongodb-viewer serving js ....');
        response.writeHead({
          contentType: 'text/javascript'
        });
        response.end(compiledJavascript);
      }
    });
  });

};

// EOF