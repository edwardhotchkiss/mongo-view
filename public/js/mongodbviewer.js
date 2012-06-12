
/**
 * mongodbviewer.js
 **/

var App = Spine.Controller.sub({
  init: function(){
    this.routes({
      '/tests/:id': function(params) {
        console.log('/tests/', params.id);
      },
      '/tests': function() {
        console.log('tests');
      }
    });
    Spine.Route.setup();
    Spine.Route.setup({
      history: true
    });
  }
});

var app = new App();

/* EOF */