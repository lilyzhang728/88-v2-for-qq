<!-- 一条聊天记录  -->
<template>
	<view class="infos-chat-item">
		<text class="chat-time" v-if="item.timestamp">
			{{item.timestamp}}
		</text>
		<view v-if="item.sender.id !== uid" class="chat-container">
			<view class="chat-icon-container">
				<image class="chat-icon" :src="item.sender.avatar" mode="aspectFill" @click.native.stop="toHomepage($event)" />
			</view>
			<view class="chat-content-container">
				<view class="chat-text-container">
					<text class="char-text">{{item.body}}</text>
				</view>
			</view>
		</view>
		<view v-else class="chat-container chat-location-me">
			<view class="chat-content-container">
				<view class="chat-text-container chat-text-container-me">
					<text class="char-text char-text-me">{{item.body}}</text>
				</view>
			</view>
			<view class="chat-icon-container">
				<image class="chat-icon" :src="item.sender.avatar" mode="aspectFill" @click.native.stop="toHomepage($event)" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: {'id': '',
						'body': '',
						'timestamp': '',
						'sender': {'id': '',
						 'avatar': 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/profile_photos/default/001.jpg',
						 'name': ''},
						'recipient': {'id': '',
						 'avatar': 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/profile_photos/default/001.jpg',
						 'name': ''}
					}
			}
		},
		data() {
			return {
				uid: uni.getStorageSync('userId'),	//3955b2a8f692fa7fdfb0c80eca3188f6
			}
		},
		methods: {
			// 点击头像，去个人主页
			toHomepage(e) {
				//防止冒泡
				e.preventDefault()
				uni.navigateTo({
					url: `/page_infos/homepage/homepage?userId=${this.item.sender.id}`
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.infos-chat-item {
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		.chat-time {
			padding: 4rpx 0rpx;
			text-align: center;
			font-size: 22rpx;
			color: #aaaaaa;
		}
		.chat-container{
			display: flex;
			// flex-direction: row;
			justify-content: flex-start;
		}
		.chat-location-me{
			// flex-direction: row-reverse;
			// text-align: right;
			justify-content: flex-end;
		}
		.chat-icon{
			width: 70rpx;
			height: 70rpx;
			border-radius: 50%;
			background-color: #eeeeee;
		}
		.chat-content-container{
			max-width: calc(100% - 210rpx);
		}
		.chat-text-container{
			background-color: #f1f1f1;
			border-radius: 20rpx;
			padding: 24rpx;
			margin-left: 20rpx;
			margin-right: 0;
		}
		.chat-text-container-me{
			background-color: #50D2B7;
			margin-left: 0;
			margin-right: 20rpx;
		}
		.char-text{
			font-size: 30rpx;
			word-break: break-all;
			display: flex;
		}
		.char-text-me{
			color: white;
		}
	}
</style>
