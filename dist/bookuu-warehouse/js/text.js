(function(){
    if (typeof define === 'function') {
        define(['./js/c.js'], function (c, text) {
            var text = function(text) {
                alert(text+c(text));
            }
            return text;
        });
    }
})();