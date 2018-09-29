/**
* @date 2017-10-29
* @author LuoWen
**/
var LAYOUT = 'input[name="layout"]'
var TRANSLATE = 'input[name="translate"]'
  // Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function() {
  $(LAYOUT).bootstrapSwitch({
    onSwitchChange: switchLayout
  })
  $(TRANSLATE).bootstrapSwitch({
    onSwitchChange: switchTranslate
  })
  getWebStore()
});

// ======================= // Utils

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
      function(resp = "") {
        afterSend(JSON.parse(resp))
      }
    );
  })
}

// ======================= //

function getWebStore() {
  messager({
    from: 'getWebStore',
    subject: {},
    afterSend: initPopupShow
  })
}

function initPopupShow(store) {
  // console.log('initPopupShow', store)
  $(LAYOUT).bootstrapSwitch('state', store.layout.checked)
  $(TRANSLATE).bootstrapSwitch('state', store.translate.checked)
}

function switchLayout(evt, checked) {
  messager({
    from: 'switchLayout',
    subject: {checked},
    // beforeSend: setDOMInfo,
    // afterSend: setDOMInfo
  })
}

function switchTranslate(evt, checked) {
  messager({
    from: 'switchTranslate',
    subject: {checked},
    // afterSend: setAutoTranslate
  })
}
