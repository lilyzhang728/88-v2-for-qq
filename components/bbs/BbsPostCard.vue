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
		<view class="bbs-post-img-box" v-if="postData.body.urls.length">
			<van-image
			  width="100%"
			  height="100%"
			  fit="contain"
			  :src="pic"
			  class="bbs-post-img-item"
			  v-for="(pic, index) in picList"
			  :key="index"
			/>
		</view>
		<view class="bbs-post-operate" @click.native.stop="clickOperate($event)">
			<!-- 点赞 -->
			<view class="bbs-post-operate-like">
				<van-icon name="good-job" :color="postData.is_like ? '#8B8B8B' : '#D7D7D7'" size="34rpx" @click.native.stop="checkoutLike($event)" />
				<view class="bbs-post-operate-like-num"  @click.native.stop="checkoutLike($event, false)" >{{handleTransform(postData.likers_count)}}</view>
			</view>
			<view class="bbs-post-operate-split"></view>
			<!-- 评论 -->
			<view class="bbs-post-operate-comment">
				<van-icon name="comment" size="34rpx" color="#D7D7D7" @click.native.stop="toComment($event)" />
				<view class="bbs-post-operate-comment-num" @click.native.stop="toComment($event)">{{handleTransform(postData.comments_count)}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const DEFAULT_AVATAR = 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg'
	import { likeGuide, disLikeGuide } from '@/network/api_guide.js'
	import { transformTime, transformMaxNum } from '@/tools/transform_time.js'
	export default {
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
			// 点赞、评论 大数单位转化
			handleTransform(val) {
				return transformMaxNum(val)
			},
			clickOperate(e) {
				//防止冒泡
				e.preventDefault()
			},
			checkoutLike(e) {
				//防止冒泡
				e.preventDefault()
				if(!this.postData.is_like) {
					//unlike ——> like
					likeGuide(this.postData.id).then(res => {
						if(res.code === 0) {
							//点赞成功，改变icon状态
							this.$emit('checkoutLike', this.index, true)
						}
					}, err => {
						console.log('likeGuide: ', err)
					})
				} else {
					//like ——> unlike
					disLikeGuide(this.postData.id).then(res => {
						if(res.code === 0) {
							//取消点赞成功，改变icon状态
							this.$emit('checkoutLike', this.index, false)
						}
					}, err => {
						console.log('disLikeGuide: ', err)
					})
				}
			},
			// 去评论
			toComment(e) {
				//防止冒泡
				e.preventDefault()
				uni.navigateTo({
					url: `/page_bbs/bbsPostDetail/bbsPostDetail?id=${this.postData.id}&showReply=1`
				})
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
		background: linear-gradient(180deg, #F1FFF7 0%, #FFFFFF 100%);
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
			background: #FAFAFA;
			border-radius: 8rpx;
			border: 20rpx solid #FAFAFA;
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
				flex: 1;
				margin-right: 20rpx;
				&:last-child {
					margin-right: 0;
				}
			}
		}
		.bbs-post-operate {
			margin-top: 35rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			line-height: 30rpx;
			font-size: 22rpx;
			color: rgba(0,0,0,0.6);
			padding-bottom: 30rpx;
			.bbs-post-operate-split {
				width: 1rpx;
				height: 28rpx;
				border-left: 1rpx solid #EAEAEA;
			}
			.bbs-post-operate-like {
				display: flex;
				align-items: center;
				.bbs-post-operate-like-num {
					margin-left: 16rpx;
					margin-top: 5rpx;
					width: 50rpx;
				}
			}
			.bbs-post-operate-comment {
				display: flex;
				align-items: center;
				.bbs-post-operate-comment-num {
					margin-left: 16rpx;
					width: 50rpx;
				}
			}
		}
	}
</style>
