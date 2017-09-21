console.log("ReLayout Caption 1", $.isReady)

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
	//   debugger;
	//   // First, validate the message's structure
	if ((msg.from === 'popup') && (msg.subject === 'parseImg')) {

		console.log('got message', msg)

		var msgResp = {};
		msgResp.info = 'Redirecting..'

		injectCSS()
		startLayout()

		response(JSON.stringify(msgResp));
	}
});


function startLayout() {
	// 收起drawer
	$('.drawer-open').removeClass('drawer-open')

	// 隐藏 "下载"
	$('.styleguide').hide()

	// 字幕放左
	$('.content-container > .horizontal-box').addClass('caption-left')

	// 视频放右
	$('.content-container > .video-container').addClass('video-right')
}

function injectCSS() {

	$('head').append('<style type="text/css">.video-right {    position: fixed;    right: 0;    top: 65px;    width: 45%;}.caption-left {    width: 55%;    margin-left: 10px;}.styleguide-hide {	display: none;}</style>')
}