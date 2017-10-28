var LAYOUT = 'input[name="layout"]'
var TRANSLATE = 'input[name="translate"]'
  // Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function() {
  // var skipRemove = window.localStorage.get('skipRemove')
  // setDOMInfo(skipRemove)
  // $("input").bootstrapSwitch({
  //   onSwitchChange: function(event, data) {
  //     console.log('onSwitchChange:', event, data)
  //   }
  // });
  // document.getElementById('check').addEventListener('click', parseImg);
  // document.getElementById('translate').addEventListener('click', switchTranslate);
  $(LAYOUT).bootstrapSwitch({
    onSwitchChange: switchLayout
  })
  //.on('switch-change', switchLayout)
  $(TRANSLATE).bootstrapSwitch({
    onSwitchChange: switchTranslate
  })
  //.on('switch-change', switchTranslate)

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
  var from = msg.from || "";
  var subject = msg.subject || {};
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
        subject: JSON.stringify(subject)
      },
      function(resp) {
        afterSend(JSON.parse(resp))
      }
    );
  })
}
function setDOMInfo(resp) {
  // var info = skipRemove ? '跳转'
  // var respMsg = 'Switching...';
  // if (typeof resp === 'string') {
  //   respMsg = resp;
  //   $('#check').addClass('btn-primary')
  // }
  // document.getElementById('check').innerHTML = respMsg;
}

function setAutoTranslate(resp) {

}


function getWebStore() {
  messager({
    from: 'getWebStore',
    subject: {},
    afterSend: initPopupShow
  })
}

function initPopupShow(store) {
  console.log('initPopupShow', store)
  $(LAYOUT).bootstrapSwitch('state', store.layout.checked)
  $(TRANSLATE).bootstrapSwitch('state', store.translate.checked)
}

function switchLayout() {
  messager({
    from: 'switchLayout',
    subject: {checked: true},
    beforeSend: setDOMInfo,
    afterSend: setDOMInfo
  })
}

function switchTranslate() {
  messager({
    from: 'translate',
    subject: {checked: true},
    afterSend: setAutoTranslate
  })
}