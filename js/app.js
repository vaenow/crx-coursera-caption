// const translate = require('google-translate-api');

// translate('Ik spreek Engels', {to: 'zh-cn'}).then(res => {
//     console.log(res.text);
//     //=> I speak English
//     console.log(res.from.language.iso);
//     //=> nl
// }).catch(err => {
//     console.error(err);
// });

const tjs = require('translation.js')

tjs
  .translate('test')
  .then(result => {
    console.log('tjs result:', result) // result 的数据结构见下文
  })