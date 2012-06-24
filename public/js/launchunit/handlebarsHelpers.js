
/**
 * @method registerHandlebarsHelpers
 * @param self Spine instance
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