
(function() {
  var host = window.location.hostname;
  var onMV = /mongoview\.com/i.test(host);
  if (onMV) {
    var t   = document.createElement('script');
    t.type  = 'text/javascript';
    t.async = true;
    t.id    = 'gauges-tracker';
    t.setAttribute('data-site-id', '4ff237cef5a1f54dbd000001');
    t.src = '//secure.gaug.es/track.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(t, s);
  };
})();

