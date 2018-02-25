/**
 * @Author: Edward
 * @Date:   2017-08-02T22:47:41+08:00
 * @Email:  809537981@qq.com
 * @Last modified by:   Edward
 * @Last modified time: 2017-08-23T16:40:25+08:00
 */



//dsx懒加载
(function ($) {
  $.fn.layzload = function (options) {
    //默认参数
    var defu = {
      data_src: "data-src", //图片src
      data_height: "data-height", //图片高度
      data_width: "data-width", //图片宽度
      delayed: 300, //延时显示img
      imgshow: 800 //显示img需要多长时间
    };
    var opt = $.extend(defu, options); //合并参数，如果传进来的有那么替换默认值
    var win_height = $(window).height();

    function Rendering(that, i) {
      if (that.offset().top - $(window).scrollTop() < win_height && that.find('img').length === 0) {
        var html = '<img src=' + that.attr(opt.data_src) + ' style="max-height: 100%;" />';
        that.timer = setTimeout(function () {
          that.html(html).find('img').fadeTo(opt.imgshow, 1);
        }, opt.delayed);
      }
    }
    var elments = this;
    this.each(function (i, el) {
      var that = $(el);
      Rendering(that, i);
      $('.main,.wrapper').on('scroll', function () {
        if (that.find('img').length === 0) {
          Rendering(that, i);
        }
        // if (elments.length === elments.find('img').length) {
        //     console.log(true);
        //     $('body').off('scroll');
        // }
      });
    });
  };
})(jQuery);
/******************************************************************
 *                            浮动弹窗                               *
 ******************************************************************/
var scrollTop = null;
var windoWidth = null;
$(function () {
  scrollTop = $(document, 'html').scrollTop(), scrollLeft = $('body').scrollLeft();
  windoWidth = $('body').outerWidth(), windoHeight = $('body').outerHeight();

  $(window).on('resize scroll', function () {
    scrollTop = $(document, 'html').scrollTop(), scrollLeft = $('body').scrollLeft();
    windoWidth = $('body').outerWidth(), windoHeight = $('body').outerHeight();
  });
})

function PropFloat(options) {
  //el, floatdEl, position
  var el = $(options.el);
  var Frame = $(options.floatdEl);

  var frameWidth = Frame.outerWidth(),
    frameHeight = Frame.outerHeight();

  switch (options.position) {
    case 'center':
      /*
      frame水平垂直居中：
      * 需要margin-top||left 各一半frame的宽度高度
      */
      var top = -Frame.outerHeight() / 2;
      var left = -Frame.outerWidth() / 2;
      Frame.css({
        'top': '50%',
        'left': '50%',
        'margin-top': top + 'px',
        'margin-left': left + 'px'
      }).removeClass('hidden').addClass('visible');
      //Drag();
      break;
    case 'self-center':
      /* frame 水平居中 el
       */
      var top = el.offset().top - 10 - scrollTop - frameHeight;
      var left = el.offset().left - frameWidth / 2 + el.outerWidth() / 2;
      Frame.css({
        'top': top,
        'left': left
      }).removeClass('hidden').addClass('visible');
      //Drag();
      break;
    case 'follow-pointer':
      /* frame 跟随指针 移动
       */
      el.on('mousemove', function (e) {
        var pointerX = e.clientX + 45 + scrollLeft; //X轴间隙
        var pointerY = e.clientY - 30 + scrollTop; //Y轴间隙

        // 判断窗口碰撞
        if (pointerX + frameWidth > windoWidth - scrollLeft) {
          pointerX = e.clientX - frameWidth - 45 + scrollLeft
        }
        if (pointerY + frameHeight > windoHeight) {
          pointerY = e.clientY - frameHeight + 30 + scrollTop
        }
        Frame.css('transition', 'initial');
        Frame.css({
          'left': pointerX,
          'top': pointerY
        }).removeClass('hidden').addClass('visible');
      })
      break;
    default:
      /*
      默认 frame 鼠标的左下侧或者右下侧
      *
      */
      var top = (el.offset().top + el.outerHeight() + 4) - scrollTop;
      var left = el.offset().left;
      /*防止frame超出documen 高度*/
      if ((top + frameHeight) > windoHeight) {
        top = el.offset().top - 4 - scrollTop - frameHeight;
      }
      /*防止frame超出documen 宽度*/
      if (left > (windoWidth / 2)) {
        left = el.offset().left - 4 - frameWidth;
        Frame.css({
          'top': top + 'px',
          'left': left + 'px'
        }).removeClass('hidden').addClass('visible');
      } else {
        left += el.outerWidth() + 4;
        Frame.css({
          'top': top + 'px',
          'left': left + 'px'
        }).removeClass('hidden').addClass('visible');
      }
      Drag();
  }

  //拖拽移动浮动框
  function Drag() {
    Frame.on('mousedown', '.prop-title', function (e) {
      Frame.css('cursor', 'move');
      var disX = e.clientX - Frame.offset().left; //获取鼠标X轴指针到元素边框位置
      var disY = e.clientY - Frame.offset().top; //获取鼠标Y轴指针到元素边框位置

      $(this).on('mousemove', function (ev) {
        Frame.css('transition', 'initial');
        var mosX = ev.clientX - disX;
        var mosY = ev.clientY - disY;
        console.log('移动', mosX, mosY);

        /*
         * 限定范围
         */
        if (mosX < 0) {
          mosX = 0;
        } else if (mosX > (windoWidth - frameWidth - scrollLeft)) {
          mosX = windoWidth - frameWidth - scrollLeft;
        }

        if (mosY < 0) {
          mosY = 0;
        } else if (mosY > (windoHeight - frameHeight - scrollTop)) {
          mosY = windoHeight - frameHeight - scrollTop;
        }

        Frame.css({
          'top': mosY,
          'left': mosX
        });
      });
      /*
       *移除绑定的事件 - 还原
       */
      $(this).on('mouseup', function () {
        Frame.css('transition', '.3s ease all');
        $(this).off('mouseup mousemove');
      });
      /*
       * 防止选中文字图片类的东西 触发浏览器默认行为
       */
      e.preventDefault();
      return false;
    });
  }
}

