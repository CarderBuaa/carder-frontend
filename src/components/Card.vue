<template>
        <div class="layout-view">
            <div class="profile-page layout-padding">
                <h1>名片信息</h1>
                <q-alert color="warning" v-show="!profileData.name">您还没有添加姓名, 请点击左边个人信息添加</q-alert>
                <q-alert color="info" v-show="profileData.name && (!cards ||cards.length === 0)" class="placeholder">您还没有名片, 请点击右下角生成名片</q-alert>
                <div class="row">
                    <div class="col-md-12 col-lg-6 card-container"  v-for="card in cards" :key="card.id">
                        <q-card>
                            <q-card-media>
                                <img :src="$http.options.root + 'card/' + card.id + '?username=' + username">
                            </q-card-media>
                            <q-card-actions>
                                <!-- <button class="primary" @click="$refs.basicModal.open()">修改</button> -->
                                <q-btn color="primary" @click="downloadCard(card.id)" v-if="isCordova">下载</q-btn>
                                <q-btn color="primary" flat @click="editCard(card)">编辑</q-btn>
                                <q-btn color="red" flat @click="delCard(card.id)">删除</q-btn>
                            </q-card-actions>
                        </q-card>
                    </div>
                </div>
            </div>
            <q-modal ref="basicModal">
                <div class="cardModal">
                    <h4>增加名片</h4>
                    <form>
                        <q-field icon="account_circle" label="姓名">
                            <q-input type="text" v-model="cardData.name" disable />
                        </q-field>

                        <q-field
                            icon="visibility"
                            helper="选择过多字段可能导致显示溢出"
                            label="字段显示">
                                <q-list no-border>
                                    <q-item tag="label" v-for="data in checkboxes" :key="data.field">
                                        <q-item-side>
                                            <q-checkbox v-model="cardData[data.field]" />
                                        </q-item-side>
                                        <q-item-main>
                                            <q-item-tile label>{{ data.name }}</q-item-tile>
                                            <q-item-tile v-if="data.value" sublabel>{{ data.value }}</q-item-tile>
                                        </q-item-main>
                                    </q-item>
                                </q-list>
                        </q-field>

                        <q-field
                            icon="fa-globe"
                            label="url显示方式"
                            v-show="profileData.url">
                            <q-option-group
                                type="radio"
                                color="secondary"
                                v-model="cardData.url"
                                :options="[
                                    { label: '不显示', value: 0 },
                                    { label: '显示为字段', value: 1 },
                                    { label: '显示二维码', value: 2 }
                                ]" />
                        </q-field>

                        <q-field
                            icon="fa-globe"
                            label="名片模板">
                            <q-option-group
                                type="radio"
                                color="secondary"
                                v-model="cardData.template"
                                :options="[
                                    { label: '居左显示', value: 0 },
                                    { label: '居右显示', value: 1 },
                                    { label: '居中显示', value: 2 }
                                ]" />
                        </q-field>

                        <q-field icon="image" label="背景">
                            <div class="q-if row no-wrap items-center relative-position q-input text-primary">
                                <div class="q-if-inner col row no-wrap items-center relative-position">
                                    <input type="file" accept="image/png,image/gif,image/jpeg" class="col" @change="getFile('image', $event)">
                                </div>
                            </div>
                        </q-field>

                        <q-field icon="image" label="logo">
                            <div class="q-if row no-wrap items-center relative-position q-input text-primary">
                                <div class="q-if-inner col row no-wrap items-center relative-position">
                                    <input type="file" accept="image/png,image/gif,image/jpeg" class="col" @change="getFile('logoImage', $event)">
                                </div>
                            </div>
                        </q-field>

                        <logo-positioner @error="removeFile('logoImage', ...arguments)" :image="cardData.logoImage" v-show="cardData.logoImage" v-model="cardData.logoPos"></logo-positioner>

                    </form>
                    <q-btn color="primary" @click="submitCard">
                        提交
                        <q-spinner slot="loading" />
                    </q-btn>
                    <q-btn color="red" flat @click="$refs.basicModal.close()">取消</q-btn>
                </div>
            </q-modal>
            <q-fixed-position  corner="bottom-right" :offset="[18, 18]">
                <q-btn round color="primary" @click="addCard()" :disable="!profileData.name">
                    <q-icon name="add" />
                </q-btn>
            </q-fixed-position>
        </div>
