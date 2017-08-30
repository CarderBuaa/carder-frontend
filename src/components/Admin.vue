<template>
    <div class="layout-view">
        <div class="profile-page layout-padding">
            <h1>管理</h1>
            <q-card>
                
                
                
            </q-card>
        </div>
    </div>
</template>

<script>
import {
    QCard,
    QCardMain,
    QCardSeparator,
    QCardTitle,
    QCardActions,
    QField,
    QInput,
    QBtn,
    QIcon,
    Loading,
    LocalStorage,
    Toast
} from 'quasar'

import {
    required,
    email,
    numeric
} from 'vuelidate/lib/validators'

export default {
    components: {
        QCard,
        QCardMain,
        QCardSeparator,
        QCardTitle,
        QCardActions,
        QField,
        QInput,
        QBtn,
        QIcon
    },
    data() {
        return {

        }
    },
    methods: {
    },
    created: function() {
        Loading.show()
        if(!LocalStorage.has('token') || !LocalStorage.has('username')) {
            this.$router.push('/login')
        }
        this.$http.get('user/' + LocalStorage.get.item('username'), {
            headers: {
                'Access-Token': LocalStorage.get.item('token')
            }
        }).then(resp => {
            Loading.hide()
        }, resp => {
            if(resp.status === 401) {
                LocalStorage.remove('token')
                LocalStorage.remove('username')
                this.$router.push('/login')
            } else {
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

<style lang="stylus" scoped>
.profile-button-container
    padding-top 1em
.right-aligned
    text-align right
hr.card-splitter
    background black
    width 100%
</style>

<style lang="stylus">
.q-field-helper
    display none
.q-field-with-error
    .q-field-helper
        display block
</style>