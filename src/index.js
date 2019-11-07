// import _ from 'lodash'
import './style.less'
import navIcon from './assets/images/icon_nav.png'
import jsonData from './assets/data/data.json'
import xmlData from './assets/data/data.xml'
import printMe from './print'
import { cube } from './math'


console.log('cube', cube(4))
console.log('jsonData', jsonData, typeof jsonData, jsonData.name)
console.log('xmlData', xmlData, typeof xmlData, xmlData.note)

function component() {
  var element = document.createElement('div');

  // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  // element.classList.add('hello')

  // var myIcon = new Image()
  // myIcon.src = navIcon
  // element.appendChild(myIcon)

  var btn = document.createElement('button')
  btn.innerHTML = 'Click me and check the console!'
  btn.onclick = printMe

  
  element.appendChild(btn)

  return element;
}

document.body.appendChild(component());

if ( module.hot ) {
  module.hot.accept('./print.js', function(){
    console.log('accepting the updated printMe module!')
    printMe()
  })
}