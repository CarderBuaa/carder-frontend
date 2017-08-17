<template>
    <q-layout>
        <div slot="header" class="toolbar">
            <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
                <i>menu</i>
            </button>
            <q-toolbar-title :padding="0">
                Carder
            </q-toolbar-title>
            <button @click="logout()">
                <i>exit_to_app</i>
            </button>
        </div>

        <q-drawer ref="leftDrawer">
            <!-- <div class="toolbar light">
                <q-toolbar-title>
                    Drawer Title
                </q-toolbar-title>
            </div> -->
            <div class="list no-border platform-delimiter">
                <q-drawer-link icon="contacts" :to="{path: '/card', exact: true}">
                    名片
                </q-drawer-link>
                <q-drawer-link icon="person" :to="{path: '/profile', exact: true}">
                    个人信息
                </q-drawer-link>
            </div>
        </q-drawer>

        <!--
          Replace following "div" with
          "<router-view class="layout-view">" component
          if using subRoutes
        -->
        <router-view class="layout-view"></router-view>
        </div>
    </q-layout>
</template>

<script>
import { LocalStorage } from 'quasar'

export default {
    data() {
        return {
        }
    },
    methods: {
        logout: function() {
            if(confirm('确定要登出吗?')) {
                LocalStorage.remove('token')
                LocalStorage.remove('username')
                this.$router.push('/login')
            }
        }
    },
    created: function() {
        if(!LocalStorage.has('token') || !LocalStorage.has('username')) {
            this.$router.push('/login')
            return
        }
        this.$router.push('/card')
    },
    beforeRouteUpdate: function(to, from, next) {
        if(to.path === '/') {
            this.$router.push('/card')
            return
        }
        next()
    }
}
</script>

<style lang="stylus">

</style>
