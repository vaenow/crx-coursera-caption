var STORE = 'coursera'
var LAYOUT = 'input[name="layout"]'
var TRANSLATE = 'input[name="translate"]'
  // Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function() {
  // var skipRemove = window.localStorage.get('skipRemove')
  // setDOMInfo(skipRemove)
  $("input").bootstrapSwitch();
  // document.getElementById('check').addEventListener('click', parseImg);
  // document.getElementById('translate').addEventListener('click', switchTranslate);
  $(LAYOUT).click(switchLayout)
  $(TRANSLATE).click(switchTranslate)

  getWebStore()
  // var store = JSON.parse(localStorage.getItem(STORE) || "{}")
  // if (store.layout) {
  //   $(LAYOUT).click()
  // }
  // if (store.translate) {
  //   if (store.translate.auto) {
  //     $(TRANSLATE).click()
  //   }
  // }

});

function messager(msg) {
  var from = msg.from || "popup";
  var subject = msg.subject || "";
  var afterSend = msg.afterSend || function() {};
  var beforeSend = msg.beforeSend || function() {};

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    beforeSend(tabs)
    chrome.tabs.sendMessage(
      tabs[0].id, {
        from: from,
        subject: subject
      },
      afterSend
    );
  })
}
function setDOMInfo(resp) {
  // var info = skipRemove ? '跳转'
  var respMsg = 'Switching...';
  if (typeof resp === 'string') {
    respMsg = resp;
    $('#check').addClass('btn-primary')
  }
  document.getElementById('check').innerHTML = respMsg;
}

function setAutoTranslate(resp) {

}


function getWebStore() {
  messager({
    subject: 'getWebStore',
    afterSend: initPopupShow
  })
}

function initPopupShow(resp) {
  console.log('initPopupShow', resp)
}

function switchLayout() {
  messager({
    subject: 'switchLayout',
    beforeSend: setDOMInfo,
    afterSend: setDOMInfo
  })
}

function switchTranslate() {
  messager({
    subject: 'translate',
    afterSend: setAutoTranslate
  })
}