<template>
    <div class="layout-view">
        <div class="profile-page layout-padding">
            <h1>管理</h1>
            <q-card>
                <q-card-main>
                    <form>
                        <q-field icon="account_circle">
                            <q-select :options="userOptions" v-model="formData.username" @change="selectUser" float-label="选择用户" />
                        </q-field>
                        <q-field
                            icon="fa-key"
                            :error="$v.formData.password.$error"
                            :helper="!$v.formData.password.required ? '请输入密码' : ''" >
                            <q-input
                                type="password"
                                v-model="formData.password"
                                float-label="密码"
                                @input="$v.formData.password.$touch()"
                                :disable="!formData.username" />
                        </q-field>
                        <q-field
                            icon="fa-key"
                            :error="$v.formData.passwordRepeat.$error"
                            :helper="!$v.formData.passwordRepeat.required ? '请再次输入密码' : (!$v.formData.passwordRepeat.sameAsPassword ? '密码不一致' : '')">
                            <q-input
                                type="password"
                                v-model="formData.passwordRepeat"
                                float-label="重复密码"
                                @input="$v.formData.passwordRepeat.$touch()"
                                :disable="!formData.username" />
                        </q-field>
                    </form>
                </q-card-main>
                <q-card-actions align="around">
                    <q-btn color="primary" class="action-btn" @click="editUser" :disable="$v.formData.passwordRepeat.$invalid">
                        修改
                        <q-spinner slot="loading" />
                    </q-btn>
                </q-card-actions>
            </q-card>
            <div class="card-container row">
                <div class="col-md-12 col-lg-6"  v-for="card in cards" :key="card.id">
                    <q-card>
                        <q-card-media>
                            <img :src="$http.options.root + 'card/' + card.id + '?username=' + formData.username">
                        </q-card-media>
                        <q-card-actions>
                            <q-btn color="red" flat @click="delCard(card.id)">删除</q-btn>
                        </q-card-actions>
                    </q-card>
                </div>
            </div>
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
    QCardMedia,
    QField,
    QInput,
    QBtn,
    QIcon,
    QSelect,
    Loading,
    LocalStorage,
    QSpinner,
    Toast
} from 'quasar'

import {
    required,
    sameAs
} from 'vuelidate/lib/validators'

export default {
    components: {
        QCard,
        QCardMain,
        QCardSeparator,
        QCardTitle,
        QCardActions,
        QCardMedia,
        QField,
        QInput,
        QBtn,
        QIcon,
        QSelect,
        QSpinner
    },
    data() {
        return {
            formData: {
                username: '',
                password: '',
                passwordRepeat: ''
            },
            users: [],
            cards: []
        }
    },
    validations: {
        formData: {
            username: { required },
            password: { required },
            passwordRepeat: {
                required,
                sameAsPassword: sameAs('password')
            }
        }
    },
    methods: {
        selectUser() {
            this.$http.get('user/' + this.formData.username, {
                headers: {
                    'Access-Token': LocalStorage.get.item('token')
                }
            }).then(resp => {
                this.cards = resp.data.cards
            })
        },
        editUser(e, done) {
            if(confirm('确定要修改吗?')) {
                this.$http.put('user/' + this.formData.username, {
                    password: this.formData.password
                }, {
                    headers: {
                        'Access-Token': LocalStorage.get.item('token')
                    }
                }).then(resp => {
                    window.location.reload()
                }, resp => {
                    Toast.create.negative({
                        html: '未知错误'
                    })
                    done()
                })
            } else {
                done()
            }
        },
        delCard(id) {
            if(confirm('确认要删除吗?')) {
                this.$http.delete('card/' + id, {
                    headers: {
                        'Access-Token': LocalStorage.get.item('token')
                    }
                }).then(resp => {
                    this.cards.splice(
                        this.cards.findIndex(card => card.id === id),
                        1
                    )
                }, resp => {
                    switch(resp.status) {
                    case 404:
                        Toast.create.negative({
                            html: resp.data.message
                        })
                        break
                    default:
                        Toast.create.negative({
                            html: '未知错误'
                        })
                    }
                })
            }
        }
    },
    computed: {
        userOptions() {
            let options = []
            for(let i = 0; i < this.users.length; i++) {
                options.push({
                    label: this.users[i].username,
                    value: this.users[i].username
                })
            }
            return options
        }
    },
    created: function() {
        Loading.show()
        if(!LocalStorage.has('token') || !LocalStorage.has('username')) {
            this.$router.push('/login')
        }
        this.$http.get('manage/allUserInfo', {
            headers: {
                'Access-Token': LocalStorage.get.item('token')
            }
        }).then(resp => {
            this.users = resp.data
            Loading.hide()
        }, resp => {
            if(resp.status === 401) {
                LocalStorage.remove('token')
                LocalStorage.remove('username')
                this.$router.push('/login')
                return
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
.action-btn
    width 100px

.cardModal
    padding 30px


.placeholder
    color #ccc
</style>

<style lang="stylus">
.q-field-helper
    display none
.q-field-with-error
    .q-field-helper
        display block
</style>