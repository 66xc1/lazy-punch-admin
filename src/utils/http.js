import axios from 'axios';
import {vueInstance} from '@/main';
import store from '../store/store';
import {trimObj} from './trim';

class RequestCfg {
    constructor(method, url, data) {
        this.method = method;
        this.url = url;
        this.data = data;
    }
}

class HTTP {
    async request(method, url, param, noMessage) {
        let instance = axios.create({
            baseURL: '/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
        });

        param = trimObj(param);
        let requestCfg = new RequestCfg(method, url, param);
        store.commit('changeLoading', 1);
        try {
            const result = await instance.request(requestCfg);
            setTimeout(() => {
                store.commit('changeLoading', -1);
            }, 200);

            if (result.data.code === '401') {
                vueInstance.$message.warning('登陆已过期');
                sessionStorage.clear();
                await vueInstance.$router.push({path: '/login'});
                return;
            }

            if (result.data.msg && !result.data.state && !noMessage) {
                vueInstance.$message.warning(result.data.msg);
            }

            return result.data;
        } catch (e) {
            setTimeout(() => {
                store.commit('changeLoading', -1);
            }, 200);

            vueInstance.$message.error('服务器出错');
        }
    }

    async post(url, param, noMessage) {
        return this.request('post', url, param, noMessage);
    }

    async get(url, param, noMessage) {
        return this.request('get', url, param, noMessage);
    }

    async downloadFile(url, param) {
        let instance = axios.create({
            baseURL: '/api',
            responseType: 'blob',
            timeout: 25000,
            validateStatus: (status) => {
                return status >= 200 && status < 300; //default
            },
            headers: {
                'Authorization': sessionStorage.getItem('authorization')
            },
        });
        let requestCfg = new RequestCfg('post', url, param);
        try {
            const result = await instance.request(requestCfg);
            return result.data;
        } catch (e) {
            vueInstance.$message.error('服务器出错');
        }
    }
}

let http = new HTTP();

export default http;
