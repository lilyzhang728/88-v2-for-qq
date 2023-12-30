<template>
	<view class="news-item-card" @click.native="toNewsDetail">
		<view class="news-item-card-author">
			<img :src="avatar" alt="" class="news-item-card-author-img">
			<view class="news-item-card-author-text">
				<view class="news-item-card-author-name">{{newsItem.author.name}}</view>
				<view class="news-item-card-author-time">{{timestamp}}</view>
			</view>
		</view>
		<view class="news-item-card-content" :class="{'news-item-card-content-haveImg': newsItem.body.urls && newsItem.body.urls.length>0}">
			<view class="news-item-card-content-left">
				<view class="news-item-card-content-left-title van-multi-ellipsis--l3">{{newsItem.title}}</view>
				<view class="news-item-card-content-left-infos" v-if="newsItem.body.summary">{{newsItem.body.summary}}</view>
			</view>
			<view class="news-item-card-content-right" v-if="newsItem.body.urls && newsItem.body.urls.length > 0">
				<img :src="newsItem.body.urls[0]" alt="" class="news-item-card-content-right-img">
			</view>
		</view>
		<view class="news-item-card-operate" @click.native.stop="clickOperate($event)">
			<view class="news-item-card-operate-item">
				<van-icon name="good-job" size="34rpx" :color="newsItem.is_like ? '#8B8B8B' : '#D7D7D7'" @click.native.stop="clickLike($event)" />
				<view class="news-item-card-operate-num">{{handleTransform(newsItem.likers_count)}}</view>
			</view>
			<view class="news-item-card-operate-item">
				<van-icon name="star" size="34rpx" :color="newsItem.is_collect ? '#8B8B8B' : '#D7D7D7'" @click.native.stop="clickStar($event)" />
				<view class="news-item-card-operate-num">{{handleTransform(newsItem.collectors_count)}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { likeGuide, disLikeGuide, collectGuide, unCollectGuide } from '@/network/api_guide.js'
	import { transformTime, transformMaxNum } from '@/tools/transform_time.js'
	export default {
		props: {
			newsItem: {
				type: Object,
				required: true,
				default: {
					author: {
						avatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',		//默认头像
						name: ''
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
			avatar() {
				return this.newsItem.author.avatar ? this.newsItem.author.avatar : 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg'
			},
			timestamp() {
				return this.newsItem.timestamp ? transformTime(this.newsItem.timestamp) : this.newsItem.timestamp
			}
		},
		methods: {
			// 点赞、评论 大数单位转化
			handleTransform(val) {
				return transformMaxNum(val)
			},
			clickOperate(e) {
				//防止冒泡
				e.preventDefault()
			},
			clickLike(e) {
				//防止冒泡
				e.preventDefault()
				if(!this.newsItem.is_like) {
					//unlike ——> like
					likeGuide(this.newsItem.id).then(res => {
						if(res.code === 0) {
							//点赞成功，改变icon状态
							this.$emit('checkoutLike', this.index, !this.newsItem.is_like)
						}
					}, err => {
						console.log('likeGuide: ', err)
					})
				} else {
					//like ——> unlike
					disLikeGuide(this.newsItem.id).then(res => {
						if(res.code === 0) {
							//取消点赞成功，改变icon状态
							this.$emit('checkoutLike', this.index, !this.newsItem.is_like)
						}
					}, err => {
						console.log('disLikeGuide: ', err)
					})
				}
			},
			// 收藏/取消收藏
			clickStar(e) {
				//防止冒泡
				e.preventDefault()
				if(!this.newsItem.is_collect) {
					//unstar ——> star
					collectGuide(this.newsItem.id).then(res => {
						if(res.code === 0) {
							//收藏成功，改变icon状态
							this.$emit('checkoutCollect', this.index, !this.newsItem.is_collect)
						}
					}, err => {
						console.log('collectGuide: ', err)
					})
				} else {
					//star ——> unstar
					unCollectGuide(this.newsItem.id).then(res => {
						if(res.code === 0) {
							//取消收藏成功，改变icon状态
							this.$emit('checkoutCollect', this.index, !this.newsItem.is_collect)
						}
					}, err => {
						console.log('unCollectGuide: ', err)
					})
				}
				
			},
			toNewsDetail() {
				uni.navigateTo({
					url: `/page_news/newsDetail/newsDetail?id=${this.newsItem.id}`
				});
			}
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
		.news-item-card-author {
			height: 66rpx;
			line-height: 66rpx;
			font-size: 24rpx;
			color: rgba(0,0,0);
			display: flex;
			align-items: center;
			.news-item-card-author-img {
				width:66rpx;
				height: 66rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			.news-item-card-author-text {
				flex: 1;
				.news-item-card-author-name {
					font-size: 24rpx;
					color: rgba(0,0,0);
					line-height: 33rpx;
					overflow: hidden;
					height: 33rpx;
				}
				.news-item-card-author-time {
					font-size: 20rpx;
					color: rgba(0,0,0,0.4);
					line-height: 28rpx;
					margin-top: 5rpx;
				}
			}
		}
		.news-item-card-content {
			display: flex;
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
		.news-item-card-operate {
			display: flex;
			justify-content: space-around;
			margin-top: 10rpx;
			padding-bottom: 25rpx;
			.news-item-card-operate-item {
				display: flex;
				align-items: center;
				.news-item-card-operate-num {
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
