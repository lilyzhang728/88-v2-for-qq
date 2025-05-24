<template>
	<view class="activity-info-card" @click.native="toDetail">
		<!-- 头像、昵称、学校 -->
		<card-user :item="infoItem" :showMoreIcon="true" @clickMore="clickMore"></card-user>
		
		<view class="activity-info-card-content" :class="{'activity-info-card-content-haveImg': infoItem.body.urls && infoItem.body.urls.length>0}">
			<view class="activity-info-card-content-left">
				<view class="activity-info-card-content-left-title van-multi-ellipsis--l3">{{infoItem.title}}</view>
				<view class="activity-info-card-content-left-infos" v-if="infoItem.body.body">{{infoItem.body.body}}</view>
			</view>
		</view>
		
		<!-- 卡片底部-点赞|收藏 -->
		<card-like-comment :cardData="infoItem" @checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect" :showStar="true"></card-like-comment>
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
			infoItem: {
				type: Object,
				required: true,
				default: {
					author: {
						avatar: 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/profile_photos/default/001.jpg',		//默认头像
						name: '',
						school: '',
						major: ''
					},
					body: {
						cover_url: '',
						references: [],
						steps: []
					},
					collectors_count: 0,
					likers_count: 0,
					title: "",
					in_house: 1,	// 是否为外部链接
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
			checkoutLike(status) {
				this.$emit('checkoutLike', this.index, status)
			},
			checkoutCollect(status) {
				this.$emit('checkoutCollect', this.index, status)
			},
			toDetail() {
				// todo：
				uni.navigateTo({
					url: `/page_qa/activityInfoDetail/activityInfoDetail?id=${this.infoItem.id}`
				});
			},
			clickMore() {
				// 参数： id, type: 0：帖子，1：评论，2：话题
				this.$emit('clickMore', this.infoItem.id, 0)
			}
		}
	}
</script>

<style lang="less" scoped>
	.activity-info-card {
		padding: 30rpx;
		padding-bottom: 10rpx;
		background: #fff;
		box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		
		.activity-info-card-content {
			// display: flex;
			margin-top: 20rpx;
			.activity-info-card-content-left {
				flex: 3;
				margin-right: 20rpx;
				.activity-info-card-content-left-title {
					word-break: break-all;
					font-size: 32rpx;
					margin-bottom: 10rpx;
					color: #000;
					line-height: 42rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-weight: bold;
				}
				.activity-info-card-content-left-infos {
					color: rgba(0, 0, 0, 0.4);
					font-size: 30rpx;
					// line-height: 34rpx;
					margin-bottom: 10rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
		}
		.activity-info-card-content-haveImg {
			min-height: 140rpx;
		}
	}
</style>
