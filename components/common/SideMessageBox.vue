<!-- 侧边-收信箱 -->
<template>
	<view class="side-message-box" @click="toMessage($event)">
		<img class="side-message-box-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/iconSideMessage.png" alt="">
		<text class="side-message-box-red-dot" v-if="showNotification"></text>
	</view>
</template>

<script>
	import { getNotifications } from '@/network/api_infos.js'
	export default {
		data() {
			return {
				showNotification: false
			}
		},
		created() {
			this.getNewNotifications()
		},
		methods: {
			toMessage(e) {
				e.preventDefault();
				uni.navigateTo({
					url: '/page_infos/viewInfos/viewInfos'
				})
			},
			getNewNotifications() {
				getNotifications({
					'since': new Date().getTime()
				}).then(res => {
					if(res.code === 0 && res.data.length) {
						// 有新消息
						this.showNotification = true
					} else {
						this.showNotification = false
					}
				}, err => {
					console.log('getNotifications: ', err)
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
		top: 1000rpx;
		.side-message-box-icon {
			width: 50rpx;
			height: 40rpx;
		}
		.side-message-box-red-dot {
			position: absolute;
			width: 12rpx;
			height: 12rpx;
			background: #FF1919;
			border-radius: 50%;
			right: 32rpx;
			top: 14rpx;
		}
	}
</style>
