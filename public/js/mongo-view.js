
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
      '/database/disconnect': function() {
        self.disconnect();
      },
      '/database/disconnect/': function() {
        self.disconnect();
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
    // navigate via spine
    $.fn.navTo = function(path) {
      self.navigate(path);
    }
  },

  // clear content
  clear: function() {
    $('#content').html('');
  },

  // disconnect method
  disconnect: function() {
    var self = this;
    self.db_name = null;
    self.collection = null;
    self.item = null;
    $.get('/api/disconnect/', function(data) {
      if (data.message === 'disconnected') {
        self.navigate('/');
      };
    });
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
    $('#indicator h1').text('connecting to database...');
    $.get('/api/connect/', $('#connection-form').serialize(), function(data) {
      var db_name = data['db_name'];
      self.db_name = db_name;
      self.navigate('/database/' + db_name + '/');
    });
  },

  // retrieve collections for db
  retrieveCollections: function(db_name) {
    var self = this;
    self.clear();
    $('#indicator h1').text('retrieving collections for ' + db_name);
    $.get('/api/database/' + db_name, function(data) {
      var json = {
        collections : data,
        howMany     : data.length - 1,
        linker      : function() {
          if (this.count === undefined) {
            return;
          };
          var HTML = '';
          // link
          var navToLink = '/database/' + db_name + '/collection/' + this.name + '/';
          // build HTML
          HTML += '<a href="javascript:void(0)" ';
          HTML += 'onclick="$(this).navTo(\'' + navToLink + '\')">';
          HTML += this.name + '</a><span>(' + this.count + ')</span>';
          console.log(HTML);
          return HTML; 
          
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
    $('#indicator h1').text('retrieving collection: ' + collection);
    $.get('/api/database/' + db_name + '/collection/' + collection, function(data) {
      var json = {
        howMany        : data.length,
        collection     : data,
        collectionName : collection,
        linker      : function() { 
          return '/database/' + db_name + '/collection/' + collection + '/' + this._id;
        }
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
    $('#indicator h1').text('retrieving item: ' + id);
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
            html += '<div class="key left"><p>';
            html += key
            html += '</p></div>'
            html += '<div class="prop left"><p>';
            html += props[key];
            html += '</p></div>';
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

  // initialize app
  var app = new App({
    start : new Date().getTime()
  });

  // setup ajax indicator text
  $('body').append($('<div id="indicator"></div>'));
  $('#indicator').append('<h1></h1>');

  // setup ajax
  $(document).ajaxStart(function() {
    $('#indicator').fadeIn(750);
  }).ajaxStop(function() {
    $('#indicator').fadeOut(750);
  }).ajaxError(function(e, jqxhr, settings, message) {
    var suppressErrorAlert = true;
    if (jqxhr.status === 599) {
      window.location = '/';
      return suppressErrorAlert;
    } else {
      window.location = '/';
      return suppressErrorAlert;
    };
  });

});

/* EOF */