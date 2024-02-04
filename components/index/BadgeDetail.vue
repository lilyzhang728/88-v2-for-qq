<!-- 弹框：徽章详情 -->
<template>
	<view class="badge-detail">
		<!-- 徽章详情 -->
		<van-popup :show="showDetail" round closeable position="bottom"
			@close.native="onClose" get-container="#app">
			<view class="detail-wrap">
				<!-- 图片 -->
				<view class="detail-img-wrap">
					<img :src="badgeInfo.image_bg" alt="" class="badge-img-bg">
					<img :src="badgeInfo.image" alt="" class="badge-img-content">
				</view>
				
				<!-- 名字 -->
				<view class="detail-name">{{badgeInfo.name}}</view>
				
				<!-- 描述 -->
				<view class="detail-badge-desc">
					{{badgeInfo.desc}}
				</view>
				
				<!-- 标签 -->
				<view class="detail-info" v-if="field">
					<van-tag round size="large" color="#FFF4E9" text-color="#FF913A" class="detail-info-tag-wrap" custom-class="detail-info-tag">{{field}}</van-tag>
				</view>
				
				<!-- 打分 -->
				<view class="detail-info-rate">
					<view class="detail-info-rate-left">
						<van-rate v-if="showDetail" :value="myRating" @change.native="handleRate" size="20" color="#ffd21e" :readonly="!showRating" />
						<view class="detail-info-rate-text-1">我的评分</view>
						<view class="detail-info-rate-text-2">({{myRating}}星)</view>
					</view>
					<view class="detail-info-rate-split"></view>
					<view class="detail-info-rate-right">
						<view class="detail-info-rate-right-score">{{badgeInfo.rating}}</view>
						<view class="detail-info-rate-text-1">评分</view>
						<view class="detail-info-rate-text-2">({{badgeInfo.rating_count}}人评价)</view>
					</view>
					
					<!-- <view class="detail-text-info" v-show="!showRating">{{badgeInfo.rating}}({{badgeInfo.rating_count}}人评价)</view>
					<view class="custom-rate" v-show="showRating">
						打分：<van-rate value="0" @change.native="handleRate" size="20" color="#ffd21e" />
						<van-icon name="question-o" class="rate-icon" @click.native="clickIcon" />
					</view>
					<view class="custom-rate-tip" v-if="showIcon">打分解释（加一行字，内容待定）</view> -->
				</view>
				
				<!-- 按钮 -->
				<view class="detail-btn-box">
					<van-button v-if="badgeType == 2" @tap="handleAddBadge" custom-style="padding: 0 105rpx;font-size: 32rpx;height: 80rpx;line-height: 45rpx;border-radius: 10rpx;background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);color:#fff;">点亮徽章</van-button>
					<!-- <van-button v-if="badgeType == 1" @tap="collectBadge" custom-style="padding: 0 105rpx;font-size: 32rpx;height: 80rpx;line-height: 45rpx;border-radius: 10rpx;background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);color:#fff;">挂墙上</van-button> -->
				</view>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import { badgeDetail, badgeDetailRating, badgeDetailRatingPost } from "@/network/api_index.js"
	import { addToMyBadge } from "@/network/api_badge.js"
	import { type_value_key_map } from '@/tools/transform_data.js'
	export default {
		props: {

		},
		data() {
			return {
				showDetail: false,
				badgeInfo: {
					desc: "",
					field: "",
					id: "",
					image_bg: "",
					image: "",
					name: "",
					rating: 0,
					rating_count: 0
				},
				badgeType: 0,
				showIcon: false,
				showRating: false,		// true:放开打分  false:禁止打分
				badgeId: null,
				myRating: 0
			}
		},
		computed: {
			field() {
				return this.badgeInfo.field ? type_value_key_map[this.badgeInfo.field] : ''
			}
		},
		watch: {
			showDetail(val) {
				if(!val) {
					this.resetData()
				}
			}
		},
		methods: {
			onClose() {
				this.showDetail = false
			},
			// // 挂墙上
			// collectBadge() {
			// 	this.showDetail = false
			// 	this.$emit('collectBadge')
			// },
			resetData() {
				this.badgeInfo = {
					desc: "",
					field: "",
					id: "",
					image_bg: "",
					image: "",
					name: "",
					rating: 0,
					rating_count: 0
				}
				this.badgeType = 0
				this.showIcon = false
				this.showRating = false
				this.badgeId = null
				this.myRating = 0
			},
			// type 徽章类型： 0-首页我的徽章 1-我的徽章	2-徽章库（我未获得的徽章） 用来决定按钮显示内容
			getBadgeDetail(badgeInfo, type) {
				this.badgeType = type
				this.badgeId = badgeInfo.id
				Promise.all([this.getBadgeData(badgeInfo), this.getBadgeDetailRating(badgeInfo)]).then(res => {
					this.showDetail = true
				}, err => {
					console.log(err)
				})
			},
			// 获取徽章详情（不包括评分）
			getBadgeData(badgeInfo) {
				return new Promise((resolve, reject) => {
					badgeDetail(badgeInfo.id).then(res => {
						if(res.code == 0 && Object.keys(res.data).length) {
							this.badgeInfo = res.data
							this.badgeInfo.rating = res.data.rating.toFixed(1)
							resolve()
						} else {
							reject()
						}
					}, err => {
						console.log('badgeDetail' + err)
						reject()
					})
				})
			},
			// 获取总评分
			getBadgeDetailRating(badgeInfo) {
				return new Promise((resolve, reject) => {
					badgeDetailRating(badgeInfo.id).then(res => {
						if(res.code === 0) {
							if(Object.keys(res.data).length) {
								// 用户评过分，回显总评分
								this.showRating = false
								this.myRating = res.data.rating
							} else {
								// 用户未评分
								this.showRating = true
							}
							resolve()
						} else {
							reject()
						}
					}, err => {
						console.log('badgeDetailRating' + err)
						reject()
					})
				})
			},
			// 用户打分
			handleRate(event) {
				let score = event.detail
				badgeDetailRatingPost({
					'badgeId': this.badgeId,
					'rating': event.detail
				}).then(res => {
					if(res.code == 0) {
						uni.showToast({
							title: '评分成功',
							icon: 'success'
						});
						//更新总评分显示
						// this.badgeInfo.rating = event.detail
						this.showRating = false
					} else {
						uni.showToast({
							title: '评分失败',
							icon: 'fail'
						});
						this.showDetail = false
					}
				}, err => {
					console.log('addToMyBadge' + err)
				})
			},
			// 添加到我的徽章（点亮徽章）
			handleAddBadge() {
				addToMyBadge({
					'achievement_ids': [this.badgeInfo.id]
				}).then(res => {
					if(res.code === 0) {
						this.$emit('toast', '点亮成功！')
						this.$emit('lightBadge')
						this.showDetail = false
					}
				}, err => {
					console.log('addToMyBadge' + err)
				})
			},
			formatDate() {
				let year = new Date().getFullYear(),
					month = new Date().getMonth(),
					day = new Date().getDate()
				return year + '-' + month + '-' + day
			},
			
			clickIcon() {
				this.showIcon = !this.showIcon
			}
		}
	}
