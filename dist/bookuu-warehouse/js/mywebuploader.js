/**
 * @Author: Edward
 * @Date:   2017-08-21T14:23:37+08:00
 * @Email:  809537981@qq.com
 * @Last modified by:   Edward
 * @Last modified time: 2017-08-31T10:41:22+08:00
 */
(function(window) {
  var WebUpload = function(options) {
    // 上传容器ID
    return new uploader(options)
  }
  var uploader = function(options) {
    this.WebUploadId = options.WebUploadId;

    // 基本url
    this.baseUrl = options.base_url;

    // 服务器地址
    this.serverUrl = options.uploadUrl;

    // 上传按钮 ID
    this.upload = options.upload;

    // 取消上传按钮 ID
    this.stopUpload = options.stopUpload;

    // 文件选择按钮 ID
    this.picke = options.picke;

    // 最大文件长度
    this.maxFileLength = options.maxFileLength;

    // 图片缩略图大小
    this.thumbnailSize = options.thumbnailSize;

    // 文件最大大小 mb
    this.maxSize = Math.pow(1024,options.maxSize);

    // 上传完成
    this.success = options.success;

    // 上传失败
    this.error = options.error;
    // formData {Object} [可选] [默认值：{}] 文件上传请求的参数表，每次发送都会发送此对象中的参数
    this.formData = options.formData;

    // 初始化uploader
    this.init()
  }
  uploader.prototype = {
    init: function() {
      var uploader = this.create()
      this.bindEvent(uploader)
    },
    create: function() {
      var uploader = WebUploader.create({
        // swf文件路径
        swf: this.baseUrl + 'webuploader/Uploader.swf',
        // 文件接收服务端。
        server: this.serverUrl,
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: this.picke,
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,
        // 只允许选择图片文件。
        accept: {
          title: 'Images',
          extensions: 'gif,jpg,jpeg,bmp,png',
          mimeTypes: 'image/jpg,image/gif,image/bmp,image/png'
        },
        formData: this.formData
      })
      return uploader
    },
    bindEvent: function(uploader) {
      var _this = this;

      // 当有文件添加进来的时候
      uploader.on('fileQueued', function(file) {

        if (uploader.getFiles().length > _this.maxFileLength) {
          alert('最多添加' + _this.maxFileLength + '张')
          return
        }

        if(!(/^(jpg||gif||bmp||png)$/.test(file.ext))) {
          alert('请选择图片类型文件')
          return
        }

        if (file.size > _this.maxSize) {
          alert('文件大小超过' + _this.maxSize + 'mb')
          return
        }
        var $li = $(
            '<li id="' + file.id + '" class="file-item thumbnail">' +
            '<span class="icon hidden"><a class="remove-this" href="javascript:;">&#xe611;</a></span>' +
            '<img>' +
            '<p class="state to-hd">' + file.name + '</p>' +
            '</li>'
          ),
          $img = $li.find('img');
        // $list为容器jQuery实例
        $(_this.WebUploadId).append($li);

        // 创建 缩略图
        uploader.makeThumb(file, function(error, src) {
          if (error) {
            $img.replaceWith('<span class="cl-rd">不能预览</span>')
            return
          }
          $img.attr('src', src)
        }, _this.thumbnailSize, _this.thumbnailSize);

        // 删除上传文件队列
        $li.on('click', '.remove-this', function() {
          uploader.removeFile(file, true)
          $(this).parents('.file-item').remove()
        })
      })

      // 提交上传
      $(_this.upload).on('click', function() {
        if (!WebUploader.Uploader.support()) {
          alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
          throw new Error('WebUploader does not support the browser you are using.');
          return
        }
        uploader.upload()
      })

      // 取消上传
      $(_this.stopUpload).on('click', function() {
        uploader.stop()
        uploader.reset()
        $(_this.WebUploadId).empty()
      })

      // 文件上传成功
      uploader.on('uploadSuccess', function(file, response) {
        $('#' + file.id).find('p.state').text('上传成功！')
        if (_this.success instanceof Function) {
          _this.success(response)
          return
        }
        throw new Error("success is not a function")
      })

      // 文件上传失败，显示上传出错
      uploader.on('uploadError', function(file, reason) {
        $('#' + file.id).find('p.state').text('上传出错!')
        if (_this.error instanceof Function) {
          _this.error(reason)
          return
        }
        throw new Error("error is not a function")
      })

      // 删除按钮交互
      $(_this.WebUploadId).on({
        'mouseover': function() {
          $(this).find('.icon').removeClass('hidden')
        },
        'mouseout': function() {
          $(this).find('.icon').addClass('hidden')
        }
      }, '.file-item')
    }
  }
  window.WebUpload = WebUpload;
})(window)
