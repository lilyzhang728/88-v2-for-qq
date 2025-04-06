<!-- 新版卡片(适用于资讯页、问答页、社区页混排)-footer -->
<template>
	<view class="common-item-card-footer" :style="{'justifyContent': showLeft ? 'space-around' : 'flex-end'}">
		<!-- 来源 -->
		<view class="common-item-card-footer-left" v-if="showLeft">
			<img class="common-item-card-footer-left-avatar" :src="defaultAvatar" alt="">
			<view class="common-item-card-footer-left-name">来源：国聘</view>
		</view>
		
		<view class="common-item-card-footer-right">
			<!-- 点赞 -->
			<view class="card-operate-like" @click.native.stop="checkoutLike($event)">
				<van-icon name="good-job" size="40rpx" :color="cardData.is_like ? activeColor : '#D7D7D7'" />
				<view class="card-operate-like-num" :style="{'color': cardData.is_like ? activeColor : '#00000099'}">{{handleTransform(cardData.likers_count)}}</view>
			</view>
			
			<!-- 评论 -->
			<view class="card-operate-comment" v-if="showComment">
				<van-icon name="comment" size="40rpx" color="#D7D7D7" @click.native.stop="toComment($event)" />
				<view class="card-operate-comment-num" @click.native.stop="toComment($event)">{{handleTransform(cardData.comments_count)}}</view>
			</view>
			
			<!-- 收藏 -->
			<view class="card-operate-comment" v-if="showStar">
				<van-icon name="star" size="40rpx" :color="cardData.is_collect ? activeCollectColor : '#D7D7D7'" @click.native.stop="clickStar($event)" />
				<view class="card-operate-comment-num" :style="{'color': cardData.is_collect ? activeCollectColor : '#00000099'}" @click.native.stop="clickStar($event)">{{handleTransform(cardData.collectors_count)}}</view>
			</view>
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
			// 是否显示左侧头像+来源
			showLeft: {
				type: Boolean,
				default: false
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
				activeCollectColor: collectColor,
				defaultAvatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',
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
				//todo:url待定
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
	.common-item-card-footer {
		margin-top: 10rpx;
		margin-right: -30rpx;
		margin-bottom: -20rpx;
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.common-item-card-footer-left {
			height: 80rpx;
			flex: 1;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			display: flex;
			align-items: center;
			.common-item-card-footer-left-avatar {
				width: 40rpx;
				height: 40rpx;
				margin-right:20rpx;
				border-radius: 50%;
				box-shadow: 4rpx 8rpx 10rpx 0 rgba(0,0,0,0.1);
			}
			.common-item-card-footer-left-name {
				flex: 1;
				font-size: 22rpx;
				font-weight: 600;
				color: #000;
				line-height: 42rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				display: flex;
			}
		}
		.common-item-card-footer-right {
			display: flex;
			font-size: 24rpx;
			color: rgba(0,0,0,0.6);
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
	}
	
</style>