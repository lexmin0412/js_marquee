// jquery version

function jMarquee(ele, time, easingFunc) {

  // 获取盒子总高度(也是需要偏移的高度)
  var itemLength = $(ele).children('ul').children('li').length
  var itemHeight = $(ele).children('ul').children('li:first-child').height()

  var moveHeight = itemHeight * itemLength

  // 克隆第一个item，加到最后
  var firstItemClone = $(ele).children('ul').children('li:first-child').html()
  $(ele).children('ul').append(firstItemClone)

  // 给元素设置定位
  $(ele).parent().css({
    position: 'relative'
  })
  $(ele).css({
    position: 'absolute',
  })

  // 进入页面开始动画
  startAnimate()

  // 设置定时器 循环滚动
  setInterval(function () {
    $('#box').css({
      top: 0
    }).stop(true)
    startAnimate()
  }, time)

  function startAnimate() {
    $('#box').animate({
      top: '-' + moveHeight + 'px'
    }, time, easingFunc, function () {
      $('#box').css({
        top: 0
      })
    })
  }
}
