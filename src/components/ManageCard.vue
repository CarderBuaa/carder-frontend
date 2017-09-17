<template>
    <div class="layout-view">
        <div class="profile-page layout-padding">
            <h1>管理卡片</h1>
            <q-card>
                <q-card-title>
                    查找卡片
                    <span slot="subtitle">可以只填一个字段，两个字段都填的情况进行and查询</span>
                </q-card-title>
                <q-card-main>
                    <q-field
                        icon="account_circle">
                        <q-input
                            type="text"
                            v-model="searchData.username"
                            float-label="用户名" />
                    </q-field>
                    <q-field
                        icon="email">
                        <q-input
                            type="email"
                            v-model="searchData.email"
                            float-label="邮箱" />
                    </q-field>
                </q-card-main>
                <q-card-actions align="around">
                    <q-btn color="primary" @click="searchCard" class="action-btn" :disable="!searchData.username && !searchData.email">
                        查找
                        <q-spinner slot="loading" />
                    </q-btn>
                </q-card-actions>
            </q-card>
            <div class="card-container row">
                <div class="col-md-12 col-lg-6"  v-for="card in cards" :key="card.id">
                    <q-card>
                        <q-card-title>
                            {{ card.username }}
                        </q-card-title>
                        <q-card-media>
                            <img :src="$http.options.root + 'card/' + card.id + '?username=' + card.username">
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
    LocalStorage,
    QSpinner,
    Toast
} from 'quasar'

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
            searchData: {
                username: '',
                email: ''
            },
            cards: []
        }
    },
    methods: {
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
        searchCard(e, done) {
            this.$http.post('manage/query', this.searchData, {
                headers: {
                    'Access-Token': LocalStorage.get.item('token')
                },
                emulateJSON: true
            }).then(resp => {
                this.cards = resp.data
                if(resp.data.length === 0) {
                    Toast.create.negative({
                        html: '没有找到卡片'
                    })
                }
                done()
            }, resp => {
                Toast.create.negative({
                    html: '未知错误'
                })
                done()
            })
        }
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