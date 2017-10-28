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
window.tjs2 = tjs

const intervalNum = setInterval(() => {
	console.log('detecting <video>...')
	const captionInfo = getCaptionInfo()
	if (captionInfo.content) {
		clearInterval(intervalNum)
		go.call(this, captionInfo.content)
			.then(resp => insertCaption(resp.result, captionInfo))
	}
}, 500)

function getCaptionInfo() {
	let content = "no caption"
	try {
		var SEPARATOR = '[[###]]'
		var ve = $('video')[0]
		var vtts = ve.textTracks
		var tt = Array.from(vtts).find(tt => tt.language === 'en')
		var captions = Array.from(tt.cues).map((c, idx) =>
			(idx !==0 ? `%%${idx}&&` : '') + c.text
		)
		// content = captions.join(SEPARATOR)
		content = captions.join('')
		console.log('content', captions, content)
	} catch (e) {
		return false
	}
	return { content, vtts, tt, SEPARATOR }
}

function go(content) {
	return tjs
		.translate(content.toLowerCase())
		.then(resp => {
			console.log('tjs result:', resp.result) // result 的数据结构见下文
			return resp
		})
}

function insertCaption(result, {vtts, SEPARATOR, tt}) {
	const content = result.join('')
	const captions = content.split("%%")
	console.log('captions', captions)
	Array.from(tt.cues).forEach((c, idx) => {
		c.text += `\n${findProperCaption(idx, captions)}`
		console.log('c.text', c.text)
	})
}

function findProperCaption(index, captions) {
	let caption = captions.find(caption => caption && caption.trim().startsWith(index))
	if (caption) {
		return caption.trim().replace(/^.*?&&/, '')
	}
	return ''
}

