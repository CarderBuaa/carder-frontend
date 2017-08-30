<template>
    <q-layout ref="layout" view="lHh Lpr lFf" :right-breakpoint="1100">
        <q-toolbar slot="header">
            <q-btn flat @click="$refs.layout.toggleLeft()">
                <q-icon name="menu" />
            </q-btn>
            <q-toolbar-title>
                Carder
            </q-toolbar-title>
            <q-btn flat @click="logout()">
                <q-icon name="exit_to_app" />
            </q-btn>
        </q-toolbar>

        <div slot="left">
            <!-- <div class="toolbar light">
                <q-toolbar-title>
                    Drawer Title
                </q-toolbar-title>
            </div> -->
            <q-list no-border link inset-separator>
                <q-side-link item :to="{path: '/card', exact: true}">
                    <q-item-side icon="contacts" />
                    <q-item-main label="名片信息" sublabel="生成名片" />
                </q-side-link>
                <q-side-link item :to="{path: '/profile', exact: true}">
                    <q-item-side icon="person" />
                    <q-item-main label="个人信息" sublabel="修改个人信息" />
                </q-side-link>
                <q-side-link item :to="{path: '/admin', exact: true}">
                    <q-item-side icon="settings" />
                    <q-item-main label="管理" sublabel="管理用户" />
                </q-side-link>
            </q-list>
        </div>

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
import {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QItemSide,
    QSideLink,
    QItemMain,
    LocalStorage
} from 'quasar'

export default {
    name: 'index',
    components: {
        QLayout,
        QToolbar,
        QToolbarTitle,
        QBtn,
        QIcon,
        QList,
        QItemSide,
        QSideLink,
        QItemMain
    },
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
    }
}
</script>

<style lang="stylus">

</style>