</template>

<script>
import {
    QFixedPosition,
    QBtn,
    QIcon,
    QModal,
    QField,
    QInput,
    QCheckbox,
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QOptionGroup,
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMedia,
    QCardActions,
    QSpinner,
    QAlert,
    Loading,
    LocalStorage,
    Toast
} from 'quasar'

import LogoPositioner from './LogoPositioner.vue'

export default {
    components: {
        QFixedPosition,
        QIcon,
        QBtn,
        QModal,
        QField,
        QInput,
        QCheckbox,
        QList,
        QItem,
        QItemSide,
        QItemMain,
        QItemTile,
        QOptionGroup,
        QCard,
        QCardTitle,
        QCardSeparator,
        QCardMedia,
        QCardActions,
        QSpinner,
        QAlert,
        LogoPositioner
    },
    data() {
        return {
            cardData: {
                name: false,
                occupation: false,
                email: false,
                addressHome: false,
                phoneMobile: false,
                phoneHome: false,
                faxHome: false,
                phoneWork: false,
                addressWork: false,
                faxWork: false,
                template: 0,
                url: 0,
                image: null,
                logoImage: null,
                logoPos: [0, 0]
            },
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
            checkboxModel: {
                occupation: '职位',
                email: '邮箱',
                phoneMobile: '手机',
                addressHome: '家庭地址',
                phoneHome: '家庭电话',
                faxHome: '家庭传真',
                addressWork: '单位地址',
                phoneWork: '单位电话',
                faxWork: '单位传真'
            },
            cards: [],
            currentCardId: null,
            username: '',
            isCordova: false
        }
    },
    computed: {
        checkboxes() {
            let ret = []
            for(let index in this.profileData) {
                if(index in this.checkboxModel && this.profileData[index]) {
                    ret.push({
                        field: index,
                        name: this.checkboxModel[index],
                        value: this.profileData[index]
                    })
                }
            }
            return ret
        }
    },
    methods: {
        addCard() {
            for(let index in this.cardData) {
                if(index === 'name') {
                    this.cardData[index] = this.profileData.name
                } else if(index === 'url' || index === 'template') {
                    this.cardData[index] = 0
                } else if(index === 'logoPos') {
                    this.cardData[index][0] = 0
                    this.cardData[index][1] = 0
                } else if(index === 'image' || index === 'logoImage') {
                    this.cardData[index] = null
                } else {
                    this.cardData[index] = false
                }
            }
            this.currentCardId = null
            this.cardData.name = this.profileData.name
            this.$refs.basicModal.open()
        },
        editCard(card) {
            for(let index in this.cardData) {
                if(index === 'name') {
                    this.cardData[index] = this.profileData.name
                } else if(index === 'logoPos') {
                    this.cardData[index][0] = card.logoX
                    this.cardData[index][1] = card.logoY
                } else if(index === 'image' || index === 'logoImage') {
                    this.cardData[index] = null
                } else {
                    this.cardData[index] = card[index]
                }
            }
            this.currentCardId = card.id
            this.cardData.name = this.profileData.name
            this.$refs.basicModal.open()
        },
        getFile(target, event) {
            this.cardData[target] = event.target.files[0]
        },
        removeFile(target, message) {
            Toast.create.negative({
                html: message
            })
            this.cardData[target] = null
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
        },
        downloadCard(id) {
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
        submitCard(e, done) {
            let cardData = new FormData()
            for(let key in this.cardData) {
                if(key !== 'logoPos' && key !== 'name') {
                    cardData.append(key, this.cardData[key])
                }
            }
            cardData.append('logoX', this.cardData.logoPos[0])
            cardData.append('logoY', this.cardData.logoPos[1])

            this.$http({
                method: 'post',
                url: this.currentCardId ? 'card/' + this.currentCardId : 'card',
                headers: {
                    'Access-Token': LocalStorage.get.item('token')
                },
                body: cardData
            })
            // this.$http.post('card', cardData, {
            //     headers: {
            //         'Access-Token': LocalStorage.get.item('token')
            //     }
            // })
                .then(resp => {
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
    },
    created() {
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
            for(let index in resp.data) {
                this.profileData[index] = resp.data[index]
            }
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

<style lang="stylus" scoped>
.cardModal
    padding 30px

.fab-card
    margin: 20px


.placeholder
    color #ccc
</style>
