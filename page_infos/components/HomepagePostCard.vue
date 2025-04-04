<!-- 帖子 -->
<template>
	<view class="homepage-post-card">
		<!-- 头像、昵称、学校 -->
		<card-user :item="postData" :showMoreIcon="false" @clickMore="clickMore"></card-user>
		
		
		<!-- 正文 -->
		<view class="homepage-post-content">{{postData.body.body}}</view>
		<view class="homepage-post-img-box" v-if="postData.body.urls && postData.body.urls.length">
			<van-image
			  width="100%"
			  height="100%"
			  fit="cover"
			  :src="pic"
			  class="homepage-post-img-item"
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
						id: '',
						school: '',
						major: ''
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
			}
		},
		computed: {
			picList() {
				return this.postData.body.urls && this.postData.body.urls.length ? this.postData.body.urls.slice(0, 3) : []
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
			checkoutLike(status) {
				this.$emit('checkoutLike', this.index, status)
			},
			clickMore() {
				// 参数： id, type: 0：帖子，1：评论，2：话题
				this.$emit('clickMore', this.postData.id, 0)
			}
		},
	}
</script>

<style lang="less" scoped>
	.homepage-post-card {
		padding: 30rpx;
		padding-bottom: 0;
		background: #fff;
		box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		
		.homepage-post-content {
			// margin-top: 20rpx;
			border-radius: 8rpx;
			border: 20rpx solid #fff;
			font-size: 30rpx;
			color: #000;
			// line-height: 45rpx;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
		.homepage-post-img-box {
			display: flex;
			height: 200rpx;
			.homepage-post-img-item {
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

