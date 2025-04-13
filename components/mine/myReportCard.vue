<!-- 我的报告-卡片 -->
<template>
	<view class="my-report-card">
		<view class="my-report-card-top">
			<view class="my-report-card-top-left">
				<van-image width="200rpx" height="200rpx" fit="cover" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/infos/iconReport1.png" />
			</view>
			<view class="my-report-card-top-right">
				<view class="my-report-card-top-right-title">
					<text class="my-report-card-top-right-title-text">English 101</text>
					<view class="my-report-card-top-right-title-label">Homework</view>
				</view>
				<view class="my-report-card-top-right-desc">
					Learn the basics',
				</view>
			</view>
		</view>
		<view class="my-report-card-content">
			  text: 'Starts today at 11 AM, Class 300'34 students'
		</view>
		<view class="my-report-card-progress-bar-box">
			<van-progress percentage="50" color="#bfa0ff" :show-pivot="false" class="my-report-card-progress-bar" />
		</view>
		<view class="my-report-card-progress-bar-infos">
			Lesson 8/12'
		</view>
	</view>
</template>

<script>
	
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
				width: 200rpx;
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
						color: #111111;
						font-size: 36rpx;
						font-weight: 600;
						line-height: 48rpx;
					}
					.my-report-card-top-right-title-label {
						padding: 6rpx 20rpx;
						box-sizing: border-box;
						border-radius: 22rpx;
						background-color: #d5c9f0;
						color: #8b0db3;
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
</style>