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

const MAX_T_LEN = 4000

let captionCache = {
	en: [],
	cn: [],
}

export default function initTranslate() {
	const intervalNum = setInterval(() => {
		// console.log('detecting <video>...')
		const captionInfo = getCaptionInfo()
		if (captionInfo) {
			clearInterval(intervalNum)
			goTranslateAndInsert(captionInfo)
		}
	}, 500)

	setTimeout(() => {
		// No video
		clearInterval(intervalNum)
	}, 60 * 1000)
}

export function isTranslated() {
	return !!captionCache.cn.length
}

function goTranslateAndInsert(captionInfo, captionIndexRange = [0, 0]) {
	// console.log('goTranslateAndInsert', captionIndexRange)

	let content = ''
	for (let i = captionIndexRange[0]; i < captionInfo.captions.length; i++) {
		const caption = captionInfo.captions[i];
		if ((content + caption).length > MAX_T_LEN) break;
		content += caption
		captionIndexRange[1]++
	}
	
	go.call(this, content)
		.then(resp => insertCaption(resp.result, captionInfo, captionIndexRange))
		.then(() => {
			const captionIndexEnd = captionIndexRange[1]
			if (captionIndexEnd < captionInfo.captions.length) {
				goTranslateAndInsert(captionInfo, [captionIndexEnd ,captionIndexEnd])
			}
		})
}

function insertCaptionCache(vtts) {
	Array.from(vtts).forEach(tt => {
		captionCache[tt.language] = []
		Array.from(tt.cues).forEach(c => {
			captionCache[tt.language].push(c.text)
		})
	})
	// console.log('captionCache', Object.assign({}, captionCache))
	console.log('captionCache', captionCache)
}
function getCaptionInfo() {
	let content = "no caption"
	try {
		var SEPARATOR = '[[###]]'
		var ve = $('video')[0]
		var vtts = ve.textTracks
		var tt = Array.from(vtts).find(tt => tt.language === 'en')
		insertCaptionCache(vtts)
		var captions = Array.from(tt.cues).map((c, idx) =>
			(idx !==0 ? `%%${idx}&&` : '') + c.text
		)

		if(!captions.length) return false
		// content = captions.join(SEPARATOR)
		// content = captions.join('')
		// console.log('content', captions, content)
	} catch (e) {
		return false
	}
	return { captions, content, vtts, tt, SEPARATOR }
}

function go(content) {
	return tjs
		.translate(content.toLowerCase())
		.then(resp => resp)
}

function insertCaption(result, {vtts, SEPARATOR, tt}, captionIndexRange) {
	const content = result.join('')
	const captions = content.split("%%")
	// console.log('captions', captions)

	const cues = Array.from(tt.cues)

	for (let i = captionIndexRange[0]; i<captionIndexRange[1]; i++) {
		// console.log('cues[i]', i)
		const properCaption = findProperCaption(i, captions)
		cues[i].text += `\n${properCaption}`

		captionCache.cn.push(properCaption)
	}
}

function findProperCaption(index, captions) {
	let caption = captions.find(caption => caption && caption.trim().startsWith(index))
	if (caption) {
		return caption.trim().replace(/^.*?&&/, '')
	}
	return ''
}

