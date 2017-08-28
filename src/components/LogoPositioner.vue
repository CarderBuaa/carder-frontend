<template>
    <div
        class="card-model"
        ref="cardModel"
        @mousemove="move($event)"
        @mouseout="mouseOut($event)"
        @mouseup="moveStop($event)">
        <img
            v-if="image"
            class="move-target"
            ref="moveTarget"
            draggable="false"
            @mousedown="moveStart($event)"
            :src="src" />
        <q-icon class="qrcode" name="fa-qrcode" /> 请拖动logo的位置
    </div>
</template>

<script>
import { QIcon } from 'quasar'

export default {
    name: 'logo-positioner',
    components: { QIcon },
    props: ['value', 'image'],
    data() {
        return {
            moving: false,
            imgX: 0,
            imgY: 0,
            mouseX: 0,
            mouseY: 0,
            src: ''
        }
    },
    methods: {
        moveStart(event) {
            this.moving = true
            this.mouseX = event.clientX
            this.mouseY = event.clientY
        },
        moveStop(event) {
            this.moving = false
        },
        mouseOut(event) {
            if(
                !(
                    (event.fromElement === this.$refs.moveTarget && event.toElement === this.$refs.cardModel) ||
                    (event.fromElement === this.$refs.cardModel && event.toElement === this.$refs.moveTarget)
                )
            ) {
                this.moveStop()
            }
        },
        move(event) {
            const img = this.$refs.moveTarget
            const model = this.$refs.cardModel
            if(this.moving) {
                this.imgX = this.imgX + (event.clientX - this.mouseX)
                this.imgY = this.imgY + (event.clientY - this.mouseY)
                if(this.imgX < 0) this.imgX = 0
                if(this.imgX > model.clientWidth - img.clientWidth) this.imgX = model.clientWidth - img.clientWidth
                if(this.imgY < 0) this.imgY = 0
                if(this.imgY > model.clientHeight - img.clientHeight) this.imgY = model.clientHeight - img.clientHeight
                img.style.left = this.imgX + 'px'
                img.style.top = this.imgY + 'px'
                this.mouseX = event.clientX
                this.mouseY = event.clientY
                this.$emit('input', [this.imgX * 800 / model.clientWidth, this.imgY * 800 / model.clientWidth])
            }
        },
        resize(width) {
            const img = this.$refs.moveTarget
            const model = this.$refs.cardModel
            try {
                const w = width || img.naturalWidth
                img.style.width = model.clientWidth / 800 * w + 'px'
                img.style.left = '0'
                img.style.top = '0'
            } catch(e) {
                console.info('Img not loaded.')
            }
            this.imgX = 0
            this.imgY = 0
        }
    },
    watch: {
        image(newVal, oldVal) {
            let reader = new FileReader()
            reader.onload = e => {
                const eventRender = e
                // const img = this.$refs.moveTarget
                const img = new Image()
                img.onload = e => {
                    if(img.width >= 800 || img.height >= 480) {
                        this.$emit('error', '图片太大')
                        return
                    }
                    this.src = eventRender.target.result
                    this.resize(img.width)
                }
                img.src = e.target.result
                // this.src = e.target.result
                // console.log(img.naturalWidth, img.naturalHeight)
                // if(img.naturalWidth >= 800 || img.naturalHeight >= 480) {
                //     this.$emit('error', '图片太大')
                // }
                // this.resize()
            }
            try{
                reader.readAsDataURL(newVal)
            } catch (e) {}
        }
    },
    mounted() {
        this.resize()
        const model = this.$refs.cardModel
        this.imgX = this.value[0] * model.clientWidth / 800
        this.imgY = this.value[1] * model.clientWidth / 800
        const that = this
        window.onresize = function() {
            that.resize()
        }
    }
}
</script>

<style lang="stylus" scoped>
.card-model
    width 100%
    background-color #eee
    height 0
    padding-bottom 60%
    margin 10px
    border #ccc 2px dashed
    overflow hidden
    position relative
    color #aaa
    text-align center
    line-height 200px
    font-size 2em
    user-select none
    cursor default

    .move-target
        cursor move
        position absolute
    

</style>