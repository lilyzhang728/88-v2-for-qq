<!-- 白色模块 -->
<template>
	<view class="white-box">
		<view class="white-box-title">
			<img :src="titleImg" alt="" class="white-box-title-img">
		</view>
		<view class="white-box-content">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	const IMG_URL = ['cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/badgeTitleAdmin.png',
	'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/badgeTitleRec.png',
	'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/badgeTitleOwn.png']
	export default {
		props: {
			index: {
				type: Number,
				required: true,
				default: 0
			}
		},
		computed: {
			titleImg() {
				return IMG_URL[this.index]
			}
		}
	}
</script>

<style scoped lang="less">
	.white-box {
		box-sizing: border-box;
		width: 100%;
		margin-top: 20rpx;
		background-color: #fff;
		box-shadow: 0rpx 0rpx 15rpx 0rpx rgba(81,211,184,0.1);
		border-radius: 20rpx;
		padding: 40rpx 30rpx 52rpx 30rpx;
		.white-box-title {
			display: flex;
			justify-content: center;
			margin-bottom: 30rpx;
			.white-box-title-img {
				height: 38rpx;
				width: 360rpx;
			}
		}
	}
</style>
