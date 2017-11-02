/**
 * Created by luowen on 17/11/2.
 */

// <!-- Global site tag (gtag.js) - Google Analytics -->
const gaContent = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-106828486-2');
ga('set', 'userId', 'ARGS');
`;
export default function (forceReset) {
    if (forceReset) $('script[name=crx]').remove();
    if ($('script[name=crx]').length) return;

    addScript({
        name: 'crx',
        src: 'https://www.googletagmanager.com/gtag/js?id=UA-106828486-2',
        type: 'text/javascript',
        async: null
    });
    addScript({
        type: 'text/javascript',
        name: 'crx',
    }, gaContent.replace(/ARGS/, $('.c-ph-username').html()));

    // if ($('script[crx]').length) return;
    //
    // $('<script>')
    //     .attr('type', 'text/javascript')
    //     .attr('async')
    //     .attr('src', 'https://www.googletagmanager.com/gtag/js?id=UA-106828486-2')
    //     .appendTo('head');
    //
    // $('<script>')
    //     .attr('type', 'text/javascript')
    //     .attr('crx')
    //     .text(gaContent)
    //     .appendTo('head');
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