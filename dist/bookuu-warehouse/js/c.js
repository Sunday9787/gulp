(function(){
    function c(text) {
        return '文字长度为:' + text.length;
    }
    if (typeof define === 'function') {
        define(function () {
            return c;
        });
        return;
    }
    window.c = c;
})();