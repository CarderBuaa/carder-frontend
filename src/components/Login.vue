<template>
    <div class="login-page window-width bg-light column items-center no-wrap" :class="{'window-height': logining}">
        <!-- your content -->
        <div class="login-header bg-dark flex items-center justify-center">
            Login
        </div>
        <div>
            <q-card class="login-card bg-white column items-center justify-center">
                <q-card-main class="full-width items-center ">
                <h1>Carder</h1>
                <form v-show="logining">
                    <q-field
                        icon="account_circle"
                        :error="$v.loginData.username.$error"
                        :helper="!$v.loginData.username.required ? '请输入用户名' : ''">
                        <q-input type="text" float-label="用户名" v-model="loginData.username" @input="$v.loginData.username.$touch()" />
                    </q-field>
                    <q-field
                        icon="fa-key"
                        :error="$v.loginData.password.$error"
                        :helper="!$v.loginData.password.required ? '请输入密码' : ''">
                        <q-input type="password" float-label="密码" v-model="loginData.password" @input="$v.loginData.password.$touch()" />
                    </q-field>
                    <div class="row sm-gutter button-container">
                        <div class="col-6">
                            <q-btn color="primary" class="col-6 full-width block" @click.prevent="login()">登陆</q-btn>
                        </div>
                        <div class="col-6">
                            <q-btn color="dark" class="col-6 full-width block" @click.prevent="logining = false">注册</q-btn>
                        </div>
                    </div>
                </form>
                <q-btn outline color="dark" v-show="!logining" @click="logining = true">
                    <q-icon name="keyboard_arrow_left" ></q-icon>
                    我有账号, 我要登陆
                </q-btn>
                <q-stepper ref="stepper" v-show="!logining" vertical>
                    <q-step default title="注册信息">
                        <form>
                            <q-field
                                icon="fa-user"
                                :error="$v.registerData.username.$error"
                                :helper="!$v.registerData.username.required ? '请输入用户名' : ''">
                                <q-input type="text" float-label="用户名" @input="$v.registerData.username.$touch()" v-model="registerData.username" />
                            </q-field>
                            <q-field
                                icon="fa-key"
                                :error="$v.registerData.password.$error"
                                :helper="!$v.registerData.password.required ? '请输入密码' : ''">
                                <q-input type="password" float-label="密码" @input="$v.registerData.password.$touch()" v-model="registerData.password" />
                            </q-field>
                            <q-field
                                icon="fa-key"
                                :error="$v.registerData.passwordRepeat.$error"
                                :helper="!$v.registerData.passwordRepeat.required ? '请再次输入密码' : (!$v.registerData.passwordRepeat.sameAsPassword ? '密码不一致' : '')">
                                <q-input type="password" float-label="重复密码" @input="$v.registerData.passwordRepeat.$touch()" v-model="registerData.passwordRepeat" />
                            </q-field>
                            <q-field
                                icon="email"
                                :error="$v.registerData.email.$error"
                                :helper="!$v.registerData.email.required ? '请输入邮箱' : (!$v.registerData.email.email ? '邮箱格式不对' : '')">
                                <q-input type="email" float-label="电子邮箱" @input="$v.registerData.email.$touch()" v-model="registerData.email" />
                            </q-field>
                            <q-field
                                icon="fa-phone"
                                :error="$v.registerData.phoneMobile.$error"
                                :helper="!$v.registerData.phoneMobile.required ? '请输入手机' : (!$v.registerData.phoneMobile.numeric ? '电话必须为数字' : '')">
                                <q-input type="number" float-label="手机" @input="$v.register.phoneMobile.$touch()" v-model="registerData.phoneMobile" />
                            </q-field>
                        </form>
                        <q-stepper-navigation>
                            <q-btn color="primary" :disabled="$v.registerData.group.$invalid" @click="$refs.stepper.next()">确认</q-btn>
                        </q-stepper-navigation>
                    </q-step>
                    <q-step title="确认">
                        <q-list>
                            <q-item>
                                 <q-item-side icon="fa-user" color="gray" />
                                 <q-item-main>
                                     <q-item-tile label>{{ registerData.username }}</q-item-tile>
                                 </q-item-main>
                            </q-item>
                            <q-item>
                                 <q-item-side icon="fa-key" color="gray" />
                                 <q-item-main>
                                     <q-item-tile label>******</q-item-tile>
                                 </q-item-main>
                            </q-item>
                            <q-item>
                                 <q-item-side icon="mail" color="gray" />
                                 <q-item-main>
                                     <q-item-tile label>{{ registerData.email }}</q-item-tile>
                                 </q-item-main>
                            </q-item>
                            <q-item>
                                 <q-item-side icon="fa-phone" color="gray" />
                                 <q-item-main>
                                     <q-item-tile label>{{ registerData.phoneMobile }}</q-item-tile>
                                 </q-item-main>
                            </q-item>
                        </q-list>
                        <q-stepper-navigation>
                            <q-btn flat @click="$refs.stepper.previous()">修改</q-btn>
                            <q-btn color="primary" @click="register()">确定, 我要注册</q-btn>
                        </q-stepper-navigation>
                    </q-step>
                    <!-- <q-step title="完成">...</q-step> -->
                </q-stepper>
                </q-card-main>
            </q-card>
        </div>
    </div>
