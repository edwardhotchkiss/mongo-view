
/**
 * mongo-view.js
 **/

var App = Spine.Controller.sub({

  db: null,
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
    self.db = null;
    self.collection = null;
    self.item = null;
    $.get('/api/disconnect/', function(data) {
      if (data['message'] === 'disconnected') {
        self.navigate('/');
      };
    });
  },

  // render connect form partial
  setupConnect: function() {
    var self = this;
    self.clear();
    var json = { MONGO_DB : 'mongodb://localhost/test' };
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
      var db = data['db_name'];
      self.db = db || self.db;
      // mongodb breadcrumbs
      mongodbBreadcrumbs(self);
      var nextURL = '/database/' + db + '/';
      self.navigate(nextURL);
    });
  },

  // retrieve collections for db
  retrieveCollections: function(db) {
    var self = this;
    self.db = db;
    // mongodb breadcrumbs
    mongodbBreadcrumbs(self);
    self.clear();
    $('#indicator h1').text('retrieving collections for ' + db);
    $.get('/api/database/' + db, function(data) {
      var howMany = data.length - 1;
      var json = {
        collections : data,
        howMany     : (howMany > 0) ? howMany : 'none',
        linker      : function() {
          if (this.count === undefined) {
            return;
          };
          var HTML = '';
          // link
          var navToLink = '/database/' + db + '/collection/' + this.name + '/';
          // build HTML
          HTML += '<a href="javascript:void(0)" ';
          HTML += 'onclick="$(this).navTo(\'' + navToLink + '\')">';
          HTML += this.name + '</a><span>(' + this.count + ')</span>';
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
  retrieveCollection: function(db, collection) {
    var self = this;
    self.collection = collection;
    self.clear();
    // mongodb breadcrumbs
    mongodbBreadcrumbs(self);
    $('#indicator h1').text('retrieving collection: ' + collection);
    $.get('/api/database/' + db + '/collection/' + collection, function(data) {
      var json = {
        howMany        : (data.length > 0) ? data.length : 'none',
        collection     : data,
        collectionName : collection,
        linker      : function() { 
          return '/database/' + db + '/collection/' + collection + '/' + this._id;
        }
      };
      $.get('/partials/collection.html', function(template) {
        var html = $.mustache(template, json);
        $('#content').append(html);
      });
    });
  },

  // retrieve single collection
  retrieveItem: function(db, collection, id) {
    var self = this;
    self.item = id;
    // mongodb breadcrumbs
    mongodbBreadcrumbs(self);
    self.clear();
    $('#indicator h1').text('retrieving item: ' + id);
    $.get('/api/database/' + db + '/collection/' + collection + '/' + id, function(data) {
      var json = {
        id       : id,
        item     : data,
        collectionName : collection,
        generateRow : function() {
          var HTML = '';
          var props = this;
          var orderedProps = {};
          // push _id to the top
          orderedProps['_id'] = props['_id'];
          for (key in props) {
            orderedProps[key] = props[key];
          };
          for (key in orderedProps) {
            HTML += '<div class="holder">';
            HTML += '<div class="key left"><p>';
            HTML += key;
            HTML += '</p></div>'
            HTML += '<div class="prop left"><p>';
            if (typeof(props[key]) === 'number') {
              HTML += '<span class="identifier-number">' + props[key] + '</span>';
            } else if (typeof(props[key]) === 'string') {
              if (key === '_id') {
                HTML += '<span class="identifier-objectid">$' + props[key] + '</span>';
              } else {
                HTML += '<span class="identifier-string">"' + props[key] + '"</span>';
              };
            };
            //html += (props[key] === '_id') ? '$' + props[key] : props[key];
            HTML += '</p></div>';
            HTML += '</div>';
          };
          return HTML;
        }
      };
      $.get('/partials/item.html', function(template) {
        var html = $.mustache(template, json);
        $('#content').append(html);
      });
    });
  }
  
});

/**
 * @method mongodbBreadcrumbs
 * @param spineInstance
 * @param db
 * @param collection
 * @param item
 **/

function mongodbBreadcrumbs(self) {
  console.log('mongodbBreadcrumbs!');
  // current db
  if (self.db) {
    var db = self.db;
    $('#current-db a').text(db);
    $('#current-db a').click(function() {
      $('#current-collection').hide(350);
      $('#current-item').hide(350);
      self.collection = null;
      self.item = null;
      self.navigate('/database/' + db + '/');
    });
    $('#current-db').fadeIn(350);
  };
  // current collection
  if (self.collection) {
    var collection = self.collection;
    $('#current-collection a').text(collection);
    $('#current-collection a').click(function() {
      $('#current-item').hide(350);
      self.item = null;
      self.navigate('/database/' + db + '/' + collection + '/');
    });
    $('#current-collection').fadeIn(350);
  };
  // current item
  if (self.item) {
    var item = self.item;
    $('#current-item a').text('$' + item);
    $('#current-item a').click(function() {
      self.navigate('/database/' + db + '/' + collection + '/' + item);
    });
    $('#current-item').fadeIn(350);
  };
};

$(document).ready(function() {

  // initialize app
  var app = new App({
    start : new Date().getTime()
  });

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