<template>
<uni-shadow-root class="vant-swipe-cell-index"><view class="van-swipe-cell custom-class" data-key="cell" @click.stop.prevent="onClick" @touchstart="startDrag" @touchmove.stop.prevent="_$self[(catchMove ? 'noop' : '')||'_$noop']($event)" @touchmove.capture="onDrag" @touchend="endDrag" @touchcancel="endDrag">
  <view :style="wrapperStyle">
    <view v-if="leftWidth" class="van-swipe-cell__left" data-key="left" @click.stop.prevent="onClick">
      <slot name="left"></slot>
    </view>
    <slot></slot>
    <view v-if="rightWidth" class="van-swipe-cell__right" data-key="right" @click.stop.prevent="onClick">
      <slot name="right"></slot>
    </view>
  </view>
</view></uni-shadow-root>
</template>

<script>

global['__wxRoute'] = 'vant/swipe-cell/index'
import { VantComponent } from '../common/component';
import { touch } from '../mixins/touch';
import { range } from '../common/utils';
const THRESHOLD = 0.3;
let ARRAY = [];
VantComponent({
    props: {
        disabled: Boolean,
        leftWidth: {
            type: Number,
            value: 0,
            observer(leftWidth = 0) {
                if (this.offset > 0) {
                    this.swipeMove(leftWidth);
                }
            },
        },
        rightWidth: {
            type: Number,
            value: 0,
            observer(rightWidth = 0) {
                if (this.offset < 0) {
                    this.swipeMove(-rightWidth);
                }
            },
        },
        asyncClose: Boolean,
        name: {
            type: null,
            value: '',
        },
    },
    mixins: [touch],
    data: {
        catchMove: false,
        wrapperStyle: '',
    },
    created() {
        this.offset = 0;
        ARRAY.push(this);
    },
    destroyed() {
        ARRAY = ARRAY.filter((item) => item !== this);
    },
    methods: {
        open(position) {
            const { leftWidth, rightWidth } = this.data;
            const offset = position === 'left' ? leftWidth : -rightWidth;
            this.swipeMove(offset);
            this.$emit('open', {
                position,
                name: this.data.name,
            });
        },
        close() {
            this.swipeMove(0);
        },
        swipeMove(offset = 0) {
            this.offset = range(offset, -this.data.rightWidth, this.data.leftWidth);
            const transform = `translate3d(${this.offset}px, 0, 0)`;
            const transition = this.dragging
                ? 'none'
                : 'transform .6s cubic-bezier(0.18, 0.89, 0.32, 1)';
            this.setData({
                wrapperStyle: `
        -webkit-transform: ${transform};
        -webkit-transition: ${transition};
        transform: ${transform};
        transition: ${transition};
      `,
            });
        },
        swipeLeaveTransition() {
            const { leftWidth, rightWidth } = this.data;
            const { offset } = this;
            if (rightWidth > 0 && -offset > rightWidth * THRESHOLD) {
                this.open('right');
            }
            else if (leftWidth > 0 && offset > leftWidth * THRESHOLD) {
                this.open('left');
            }
            else {
                this.swipeMove(0);
            }
            this.setData({ catchMove: false });
        },
        startDrag(event) {
            if (this.data.disabled) {
                return;
            }
            this.startOffset = this.offset;
            this.touchStart(event);
        },
        noop() { },
        onDrag(event) {
            if (this.data.disabled) {
                return;
            }
            this.touchMove(event);
            if (this.direction !== 'horizontal') {
                return;
            }
            this.dragging = true;
            ARRAY.filter((item) => item !== this && item.offset !== 0).forEach((item) => item.close());
            this.setData({ catchMove: true });
            this.swipeMove(this.startOffset + this.deltaX);
        },
        endDrag() {
            if (this.data.disabled) {
                return;
            }
            this.dragging = false;
            this.swipeLeaveTransition();
        },
        onClick(event) {
            const { key: position = 'outside' } = event.currentTarget.dataset;
            this.$emit('click', position);
            if (!this.offset) {
                return;
            }
            if (this.data.asyncClose) {
                this.$emit('close', {
                    position,
                    instance: this,
                    name: this.data.name,
                });
            }
            else {
                this.swipeMove(0);
            }
        },
    },
});
export default global['__wxComponents']['vant/swipe-cell/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';

.van-swipe-cell {
	overflow: hidden;
	position: relative
}

.van-swipe-cell__left,
.van-swipe-cell__right {
	height: 100%;
	position: absolute;
	top: 0
}

.van-swipe-cell__left {
	left: 0;
	transform: translate3d(-100%, 0, 0)
}

.van-swipe-cell__right {
	right: 0;
	transform: translate3d(100%, 0, 0)
}

.van-swipe-cell__left {
	/* width: 130rpx; */
	height: 100%;
	font-size: 30rpx;
	color: #fff;
	text-align: center;
	background-color: #f44;
	word-wrap: break-word;
	padding: 0 22rpx;
	box-sizing: border-box;
	/*文本垂直居中*/
	display: flex;
	align-items: center;
	justify-content: center;
}

.van-swipe-cell__right {
	/* width: 130rpx; */
	height: 100%;
	font-size: 30rpx;
	color: #fff;
	text-align: center;
	background-color: #f44;
	word-wrap: break-word;
	padding: 0 22rpx;
	box-sizing: border-box;
	/*文本垂直居中*/
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>