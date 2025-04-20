<!-- 收到的收藏card -->
<template>
	<view class="infos-collect-card" @click="toDetail">
		<view class="infos-collect-card-left">
			<img class="infos-collect-card-avatar" :src="avatar" @click.native.stop="toHomepage($event)" alt="">
		</view>
		<view class="infos-collect-card-right">
			<view class="infos-collect-card-content">
				<view class="infos-collect-card-content-name">
					<text @click.native.stop="toHomepage($event)">{{item.user.name}}</text></view>
				<view class="infos-collect-card-content-infos">
					<text>收藏了你的{{postType}}</text>
					<text class="infos-collect-card-content-infos-timestamp">{{timestamp}}</text>
				</view>
			</view>
			<view class="infos-collect-card-img-box">
				<img class="infos-collect-card-right-img" :src="item.post.body.cover_url" alt="">
			</view>
		</view>
	</view>
</template>

<script>
	import { transformTime } from '@/tools/transform_time.js'
	import { article_type_key_value_map } from '@/tools/transform_data.js'
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
							cover_url: '',
						},
						id: '',
						post_type: 1
					},
					timestamp: ''
				}
			},
		},
		computed: {
			avatar() {
				return this.item.user.avatar ? this.item.user.avatar : DEFAULT_AVATAR
			},
			timestamp() {
				return this.item.timestamp ? transformTime(this.item.timestamp) : this.item.timestamp
			},
			postType() {
				if(this.item.post.post_type) {
					return article_type_key_value_map[this.item.post.post_type]
				} else {
					return ''
				}
			}
		},
		methods: {
			toDetail() {
				switch (this.item.post.post_type){
					// case 1:
					// 	1-跳转资讯
					// 	uni.navigateTo({
					// 		url: `/page_guide/guideDetail/guideDetail?showEditBtn=true&inDraft=false&id=${this.item.post.id}&tabIndex=2`
					// 	})
					// 	break;
					// case 2:
					// 	//2-攻略TODO
					// 	uni.navigateTo({
					// 		url: `/page_news/newsDetail/newsDetail?id=${this.item.post.id}`
					// 	});
					// 	break;
					case 2:
					case 4:
						//2-攻略|4-问题
						uni.navigateTo({
							url: `/page_qa/questionDetail/questionDetail?id=${this.item.post.id}`
						})
						break;
					default:
						break;
				}
			},
			// 点击头像，去个人主页
			toHomepage(e) {
				//防止冒泡
				e.preventDefault()
				uni.navigateTo({
					url: `/page_infos/homepage/homepage?userId=${this.item.user.id}`
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.infos-collect-card {
		display: flex;
		align-items: center;
		.infos-collect-card-left {
			display: flex;
			align-items: center;
			.infos-collect-card-avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 30rpx;
			}
		}
		.infos-collect-card-right {
			flex: 1;
			display: flex;
			align-items: center;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #E8E8E8;
			overflow: hidden;
			.infos-collect-card-content {
				flex: 1;
				overflow: hidden;
				.infos-collect-card-content-name {
					font-size: 30rpx;
					color: rgba(0,0,0);
					line-height: 42rpx;
					margin-bottom: 10rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.infos-collect-card-content-infos {
					font-size: 28rpx;
					color: rgba(0,0,0,0.5);
					line-height: 33rpx;
					.infos-collect-card-content-infos-timestamp {
						margin-left: 20rpx;
					}
				}
			}
			.infos-collect-card-img-box {
				width: 100rpx;
				text-align: right;
				display: flex;
				align-items: center;
				.infos-collect-card-right-img {
					width: 80rpx;
					height: 80rpx;
				}
			}
		}
	}
	
</style>
