
/**
 * @author Edward Hotchkiss <edwardhotchkiss@me.com>
 * @description Twitter Style Notifications
 * @license - MIT ($.easing from jQuery UI)
 * Don't bundle entire jQuery UI, just easeInOutExpo quad
 */

$.extend($.easing, {
  easeInOutExpo: function (x, t, b, c, d) {
    if (t == 0) {
      return b;
    };
    if (t == d) {
      return b + c;
    };
    if ((t /= d / 2) < 1) {
      return c/2 * Math.pow(2, 10 * (t - 1)) + b;
    };
    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
  }
});

$.Notify = function(message, callback) {
  callback = callback || function(){};
  $('<div id="notification"><p id="notificationTxt"></p></div>').appendTo('body');
  $('#notificationTxt').html(message);
  var notificationDiv = {
    left            : 0,
    height          : 40,
    zIndex          : 99,
    opacity         : 0.8,
    top             : -40,
    width           : '100%',
    position        : 'fixed',
    textAlign       : 'center',
    background      : '#e2e2e2'
  };
  var notificationP = {
    position      : 'relative',
    fontSize      : 12,
    color         : '#111',
    width         : 600,
    margin        : '0 auto 0 auto',
    fontWeight    : 'bold',
    textTransform : 'uppercase',
    textShadow    : '1px 1px 1px #fff',
    padding       : '12px 0 12px 0',
    fontFamily    : '"Lucida Grande", Tahoma, Verdana, Arial, sans-serif'
  };
  for (index in notificationDiv) {
    $('#notification').css(index, notificationDiv[index]);
  };
  for (index in notificationP) {
    $('#notification p').css(index, notificationP[index]);
  };
  $('#notification').animate({
    top : 0
    }, 750, 'easeInOutExpo', function() {
      setTimeout(function() {
        $('#notification').animate({
          top : -40
        }, 750, 'easeInOutExpo', function() {
          setTimeout(function() {
            // DONE.
            callback();
          }, 1500)
      });
    }, 3000);
  });
};

/* EOF */