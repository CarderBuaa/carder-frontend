<template>
        <div class="layout-view">
            <div class="profile-page layout-padding">
                <h1>名片信息</h1>
                <div class="card card-container" v-for="card in cards" :key="card.id">
                    <img :src="$http.options.root + 'card/' + card.id + '?username=' + username">
                    <div class="card-content">
                        <!-- <button class="primary" @click="$refs.basicModal.open()">修改</button> -->
                        <button class="primary" @click="downloadCard(card.id)" v-if="isCordova">下载</button>
                        <button class="clear negative" @click="delCard(card.id)">删除</button>
                    </div>
                </div>
            </div>
            <q-modal ref="basicModal">
                <div class="cardModal">
                    <h4>增加名片</h4>
                    <form action="">
                        <div class="row items-center gutter">
                            <div class="width-1of5 right-aligned">
                                <label class="">姓名</label>
                            </div>
                            <div class="auto">
                                <input type="text" class="full-width" v-model="formdata.name" readonly>
                            </div>
                        </div>
                        <div class="row items-center gutter">
                            <div class="width-1of5 right-aligned">
                                <label class="">职位</label>
                            </div>
                            <div class="auto">
                                <q-select class="full-width" type="list" v-model="formdata.occupation" :options="makeOptions(profile.occupation)"></q-select>
                            </div>
                        </div>
                        <div class="row items-center gutter">
                            <div class="width-1of5 right-aligned">
                                <label class="">电子邮箱</label>
                            </div>
                            <div class="auto">
                                <q-select class="full-width" type="list" v-model="formdata.email" :options="makeOptions(profile.email)"></q-select>
                            </div>
                        </div>
                        <div class="row items-center gutter">
                            <div class="width-1of5 right-aligned">
                                <label class="">地址</label>
                            </div>
                            <div class="auto">
                                <q-select class="full-width" type="list" v-model="formdata.address" :options="makeOptions(profile.address)"></q-select>
                            </div>
                        </div>
                        <div class="row items-center gutter">
                            <div class="width-1of5 right-aligned">
                                <label class="">电话</label>
                            </div>
                            <div class="auto">
                                <q-select class="full-width" type="list" v-model="formdata.phone" :options="makeOptions(profile.phone)"></q-select>
                            </div>
                        </div>
                        <div class="row items-center gutter">
                            <div class="width-1of5 right-aligned">
                                <label class="">背景</label>
                            </div>
                            <div class="auto">
                                <input class="full-width" type="file" accept="image/png,image/gif,image/jpeg" @change="getFile($event)"></input>
                            </div>
                        </div>
                        <div class="row gutter button-container">
                            <div class="width-1of2">
                                <button class="primary full-width" @click.prevent="addCardSubmit()">提交</button>
                            </div>
                            <div class="auto">
                                <button class="clear negative full-width" @click.prevent="$refs.basicModal.close()">取消</button>
                            </div>
                        </div>
                    </form>
                </div>
            </q-modal>
            <button class="primary raised circular absolute-bottom-right fab-card" @click="addCard()">
                <i class="q-fab-icon">add</i>
            </button>
        </div>
</template>

<script>
import { Loading, LocalStorage, Toast } from 'quasar'

export default {
    data() {
        return {
            formdata: {
                name: '',
                occupation: '',
                email: '',
                address: '',
                phone: '',
                image: ''
            },
            profile: {
                name: '',
                occupation: [],
                email: [],
                address: [],
                phone: []
            },
            cards: [],
            username: '',
            isCordova: false
        }
    },
    methods: {
        addCard: function() {
            this.formdata = {
                name: this.profile.name,
                occupation: '',
                email: '',
                address: '',
                phone: '',
                image: ''
            }
            this.$refs.basicModal.open()
        },
        getFile: function(event) {
            this.formdata.image = event.target.files[0]
        },
        delCard: function(id) {
            if(confirm('确认要删除吗?')) {
                this.$http.delete('card/' + id, {
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
        downloadCard: function(id) {
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + 'Download/', dirEntry => {
                dirEntry.getFile('card' + id + '.jpg', {create: true, exclusive: false}, fileEntry => {
                    let fileTransfer = new FileTransfer()
                    let fileURL = fileEntry.toURL()
                    fileTransfer.download(
                        this.$http.options.root + 'card/' + id + '?username=' + this.username,
                        fileURL,
                        entry => {
                            alert('下载成功! 名片保存在Download文件夹下')
                        }
                    )
                })
            })
        },
        makeOptions: function(arr) {
            let options = []
            for(let i = 0; i < arr.length; i++) {
                options.push({
                    label: arr[i],
                    value: arr[i]
                })
            }
            return options
        },
        addCardSubmit: function() {
            let formdata = new FormData()
            for(let key in this.formdata) {
                formdata.append(key, this.formdata[key])
            }
            this.$http.post('card', formdata, {
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
    created: function() {
        Loading.show()
        if(typeof cordova === 'object') {
            this.isCordova = true
        }
        if(!LocalStorage.has('token') || !LocalStorage.has('username')) {
            this.$router.push('/login')
            return
        }
        this.username = LocalStorage.get.item('username')
        this.$http.get('user/' + LocalStorage.get.item('username'), {
            headers: {
                'Access-Token': LocalStorage.get.item('token')
            }
        }).then(resp => {
            this.profile.name = resp.data.name
            this.profile.occupation = resp.data.occupation
            this.profile.address = resp.data.address
            this.profile.email = resp.data.email
            this.profile.phone = resp.data.phone
            this.cards = resp.data.cards
            Loading.hide()
        }, resp => {
            if(resp.status === 401) {
                LocalStorage.remove('token')
                LocalStorage.remove('username')
                this.$router.push('/login')
                return
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
.cardModal
    padding 30px

.fab-card
    margin: 20px

.card-container
    height: 0
    padding-bottom calc(60% + 65px)
</style>
