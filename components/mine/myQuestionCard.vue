<!-- 我的问答 -->
<template>
	<view class="question-item-card" @click="toDetail(item)">
		<!-- 头像、昵称、学校 -->
		<card-user :item="item" :showMoreIcon="showMoreIcon" @clickMore="clickMore"></card-user>
		
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
	import CardLikeComment from '@/components/common/CardLikeComment.vue'
	import CardUser from '@/components/common/CardUser.vue'
	export default {
		components: {
			CardLikeComment,
			CardUser
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
			showMoreIcon: {
				type: Boolean,
				required: false,
				default: false
			}
		},
		data() {
			return {
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
			clickMore() {
				// 参数： id, type: 0：帖子，1：评论，2：话题
				this.$emit('clickMore', this.item.id, 0)
			}
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

