<template>
	<view class="news-item-card" @click.native="toNewsDetail">
		<!-- 头像、昵称、学校 -->
		<card-user :item="newsItem" :showMoreIcon="true" @clickMore="clickMore" :ifOfficialAccountLink="ifOfficialAccountLink"></card-user>
		
		<view class="news-item-card-content" :class="{'news-item-card-content-haveImg': newsItem.body.urls && newsItem.body.urls.length>0}">
			<view class="news-item-card-content-left">
				<view class="news-item-card-content-left-title van-multi-ellipsis--l3">{{newsItem.title}}</view>
				<view class="news-item-card-content-left-infos" v-if="!ifOfficialAccountLink && newsItem.body.body">{{newsItem.body.body}}</view>
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
	import { compareVersion } from '@/tools/about_wx.js'
	const hostSDKVersion = uni.getStorageSync('hostSDKVersion')
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
		computed: {
			// 是否为外部公众号链接
			ifOfficialAccountLink() {
				return parseInt(this.newsItem.in_house) === 0
			}
		},
		methods: {
			checkoutLike(status) {
				this.$emit('checkoutLike', this.index, status)
			},
			checkoutCollect(status) {
				this.$emit('checkoutCollect', this.index, status)
			},
			toNewsDetail() {
				if(this.ifOfficialAccountLink) {
					// 跳外部公众号文章链接
					if(compareVersion(hostSDKVersion, '3.4.8') < 0) {
						// 基础库低于3.4.8，无法打开外链公众号
						wx.showModal({
							title: '提示',
							content: '当前微信版本过低，请升级到最新微信版本后重试。',
							complete(res) {
								// 退出小程序
								// if(wx.exitMiniProgram) {
								// 	wx.exitMiniProgram()
								// }
							} 
						})
					} else {
						if(wx.openOfficialAccountArticle) {
							wx.openOfficialAccountArticle({
								url: this.newsItem.source_link, // 此处填写公众号文章连接
							})
						}
					}
				} else {
					// 跳小程序内部文章
					uni.navigateTo({
						url: `/page_news/newsDetail/newsDetail?id=${this.newsItem.id}`
					});
				}
			},
			clickMore() {
				// 参数： id, type: 0：帖子，1：评论，2：话题
				this.$emit('clickMore', this.newsItem.id, 0)
			}
		}
	}
</script>

<style lang="less" scoped>
	.news-item-card {
		padding: 30rpx;
		padding-bottom: 10rpx;
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
				.news-item-card-content-left-infos {
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
