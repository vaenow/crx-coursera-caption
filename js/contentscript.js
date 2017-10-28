chrome.runtime.onMessage.addListener(function({
	from,
	subject
}, sender, response) {
	const resp = responseWrapper(response)
	const subj = JSON.parse(subject)

	switch (from) {
		case 'getWebStore':
			handleGetWebStore(subj, resp);
			break;
		case 'switchLayout':
			handleSwitchLayout(subj, resp);
			break;
		case 'switchTranslate':
			handleSwitchTranslate(subj, resp);
			break;
	}
});

// ======================= // Utils
var STORE = 'coursera'
var STORE_DEFAULT = {
	layout: {
		checked: false
	},
	translate: {
		checked: false
	},
}

function responseWrapper(response) {
	return function(msg) {
		return response(JSON.stringify(msg))
	}
}

function getStore() {
	return JSON.parse(localStorage.getItem(STORE)) || STORE_DEFAULT
}

function updateStore(store) {
	localStorage.setItem(STORE, JSON.stringify(store))
}

// ======================= // Handle

function handleGetWebStore({checked}, response) {
	// console.log('got message, handleGetWebStore', msg)
	response(getStore());
}

function handleSwitchLayout({checked}, response) {

	console.log('got message', checked)

	// var msgResp = {};
	// msgResp.info = 'Redirecting..'

	//injectCSS()
	// const switched = isSwitched()

	// if (checked !== switched) {
	startLayout(isSwitched())
		// }
	let store = getStore()
	store.layout.checked = checked;
	updateStore(store)

	response({
		code: 200,
		msg: "Bravo! ❄️"
	});
}

function handleSwitchTranslate({checked}, response) {
	let store = getStore()
	store.translate.checked = checked;
	updateStore(store)

	response({
		code: 200,
		msg: 'cool'
	})
}

// ======================= //

function startLayout(isSwitched) {
	if (!isSwitched) {
		// 收起drawer
		if ($('.drawer-open').length) {
			$(".side-nav-button").click()
		}

		// 隐藏 "下载"
		$('.styleguide').hide()

		// 字幕放左
		$('.content-container > .horizontal-box').addClass('caption-left')

		// 视频放右
		$('.content-container > .video-container').addClass('video-right')
		$('.content-container > .video-container > div').addClass('video-right')
		$('.content-container > .video-container > div .video-js').addClass('video-right')
		$('.content-container > .video-container   .c-video-title').hide()


	} else {
		// 展开drawer
		if (!$('.drawer-open').length) {
			$(".side-nav-button").click()
		}

		// 隐藏 "下载"
		$('.styleguide').show()

		// 字幕放左
		$('.content-container > .horizontal-box').removeClass('caption-left')

		// 视频放右
		$('.content-container > .video-container').removeClass('video-right')
		$('.content-container > .video-container > div').removeClass('video-right')
		$('.content-container > .video-container > div .video-js').removeClass('video-right')
		$('.content-container > .video-container   .c-video-title').show()
	}
}

function isSwitched() {
	return !!$('.video-right').length
}