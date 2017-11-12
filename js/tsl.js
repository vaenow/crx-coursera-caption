/**
* @date 2017-10-29
* @author LuoWen
**/
const tjs = require('translation.js')

const MAX_T_LEN = 4000
let intervalNum = 0
let captionCacheDefault = JSON.stringify({
	isTranslate: false,
	vtts: {},
	en: [],
	cn: [],
});
let captionCache = JSON.parse(captionCacheDefault);

export default function tsl(isTranslate) {
	if (!isTranslate) { // clean cn translate
		captionCache.isTranslate = false
		return cleanCaption()
	} else if (captionCache.cn.length) { // use cn cache
		captionCache.isTranslate = true
		cleanCaption()
		return insertCaption(captionCache.cn, captionCache, [0, captionCache.en.length])
	} else { // start caption
		const captionInfo = getCaptionInfo()
		startTranslate(captionInfo)
	}
}

export function afterVideoReady(callback = () => {}) {
	if (intervalNum) clearInterval(intervalNum)

	intervalNum = setInterval(() => {
		const captionInfo = getCaptionInfo()
		if (captionInfo) {
			clearInterval(intervalNum)
			callback(captionInfo)
		}
	}, 500)

	setTimeout(() => {
		// No video
		clearInterval(intervalNum)
	}, 60 * 1000)
}

export function startTranslate(captionInfo) {
	captionCache.isTranslate = true
	goTranslateAndInsert(captionInfo)
}

export function isTranslated() {
	return !!captionCache.isTranslate
}

function goTranslateAndInsert(captionInfo, captionIndexRange = [0, 0]) {
	let content = ''
	for (let i = captionIndexRange[0]; i < captionInfo.captions.length; i++) {
		const caption = captionInfo.captions[i];
		if ((content + caption).length > MAX_T_LEN) break;
		content += caption
		captionIndexRange[1]++
	}
	
	go.call(this, content)
		.then(resp => {
			resp.result.forEach(result => captionCache.cn.push(result))
			insertCaption(resp.result, captionInfo, captionIndexRange)
		})
		.then(() => {
			const captionIndexEnd = captionIndexRange[1]
			if (captionIndexEnd < captionInfo.captions.length) {
				goTranslateAndInsert(captionInfo, [captionIndexEnd ,captionIndexEnd])
			}
		})
}

export function resetCaption() {
	captionCache = JSON.parse(captionCacheDefault)
}

function cleanCaption() {
	const tt = getTextTrack(captionCache.vtts)
	const cues = Array.from(tt.cues)
	cues.forEach((c, idx) => {
		c.text = captionCache.en[idx]
	})
}

function insertCaptionCache(vtts) {
	captionCache.vtts = vtts
	captionCache.tt = getTextTrack(vtts)
	Array.from(vtts).forEach(tt => {
		captionCache[tt.language] = []
		Array.from(tt.cues).forEach(c => {
			captionCache[tt.language].push(c.text)
		})
	})
}

function getTextTrack(vtts, lan = 'en') {
	return Array.from(vtts).find(tt => tt.language === lan)
}

function getCaptionInfo() {
	let content = "no caption"
	try {
		var SEPARATOR = '[[###]]'
		var ve = $('video')[0]
		var vtts = ve.textTracks
		var tt = getTextTrack(vtts)
		insertCaptionCache(vtts)
		var captions = Array.from(tt.cues).map((c, idx) =>
			(idx !==0 ? `&&${idx}%%` : '') + c.text
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
		.replace(/＆＆/g, "&&")
		.replace(/％％/g, "%%")
	const captions = content.split("&&")
	// console.log('captions', captions)

	for (let i = captionIndexRange[0]; i<captionIndexRange[1]; i++) {
		// console.log('cues[i]', i)
		const properCaption = findProperCaption(i, captions)
		tt.cues[i].text += `\n${properCaption}`
	}
}

function findProperCaption(index, captions) {
	let caption = captions.find(caption => caption && caption.trim().startsWith(index))
	if (caption) {
		return caption.trim().replace(/^.*?%%/, '')
	}
	return ''
}

