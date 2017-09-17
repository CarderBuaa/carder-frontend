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
                <q-side-link v-if="role === 1" item :to="{path: '/admin', exact: true}">
                    <q-item-side icon="settings" />
                    <q-item-main label="管理用户" sublabel="查看修改用户信息" />
                </q-side-link>
                <q-side-link v-if="role === 1" item :to="{path: '/manage-card', exact: true}">
                    <q-item-side icon="settings" />
                    <q-item-main label="管理卡片" sublabel="查看修改名片信息" />
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
    LocalStorage,
    Loading
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
        QItemMain,
        Loading
    },
    data() {
        return {
            role: 0
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
    beforeRouteEnter(to, from, next) {
        if(!LocalStorage.has('token') || !LocalStorage.has('username')) {
            next('/login')
        } else {
            next()
        }
    },
    created: function() {
        this.$http.get('user/' + LocalStorage.get.item('username'), {
            headers: {
                'Access-Token': LocalStorage.get.item('token')
            }
        }).then(resp => {
            this.role = resp.data.role
            Loading.hide()
        }, resp => {
            if(resp.status === 401) {
                LocalStorage.remove('token')
                LocalStorage.remove('username')
                this.$router.push('/login')
            }
            else {
                Toast.create.negative({
                    html: '未知错误'
                })
                Loading.show({
                    message: '未知错误, 请刷新页面重试'
                })
            }
        })
    }
}
</script>

<style lang="stylus">

</style>
