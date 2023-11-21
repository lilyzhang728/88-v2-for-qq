<!-- 收到的关注card -->
<template>
	<view class="infos-focus-card" @click.native.stop="toHomepage($event)">
		<view class="infos-focus-card-left">
			<img class="infos-focus-card-avatar" :src="avatar" alt="">
		</view>
		<view class="infos-focus-card-right">
			<view class="infos-focus-card-content">
				<view class="infos-focus-card-content-name">{{item.post.author.name}}</view>
				<view class="infos-focus-card-content-infos">开始关注你了 {{timestamp}}</view>
			</view>
			<view class="infos-focus-card-right-btn-box">
				<!-- 回关|关注|去私信 -->
				<van-button size="small" class="infos-focus-card-right-btn-wrap" custom-class="infos-focus-card-right-btn" @click.native="handleFocus">回关</van-button>
			</view>
		</view>
		
		<!-- <view class="infos-focus-card-box">
			<img class="infos-focus-card-avatar" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg" alt="">
			<view class="infos-focus-card-content">
				<view class="infos-focus-card-content-name" >用户名</view>
				<view class="infos-focus-card-content-infos">开始关注你了 2023-08-10</view>
			</view>
			<view class="infos-focus-card-right">
				<van-button size="small" class="infos-focus-card-right-btn-wrap" custom-class="infos-focus-card-right-btn" @click.native="handleFocus">回关</van-button>
			</view>
		</view> -->
	</view>
</template>

<script>
	import { transformTime } from '@/tools/transform_time.js'
	const DEFAULT_AVATAR = 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg'
	export default {
		props: {
			item: {
				type: Object,
				default: {
					post: {
						author: {
							name: '',
							avatar: '',
							id: ''
						},
						body: {
							
						},
						id: '',
						timestamp: '',
						post_type: 1
					}
				}
			},
		},
		computed: {
			avatar() {
				return this.item.post.author.avatar ? this.item.post.author.avatar : DEFAULT_AVATAR
			},
			timestamp() {
				return this.item.timestamp ? transformTime(this.item.timestamp) : this.item.timestamp
			},
		},
		methods: {
			// 点击卡片，去个人主页
			toHomepage(e) {
				//防止冒泡
				e.preventDefault()
				uni.navigateTo({
					url: `/page_infos/homepage/homepage?userId=${this.item.post.author.id}`
				})
			}
		},
	}
	
</script>

<style lang="less" scoped>
	// .infos-focus-card {
	// 	padding: 30rpx 0;
	// 	border-bottom: 1rpx solid #E8E8E8;
	// 	.infos-focus-card-box {
	// 		display: flex;
	// 		align-items: center;
	// 		.infos-focus-card-avatar {
	// 			width: 70rpx;
	// 			height: 70rpx;
	// 			border-radius: 50%;
	// 			margin-right: 20rpx;
	// 		}
	// 		.infos-focus-card-content {
	// 			flex: 1;
	// 			overflow: hidden;
	// 			.infos-focus-card-content-name {
	// 				font-size: 30rpx;
	// 				color: rgba(0,0,0);
	// 				line-height: 42rpx;
	// 				margin-bottom: 8rpx;
	// 				overflow: hidden;
	// 				text-overflow: ellipsis;
	// 				white-space: nowrap;
	// 			}
	// 			.infos-focus-card-content-infos {
	// 				font-size: 24rpx;
	// 				color: rgba(0,0,0,0.5);
	// 				line-height: 33rpx;
	// 			}
	// 		}
	// 		.infos-focus-card-right {
	// 			width: 130rpx;
	// 			text-align: right;
	// 			.infos-focus-card-right-btn-wrap {
	// 				/deep/ .infos-focus-card-right-btn {
	// 					padding: 0 26rpx !important;
	// 					line-height: 45rpx !important;
	// 					font-weight: 400 !important;
	// 					font-size: 26rpx !important;
	// 					background: #fff !important;
	// 					border-radius: 8rpx !important;
	// 					border: 1rpx solid #CECECE !important;
	// 					color:rgba(0,0,0,0.8) !important;
	// 				}
	// 			}
	// 		}
	// 	}
	// }
	
	.infos-focus-card {
		display: flex;
		align-items: center;
		.infos-focus-card-left {
			display: flex;
			align-items: center;
			.infos-focus-card-avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 30rpx;
			}
		}
		.infos-focus-card-right {
			flex: 1;
			display: flex;
			align-items: center;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #E8E8E8;
			.infos-focus-card-content {
				flex: 1;
				overflow: hidden;
				.infos-focus-card-content-name {
					font-size: 30rpx;
					color: rgba(0,0,0);
					line-height: 42rpx;
					margin-bottom: 10rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.infos-focus-card-content-infos {
					font-size: 28rpx;
					color: rgba(0,0,0,0.5);
					line-height: 33rpx;
				}
			}
			.infos-focus-card-right-btn-box {
				display: flex;
				align-items: center;
				width: 130rpx;
				text-align: right;
				.infos-focus-card-right-btn-wrap {
					/deep/ .infos-focus-card-right-btn {
						padding: 0 26rpx !important;
						line-height: 45rpx !important;
						font-weight: 400 !important;
						font-size: 26rpx !important;
						background: #fff !important;
						border-radius: 8rpx !important;
						border: 1rpx solid #CECECE !important;
						color:rgba(0,0,0,0.8) !important;
					}
				}
			}
		}
	}
</style>
