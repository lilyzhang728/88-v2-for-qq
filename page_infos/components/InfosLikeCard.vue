<!-- 收到的赞card，攻略 or 帖子 -->
<template>
	<view class="infos-like-card" @click="toDetail">
		<view class="infos-like-card-left">
			<img class="infos-like-card-avatar" :src="avatar" @click.native.stop="toHomepage($event)" alt="">
		</view>
		<view class="infos-like-card-right">
			<view class="infos-like-card-content">
				<view class="infos-like-card-content-name" @click.native.stop="toHomepage($event)">{{item.user.name}}</view>
				<view class="infos-like-card-content-infos">
					<text>赞了你的{{typeText}}</text>
					<text class="infos-like-card-content-infos-timestamp">{{timestamp}}</text>
				</view>
			</view>
			<view class="infos-like-card-img-box" v-if="showRightImg">
				<img class="infos-like-card-right-img" :src="rightImgUrl" alt="">
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
				return this.item.user.avatar ? this.item.user.avatar : DEFAULT_AVATAR
			},
			timestamp() {
				return this.item.timestamp ? transformTime(this.item.timestamp) : this.item.timestamp
			},
			//被点赞的类型
			typeText() {
				if(this.item.comment) {
					return '评论'
				} else if(this.item.post.post_type) {
					return article_type_key_value_map[Number(this.item.post.post_type)]
				} else {
					return ''
				}
			},
			//是否显示右边封面图
			showRightImg() {
				if(this.item.comment) {
					// 评论(暂不显示封面)
					return false
				} else {
					if(this.item.post.post_type === 1) {
						//攻略
						return this.item.post.body.cover_url
					} else {
						//帖子
						return this.item.post.body.urls && this.item.post.body.urls.length
					}
				}
				
			},
			//右边封面图url
			rightImgUrl() {
				if(this.item.comment) {
					return ''
				} else {
					if(this.item.post.post_type === 1) {
						//攻略
						return this.item.post.body.cover_url
					} else {
						//帖子
						return this.item.post.body.urls && this.item.post.body.urls[0]
					}
				}
				
			}
		},
		methods: {
			toDetail() {
				if(this.item.comment) {
					// 评论被点赞，跳转帖子详情
					uni.navigateTo({
						url: `/page_bbs/bbsPostDetail/bbsPostDetail?id=${this.item.comment.post.id}`
					})
				} else {
					switch (this.item.post.post_type){
						case 1:
							//1-跳转攻略详情
							uni.navigateTo({
								url: `/page_guide/guideDetail/guideDetail?showEditBtn=true&inDraft=false&id=${this.item.post.id}&tabIndex=2`
							})
							break;
						case 2:
							//2-资讯
							uni.navigateTo({
								url: `/page_news/newsDetail/newsDetail?id=${this.item.post.id}`
							});
							break;
						case 3:
							//3-跳转帖子详情
							uni.navigateTo({
								url: `/page_bbs/bbsPostDetail/bbsPostDetail?id=${this.item.post.id}`
							})
							break;
						case 4:
							//4-问题
							uni.navigateTo({
								url: `/page_qa/questionDetail/questionDetail?id=${this.item.post.id}`
							})
							break;
						default:
							break;
					}
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
	.infos-like-card {
		display: flex;
		align-items: center;
		.infos-like-card-left {
			display: flex;
			align-items: center;
			.infos-like-card-avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 30rpx;
			}
		}
		.infos-like-card-right {
			flex: 1;
			display: flex;
			align-items: center;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #E8E8E8;
			overflow: hidden;
			.infos-like-card-content {
				flex: 1;
				overflow: hidden;
				.infos-like-card-content-name {
					font-size: 30rpx;
					color: rgba(0,0,0);
					line-height: 42rpx;
					margin-bottom: 10rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.infos-like-card-content-infos {
					font-size: 28rpx;
					color: rgba(0,0,0,0.5);
					line-height: 33rpx;
					.infos-like-card-content-infos-timestamp {
						margin-left: 20rpx;
					}
				}
			}
			.infos-like-card-img-box {
				width: 100rpx;
				text-align: right;
				display: flex;
				align-items: center;
				.infos-like-card-right-img {
					width: 80rpx;
					height: 80rpx;
				}
			}
		}
	}
	
</style>
