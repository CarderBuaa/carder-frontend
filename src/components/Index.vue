<template>
    <q-layout>
        <div slot="header" class="toolbar">
            <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
                <i>menu</i>
            </button>
            <q-toolbar-title :padding="0">
                Carder
            </q-toolbar-title>
        </div>

        <q-drawer ref="leftDrawer">
            <!-- <div class="toolbar light">
                <q-toolbar-title>
                    Drawer Title
                </q-toolbar-title>
            </div> -->
            <div class="list no-border platform-delimiter">
                <q-drawer-link icon="mail" :to="{path: '/card', exact: true}">
                    名片
                </q-drawer-link>
                <q-drawer-link icon="mail" :to="{path: '/profile', exact: true}">
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
export default {
    data() {
        return {
        }
    },
    computed: {

    },
    methods: {

    }
}
</script>

<style lang="stylus">

</style>
