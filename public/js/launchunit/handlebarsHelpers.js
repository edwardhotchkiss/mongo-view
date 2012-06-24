
/**
 * @method registerHandlebarsHelpers
 * @param self Spine instance
 **/

function registerHandlebarsHelpers(self) {

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
    var props = item[0];
    var orderedProps = {};
    // push _id to the top
    orderedProps['_id'] = props['_id'];
    for (key in props) {
      orderedProps[key] = props[key];
    };
    // sort through and classify
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
  
};