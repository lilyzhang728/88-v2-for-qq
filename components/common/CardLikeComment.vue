<!-- 卡片底部-点赞|收藏|评论 -->
<template>
	<view class="card-operate" @click.native.stop="clickOperate($event)">
		<!-- 点赞 -->
		<view class="card-operate-like">
			<van-icon name="good-job" :color="cardData.is_like ? '#8B8B8B' : '#D7D7D7'" size="34rpx" @click.native.stop="checkoutLike($event)" />
			<view class="card-operate-like-num"  @click.native.stop="checkoutLike($event, false)" >{{handleTransform(cardData.likers_count)}}</view>
		</view>
		
		<!-- 评论 -->
		<view class="card-operate-split" v-if="showComment"></view>
		<view class="card-operate-comment" v-if="showComment">
			<van-icon name="comment" size="34rpx" color="#D7D7D7" @click.native.stop="toComment($event)" />
			<view class="card-operate-comment-num" @click.native.stop="toComment($event)">{{handleTransform(cardData.comments_count)}}</view>
		</view>
		
		<!-- 收藏 -->
		<view class="card-operate-split" v-if="showStar"></view>
		<view class="card-operate-comment" v-if="showStar">
			<van-icon name="star" size="34rpx" :color="cardData.is_collect ? '#8B8B8B' : '#D7D7D7'" @click.native.stop="clickStar($event)" />
			<view class="card-operate-comment-num" @click.native.stop="clickStar($event)">{{handleTransform(cardData.collectors_count)}}</view>
		</view>
	</view>
</template>

<script>
	import { transformMaxNum } from '@/tools/transform_time.js'
	import { likeGuide, disLikeGuide, collectGuide, unCollectGuide } from '@/network/api_guide.js'
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
		margin-top: 35rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		line-height: 30rpx;
		font-size: 22rpx;
		color: rgba(0,0,0,0.6);
		padding-bottom: 30rpx;
		.card-operate-split {
			width: 1rpx;
			height: 28rpx;
			border-left: 1rpx solid #EAEAEA;
		}
		.card-operate-like {
			display: flex;
			align-items: center;
			.card-operate-like-num {
				margin-left: 16rpx;
				margin-top: 5rpx;
				width: 50rpx;
			}
		}
		.card-operate-comment {
			display: flex;
			align-items: center;
			.card-operate-comment-num {
				margin-left: 16rpx;
				width: 50rpx;
			}
		}
	}
</style>