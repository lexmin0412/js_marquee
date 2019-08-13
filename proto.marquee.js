// proto js

function marquee ( ele, time, easingFunc ) {

  var listBox = document.querySelector(''+ ele +' ul')

  var itemList = document.querySelectorAll(''+ ele +' ul li')
  // var firstItem = document.querySelectorAll(''+ ele +' ul li')[0]

  var listLength = itemList.length

  // 获取盒子总高度
  var box = document.querySelector(ele)
  var itemHeight = itemList[0].clientHeight
  var moveHeight = itemHeight*listLength

  // 克隆第一个item,加到最后
  var firstItemClone = itemList[0].cloneNode(true)
  listBox.parentNode.style.position = 'absolute'
  listBox.appendChild(firstItemClone)
  console.log(document.querySelectorAll(''+ ele +' ul li'))

  // 进入页面开始动画
  document.querySelector(ele).parentNode.style.position = 'relative'
  document.querySelector(ele).parentNode.style.position = 'absolute'
  console.log(document.querySelector(ele).parentNode)

  var top = 0;

  // 设置定时器 循环滚动
  setInterval(function(){
    console.log(222222, $('#box').css('top'), top)

    top -= 2
    $('#box').css({
      top: parseInt(top) - 2 + 'px'
    })
  },time)


  // setTimeout(() => {
    
  //   console.log(itemList)
  // }, 200);


  console.log(box)
  console.log(itemHeight)

}