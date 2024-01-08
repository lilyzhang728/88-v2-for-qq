<!-- 帖子 -->
<template>
	<view class="bbs-post-card">
		<view class="bbs-post-author">
			<img class="bbs-post-author-avatar" :src="avatar"  @click.native.stop="toHomepage($event)"></img>
			<view class="bbs-post-author-name"  @click.native.stop="toHomepage($event)">{{postData.author.name}}</view>
			<view class="bbs-post-author-time">{{timestamp}}</view>
		</view>
		<!-- 帖子所属话题 -->
		<view class="bbs-post-topic" @click.native.stop="toTopic($event)" v-if="postData.bind_topics && postData.bind_topics.length">
			<img class="bbs-post-topic-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/topicIcon.png" alt="">
			<text class="bbs-post-topic-text">{{postData.bind_topics[0].body}}</text>
		</view>
		<!-- 正文 -->
		<view class="bbs-post-content">{{postData.body.body}}</view>
		<view class="bbs-post-img-box" v-if="postData.body.urls && postData.body.urls.length">
			<van-image
			  width="100%"
			  height="100%"
			  fit="cover"
			  :src="pic"
			  class="bbs-post-img-item"
			  v-for="(pic, index) in picList"
			  :key="index"
			  @click.native="previewImg($event, pic)"
			/>
		</view>
		<!-- 卡片底部-点赞|评论 -->
		<card-like-comment :cardData="postData" @checkoutLike="checkoutLike" :showComment="true"></card-like-comment>
	</view>
</template>

<script>
	const DEFAULT_AVATAR = 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg'
	import { transformTime } from '@/tools/transform_time.js'
	import CardLikeComment from '@/components/common/CardLikeComment.vue'
	export default {
		components: {
			CardLikeComment
		},
		props: {
			//帖子的index
			index: {
				type: Number,
				default: 0
			},
			postData: {
				type: Object,
				default: {
					author: {
						name: '',
						avatar: '',
						id: ''
					},
					body: {
						body: ''
					},
					is_like: false,
					likers_count: 0,
					comments_count: 0,
					title: "",
					views: 0,
					timestamp: '',
					status: 0,
					id: ''
				}
			},
		},
		computed: {
			avatar() {
				return this.postData.author.avatar ?  this.postData.author.avatar : DEFAULT_AVATAR
			},
			picList() {
				return this.postData.body.urls && this.postData.body.urls.length ? this.postData.body.urls.slice(0, 3) : []
			},
			timestamp() {
				return this.postData.timestamp ? transformTime(this.postData.timestamp) : this.postData.timestamp
			}
 		},
		methods: {
			// 预览图片
			previewImg(e, url) {
				//防止冒泡
				e.preventDefault()
				uni.previewImage({
					current: 0,
					urls: [url]
				});
			},
			checkoutLike(status) {
				this.$emit('checkoutLike', this.index, status)
			},
			// 点击头像，去个人主页
			toHomepage(e) {
				//防止冒泡
				e.preventDefault()
				uni.navigateTo({
					url: `/page_infos/homepage/homepage?userId=${this.postData.author.id}`
				})
			},
			// 跳转话题详情页
			toTopic(e) {
				//防止冒泡
				e.preventDefault()
				uni.navigateTo({
					url: `/page_bbs/bbsTopicDetail/bbsTopicDetail?id=${this.postData.bind_topics[0].id}`
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.bbs-post-card {
		padding: 30rpx;
		padding-bottom: 0;
		background: #fff;
		box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		.bbs-post-author {
			display: flex;
			align-items: center;
			.bbs-post-author-avatar {
				width: 70rpx;
				height: 70rpx;
				margin-right:20rpx;
				border-radius: 50%;
			}
			.bbs-post-author-name {
				flex: 1;
				font-size: 30rpx;
				font-weight: 500;
				color: #000;
				line-height: 42rpx;
			}
			.bbs-post-author-time {
				width: 100rpx;
				font-size: 20rpx;
				color: rgba(0,0,0,0.4);
				line-height: 28rpx;
				margin-left: 10rpx;
			}
		}
		.bbs-post-topic {
			font-size: 26rpx;
			color: #35C8A6;
			line-height: 37rpx;
			display: flex;
			align-items: center;
			margin-top: 16rpx;
			margin-left: 11rpx;
			.bbs-post-topic-icon {
				height: 30rpx;
				width: 30rpx;
				margin-right: 10rpx;
			}
			.bbs-post-topic-text {
				flex: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
		.bbs-post-content {
			margin-top: 20rpx;
			border-radius: 8rpx;
			border: 20rpx solid #fff;
			font-size: 26rpx;
			color: #000;
			line-height: 45rpx;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
		.bbs-post-img-box {
			margin-top: 40rpx;
			display: flex;
			height: 200rpx;
			.bbs-post-img-item {
				// flex: 1;
				width: calc((100vw - 110rpx) / 3);
				margin-right: 20rpx;
				&:last-child {
					margin-right: 0;
				}
			}
		}
	}
</style>

