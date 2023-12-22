<!-- 侧边-收信箱 -->
<template>
	<view class="side-message-box" @click="toMessage($event)">
		<img class="side-message-box-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/iconSideMessage.png" alt="">
	</view>
</template>

<script>
	export default {
		methods: {
			toMessage(e) {
				e.preventDefault();
				uni.navigateTo({
					url: '/page_infos/viewInfos/viewInfos'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.side-message-box {
		width: 128rpx;
		height: 80rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 17rpx 0rpx rgba(0,0,0,0.1);
		border-radius: 42rpx 0rpx 0rpx 42rpx;
		padding: 20rpx 38rpx;
		box-sizing: border-box;
		position: fixed;
		right: 0;
		bottom: 50%;
		.side-message-box-icon {
			width: 50rpx;
			height: 40rpx;
		}
	}
</style>
