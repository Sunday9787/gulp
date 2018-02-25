(function(w, d, u) {
    var Popup = function (options) {

       /**
        *  @param {Object} options
        *  @param {string} options.type
        *  @param {arry[string]} options.btn
        *  @param {string} options.height
        *  @param {string} options.width
        *  @param {string} options.algin
        *  @param {string} options.title
        *  @param {string} options.content
        *  @param {arry[fn]} options.callback
        *
        */

        this.type = options.type;

        this.btn = options.btn;

        this.height = options.height;

        this.width = options.width;

        this.algin = options.algin;

        this.title = options.title;

        this.content = options.content;

        this.callback = options.callback;

        this.close = function () {
            $('.popup-layer').fadeOut(200, function () {
                $(this).remove();
            });
        }

        this.resize = function () {
            $(w).on('resize', function () {
                var left = ($(w).width() / 2) - ($('.popup-layer').width() / 2);
                var top = ($(w).height() / 2) - ($('.popup-layer').height() / 2);
                $('.popup-layer').css({'left': left + 'px', 'top': top + 'px'});
            });
        }

        this.setPostion = function () {
            var left = ($(w).width() / 2) - ($('.popup-layer').width() / 2);
            var top = ($(w).height() / 2) - ($('.popup-layer').height() / 2);
            $('.popup-layer').css({'left': left + 'px', 'top': top + 'px'}).animate({'opacity': 1}, 200);
        }

        this.bindEvent = function (_this) {
            var btnLength = _this.btn.length
            for (var a = 0; a < btnLength; a++) {
                (function(b) {
                    $('#popup-layer-btn'+b).on('click', function () {
                        _this.callback[b].call(_this);
                    });
                })(a)
            }
        }

        // 启动
        this.fn[this.type](this);
    }

    Popup.prototype.fn = {
        html: function (_this) {
            var btn = '';
            $.each( _this.btn, function (i, value) {
                btn += '<a id="popup-layer-btn'+ i +'" class="popup-layer-btn ' + ((i === 0) ? 'active':'') + '" href="javascript:;">' + value + '</a>';
            });
            // for (var i = 0; i < _this.btn.length; i++) {
            //     (function (a){
            //         btn += '<a id="popup-layer-btn'+a+'" class="popup-layer-btn ' + ((a === 0) ? 'active':'') + '" href="javascript:;">' + _this.btn[i] + '</a>';
            //     })(i);
            // }

            var htmlTemplate = '<div class="popup-layer" style="width: '+ (_this.width ? _this.width: 'auto') +';height: '+ (_this.height ? _this.height: 'auto') +';">'+
                                    '<div class="popup-layer-title">' + _this.title + '</div>'+
                                    '<div class="popup-layer-content">' + _this.content + '</div>'+
                                    '<div class="popup-layer-footer" style="text-align:'+(_this.algin ? _this.algin : 'right')+'">' + btn + '</div>'+
                                '</div';
            $('body').append(htmlTemplate);

            // 设置位置参数
            _this.setPostion();

            // 为按钮注册事件
            _this.bindEvent(_this);
            
            // resize 事件
            _this.resize();
        }
    }
    function PopupLayer(options) {
        return new Popup(options);
    }
    if (typeof define === 'function') {
        define(function () {
            return Popup;
        });
        return;
    }

    w.Popup = Popup;
})(window, document, undefined)
