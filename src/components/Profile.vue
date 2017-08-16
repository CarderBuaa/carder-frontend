<template>
    <div class="layout-view">
        <div class="profile-page layout-padding">
            <h1>个人信息</h1>
            <div class="card">
                <div class="card-content">
                    <form action="">
                        <div class="row items-center gutter">
                            <div class="width-1of5 right-aligned">
                                <label class="">姓名</label>
                            </div>
                            <div class="auto">
                                <input type="text" class="full-width" v-model="formdata.name">
                            </div>
                        </div>

                        <div class="row items-center gutter" v-for="(occupation, index) in formdata.occupation" v-bind:key="'occupation' + index">
                            <div class="width-1of5 right-aligned">
                                <label v-if="index === 0" >职位</label>
                                <label v-if="index !== 0" ></label>
                            </div>
                            <div class="width-3of5">
                                <input type="text" class="full-width" v-model.number="formdata.occupation[index]">
                            </div>
                            <div class="width-1of5 ">
                                <button v-if="index === 0" class="primary" @click.prevent="addField('occupation')">增加</button>
                                <button v-if="index !== 0" class="clear negative" @click.prevent="delField('occupation', index)">删除</button>
                            </div>
                        </div>

                        <div class="row items-center gutter" v-for="(email, index) in formdata.email" v-bind:key="'email' + index">
                            <div class="width-1of5 right-aligned">
                                <label v-if="index === 0" >电子邮箱</label>
                                <label v-if="index !== 0" ></label>
                            </div>
                            <div class="width-3of5">
                                <input type="text" class="full-width" v-model.number="formdata.email[index]">
                            </div>
                            <div class="width-1of5 ">
                                <button v-if="index === 0" class="primary" @click.prevent="addField('email')">增加</button>
                                <button v-if="index !== 0" class="clear negative" @click.prevent="delField('email', index)">删除</button>
                            </div>
                        </div>

                        <div class="row items-center gutter" v-for="(address, index) in formdata.address" v-bind:key="'address' + index">
                            <div class="width-1of5 right-aligned">
                                <label v-if="index === 0" >地址</label>
                                <label v-if="index !== 0" ></label>
                            </div>
                            <div class="width-3of5">
                                <input type="text" class="full-width" v-model.number="formdata.address[index]">
                            </div>
                            <div class="width-1of5 ">
                                <button v-if="index === 0" class="primary" @click.prevent="addField('address')">增加</button>
                                <button v-if="index !== 0" class="clear negative" @click.prevent="delField('address', index)">删除</button>
                            </div>
                        </div>

                        <div class="row items-center gutter" v-for="(phone, index) in formdata.phone" v-bind:key="'phone' + index">
                            <div class="width-1of5 right-aligned">
                                <label v-if="index === 0" >电话</label>
                                <label v-if="index !== 0" ></label>
                            </div>
                            <div class="width-3of5">
                                <input type="number" class="full-width" v-model.number="formdata.phone[index]">
                            </div>
                            <div class="width-1of5 ">
                                <button v-if="index === 0" class="primary" @click.prevent="addField('phone')">增加</button>
                                <button v-if="index !== 0" class="clear negative" @click.prevent="delField('phone', index)">删除</button>
                            </div>
                        </div>

                        <div class="row gutter button-container profile-button-container">
                            <div class="width-1of3 offset-1of3">
                                <button class="primary full-width" @click.prevent="edit()">修改</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Loading, LocalStorage, Toast } from 'quasar'

export default {
    data() {
        return {
            formdata: {
                name: '',
                occupation: [undefined],
                email: [undefined],
                address: [undefined],
                phone: [undefined]
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
        edit: function() {
            if(confirm('确定要修改吗?')) {
                this.$http.put('user/' + LocalStorage.get.item('username'), this.parsedFormdata, {
                    headers: {
                        'Access-Token': LocalStorage.get.item('token')
                    }
                }).then(resp => {
                    window.location.reload()
                }, resp => {
                    Toast.create.negative({
                        html: '未知错误'
                    })
                })
            }
        },
        addField: function(field) {
            this.formdata[field].push(undefined)
        },
        delField: function(field, index) {
            this.formdata[field].splice(index, 1)
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
            this.formdata.name = resp.data.name ? resp.data.name : ''
            this.formdata.occupation = resp.data.occupation ? resp.data.occupation : [undefined]
            this.formdata.address = resp.data.address ? resp.data.address : [undefined]
            this.formdata.email = resp.data.email ? resp.data.email : [undefined]
            this.formdata.phone = resp.data.phone ? resp.data.phone : [undefined]
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
.profile-button-container
    padding-top 1em
.right-aligned
    text-align right
</style>
