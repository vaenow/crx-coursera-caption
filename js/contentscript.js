import startLayout, {isSwitched} from './layout'
import translate, {isTranslated} from './tsl'

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

	const switched = isSwitched()
	if (checked !== switched){
		startLayout(switched)
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
