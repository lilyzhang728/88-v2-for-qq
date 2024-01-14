<template>
	<view class="news-item-card" @click.native="toNewsDetail">
		<!-- 头像、昵称、学校 -->
		<card-user :item="newsItem"></card-user>
		
		<view class="news-item-card-content" :class="{'news-item-card-content-haveImg': newsItem.body.urls && newsItem.body.urls.length>0}">
			<view class="news-item-card-content-left">
				<view class="news-item-card-content-left-title van-multi-ellipsis--l3">{{newsItem.title}}</view>
				<view class="news-item-card-content-left-infos" v-if="newsItem.body.body">{{newsItem.body.body}}</view>
			</view>
			<view class="news-item-card-content-right" v-if="newsItem.body.urls && newsItem.body.urls.length > 0">
				<img :src="newsItem.body.urls[0]" alt="" class="news-item-card-content-right-img">
			</view>
		</view>
		
		<!-- 卡片底部-点赞|收藏 -->
		<card-like-comment :cardData="newsItem" @checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect" :showStar="true"></card-like-comment>
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
			newsItem: {
				type: Object,
				required: true,
				default: {
					author: {
						avatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',		//默认头像
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
		computed: {
			
		},
		methods: {
			checkoutLike(status) {
				this.$emit('checkoutLike', this.index, status)
			},
			checkoutCollect(status) {
				this.$emit('checkoutCollect', this.index, status)
			},
			toNewsDetail() {
				uni.navigateTo({
					url: `/page_news/newsDetail/newsDetail?id=${this.newsItem.id}`
				});
			},
			
		}
	}
</script>

<style lang="less" scoped>
	.news-item-card {
		padding: 30rpx;
		padding-bottom: 0;
		background: #fff;
		box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		
		.news-item-card-content {
			// display: flex;
			margin-top: 20rpx;
			.news-item-card-content-left {
				flex: 3;
				margin-right: 20rpx;
				.news-item-card-content-left-title {
					font-size: 30rpx;
					margin-bottom: 10rpx;
					color: #000;
					line-height: 42rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.news-item-card-content-left-infos {
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
			.news-item-card-content-right {
				flex: 1;
				.news-item-card-content-right-img {
					width: 100%;
					height: 100%;
				}
			}
		}
		.news-item-card-content-haveImg {
			min-height: 140rpx;
		}
	}
</style>
