<template>
	<view class="question-item-card" @click="toDetail(item)">
		<!-- 头像、昵称、学校 -->
		<card-user :item="item"></card-user>
		
		<view class="question-item-card-content" :class="{'question-item-card-content-haveImg': item.body.urls.length>0}">
			<view class="question-item-card-content-left">
				<view class="question-item-card-content-left-title van-multi-ellipsis--l3">{{item.title}}</view>
				<view class="question-item-card-content-left-infos" v-if="item.body.body">{{item.body.body}}</view>
			</view>
			<view class="question-item-card-content-right" v-if="item.body.urls.length > 0">
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
				required: true,
				default: {
					author: {
						avatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',		//默认头像
						name: '',
						id: '',
						school: '',
						major: ''
					},
					body: {
						urls: [],
						body: ''
					},
					collectors_count: 0,
					likers_count: 0,
					title: "",
					views: 0,
					status: 0,		//0:未发布  1：已发布
					id: '',
					is_collect: false,
					is_like: false,
					timestamp: ''
				}
			},
			//card的index
			index: {
				type: Number,
				required: true,
				default: 0
			},
		},
		methods: {
			toDetail(item) {
				uni.navigateTo({
					url: `/page_qa/questionDetail/questionDetail?id=${item.id}`
				})
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
		.question-item-card-operate {
			display: flex;
			justify-content: space-around;
			margin-top: 10rpx;
			padding-bottom: 25rpx;
			.question-item-card-operate-item {
				display: flex;
				align-items: center;
				.question-item-card-operate-num {
					margin-left: 16rpx;
					font-size: 22rpx;
					color: rgba(0,0,0,0.6);
					line-height: 30rpx;
					width: 50rpx;
				}
			}
			
		}
	}
</style>