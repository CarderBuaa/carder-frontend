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

                        <div class="row items-center gutter" v-for="(phonenumber, index) in formdata.phone" v-bind:key="index">
                            <div class="width-1of5 right-aligned">
                                <label v-if="index === 0" >电话</label>
                                <label v-if="index !== 0" ></label>
                            </div>
                            <div class="width-3of5">
                                <input type="number" class="full-width" v-model="formdata.phone[index]">
                            </div>
                            <div class="width-1of5 ">
                                <button v-if="index === 0" class="primary" @click.prevent="addPhone()">增加</button>
                                <button v-if="index !== 0" class="clear negative" @click.prevent="delPhone(index)">删除</button>
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
export default {
    data() {
        return {
            formdata: {
                name: '',
                occupation: '',
                email: '',
                address: '',
                phone: [undefined]
            },
            loading: true
        }
    },
    methods: {
        edit: function() {
            ;
        },
        addPhone: function() {
            this.formdata.phone.push(undefined)
        },
        delPhone: function(index) {
            this.formdata.phone.splice(index, 1)
        }
    }
}
</script>

<style lang="stylus">
.profile-button-container
    padding-top 1em
.right-aligned
    text-align right
</style>
