<!-- 话题详情-帖子 -->
<template>
	<view class="bbs-topic-post-card">
		<!-- 头像、昵称、学校 -->
		<card-user :item="postData"></card-user>
		
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
			  fit="cover"
			  :src="pic"
			  class="bbs-topic-post-img-item"
			  v-for="(pic, index) in picList"
			  :key="index"
			  @click.native.stop="previewImg($event, pic)"
			/>
		</view>
		
		<!-- 卡片底部-点赞|评论 -->
		<card-like-comment :cardData="postData" @checkoutLike="checkoutLike" :showComment="true"></card-like-comment>
	</view>
</template>

<script>
	import CardLikeComment from '@/components/common/CardLikeComment.vue'
	import CardUser from '@/components/common/CardUser.vue'
	export default {
		components: {
			CardLikeComment,
			CardUser
		},
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
		},
		methods: {
			checkoutLike(status) {
				this.$emit('checkoutLike', this.index, status)
			},
			// 预览图片
			previewImg(e, url) {
				//防止冒泡
				e.preventDefault()
				uni.previewImage({
					current: 0,
					urls: [url]
				});
			},
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
			font-size: 30rpx;
			color: #000;
			// line-height: 45rpx;
		}
		.bbs-topic-post-img-box {
			margin-top: 40rpx;
			display: flex;
			height: 200rpx;
			.bbs-topic-post-img-item {
				width: calc((100vw - 110rpx) / 3);
				margin-right: 20rpx;
				&:last-child {
					margin-right: 0;
				}
			}
		}
	}
</style>
