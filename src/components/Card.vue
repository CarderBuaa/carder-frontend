<template>
        <div class="layout-view">
            <div class="profile-page layout-padding">
                <h1>名片信息</h1>
                <div class="card">
                    <img src="">
                    <div class="card-content">
                        <button class="clear tertiary" @click="$refs.basicModal.open()">修改</button>
                    </div>
                </div>
            </div>
            <q-modal ref="basicModal" class="minimized">
                <div class="editModal">
                    <h4>修改</h4>
                    <form action="">
                        <div class="stacked-label">
                            <input type="text" class="full-width">
                            <label>姓名</label>
                        </div>
                        <div class="stacked-label">
                            <input type="text" class="full-width">
                            <label>职位</label>
                        </div>
                        <div class="stacked-label">
                            <input type="text" class="full-width">
                            <label>公司</label>
                        </div>
                        <div class="stacked-label">
                            <input type="text" class="full-width">
                            <label>固定电话</label>
                        </div>
                        <div class="stacked-label">
                            <input type="text" class="full-width">
                            <label>移动电话</label>
                        </div>
                        <div class="stacked-label">
                            <input type="text" class="full-width">
                            <label>电子邮箱</label>
                        </div>
                        <div class="row gutter button-container">
                            <div class="width-1of2">
                                <button class="primary full-width">修改</button>
                            </div>
                            <div class="auto">
                                <button class="primary full-width" @click="$refs.basicModal.close()">取消</button>
                            </div>
                        </div>
                    </form>
                </div>
            </q-modal>
        </div>
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>

<style lang="stylus">
.editModal
    padding 30px
</style>
