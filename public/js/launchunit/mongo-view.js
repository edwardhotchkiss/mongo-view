
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
      '/database/export': function() {
        self.renderExport();
      },
      '/database/export/': function() {
        self.renderExport();
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
    };
    // handlebars helpers, register with instance
    registerHandlebarsHelpers(self);
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

  // render database tools
  renderExport: function() {
    var self = this;
    self.clear();
    // mongodb breadcrumbs
    mongodbBreadcrumbs(self);
    var json = { MONGO_DB : 'mongodb://localhost/test' };
    $.get('/partials/export.html', function(source) {
      // render view with handlebars
      var template = Handlebars.compile(source);
      $('#content').html(template(json));
      // connection form submit
      $('#connect-btn').click(function(e) {  
        self.export($('#connection-string').val());    
      }); 
    });
  },

  // hit export endpoint
  export: function(mongoString) {
    var self = this;
    self.clear();
    // mongodb breadcrumbs
    mongodbBreadcrumbs(self);
    console.log('exporting...');
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

/**
 * @method registerHandlebarsHelpers
 **/

function registerHandlebarsHelpers(self) {

  /**
   * @method pushIdToTop
   **/

  function pushIdToTop(obj) {
    var ordered = {};
    ordered['_id'] = obj['_id'];
    for (key in obj) {
      ordered[key] = obj[key];
    };
    return ordered;
  };

  /**
   * @handlebars helpers
   **/

  // get database name
  Handlebars.registerHelper('getDB', function() {
    return self.db;
  });
  
  // get collection name
  Handlebars.registerHelper('getCollection', function() {
    return self.collection;
  });
  
  // prettify a mongodb item
  Handlebars.registerHelper('generateRow', function(item) {
    var HTML = '';
    var orderedItem = pushIdToTop(item[0]);
    // sort through and classify
    for (key in orderedItem) {
      HTML += '<div class="holder">';
      HTML += '<div class="key left"><p>';
      HTML += key;
      HTML += '</p></div>'
      HTML += '<div class="prop left"><p>';
      if (typeof(orderedItem[key]) === 'number') {
        HTML += '<span class="identifier-number">' + orderedItem[key] + '</span>';
      } else if (typeof(orderedItem[key]) === 'string') {
        if (key === '_id') {
          HTML += '<span class="identifier-objectid">$' + orderedItem[key] + '</span>';
        } else {
          HTML += '<span class="identifier-string">"' + orderedItem[key] + '"</span>';
        };
      };
      HTML += '</p></div>';
      HTML += '</div>';
    };
    return new Handlebars.SafeString(HTML);
  });

};

$(document).ready(function() {

  // initialize app
  var app = new App({
    start : new Date().getTime()
  });

  /**
   * @method notifyThenRedirect
   * @description $.Notify, then redirect user
   * @param message Notification message
   * @param location Path for redirect
   **/

  function notifyThenRedirect(message, location) {
    location = location || '/';
    $.Notify(message, function() {
      window.location = location;
      return suppressErrorAlert;
    });
  };

  // setup ajax
  $(document).ajaxStart(function() {
    $('#indicator').fadeIn(1000);
  }).ajaxStop(function() {
    $('#indicator').fadeOut(1000);
  }).ajaxError(function(e, xhr, settings, exception) {
    var suppressErrorAlert = true;
    if (xhr.status === 599) {
      notifyThenRedirect('No Active MongoDB Connection!');
    } else if (xhr.status === 511) {
      notifyThenRedirect('Access Forbidden to localhost on this Domain!');
    } else {
      notifyThenRedirect('Unknown Error! Redirecting...');
    };
  });

});


/* EOF */