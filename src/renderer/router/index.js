import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: require('@/components/Home')
        }, {
            path: '/main/:business_id',
            name: 'main',
            component: require('@/components/Main')
        }, {
            path: '/login',
            name: 'login',
            component: require('@/components/Login')
        }, {
            path: '/logout',
            name: 'logout',
            component: require('@/components/Logout')
        }, {
            path: '/choose-business',
            name: 'chooseBusiness',
            component: require('@/components/ChooseBusiness')
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})