import Vue from 'vue';
import Vuex from 'vuex';
import loading from './modules/loading';

Vue.use(Vuex);

// 创建 store 实例
export default new Vuex.Store({
    modules: {
        loading
    }
});
