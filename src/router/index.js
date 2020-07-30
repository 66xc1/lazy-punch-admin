import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

const routes = [
    {path: '/login',name: 'login',component:() => import('@/views/login')},
    {path: '/index',name: 'index',component:() => import('@/views/index')},
    {path: '/task',name: 'task',component:() => import('@/views/task')},
    {path: '/phone',name: 'phone',component:() => import('@/views/phone')},
];

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
});


router.onError(error => {
    location.reload();
    /*const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.match(pattern);
    console.log(isChunkLoadFailed);
    if(isChunkLoadFailed){
        location.reload();
    }*/
});

export default router;
