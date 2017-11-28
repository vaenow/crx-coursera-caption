/**
 * Created by luowen on 2017/11/28.
 */

// ======================= // Utils
var STORE = 'coursera';
// var STORE_V2 = 'cousera_store';
var STORE_DEFAULT = {
    layout: {
        checked: false
    },
    translate: {
        checked: true
    },
}

export function responseWrapper(response) {
    return function(msg) {
        return response(JSON.stringify(msg))
    }
}

export function getStore(storeName = STORE) {
    try {
        return JSON.parse(localStorage.getItem(storeName)) || STORE_DEFAULT
    } catch (e) {
        return STORE_DEFAULT;
    }
}

export function updateStore(store) {
    localStorage.setItem(STORE, JSON.stringify(store))
}