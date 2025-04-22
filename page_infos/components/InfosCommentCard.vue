<!-- 收到的评论card -->
<template>
	<view class="infos-comment-card" @click="toPostDetail">
		<view class="infos-comment-card-left">
			<img :src="avatar" @click.native.stop="toHomepage($event)" alt="" class="infos-comment-card-avatar">
		</view>
		<view class="infos-comment-card-content">
			<view class="infos-comment-card-content-name">
				<text @click.native.stop="toHomepage($event)">{{item.author.name}}</text>
			</view>
			<view class="infos-comment-card-content-time">
				评论了你的{{postType}} {{timestamp}} 
			</view>
			<view class="infos-comment-card-content-body">
				{{commentBody(item.body)}}
			</view>
			<view class="infos-comment-card-content-reply">
				<img class="infos-comment-card-content-reply-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/infos/iconReply.png" alt="">
				回复</view>
		</view>
		<view class="infos-comment-card-right" v-if="showRightImg">
			<img class="infos-comment-card-right-img" :src="rightImgUrl" alt="">
		</view>
	</view>
</template>

<script>
	import { transformTime } from '@/tools/transform_time.js'
	import { article_type_key_value_map } from '@/tools/transform_data.js'
	import { uncodeUtf16 } from '@/tools/transform_emoji.js'
	const DEFAULT_AVATAR = 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg'
	export default {
		props: {
			item: {
				type: Object,
				default: {
					author: {
						name: ''
					},
					timestamp: '',
					body: '',
					id: '',
					post: {
						id: '',
						post_type: 3
					}
				}
			},
		},
		data() {
			return {
			}
		},
		computed: {
			avatar() {
				return this.item.author.avatar ?  this.item.author.avatar : DEFAULT_AVATAR
			},
			timestamp() {
				return this.item.timestamp ? transformTime(this.item.timestamp) : this.item.timestamp
			},
			postType() {
				if(this.item.parent_id) {
					return '评论'
				} else if(this.item.post.post_type) {
					return article_type_key_value_map[this.item.post.post_type]
				} else {
					return ''
				}
			},
			//是否显示右边封面图
			showRightImg() {
				// if(this.item.parent_id) {
				// 	// 评论(暂不显示封面)
				// 	return false
				// } else {
				// 	if(this.item.post.post_type === 1) {
				// 		//攻略
				// 		return this.item.post.body.cover_url
				// 	} else {
				// 		//帖子
				// 		return this.item.post.body.urls && this.item.post.body.urls.length
				// 	}
				// }
				return false
			},
			//右边封面图url
			rightImgUrl() {
				if(this.item.parent_id) {
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
			// 评论正文emoji解码
			commentBody(val) {
				return val ? uncodeUtf16(val) : ''
			},
			//跳转帖子详情
			toPostDetail() {
				switch (this.item.post.post_type){
					// case 2:
					// 	//2-资讯
					// 	uni.navigateTo({
					// 		url: `/page_news/newsDetail/newsDetail?id=${this.item.post.id}`
					// 	});
					// 	break;
					// case 3:
					// 	//3-跳转帖子详情
					// 	uni.navigateTo({
					// 		url: `/page_bbs/bbsPostDetail/bbsPostDetail?id=${this.item.post.id}`
					// 	})
					// 	break;
					// case 4:
					// 	//4-问题
					// 	uni.navigateTo({
					// 		url: `/page_qa/questionDetail/questionDetail?id=${this.item.post.id}`
					// 	})
					// 	break;
					// default:
					// 	break;
						
					case 3:
						//3-跳转帖子详情
						uni.navigateTo({
							url: `/page_bbs/bbsPostDetail/bbsPostDetail?id=${this.item.post.id}`
						})
						break;
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
				// e.preventDefault()
				// uni.navigateTo({
				// 	url: `/page_infos/homepage/homepage?userId=${this.item.author.id}`
				// })
			}
		},
	}
</script>

<style lang="less" scoped>
	.infos-comment-card {
		display: flex;
		.infos-comment-card-left {
			padding: 30rpx 0;
			// display: flex;
			// align-items: center;
			.infos-comment-card-avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 30rpx;
			}
		}
		.infos-comment-card-content {
			flex: 1;
			overflow: hidden;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #E8E8E8;
			.infos-comment-card-content-name {
				font-size: 30rpx;
				color: rgba(0,0,0);
				font-weight: 500;
				line-height: 40rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 100%;
			}
			.infos-comment-card-content-time {
				font-size: 28rpx;
				color: rgba(0,0,0,0.5);
				line-height: 36rpx;
				margin-top: 10rpx;
			}
			.infos-comment-card-content-body {
				font-size: 30rpx;
				color: rgba(0,0,0);
				line-height: 48rpx;
				margin-top: 10rpx;
			}
			.infos-comment-card-content-reply {
				margin-top: 20rpx;
				font-size: 28rpx;
				color: #35C8A7;
				line-height: 42rpx;
				display: flex;
				align-items: center;
				.infos-comment-card-content-reply-icon {
					height: 30rpx;
					width: 30rpx;
					margin-right: 15rpx;
				}
			}
		}
		// .infos-comment-card-right {
		// 	padding: 30rpx 0;
		// 	border-bottom: 1rpx solid #E8E8E8;
		// 	text-align: right;
		// 	.infos-comment-card-right-quote {
		// 		width: 122rpx;
		// 		height: 87rpx;
		// 		font-size: 22rpx;
		// 		color: rgba(0,0,0,0.4);
		// 		line-height: 29rpx;
		// 		margin-top: 15rpx;
		// 		overflow: hidden;
		// 		text-overflow: ellipsis;
		// 		display: -webkit-box;
		// 		-webkit-line-clamp: 3;
		// 		-webkit-box-orient: vertical;
		// 	}
		// 	.infos-comment-card-right-img {
		// 		width: 112rpx;
		// 		height: 112rpx;
		// 	}
		// }
		.infos-comment-card-right {
			width: 100rpx;
			text-align: right;
			display: flex;
			align-items: center;
			.infos-comment-card-right-img {
				width: 80rpx;
				height: 80rpx;
			}
		}
	}
</style>
