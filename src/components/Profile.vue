<template>
    <div class="layout-view">
        <div class="profile-page layout-padding">
            <h1>个人信息</h1>
            <q-card>
                
                <form>
                    <q-card-main>
                        <q-card-title>基本信息</q-card-title>
                        <q-field
                            icon="account_circle"
                            :error="$v.profileData.name.$error"
                            :helper="!$v.profileData.name.required ? '请输入姓名' : ''">
                            <q-input type="text" float-label="姓名" v-model="profileData.name" @input="$v.profileData.name.$touch()" />
                        </q-field>

                        <q-field
                            icon="account_box">
                            <q-input type="text" float-label="职位" v-model="profileData.occupation" />
                        </q-field>

                        <q-field
                            icon="mail"
                            :error="$v.profileData.email.$error"
                            :helper="!$v.profileData.email.required ? '请输入邮箱' : (!$v.profileData.email.email ? '邮箱格式不对' : '')">
                            <q-input type="text" float-label="电子邮箱" v-model="profileData.email" @input="$v.profileData.email.$touch()" />
                        </q-field>

                        <q-field
                            icon="fa-phone"
                            :error="$v.profileData.phoneMobile.$error"
                            :helper="!$v.profileData.phoneMobile.required ? '请输入手机号码' : ''">
                            <q-input type="number" float-label="手机" v-model="profileData.phoneMobile"  @input="$v.profileData.phoneMobile.$touch()" />
                        </q-field>

                        <q-field icon="fa-globe">
                            <q-input type="url" float-label="网址" v-model="profileData.url" />
                        </q-field>
                    </q-card-main>

                    <q-card-separator />

                    <q-card-main>
                        <q-card-title>家庭信息</q-card-title>
                        <q-field
                            icon="place">
                            <q-input type="text" float-label="家庭地址" v-model="profileData.addressHome" />
                        </q-field>

                        <q-field
                            icon="fa-phone">
                            <q-input type="number" float-label="家庭电话" v-model="profileData.phoneHome" />
                        </q-field>

                        <q-field
                            icon="fa-fax">
                            <q-input type="number" float-label="家庭传真" v-model="profileData.faxHome" />
                        </q-field>
                    </q-card-main>

                    <q-card-separator />

                    <q-card-main>
                        <q-card-title>单位信息</q-card-title>
                        <q-field
                            icon="place">
                            <q-input type="text" float-label="单位地址" v-model="profileData.addressWork" />
                        </q-field>

                        <q-field
                            icon="fa-phone">
                            <q-input type="number" float-label="单位电话" v-model="profileData.phoneWork" />
                        </q-field>

                        <q-field
                            icon="fa-fax">
                            <q-input type="number" float-label="单位传真" v-model="profileData.faxWork" />
                        </q-field>
                    </q-card-main>

                    <q-card-actions  align="around">
                        <q-btn class="action-btn" @click="editProfile" color='primary' :disable="$v.profileData.group.$invalid">
                            修改
                            <q-spinner slot="loading" />
                        </q-btn>
                    </q-card-actions>
                </form>
                
            </q-card>
            <q-card>
                <q-card-title>修改密码</q-card-title>
                <q-card-main>
                    <q-field
                        icon="fa-key"
                        :error="$v.passwordData.password.$error"
                        :helper="!$v.passwordData.password.required ? '请输入密码' : ''">
                        <q-input type="password" float-label="新密码" @input="$v.passwordData.password.$touch()" v-model="passwordData.password" />
                    </q-field>
                    <q-field
                        icon="fa-key"
                        :error="$v.passwordData.passwordRepeat.$error"
                        :helper="!$v.passwordData.passwordRepeat.required ? '请再次输入密码' : (!$v.passwordData.passwordRepeat.sameAsPassword ? '密码不一致' : '')">
                        <q-input type="password" float-label="重复密码" @input="$v.passwordData.passwordRepeat.$touch()" v-model="passwordData.passwordRepeat" />
                    </q-field>
                </q-card-main>
                <q-card-actions  align="around">
                    <q-btn class="action-btn" @click="editPassword" color='primary' :disable="$v.passwordData.passwordRepeat.$invalid">
                        修改
                        <q-spinner slot="loading" />
                    </q-btn>
                </q-card-actions>
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
    QSpinner,
    Loading,
    LocalStorage,
    Toast
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
        QCardSeparator,
        QCardTitle,
        QCardActions,
        QField,
        QInput,
        QBtn,
        QIcon,
        QSpinner
    },
    data() {
        return {
            profileData: {
                name: '',
                occupation: '',
                email: '',
                addressHome: '',
                phoneMobile: '',
                phoneHome: '',
                faxHome: '',
                phoneWork: '',
                addressWork: '',
                faxWork: '',
                url: ''
            },
            passwordData: {
                password: '',
                passwordRepeat: ''
            }
        }
    },
    validations: {
        profileData: {
            name: { required },
            email: { required, email },
            phoneMobile: { required, numeric },
            phoneHome: { numeric },
            phoneWork: { numeric },
            faxHome: { numeric },
            faxWork: { numeric },
            group: [
                'profileData.name',
                'profileData.email',
                'profileData.phoneMobile'
            ]
        },
        passwordData: {
            password: { required },
            passwordRepeat: {
                required,
                sameAsPassword: sameAs('password')
            }
        }
    },
    computed: {
        parsedFormdata: function() {
            // let data = JSON.parse(JSON.stringify(this.formdata))
            let data = {}
            for(let field in this.formdata) {
                if(typeof (this.formdata[field]) === 'object') {
                    data[field] = []
                    for(let i = 0; i < this.formdata[field].length; i++) {
                        if(this.formdata[field][i] !== undefined && this.formdata[field][i] !== '') {
                            data[field].push(this.formdata[field][i])
                        }
                    }
                }
                else {
                    data[field] = this.formdata[field]
                }
            }
            return data
        }
    },
    methods: {
        editProfile(e, done) {
            if(confirm('确定要修改吗?')) {
                this.$http.put('user/' + LocalStorage.get.item('username'), this.profileData, {
                    headers: {
                        'Access-Token': LocalStorage.get.item('token')
                    }
                }).then(resp => {
                    window.location.reload()
                }, resp => {
                    done()
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
            } else {
                done()
            }
        },
        editPassword(e, done) {
            if(confirm('确定要修改吗?')) {
                this.$http.put('user/' + LocalStorage.get.item('username'), {
                    password: this.passwordData.password
                }, {
                    headers: {
                        'Access-Token': LocalStorage.get.item('token')
                    }
                }).then(resp => {
                    window.location.reload()
                }, resp => {
                    done()
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
        }
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
            for(let index in this.profileData) {
                this.profileData[index] = resp.data[index]
            }
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
</style>