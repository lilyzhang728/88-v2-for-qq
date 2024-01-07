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
		<view class="question-item-card-operate" @click.native.stop="clickOperate($event)">
			<view class="question-item-card-operate-item">
				<van-icon name="good-job" size="34rpx" :color="item.is_like ? '#8B8B8B' : '#D7D7D7'" @click.native.stop="clickLike($event, index)" />
				<view class="question-item-card-operate-num">{{handleTransform(item.likers_count)}}</view>
			</view>
			<view class="question-item-card-operate-item">
				<van-icon name="star" size="34rpx" :color="item.is_collect ? '#8B8B8B' : '#D7D7D7'" @click.native.stop="clickStar($event, index)" />
				<view class="question-item-card-operate-num">{{handleTransform(item.collectors_count)}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { transformTime, transformMaxNum } from '@/tools/transform_time.js'
	import { likeGuide, disLikeGuide, collectGuide, unCollectGuide } from '@/network/api_guide.js'
	export default {
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
			// 点赞、评论 大数单位转化
			handleTransform(val) {
				return transformMaxNum(val)
			},
			clickOperate(e) {
				//防止冒泡
				e.preventDefault()
			},
			clickLike(e, index) {
				//防止冒泡
				e.preventDefault()
				if(!this.item.is_like) {
					//unlike ——> like
					likeGuide(this.item.id).then(res => {
						if(res.code === 0) {
							//点赞成功，改变icon状态
							this.$emit('checkoutLike', this.index, true)
						}
					}, err => {
						console.log('likeGuide: ', err)
					})
				} else {
					//like ——> unlike
					disLikeGuide(this.item.id).then(res => {
						if(res.code === 0) {
							//取消点赞成功，改变icon状态
							this.$emit('checkoutLike', this.index, false)
						}
					}, err => {
						console.log('disLikeGuide: ', err)
					})
				}
			},
			// 收藏/取消收藏
			clickStar(e, index) {
				//防止冒泡
				e.preventDefault()
				if(!this.item.is_collect) {
					//unstar ——> star
					collectGuide(this.item.id).then(res => {
						if(res.code === 0) {
							//收藏成功，改变icon状态
							this.$emit('checkoutCollect', this.index, true)
						}
					}, err => {
						console.log('collectGuide: ', err)
					})
				} else {
					//star ——> unstar
					unCollectGuide(this.item.id).then(res => {
						if(res.code === 0) {
							//取消收藏成功，改变icon状态
							this.$emit('checkoutCollect', this.index, false)
						}
					}, err => {
						console.log('unCollectGuide: ', err)
					})
				}
				
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

