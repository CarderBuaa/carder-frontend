<template>
        <div class="layout-view">
            <div class="profile-page layout-padding">
                <h1>名片信息</h1>
                <div class="card">
                    <img src="">
                    <div class="card-content">
                        <button class="primary" @click="$refs.basicModal.open()">修改</button>
                        <button class="clear negative" @click="$refs.basicModal.open()">删除</button>
                    </div>
                </div>
            </div>
            <q-modal ref="basicModal" class="minimized">
                <div class="editModal">
                    <h4>修改</h4>
                    <form action="">
                        <div class="row items-center gutter">
                            <div class="width-1of5 right-aligned">
                                <label class="">姓名</label>
                            </div>
                            <div class="auto">
                                <input type="text" class="full-width" v-model="formdata.name">
                            </div>
                        </div>
                        <div class="row items-center gutter">
                            <div class="width-1of5 right-aligned">
                                <label class="">职位</label>
                            </div>
                            <div class="auto">
                                <input type="text" class="full-width" v-model="formdata.occupation">
                            </div>
                        </div>
                        <div class="row items-center gutter">
                            <div class="width-1of5 right-aligned">
                                <label class="">电子邮箱</label>
                            </div>
                            <div class="auto">
                                <input type="text" class="full-width" v-model="formdata.email">
                            </div>
                        </div>
                        <div class="row items-center gutter">
                            <div class="width-1of5 right-aligned">
                                <label class="">地址</label>
                            </div>
                            <div class="auto">
                                <input type="text" class="full-width" v-model="formdata.address">
                            </div>
                        </div>
                        <div class="row gutter button-container">
                            <div class="width-1of2">
                                <button class="primary full-width">修改</button>
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
export default {
    data() {
        return {
            formdata: {
                name: '',
                occupation: '',
                email: '',
                address: '',
                phone: [undefined]
            }
        }
    },
    methods: {
        addCard: function() {
            this.$refs.basicModal.open()
        }
    }
}
</script>

<style lang="stylus">
.editModal
    padding 30px

.fab-card
    margin: 20px
</style>