</script>

<style scoped lang="less">
	.badge-detail {
		.detail-wrap {
			text-align: center;
			// height: 593rpx;
			.detail-img-wrap {
				position: position;	//fixed;
				width: 100vw;
				height: 150rpx;
				text-align: center;
				// bottom: 626rpx;
				margin-top: 40px;
				.badge-img-content {
					width: 150rpx;
					height: 150rpx;
					position: absolute;
					left: 50%;
					top: 40px;
					transform: translate(-50%);
				}
				.badge-img-bg {
					width: 150rpx;
					height: 150rpx;
					position: absolute;
					left: 50%;
					top: 40px;
					transform: translate(-50%);
				}
			}

			.detail-name {
				font-size: 34rpx;
				font-weight: bold;
				margin-top: 32rpx;  //108rpx;
				line-height: 48rpx;
			}
			// TODO:最多2行？待确认
			.detail-badge-desc {
				margin: 10rpx 35rpx 0 35rpx;
				color: rgba(0,0,0,0.4);
				font-size: 22rpx;
				line-height: 30rpx;
			}
			
			.detail-info {
				text-align: center;
				margin-top: 32rpx;
				
				.detail-info-tag-wrap {
					.detail-info-tag-wrap:last-child {
						margin-right: 0;
					}
					/deep/ .detail-info-tag {
						padding: 5rpx 47rpx !important;
						font-size: 26rpx !important;
						line-height: 37rpx !important;
					}
				}
			}
			
			.detail-info-rate {
				margin: 30rpx 35rpx 0 35rpx;
				height: 196rpx;
				display: flex;
				padding: 28rpx 0;;
				background: linear-gradient(135deg, rgba(47, 194, 197, 0.05) 0%, rgba(55, 201, 163, 0.05) 100%);
				border-radius: 20rpx;
				border: 1rpx solid rgba(80, 210, 183, 0.7);
				box-sizing: border-box;
				.detail-info-rate-left {
					width: 50%;
					text-align: center;
				}
				.detail-info-rate-split {
					width: 1rpx;
					height: 103rpx;
					background-color: rgba(80, 210, 183, 0.2);
					margin-top: 19rpx;
				}
				.detail-info-rate-right {
					width: 50%;
					text-align: center;
					.detail-info-rate-right-score {
						color: rgba(0,0,0,0.8);
						font-weight: 600;
						line-height: 49rpx;
						font-size: 35rpx;
					}
				}
				.detail-info-rate-text-1 {
					line-height: 37rpx;
					color: rgba(0,0,0,0.5);
					font-size: 26rpx;
					margin-top: 18rpx;
				}
				.detail-info-rate-text-2 {
					font-size: 20rpx;
					line-height: 28rpx;
					color: rgba(0,0,0,0.3);
					margin-top: 8rpx;
				}
			}
			.detail-btn-box {
				margin-top: 60rpx;
				
			}
		}
	}
	
</style>
