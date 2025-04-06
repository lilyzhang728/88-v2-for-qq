<!-- 新版卡片(适用于资讯页、问答页、社区页混排) -->
<template>
	<view class="common-item-card">
		<view class="common-item-card-title">
			非科班转码的一点心得：技术栈与深度怎么平衡
		</view>
		<view class="common-item-card-content">
			计算机专业应届生，刚结束春招上岸学生一枚，刚结束春招，最近正在整理资料时翻到...
		</view>
		<view class="common-item-card-time-box">
			<view class="common-item-card-time">2025-04-03 09:22:05</view>
			<view class="common-item-card-time-split">|</view>
			<view class="common-item-card-time-type">问答</view>
		</view>
		<view class="common-item-card-progress-bar-box">
			<view class="common-item-card-progress-bar-item">
				<view class="common-item-card-progress-bar-item-text">时效性</view>
				<view class="common-item-card-progress-bar-item-progress-bar-box">
					<van-progress percentage="50" color="#2ca1ae" :show-pivot="false" class="common-item-card-progress-bar-item-progress-bar" />
				</view>
				<view class="common-item-card-progress-bar-item-score">2.5分 / 5.0分</view>
			</view>
			<view class="common-item-card-progress-bar-item">
				<view class="common-item-card-progress-bar-item-text">时效性</view>
				<view class="common-item-card-progress-bar-item-progress-bar-box">
					<van-progress percentage="50" color="#d47b38" :show-pivot="false" class="common-item-card-progress-bar-item-progress-bar" />
				</view>
				<view class="common-item-card-progress-bar-item-score">2.5分 / 5.0分</view>
			</view>
			<view class="common-item-card-progress-bar-item">
				<view class="common-item-card-progress-bar-item-text">时效性</view>
				<view class="common-item-card-progress-bar-item-progress-bar-box">
					<van-progress percentage="50" color="#7047a2" :show-pivot="false" class="common-item-card-progress-bar-item-progress-bar" />
				</view>
				<view class="common-item-card-progress-bar-item-score">2.5分 / 5.0分</view>
			</view>
		</view>
		<view class="common-item-card-tag-box">
			<view class="common-item-card-tag-item">
				<img class="common-item-card-tag-item-icon" :src="iconSrc" alt="">
				<view class="common-item-card-tag-item-label">适用人群</view>
				<view class="common-item-card-tag-item-tag-box">
					<view class="common-item-card-tag-item-tag">计算机</view>
					<view class="common-item-card-tag-item-tag">实习</view>
					<view class="common-item-card-tag-item-tag">跨专业</view>
					<view class="common-item-card-tag-item-tag">跨专业</view>
				</view>
			</view>
			<view class="common-item-card-tag-item common-item-card-tag-item1">
				<img class="common-item-card-tag-item-icon" :src="iconSrc" alt="">
				<view class="common-item-card-tag-item-label">适用人群</view>
				<view class="common-item-card-tag-item-tag-box">
					<view class="common-item-card-tag-item-tag">计算机</view>
					<view class="common-item-card-tag-item-tag">实习</view>
					<view class="common-item-card-tag-item-tag">跨专业</view>
					<view class="common-item-card-tag-item-tag">跨专业</view>
				</view>
			</view>
			<view class="common-item-card-tag-item common-item-card-tag-item2">
				<img class="common-item-card-tag-item-icon" :src="iconSrc" alt="">
				<view class="common-item-card-tag-item-label">适用人群</view>
				<view class="common-item-card-tag-item-tag-box">
					<view class="common-item-card-tag-item-tag">计算机</view>
					<view class="common-item-card-tag-item-tag">实习</view>
					<view class="common-item-card-tag-item-tag">跨专业</view>
					<view class="common-item-card-tag-item-tag">跨专业</view>
				</view>
			</view>
		</view>
		<view class="common-item-card-footer">
			<common-item-card-footer :showComment="true" :showStar="true"></common-item-card-footer>
		</view>
	</view>
</template>

<script>
	import CommonItemCardFooter from '@/components/common/CommonItemCardFooter.vue'
	export default {
		components: {
			CommonItemCardFooter
		},
		data() {
			return {
				iconSrc: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/tipIcon.png'
			}
		}
	}
</script>

<style lang="less" scoped>
	.common-item-card {
		margin-top: 30rpx;
		padding: 20rpx;
		background-color: #ffffff;
		border-radius: 16px;
		border: 1px solid #ffffff;
		box-sizing: border-box;
		box-shadow: 0px 0px 8px rgba(0,0,0,0.12);
		.common-item-card-title{
			color: #303030;
			font-size: 36rpx;
			font-weight: 500;
			line-height: 48rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.common-item-card-content {
			margin-top: 10rpx;
			color: #616161;
			font-size: 32rpx;
			line-height: 40rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.common-item-card-time-box {
			margin-top: 10rpx;
			font-size: 24rpx;
			line-height: 32rpx;
			display: flex;
			.common-item-card-time{
				color: #292d3a;
			}
			.common-item-card-time-split {
				height: 24rpx;
				color: #292d3a;
				margin: 0 12rpx;
			}
			.common-item-card-time-type {
				color: #0dae8c;
				font-weight: 500;
			}
		}
		.common-item-card-progress-bar-box {
			margin-top: 20rpx;
			display: flex;
			justify-content: space-around;
			.common-item-card-progress-bar-item {
				display: flex;
				flex-direction: column;
				.common-item-card-progress-bar-item-text {
					color: #292d3a;
					font-size: 26rpx;
					line-height: 34rpx;
				}
				.common-item-card-progress-bar-item-progress-bar-box {
					margin-top: 10rpx;
					width: 100%;
					.common-item-card-progress-bar-item-progress-bar {
						/deep/ .van-progress {
							height: 14rpx !important;
							background: #f8f4f0 !important;
							border-radius: 7rpx !important;
						}
					}
				}
				.common-item-card-progress-bar-item-score {
					margin-top: 10rpx;
					color: #292d3a;
					font-size: 24rpx;
					line-height: 32rpx;
				}
			}
		}
		.common-item-card-tag-box {
			margin-top: 20rpx;
			.common-item-card-tag-item {
				margin-top: 10rpx;
				display: flex;
				align-items: center;
				.common-item-card-tag-item-icon {
					width: 48rpx;
					height: 48rpx;
				}
				.common-item-card-tag-item-label {
					margin-left: 26rpx;
					width: 130rpx;
					color: #424242;
					font-size: 28rpx;
					font-weight: 500;
					line-height: 36rpx;
				}
				.common-item-card-tag-item-tag-box {
					margin-left: 20rpx;
					flex: 1;
					display: flex;
					overflow: hidden;
					flex-wrap: nowrap;
					.common-item-card-tag-item-tag {
						font-size: 24rpx;
						font-weight: 500;
						line-height: 32rpx;
						padding: 6rpx 20rpx;
						color: #231c16;
						background-color: #f8f2e0;
						border-radius: 22rpx;
						margin-right: 2rpx;
						white-space: nowrap;
					}
				}
			}
			.common-item-card-tag-item1{
				.common-item-card-tag-item-tag {
					background-color: #e7f9ff !important;
				}
			}
			.common-item-card-tag-item2{
				.common-item-card-tag-item-tag {
					background-color: #dcddfb !important;
				}
			}
		}
	}
	
</style>