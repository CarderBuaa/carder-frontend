// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

import Vue from 'vue'
import VueResource from 'vue-resource'
import Vuelidate from 'vuelidate'
import Quasar from 'quasar'
import router from './router'

Vue.use(Quasar) // Install Quasar Framework
Vue.use(VueResource)
Vue.use(Vuelidate)

if(__THEME === 'mat') {
    require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

Vue.http.options.root = '/api/v1/'
// Vue.http.options.emulateJSON = true

Quasar.start(() => {
    /* eslint-disable no-new */
    new Vue({
        el: '#q-app',
        router,
        render: h => h(require('./App'))
    })
})
