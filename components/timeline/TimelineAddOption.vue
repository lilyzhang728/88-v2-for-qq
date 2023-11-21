<!-- 弹框：添加事件选项 -->
<template>
	<view class="timeline-add-option">
		<van-popup :show="showAddOption" round closeable position="bottom" @close.native="onClose" >
			<view class="timeline-add-option-wrap">
				<view class="timeline-add-option-btn" @click="toMakeEvent">
					<img src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/eventCreateIcon.png" class="timeline-add-option-btn-icon" alt="">
					创建事件</view>
				<view class="timeline-add-option-btn" @click="toEventLibrary">
					<img src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/eventLibraryIcon.png" class="timeline-add-option-btn-icon" alt="">
					去事件库添加</view>
			</view>
		</van-popup>
	</view>
</template>

<script>
	export default {
		props: {
			start_year: {
				type: Number,
				required: true,
				default: new Date().getFullYear()
			},
			graduate_year: {
				type: Number,
				required: true,
				default: new Date().getFullYear()
			},
		},
		data() {
			return {
				showAddOption: false,
			}
		},
		methods: {
			onClose() {
				this.showAddOption = false
			},
			//去创建事件页面
			toMakeEvent() {
				uni.navigateTo({
					url: `/page_editPersonalInfo/addTimelineItem/addTimelineItem?start=${this.start_year}&graduate=${this.graduate_year}`
				})
				this.showAddOption = false
			},
			//去事件库页面
			toEventLibrary() {
				//TODO： 待实现
			}
		}
	}
</script>

<style scoped lang="less">
	.timeline-add-option {
		.timeline-add-option-wrap {
			padding: 90rpx 45rpx 40rpx 45rpx;
			.timeline-add-option-btn {
				height: 90rpx;
				line-height: 90rpx;
				// background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
				border-radius: 20rpx;
				border: 1rpx solid #50D2B7;
				color: rgba(0,0,0,0.8);
				font-size: 28rpx;
				margin-bottom: 20rpx;
				padding-left: 72rpx;
				display: flex;
				align-items: center;
				&:last-child {
					margin-bottom: 0;
				}
				.timeline-add-option-btn-icon {
					width: 33rpx;
					height: 36rpx;
					margin-right: 20rpx;
				}
			}
		}
	}
</style>
