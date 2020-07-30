import http from '@/utils/http.js';
let base = {};



base.install = function(Vue) {
    Vue.prototype.$http = http;

    Vue.prototype.deepClone = function(item) {
        if (item) {
            return JSON.parse(JSON.stringify(item));
        }
    };
};
export {base};
