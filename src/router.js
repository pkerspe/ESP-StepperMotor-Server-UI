import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Setup from './views/Setup.vue'
import Control from './views/Control.vue'
import About from './views/About.vue'

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            title: 'ESP-StepperMotor-Server',
            description: ''
        }
    },
    {
        path: '/control',
        name: 'control',
        component: Control,
        meta: {
            title: 'Motion control',
            description: 'on this page you can control all configured stepper motors'
        }
    },
    {
        path: '/setup',
        name: 'setup',
        component: Setup,
        meta: {
            title: 'Setup',
            description: 'on this page you can configure the ESP-StepperMotor-Server, register stepper motors and limit switches as well as other settings'
        }
    },
    {
        path: '/about',
        name: 'about',
        component: About,
        meta: {
            title: 'About ESP-StepperMotor-Server',
            description: ''
        }
    }
];

const router = new Router({
    routes,
    mode: 'history'
});

router.beforeEach((to, from, next) => {
    if(document.getElementById("header-title-from-content")) {
        document.getElementById("header-title-from-content").innerHTML = to.meta.title;
        document.getElementById("header-description-from-content").innerHTML = to.meta.description;
    }
    next();
});

export default router;
