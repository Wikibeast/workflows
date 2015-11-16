var $, fill;

$ = require('jQuery');

(fill = function(item) {
  return $('.tagline').append("" + item);
})('The most creative minds in art');

fill;
