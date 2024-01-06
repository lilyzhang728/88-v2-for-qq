<!-- 话题详情-帖子 -->
<template>
	<view class="bbs-topic-post-card">
		<view class="bbs-topic-post-author">
			<img class="bbs-topic-post-author-avatar" :src="postData.author.avatar"></img>
			<view class="bbs-topic-post-author-name">{{postData.author.name}}</view>
			<view class="bbs-topic-post-author-time">{{timestamp}}</view>
		</view>
		<!-- <view class="bbs-topic-post-topic">
			<img class="bbs-topic-post-topic-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/topicIcon.png" alt="">
			<text class="bbs-topic-post-topic-text">COS大赛灌篮高手COS大赛灌篮高手COS大赛灌篮高手COS大赛灌篮高手COS大赛</text>
		</view> -->
		
		<!-- 正文 -->
		<view class="bbs-topic-post-content">{{postData.body.body}}</view>
		<view class="bbs-topic-post-img-box" v-if="postData.body && postData.body.urls && postData.body.urls.length">
			<van-image
			  width="100%"
			  height="100%"
			  fit="contain"
			  :src="pic"
			  class="bbs-topic-post-img-item"
			  v-for="(pic, index) in picList"
			  :key="index"
			/>
		</view>
		<view class="bbs-topic-post-operate">
			<!-- 点赞 -->
			<view class="bbs-topic-post-operate-like">
				<van-icon v-if="!postData.is_like" name="like-o" size="25rpx" @click.native.stop="checkoutLike($event, true)" />
				<van-icon v-else name="like" size="25rpx"  @click.native.stop="checkoutLike($event, false)" />
				<text class="bbs-topic-post-operate-like-num">{{handleTransform(postData.likers_count)}}</text>
			</view>
			<view class="bbs-topic-post-operate-split"></view>
			<!-- 评论 -->
			<view class="bbs-topic-post-operate-comment">
				<van-icon name="comment-o" size="25rpx" />
				<text class="bbs-topic-post-operate-comment-num">{{handleTransform(postData.comments_count)}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { likeGuide, disLikeGuide } from '@/network/api_guide.js'
	import { transformTime, transformMaxNum } from '@/tools/transform_time.js'
	export default {
		props: {
			postData: {
				type: Object,
				default: {
					author: {
						avatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',
						name: ''
					},
					body: {
						body: '',
						urls: []
					},
					comments_count: 0,
					id: '',
					is_like: false,
					likers_count: 0,
					timestamp: '',
					views: 0
				}
			},
			index: {
				type: Number,
				default: 0
			}
		},
		computed: {
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
			checkoutLike(e, status) {
				//防止冒泡
				e.preventDefault()
				if(status) {
					//unlike ——> like
					likeGuide(this.postData.id).then(res => {
						if(res.code === 0) {
							//点赞成功，改变icon状态
							this.$emit('checkoutLike', this.index, status)
						}
					}, err => {
						console.log('likeGuide: ', err)
					})
				} else {
					//like ——> unlike
					disLikeGuide(this.postData.id).then(res => {
						if(res.code === 0) {
							//取消点赞成功，改变icon状态
							this.$emit('checkoutLike', this.index, status)
						}
					}, err => {
						console.log('disLikeGuide: ', err)
					})
				}
			}
		},
	}
</script>

<style lang="less" scoped>
	.bbs-topic-post-card {
		padding: 30rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(81,211,184,0.15);
		border-radius: 20rpx;
		margin-top: 20rpx;
		.bbs-topic-post-author {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: rgba(0,0,0,0.5);
			line-height: 33rpx;
			.bbs-topic-post-author-avatar {
				width: 50rpx;
				height: 50rpx;
				margin-right:20rpx;
				border-radius: 50%;
			}
			.bbs-topic-post-author-name {
				flex: 1;
				
			}
			.bbs-topic-post-author-time {
				text-align: right;
			}
		}
		.bbs-topic-post-topic {
			font-size: 26rpx;
			color: #35C8A6;
			line-height: 37rpx;
			display: flex;
			align-items: center;
			margin-top: 16rpx;
			margin-left: 11rpx;
			.bbs-topic-post-topic-icon {
				height: 30rpx;
				width: 30rpx;
				margin-right: 10rpx;
			}
			.bbs-topic-post-topic-text {
				flex: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
		.bbs-topic-post-content {
			margin-top: 20rpx;
			padding: 20rpx;
			border-radius: 8rpx;
			font-size: 26rpx;
			color: #000;
			line-height: 45rpx;
		}
		.bbs-topic-post-img-box {
			margin-top: 40rpx;
			display: flex;
			height: 200rpx;
			.bbs-topic-post-img-item {
				flex: 1;
				margin-right: 20rpx;
				&:last-child {
					margin-right: 0;
				}
			}
		}
		.bbs-topic-post-operate {
			margin-top: 30rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			line-height: 30rpx;
			font-size: 22rpx;
			color: rgba(0,0,0,0.6);
			.bbs-topic-post-operate-split {
				width: 1rpx;
				height: 28rpx;
				border-left: 1rpx solid #EAEAEA;
			}
			.bbs-topic-post-operate-like {
				display: flex;
				align-items: center;
				.bbs-topic-post-operate-like-num {
					margin-left: 16rpx;
				}
			}
			.bbs-topic-post-operate-comment {
				display: flex;
				align-items: center;
				.bbs-topic-post-operate-comment-num {
					margin-left: 16rpx;
				}
			}
		}
	}
</style>