</template>

<script>
import {
    QCard,
    QCardMain,
    QField,
    QInput,
    QBtn,
    QIcon,
    QStepper,
    QStep,
    QStepperNavigation,
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    Toast,
    LocalStorage,
    Loading
} from 'quasar'

import {
    required,
    email,
    numeric,
    sameAs
} from 'vuelidate/lib/validators'

export default {
    components: {
        QCard,
        QCardMain,
        QField,
        QInput,
        QBtn,
        QIcon,
        QStepper,
        QStep,
        QStepperNavigation,
        QList,
        QItem,
        QItemSide,
        QItemMain,
        QItemTile
    },
    data() {
        return {
            loginData: {
                username: '',
                password: ''
            },
            registerData: {
                username: '',
                password: '',
                passwordRepeat: '',
                email: '',
                phoneMobile: ''
            },
            logining: true
        }
    },
    validations: {
        loginData: {
            username: { required },
            password: { required }
        },
        registerData: {
            username: { required },
            password: { required },
            passwordRepeat: {
                required,
                sameAsPassword: sameAs('password')
            },
            email: { required, email },
            phoneMobile: { required, numeric },
            group: [
                'registerData.username',
                'registerData.password',
                'registerData.passwordRepeat',
                'registerData.email',
                'registerData.phoneMobile'
            ]
        }
    },
    methods: {
        login() {
            if(!this.loginData.username || !this.loginData.password) {
                Toast.create.negative({
                    html: '用户名或密码不能为空!'
                })
                return
            }
            this.$http.post('user/accesstoken', {
                username: this.loginData.username,
                password: this.loginData.password
            }, {
                emulateJSON: true
            }).then(resp => {
                LocalStorage.set('token', resp.data.token)
                LocalStorage.set('username', this.loginData.username)
                this.$router.push('/card')
            }, resp => {
                switch(resp.status) {
                case 400:
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
        },
        registerDataReset() {
            this.registerData.username = ''
            this.registerData.password = ''
            this.registerData.passwordRepeat = ''
            this.registerData.email = ''
            this.registerData.phoneMobile = ''
        },
        register() {
            if(!this.registerData.username || !this.registerData.password) {
                Toast.create.negative({
                    html: '用户名或密码不能为空!'
                })
                return
            }
            this.$http.post('user', {
                username: this.registerData.username,
                password: this.registerData.password,
                email: this.registerData.email,
                phoneMobile: this.registerData.phoneMobile
            }, {
                emulateJSON: true
            }).then(resp => {
                Toast.create.positive({
                    html: '注册成功! 请登录'
                })
                this.logining = true
                this.registerDataReset()
            }, resp => {
                switch(resp.status) {
                case 400:
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
    },
    created() {
        if(Loading.isActive()) Loading.hide()
        if(LocalStorage.has('token') && LocalStorage.has('username')) {
            this.$router.push('/card')
        }
    }
}
</script>

<style lang="stylus" scoped>
.login-page
    .login-header
        height 30vh
        width 100%
        font-size 20vmax
        color rgba(255, 255, 255, .2)
        overflow hidden
    .login-card
        margin-top -25px
        width 90vw
        max-width 600px
        padding 25px
        .button-container
            padding 1rem 0 0 0
        .q-stepper
            width 100%
            box-shadow none
        .q-field-helper
            display none !important
</style>

<style lang="stylus">
.q-field-helper
    display none
.q-field-with-error
    .q-field-helper
        display block
</style>