/*弹窗*/
function PropUp(options, rendeafter, callback) {

  /*
   * [options description]
   * options.propupContent ".prop-content" 内容
   * options.propupTitle ".content-title" 标题
   *
   * rendeafter  在已经渲染html后 但还未显示的时候 用于模板内其它操作
   */
  if ($('#prop-box')[0] !== undefined) return;

  var propHtml = '<div id="prop-box" style="display:none;"><h4 class="prop-title clearfix"><div class="prop-title-text fl">' + options.propupTitle + '</div><div class="fr"><a class="prop-icon-close icon" href="javascript:;">&#xe611;</a></div><div class="clear"></div></h4><div class="prop-content">' + options.propupContent + '</div><div class="prop-btn ta-ct"><a href="javascript:;" class="prop-btn-true btn">确定</a><a href="javascript:;" class="prop-btn-false btn muted">取消</a></div></div>';
  $('body').append(propHtml)

  PropFloat({
    'floatdEl': '#prop-box',
    'position': 'center'
  })

  // 执行未显示之前操作
  rendeafter && rendeafter()

  $('#prop-box').show().animate({
    'opacity': '1'
  }, 100)

  $('#prop-box').on('click', '.prop-btn-true', function () {
    callback(true)
    $('#prop-box').animate({
      'opacity': '0'
    }, 100, function () {
      $(this).hide().remove();
    })
  })

  $('#prop-box').on('click', '.prop-icon-close , .prop-btn-false', function () {
    callback(false)
    $('#prop-box').animate({
      'opacity': '0'
    }, 100, function () {
      $(this).hide().remove();
    })
  })
}

/*弹窗*/
function PropUpAlert(options, rendeafter, callback) {

  /*
   * [options description]
   * options.propupContent ".prop-content" 内容
   * options.propupTitle ".content-title" 标题
   *
   */
  if ($('#prop-box')[0] !== undefined) return;

  var propAlertHtml = '<div id="prop-box" style="display:none;">' +
    '<h4 class="prop-title clearfix">' +
    '<div class="prop-title-text fl">' + options.propupTitle + '</div>' +
    '<div class="fr"><a class="prop-icon-close icon" href="javascript:;">&#xe611;</a></div>' +
    '</h4>' +
    '<div class="clear"></div></h4><div class="prop-content">' + options.propupContent + '</div>' +
    '</div>';
  $('body').append(propAlertHtml)

  PropFloat({
    'floatdEl': '#prop-box',
    'position': 'center'
  })

  $('#prop-box').show().animate({
    'opacity': '1'
  }, 100)

  $('#prop-box').on('click', '.prop-icon-close', function () {
    $('#prop-box').animate({
      'opacity': '0'
    }, 100, function () {
      $(this).hide().remove();
    })
  })
}


//为jQuery 添加判断浏览器属性
! function ($) {
  var userAgent = navigator.userAgent.toLowerCase();
  // Figure out what browser is being used
  $.browser = {
    version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
    safari: /webkit/.test(userAgent),
    opera: /opera/.test(userAgent),
    msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
    mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
  }
}(jQuery)
