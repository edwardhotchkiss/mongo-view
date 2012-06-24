
/**
 * mongo-view.js
 **/

var App = Spine.Controller.sub({

  db: null,
  collectionCount: null,
  collection: null,
  itemCount: null,
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
    // setup Handlebars helpers
    Handlebars.registerHelper('getDB', function() {
      return self.db;
    });
    Handlebars.registerHelper('getCollection', function() {
      return self.collection;
    });
    Handlebars.registerHelper('generateRow', function(item) {
      var HTML = '';
      var props = item[0];
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
        HTML += '</p></div>';
        HTML += '</div>';
      };
      return new Handlebars.SafeString(HTML);
    });
  },

  // clear content
  clear: function() {
    $('#content').html('');
  },

  // disconnect method
  disconnect: function() {
    var self = this;
    self.db = null;
    self.collectionCount = null;
    self.collection = null;
    self.itemCount = null;
    self.item = null;
    $.get('/api/disconnect/', function(data) {
      if (data['message'] === 'disconnected') {
        // mongodb breadcrumbs
        mongodbBreadcrumbs(self);
        self.navigate('/');
      };
    });
  },

  // render connect form partial
  setupConnect: function() {
    var self = this;
    self.clear();
    // mongodb breadcrumbs
    mongodbBreadcrumbs(self);
    var json = { MONGO_DB : 'mongodb://localhost/test' };
    $.get('/partials/connect.html', function(source) {
      // render view with handlebars
      var template = Handlebars.compile(source);
      $('#content').html(template(json));
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
    self.clear();
    $('#indicator h1').text('retrieving collections for ' + db);
    $.get('/api/database/' + db, function(data) {
      var count = data.length - 1;
      var howMany = (count > 0) ? count: 'none';
      // setup for breadcrumbs
      self.collectionCount = howMany;
      // mongodb breadcrumbs
      mongodbBreadcrumbs(self);
      // setup JSON for view render
      var json = {
        db          : db,
        collections : data,
        howMany     : howMany
      };
      $.get('/partials/collections.html', function(source) {
        // render view with handlebars
        var template = Handlebars.compile(source);
        $('#content').html(template(json));
      });
    });
  },

  // retrieve single collection
  retrieveCollection: function(db, collection) {
    var self = this;
    self.collection = collection;
    self.clear();
    $('#indicator h1').text('retrieving collection: ' + collection);
    $.get('/api/database/' + db + '/collection/' + collection, function(data) {
      var howMany = data.length;
      self.itemCount = howMany;
      // mongodb breadcrumbs
      mongodbBreadcrumbs(self);
      // setup for view render
      var json = {
        db             : db,
        howMany        : howMany,
        collection     : data,
        collectionName : collection
      };
      // setup JSON for view render
      $.get('/partials/collection.html', function(source) {
        // render view with handlebars
        var template = Handlebars.compile(source);
        $('#content').html(template(json));
      });
    });
  },

  // retrieve single collection
  retrieveItem: function(db, collection, id) {
    var self = this;
    self.item = id;
    self.clear();
    $('#indicator h1').text('retrieving item: ' + id);
    $.get('/api/database/' + db + '/collection/' + collection + '/' + id, function(data) {
      // mongodb breadcrumbs
      mongodbBreadcrumbs(self);
      // setup JSON for mustache
      var json = {   
        id       : id,
        item     : data,
        collectionName : collection
      };
      $.get('/partials/item.html', function(source) {
        // render view with handlebars
        var template = Handlebars.compile(source);
        $('#content').html(template(json));
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
  // current db
  if (self.db) {
    var db = self.db;
    var count = self.collectionCount;
    var textWithCount = db + ' (' + count + ')';
    $('#current-db a').text(textWithCount);
    $('#current-db a').click(function() {
      $('#current-collection').hide(350);
      $('#current-item').hide(350);
      self.collection = null;
      self.item = null;
      self.navigate('/database/' + db + '/');
    });
    $('#current-db').fadeIn(350);
  } else {
    $('#current-db a').text('');
  };
  // current collection
  if (self.collection) {
    var collection = self.collection;
    var count = self.itemCount;
    var textWithCount = collection + ' (' + count + ')';
    $('#current-collection a').text(textWithCount);
    $('#current-collection a').click(function() {
      $('#current-item').hide(350);
      self.item = null;
      self.navigate('/database/' + db + '/' + collection + '/');
    });
    $('#current-collection').fadeIn(350);
  } else {
    $('#current-collection a').text('');
  };
  // current item
  if (self.item) {
    var item = self.item;
    $('#current-item a').text('$' + item);
    $('#current-item a').click(function() {
      self.navigate('/database/' + db + '/' + collection + '/' + item);
    });
    $('#current-item').fadeIn(350);
  } else {
    $('#current-item a').text('');
  };
};

$(document).ready(function() {

  // initialize app
  var app = new App({
    start : new Date().getTime()
  });

  // setup ajax
  $(document).ajaxStart(function() {
    $('#indicator').fadeIn(1000);
  }).ajaxStop(function() {
    $('#indicator').fadeOut(1000);
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