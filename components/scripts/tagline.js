var $, fill;

$ = require('jQuery');

(fill = function(item) {
  return $('.tagline').append("" + item);
})('Creative minds in art');

fill;
