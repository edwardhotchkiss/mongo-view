
/**
 * mongo-view.js
 **/

var App = Spine.Controller.sub({

  db_name: null,
  collection: null,
  item: null,

  // initialize app
  init: function(params) {
    var self = this;
    // setup routes
    this.routes({
      '/': function() {
        self.setupConnect()
      },
      '/database/:database': function(params) {
        self.retrieveCollections(params.database)
      },
      '/database/:database/': function(params) {
        self.retrieveCollections(params.database)
      },
      '/database/:database/collection/:collection': function(params) {
        self.retrieveCollection(params.database, params.collection);
      },
      '/database/:database/collection/:collection/': function(params) {
        self.retrieveCollection(params.database, params.collection);
      },
      '/database/:database/collection/:collection/:id': function(params) {
        self.retrieveItem(params.database, params.collection, params.id);
      },
      '/database/:database/collection/:collection/:id/': function(params) {
        self.retrieveItem(params.database, params.collection, params.id);
      },
    });
    // setup routes
    Spine.Route.setup();
    // preserve html5 history
    Spine.Route.setup({
      history: true
    });
  },

  // clear content
  clear: function() {
    $('#content').html('');
  },

  // render connect form partial
  setupConnect: function() {
    var self = this;
    self.clear();
    var json = { MONGO_DB : 'mongodb://localhost/dash' };
    $.get('/partials/connect.html', function(template) {
      var html = $.mustache(template, json);
      $('#content').append(html);
      // connection form submit
      $('#connect-btn').click(function(e) {  
        self.connect($('#connection-string').val());    
      });
    });
  },

  // connect to mongo and initialize session
  connect: function(mongoString) {
    var self = this;
    $.post('/api/connect', $('#connection-form').serialize(), function(data) {
      var db_name = data['db_name'];
      self.db_name = db_name;
      self.navigate('/database/' + db_name + '/');
    });
  },

  // retrieve collections for db
  retrieveCollections: function(db_name) {
    var self = this;
    self.clear();
    $.get('/api/database/' + db_name, function(data) {
      var json = {
        collections : data,
        howMany     : data.length - 1,
        linker      : function() { 
          return '/database/' + db_name + '/collection/' + this.name + '/';
        }
      };
      $.get('/partials/collections.html', function(template) {
        var html = $.mustache(template, json);
        $('#content').append(html);
      });
    });
  },

  // retrieve single collection
  retrieveCollection: function(db_name, collection) {
    var self = this;
    self.clear();
    $.get('/api/database/' + db_name + '/collection/' + collection, function(data) {
      var json = {
        howMany        : data.length,
        collection     : data,
        collectionName : collection
      };
      $.get('/partials/collection.html', function(template) {
        var html = $.mustache(template, json);
        $('#content').append(html);
      });
    });
  },

  // retrieve single collection
  retrieveItem: function(db_name, collection, id) {
    var self = this;
    self.clear();
    $.get('/api/database/' + db_name + '/collection/' + collection + '/' + id, function(data) {
      var json = {
        id       : id,
        item     : data,
        collectionName : collection,
        generateRow : function() {
          var html = '';
          var props = this;
          for (key in props) {
            html += '<div class="holder">';
            html += '<div class="key left">';
            html += key
            html += '</div>'
            html += '<div class="prop right">';
            html += props[key];
            html += '</div>';
            html += '</div>';
          };
          return html;
        }
      }
      $.get('/partials/item.html', function(template) {
        var html = $.mustache(template, json);
        $('#content').append(html);
      });
    });
  }
  
});

$(document).ready(function() {
  var app = new App({
    start : new Date().getTime()
  });
});

/* EOF */