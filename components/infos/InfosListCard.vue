<!-- 消息card, 展示在tab5首页的私信列表 -->
<template>
	<view class="infos-list-card" @click="toInfosChat">
		<view class="infos-list-card-left">
			<img class="infos-list-card-avatar" :src="avatar" alt="">
		</view>
		<view class="infos-list-card-content">
			<view class="infos-list-card-content-header">
				<view class="infos-list-card-content-header-name">{{username}}</view>
				<view class="infos-list-card-content-header-time">{{timestamp}}</view>
			</view>
			<view class="infos-list-card-content-infos">{{item.body}}</view>
		</view>
	</view>
</template>

<script>
	import { transformTime } from '@/tools/transform_time.js'
	const DEFAULT_AVATAR = 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg'
	const userId = uni.getStorageSync('userId')
	export default {
		props: {
			item: {
				type: Object,
				default: {
					body: '',
					id: '',
					is_new: false,
					recipient: {
						avatar: '',
						name: '',
						id: ''
					},
					sender: {
						avatar: '',
						name: '',
						id: ''
					},
					timestamp: ''
				}
			},
		},
		computed: {
			avatar() {
				if(this.item.recipient.id === userId) {
					//我是recipient, 显示sender头像
					return this.item.sender.avatar ? this.item.sender.avatar : DEFAULT_AVATAR
				} else if(this.item.sender.id === userId) {
					//我是sender，显示recipient头像
					return this.item.recipient.avatar ? this.item.recipient.avatar : DEFAULT_AVATAR
				} else {
					return DEFAULT_AVATAR
				}
			},
			username() {
				if(this.item.recipient.id === userId) {
					//我是recipient, 显示sender名字
					return this.item.sender.name ? this.item.sender.name : ''
				} else if(this.item.sender.id === userId) {
					//我是sender，显示recipient名字
					return this.item.recipient.name ? this.item.recipient.name : ''
				} else {
					return ''
				}
			},
			timestamp() {
				return this.item.timestamp ? transformTime(this.item.timestamp) : this.item.timestamp
			},
		},
		methods: {
			// 点击头像，去聊天页
			toInfosChat() {
				let id = this.item.recipient.id === userId ? this.item.sender.id : this.item.recipient.id
				let name = this.item.recipient.id === userId ? this.item.sender.name : this.item.recipient.name
				uni.navigateTo({
					url: `/page_infos/infosChat/infosChat?id=${id}&name=${name}`
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.infos-list-card {
		display: flex;
		align-items: center;
		.infos-list-card-left {
			display: flex;
			align-items: center;
			.infos-list-card-avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 30rpx;
			}
		}
		.infos-list-card-content {
			flex: 1;
			overflow: hidden;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #E8E8E8;
			.infos-list-card-content-header{
				display: flex;
				.infos-list-card-content-header-name {
					flex: 1;
					font-size: 30rpx;
					color: rgba(0,0,0);
					line-height: 42rpx;
					margin-bottom: 10rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.infos-list-card-content-header-time {
					font-size: 20rpx;
					color: rgba(0,0,0,0.5);
					line-height: 42rpx;
				}
			}
			
			.infos-list-card-content-infos {
				font-size: 28rpx;
				color: rgba(0,0,0,0.5);
				line-height: 33rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				
			}
		}
	}
</style>
