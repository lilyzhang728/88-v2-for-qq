<template>
	<view class="question-item-card" @click="toDetail(item)">
		<!-- 头像、昵称、学校 -->
		<card-user :item="item" :showMoreIcon="true" @clickMore="clickMore"></card-user>
		
		<view class="question-item-card-content" :class="{'question-item-card-content-haveImg': item.body.urls.length>0}">
			<view class="bbs-post-content">
				<view class="question-item-card-content-left-title van-multi-ellipsis--l3">{{item.title}}</view>
				<view class="question-item-card-content-left-infos" v-if="item.body.body">{{item.body.body}}</view>
			</view>
			<view class="bbs-post-img-box" v-if="item.body.urls && item.body.urls.length">
				<van-image
				  width="100%"
				  height="100%"
				  fit="cover"
				  :src="pic"
				  class="bbs-post-img-item"
				  v-for="(pic, index) in item.body.urls"
				  :key="index"
				  @click.native="previewImg($event, pic)"
				/>
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
			// 预览图片
			previewImg(e, url) {
				//防止冒泡
				e.preventDefault()
				uni.previewImage({
					current: 0,
					urls: [url]
				});
			},
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
		padding-bottom: 10rpx;
		background: #fff;
		box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		
		.question-item-card-content {
			margin-top: 20rpx;
			
			.bbs-post-content {
				margin-top: 20rpx;
				border-radius: 8rpx;
				border-top: 20rpx solid #fff;
				font-size: 30rpx;
				color: #000;
				// line-height: 45rpx;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
				.question-item-card-content-left-title {
					font-size: 34rpx;
					margin-bottom: 10rpx;
					color: #000;
					line-height: 56rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-weight: bold;
				}
				.question-item-card-content-left-infos {
					color: rgba(0, 0, 0, 0.4);
					font-size: 32rpx;
					line-height: 56rpx;
					// margin-bottom: 10rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
			.bbs-post-img-box {
				// margin-top: 40rpx;
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