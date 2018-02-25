/*
 * @Author: Edward
 * @Date: 2017-08-2 09:42:55
 * @Last modified by:   Edward
 * @Email by:  809537981@qq.com
 * @Last modified time: 2017-08-23T17:29:40+08:00
 */

$('.sidebar-left-menu').on('click', '.item', function(e) {
  $(this).find('.list-item').slideToggle(function(){
  	if(!$(this).is(':visible')) {
  		$(this).prev().find('span.icon-arrow-right').html('&#xe60f;')
  		return
  	} else {
  		$(this).prev().find('span.icon-arrow-right').html('&#xe60e;')
  		return
  	}
  });
  e.stopPropagation();
})

function checkbox () {
  // 选择
  $('.checkbox-table').on('click','input[type="checkbox"]',function(){
    if($(this).is(':checked')) {
      $(this).prev('span').removeClass('icon-checkbox').addClass('icon-checkbox-checked').html('&#xe616;')
    } else {
      $(this).prev('span').removeClass('icon-checkbox-checked').addClass('icon-checkbox').html('&#xe617;')
    }
  })
  // 返选
  $('.checkbox-table').on('click','.toggleChecked',function(){
    $('.checkbox-table input[type="checkbox"]').each(function(index, el) {
      if($(el).is(':checked')) {
        $(el).prop('checked',false).prev('span').removeClass('icon-checkbox-checked').addClass('icon-checkbox').html('&#xe617;')
      } else {
        $(el).prop('checked',true).prev('span').removeClass('icon-checkbox').addClass('icon-checkbox-checked').html('&#xe616;')
      }
    })
  })
  // 全选
  $('.checkbox-table').on('click','.checkedAll',function(){
    $('.checkbox-table input[type="checkbox"]').each(function(index, el) {
      if(!$(el).is(':checked')) {
        $(el).prop('checked',true).prev('span').removeClass('icon-checkbox').addClass('icon-checkbox-checked').html('&#xe616;')
      }
    })
  })
}

/*滑动下拉*/
$('.dropdown').on({
  'mouseenter': function(e){
    $(this).find('.dropdown-menu').slideDown('fast');
    e.stopPropagation()
  },
  'mouseleave': function(e){
    $(this).find('.dropdown-menu').slideUp('fast');
    e.stopPropagation()
  }
})
