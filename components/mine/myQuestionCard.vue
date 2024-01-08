<!-- 我的问答 -->
<template>
	<view class="question-item-card" @click="toDetail(item)">
		<view class="question-item-card-author">
			<img :src="item.author.avatar ? item.author.avatar : defaultAvatar" alt="" class="question-item-card-author-img">
			<view class="question-item-card-author-text">
				<view class="question-item-card-author-name">{{item.author.name}}</view>
				<view class="question-item-card-author-time">{{item.timestamp}}</view>
			</view>
		</view>
		<view class="question-item-card-content" :class="{'question-item-card-content-haveImg': item.body.urls && item.body.urls.length}">
			<view class="question-item-card-content-left">
				<view class="question-item-card-content-left-title van-multi-ellipsis--l3">{{item.title}}</view>
				<view class="question-item-card-content-left-infos" v-if="item.body.body">{{item.body.body}}</view>
			</view>
			<view class="question-item-card-content-right" v-if="item.body.urls && item.body.urls.length">
				<img :src="item.body.urls[0]" alt="" class="question-item-card-content-right-img">
			</view>
		</view>
		
		<!-- 卡片底部-点赞|收藏 -->
		<card-like-comment :cardData="item" @checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect" :showStar="true"></card-like-comment>
	</view>
</template>

<script>
	import { transformTime } from '@/tools/transform_time.js'
	import CardLikeComment from '@/components/common/CardLikeComment.vue'
	export default {
		components: {
			CardLikeComment
		},
		props: {
			item: {
				type: Object,
				default: {}
			},
			index: {
				type: Number,
				required: true,
				default: 0
			},
		},
		data() {
			return {
				defaultAvatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',
			}
		},
		methods: {
			
			toDetail(item) {
				uni.navigateTo({
					url: `/page_qa/questionDetail/questionDetail?id=${this.item.id}`
				})
			},
			toastMsg(type) {
				this.$emit('toastMsg', type)
			},
			checkoutLike(status) {
				this.$emit('checkoutLike', this.index, status)
			},
			checkoutCollect(status) {
				this.$emit('checkoutCollect', this.index, status)
			},
		},
	}
</script>

<style lang="less" scoped>
			.question-item-card {
				padding: 30rpx;
				padding-bottom: 0;
				background: #fff;
				box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
				border-radius: 20rpx;
				margin-bottom: 20rpx;
				.question-item-card-author {
					height: 66rpx;
					line-height: 66rpx;
					font-size: 24rpx;
					color: rgba(0,0,0);
					display: flex;
					align-items: center;
					.question-item-card-author-img {
						width:66rpx;
						height: 66rpx;
						border-radius: 50%;
						margin-right: 20rpx;
					}
					.question-item-card-author-text {
						flex: 1;
						.question-item-card-author-name {
							font-size: 24rpx;
							color: rgba(0,0,0);
							line-height: 33rpx;
							overflow: hidden;
							height: 33rpx;
						}
						.question-item-card-author-time {
							font-size: 20rpx;
							color: rgba(0,0,0,0.4);
							line-height: 28rpx;
							margin-top: 5rpx;
						}
					}
				}
				.question-item-card-content {
					display: flex;
					margin-top: 20rpx;
					.question-item-card-content-left {
						flex: 3;
						margin-right: 20rpx;
						.question-item-card-content-left-title {
							font-size: 30rpx;
							margin-bottom: 10rpx;
							color: #000;
							line-height: 42rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
						.question-item-card-content-left-infos {
							color: rgba(0, 0, 0, 0.4);
							font-size: 22rpx;
							line-height: 30rpx;
							margin-bottom: 10rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
					}
					.question-item-card-content-right {
						flex: 1;
						.question-item-card-content-right-img {
							width: 100%;
							height: 100%;
						}
					}
				}
				.question-item-card-content-haveImg {
					min-height: 140rpx;
				}
			}
</style>

