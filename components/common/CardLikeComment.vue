<!-- 卡片底部-点赞|收藏|评论 -->
<template>
	<view class="card-operate" @click.native.stop="clickOperate($event)">
		<!-- 点赞 -->
		<view class="card-operate-like" @click.native.stop="checkoutLike($event)">
			<van-icon name="good-job" size="40rpx" :color="cardData.is_like ? activeColor : '#D7D7D7'" />
			<view class="card-operate-like-num" :style="{'color': cardData.is_like ? activeColor : '#00000099'}">{{handleTransform(cardData.likers_count)}}</view>
		</view>
		
		<!-- 评论 -->
		<view class="card-operate-split" v-if="showComment"></view>
		<view class="card-operate-comment" v-if="showComment">
			<van-icon name="comment" size="40rpx" color="#D7D7D7" @click.native.stop="toComment($event)" />
			<view class="card-operate-comment-num" @click.native.stop="toComment($event)">{{handleTransform(cardData.comments_count)}}</view>
		</view>
		
		<!-- 收藏 -->
		<view class="card-operate-split" v-if="showStar"></view>
		<view class="card-operate-comment" v-if="showStar">
			<van-icon name="star" size="40rpx" :color="cardData.is_collect ? activeCollectColor : '#D7D7D7'" @click.native.stop="clickStar($event)" />
			<view class="card-operate-comment-num" :style="{'color': cardData.is_collect ? activeCollectColor : '#00000099'}" @click.native.stop="clickStar($event)">{{handleTransform(cardData.collectors_count)}}</view>
		</view>
	</view>
</template>

<script>
	import { transformMaxNum } from '@/tools/transform_time.js'
	import { likeGuide, disLikeGuide, collectGuide, unCollectGuide } from '@/network/api_guide.js'
	import { themeColor, collectColor } from '@/common/common.less'
	export default {
		props: {
			cardData: {
				type: Object,
				default: {
					id: '',
					is_like: false,
					likers_count: 0,
					comments_count: 0
				}
			},
			// 是否显示评论图标
			showComment: {
				type: Boolean,
				default: false
			},
			// 是否显示收藏图标
			showStar: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				activeColor: themeColor,
				activeCollectColor: collectColor
				
			}
		},
		methods: {
			clickOperate(e) {
				//防止冒泡
				e.preventDefault()
			},
			// 点赞、评论 大数单位转化
			handleTransform(val) {
				return transformMaxNum(val)
			},
			checkoutLike(e) {
				//防止冒泡
				e.preventDefault()
				if(!this.cardData.is_like) {
					//unlike ——> like
					this.$emit('checkoutLike', true)
					likeGuide(this.cardData.id).then(res => {
						if(res.code === 0) {
							//点赞成功
						}
					}, err => {
						console.log('likeGuide: ', err)
					})
				} else {
					//like ——> unlike
					this.$emit('checkoutLike', false)
					disLikeGuide(this.cardData.id).then(res => {
						if(res.code === 0) {
							//取消点赞成功
						}
					}, err => {
						console.log('disLikeGuide: ', err)
					})
				}
			},
			// 去评论
			toComment(e) {
				//防止冒泡
				e.preventDefault()
				uni.navigateTo({
					url: `/page_bbs/bbsPostDetail/bbsPostDetail?id=${this.cardData.id}&showReply=1`
				})
			},
			// 收藏/取消收藏
			clickStar(e) {
				//防止冒泡
				e.preventDefault()
				if(!this.cardData.is_collect) {
					//unstar ——> star
					//改变icon状态
					this.$emit('checkoutCollect', true)
					collectGuide(this.cardData.id).then(res => {
						if(res.code === 0) {
							//收藏成功
						}
					}, err => {
						console.log('collectGuide: ', err)
					})
				} else {
					//star ——> unstar
					//改变icon状态
					this.$emit('checkoutCollect', false)
					unCollectGuide(this.cardData.id).then(res => {
						if(res.code === 0) {
							//取消收藏成功
						}
					}, err => {
						console.log('unCollectGuide: ', err)
					})
				}
				
			},
		}
	}
</script>

<style lang="less" scoped>
	.card-operate {
		// margin-top: 5rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		// line-height: 30rpx;
		font-size: 24rpx;
		color: rgba(0,0,0,0.6);
		// padding-bottom: 30rpx;
		.card-operate-split {
			width: 1rpx;
			height: 28rpx;
			border-left: 1rpx solid #EAEAEA;
		}
		.card-operate-like {
			padding: 20rpx;
			display: flex;
			align-items: center;
			.card-operate-like-num {
				margin-left: 16rpx;
				margin-top: 2rpx;
				width: 50rpx;
			}
		}
		.card-operate-comment {
			padding: 20rpx;
			display: flex;
			align-items: center;
			.card-operate-comment-num {
				margin-left: 16rpx;
				margin-top: 2rpx;
				width: 50rpx;
				// margin-bottom: 4rpx;
			}
		}
	}
</style>