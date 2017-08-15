<template>
    <!-- root node required -->
    <div class="login-page window-height window-width bg-light column items-center">
        <!-- your content -->
        <div class="login-header bg-dark flex items-center justify-center">
            Login
        </div>
        <div>
            <div class="login-card card bg-white column items-center justify-center">
                <!-- if you want automatic padding -->
                <h1>Carder</h1>
                <form action="">
                    <div class="floating-label">
                        <input type="text" required class="full-width" v-model="username">
                        <label>用户名</label>
                    </div>
                    <div class="floating-label">
                        <input type="password" required class="full-width" v-model="password">
                        <label>密码</label>
                    </div>
                    <div class="row gutter button-container">
                        <div class="width-1of2">
                            <button class="primary full-width" @click.prevent="login()">登陆</button>
                        </div>
                        <div class="auto">
                            <button class="dark full-width" @click.prevent="register()">注册</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { Toast, LocalStorage } from 'quasar'

export default {
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        login: function() {
            if(!this.username || !this.password) {
                Toast.create.negative({
                    html: '用户名或密码不能为空!'
                })
                return
            }
            this.$http.post('user/accesstoken', {
                username: this.username,
                password: this.password
            }).then(resp => {
                LocalStorage.set('token', resp.data.token)
                LocalStorage.set('username', this.username)
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
        register: function() {
            if(!this.username || !this.password) {
                Toast.create.negative({
                    html: '用户名或密码不能为空!'
                })
                return
            }
            this.$http.post('user', {
                username: this.username,
                password: this.password
            }).then(resp => {
                Toast.create.positive({
                    html: '注册成功! 请登录'
                })
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
    created: function() {
        if(LocalStorage.has('token')){
            router.push('/card')
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

</style>
