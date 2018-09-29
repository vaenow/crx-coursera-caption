/**
 * Created by luowen on 17/11/2.
 */

import { getStore } from '../utils'
// <!-- Global site tag (gtag.js) - Google Analytics -->
const GA_CONTENT = `
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-106828486-2', 'auto');
`;
const PAGE_VIEW = `ga('send', 'pageview');`;
const TICK_EVENT = `ga('send', 'event', 'Tick', 'ACTION', 'ARGS');`;
let interval = {
    num: 0,
    MAX_CNT: 20,
    currentCnt: 0
};
export default function (forceReset) {
    if (forceReset) $('script[name=crx]').remove();
    if ($('script[name=crx]').length) return;

    addScript({
        type: 'text/javascript',
        name: 'crx',
    }, (GA_CONTENT + PAGE_VIEW));
    tick();

    // Keep ga alive
    clearInterval(interval.num);
    interval.currentCnt = 0;
    interval.num = setInterval(function () {
        tick();
        if(++interval.currentCnt > interval.MAX_CNT) {
            clearInterval(interval.num);
            interval.currentCnt = 0;
            // console.log('GA stop', JSON.stringify(interval))
        }
    }, 3 * 60 * 1000)
}

function tick() {
    // window.ga && window.ga('send', 'pageview');
    $('script[name=ga]').remove();
    addScript({
            type: 'text/javascript',
            name: 'ga',
        },
        makeTickEvent()
    );
    // console.log(`GA window.ga('send', 'pageview');`, JSON.stringify(interval))
}

function makeTickEvent() {
    let tickEvent = "";
    const store = getStore();
    for( const k in store) {
        tickEvent += TICK_EVENT.replace(/ACTION/, k).replace(/ARGS/, store[k].checked)
    }
    return tickEvent;
}

function addScript(attribute, text, callback) {
    let s = document.createElement('script');
    for (const attr in attribute) {
        s.setAttribute(attr, attribute[attr] ? attribute[attr] : null)
    }
    s.innerHTML = text;
    s.onload = callback;
    document.head.appendChild(s);
}

// <!-- Google Tag Manager -->
// <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
// })(window,document,'script','dataLayer','GTM-PRMZ3QH');</script>
// <!-- End Google Tag Manager -->
//
// <!-- Google Tag Manager (noscript) -->
// <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PRMZ3QH"
// height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
//     <!-- End Google Tag Manager (noscript) -->
