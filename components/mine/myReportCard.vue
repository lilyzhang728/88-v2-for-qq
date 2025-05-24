<!-- 我的报告-卡片 -->
<template>
	<view class="my-report-card" :class="boxDynamicClass">
		<view class="my-report-card-top">
			<view class="my-report-card-top-left">
				<van-image width="120rpx" height="120rpx" fit="cover" :src="getImgSrc" />
			</view>
			<view class="my-report-card-top-right">
				<view class="my-report-card-top-right-title">
					<text class="my-report-card-top-right-title-text">{{cardData && cardData.name}}</text>
					<view class="my-report-card-top-right-title-label">{{cardData && cardData.word}}</view>
				</view>
				<view class="my-report-card-top-right-desc">
					{{cardData && cardData.desc}}
				</view>
			</view>
		</view>
		<view class="my-report-card-content" :class="{'my-report-card-content-arr': item.content.length>1}" v-for="(item, index) in cardData && cardData.fields" :key="index">
			<view class="my-report-card-content-key">{{item.field}}: </view>
			<view v-if="item.content.length < 2">
				<view class="my-report-card-content-value">{{item.content[0]}}</view>
			</view>
			<view v-else>
				<view class="my-report-card-content-value" v-for="(content, index) in item.content" :key="index">◆ {{content}}</view>
			</view>
		</view>
		
		<view class="my-report-card-progress-bar-box">
			<van-progress :percentage="progressScore" :color="progressColor" :show-pivot="false" class="my-report-card-progress-bar" />
		</view>
		<view class="my-report-card-progress-bar-infos">
			{{cardData && cardData.score_desc}}
		</view>
	</view>
</template>

<script>
	const COLOR_PROGRESS = ['#74d9c7', '#a5d974', '#85b6ff', '#bfa0ff']
	// const COLOR_BTN_BACKGROUND = ['#d5c9f0', '#dcfdf7', '#dceffd', '#bbecd6']
	// const COLOR_BTN_FONT = ['#8b0db3', '#39baa3', '#1c3e97', '#119741']
	const IMG_SRC = [
		'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/infos/iconReport2.png',
		'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/infos/iconReport14.png',
		'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/infos/iconReport13.png',
		'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/infos/iconReport1.png',
	]
	export default {
		props: {
			cardData: {
				type: Object,
				default: {},
				required: true
			},
			cardIndex: {
				type: Number,
				default: 0,
				required: true
			}
		},
		computed: {
			progressColor() {
				return COLOR_PROGRESS[this.cardIndex]
			},
			boxDynamicClass() {
				return "my-report-card-" + this.cardIndex
			},
			progressScore() {
				return this.cardData && this.cardData.score ? this.cardData.score/5*100 : 0
			},
			getImgSrc() {
				return IMG_SRC[this.cardIndex]
			}
		},
		
	}
	
</script>

<style lang="less" scoped>
	.my-report-card {
		margin-top: 30rpx;
		padding: 30rpx;
		background-color: #ffffff;
		border-radius: 20px;
		border: 1px solid #e1e1e1;
		box-sizing: border-box;
		.my-report-card-top {
			display: flex;
			.my-report-card-top-left {
				width: 136rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.my-report-card-top-right {
				margin-left: 20rpx;
				flex: 1;
				.my-report-card-top-right-title {
					margin-top: 10rpx;
					height: 50rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.my-report-card-top-right-title-text{
						font-size: 36rpx;
						font-weight: 600;
						line-height: 48rpx;
					}
					.my-report-card-top-right-title-label {
						padding: 6rpx 20rpx;
						box-sizing: border-box;
						border-radius: 22rpx;
						font-size: 20rpx;
						font-weight: 500;
						line-height: 28rpx;
					}
				}
				.my-report-card-top-right-desc {
					margin-top: 20rpx;
					color: #7b7b7b;
					font-size: 28rpx;
					line-height: 36rpx;
				}
			}
		}
		.my-report-card-content {
			margin-top: 20rpx;
			color: #111111;
			font-size: 28rpx;
			line-height: 36rpx;
			display: flex;
			.my-report-card-content-key {
				font-weight: bold;
			}
			.my-report-card-content-value {
				color: #7b7b7b;
				margin-left: 26rpx;
			}
		}
		.my-report-card-content-arr {
			display: block;
			.my-report-card-content-value {
				margin-left: 0;
				margin-top: 14rpx;
				line-height: 44rpx;
			}
		}
		.my-report-card-progress-bar-box {
			margin-top: 20rpx;
			width: 100%;
		}
		.my-report-card-progress-bar-infos {
			margin-top: 10rpx;
			color: #7b7b7b;
			font-size: 24rpx;
			line-height: 32rpx;
		}
	}
	.my-report-card-0 {
		margin-top: 20rpx !important;
		.my-report-card-top-right-title-text {
			color: #74d9c7;
		}
		.my-report-card-content-key {
			color: #74d9c7;
		}
		.my-report-card-top-right-title-label {
			color: #39baa3;
			background-color: #dcfdf7;
		}
	}
	
	.my-report-card-1 {
		.my-report-card-top-right-title-text {
			color: #a5d974;
		}
		.my-report-card-content-key {
			color: #a5d974;
		}
		.my-report-card-top-right-title-label {
			color: #119741;
			background-color: #bbecd6;
		}
	}
	.my-report-card-2 {
		.my-report-card-top-right-title-text {
			color: #85b6ff;
		}
		.my-report-card-content-key {
			color: #85b6ff;
		}
		.my-report-card-top-right-title-label {
			color: #1c3e97;
			background-color: #dceffd;
		}
	}
	.my-report-card-3 {
		margin-bottom: 20rpx !important;
		.my-report-card-top-right-title-text {
			color: #bfa0ff;
		}
		.my-report-card-content-key {
			color: #bfa0ff;
		}
		.my-report-card-top-right-title-label {
			color: #8b0db3;
			background-color: #d5c9f0;
		}
	}
</style>