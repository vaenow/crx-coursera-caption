/**
* @date 2017-10-29
* @author LuoWen
**/
import GA from './lib/ga'
import startLayout, {
    isSwitched
} from './layout'
import translate, {
	isTranslated,
	startTranslate,
	afterVideoReady,
	resetCaption,
} from './tsl'

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

initSavedConfig()
function initSavedConfig() {
	afterVideoReady((captionInfo) => {
		const store = getStore()
		if (store.translate.checked) {
			startTranslate(captionInfo)
		}
		if (store.layout.checked) {
			startLayout(true)
		}
		GA()
	})
}

// let currentPage = ''
listenUrlChange()
let urlChangeNum = 0
function listenUrlChange() {
	let currentPage = window.location.href;
	clearInterval(urlChangeNum)
	urlChangeNum = setInterval(function() {
		if (currentPage != window.location.href) {
			currentPage = window.location.href;
			// location.reload()
			clearInterval(urlChangeNum)
            GA(true)
			listenUrlChange()
			resetCaption()
			initSavedConfig()
		}
	}, 50);
}

// ======================= // Utils
var STORE = 'coursera'
var STORE_DEFAULT = {
	layout: {
		checked: false
	},
	translate: {
		checked: true
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

	const switched = isSwitched()
	if (checked !== switched){
		startLayout(checked)
	}

	let store = getStore()
	store.layout.checked = checked;
	updateStore(store)

	response({
		code: 200,
		msg: "Bravo! ❄️"
	});
}

function handleSwitchTranslate({checked}, response) {

	if(checked !== isTranslated()) {
		translate(checked)
	}

	let store = getStore()
	store.translate.checked = checked;
	updateStore(store)

	response({
		code: 200,
		msg: 'cool'
	})
}

// ======================= //
