<!-- 话题 -->
<template>
	<view class="bbs-topic-card">
		<view class="bbs-topic-card-left">
			<view class="bbs-topic-card-left-title">
				<img class="bbs-topic-card-left-title-img" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/topicIcon.png" alt="">
				<text class="bbs-topic-card-left-title-text">{{topicData.body}}</text>
			</view>
			<view class="bbs-topic-card-left-info">
				<text class="bbs-topic-card-left-info-text">{{topicData.posts_count}}篇内容</text>
				<text class="bbs-topic-card-left-info-text">{{topicData.views}}次浏览</text>
			</view>
		</view>
		<view class="bbs-topic-card-right">></view>
	</view>
</template>

<script>
	export default {
		props: {
			topicData: {
				type: Object,
				default: {
					body: "",
					collectors_count: 0,
					field: "",
					id: "",
					timestamp: "",
					views: 0
				}
			},
		},
	}
</script>

<style lang="less" scoped>
	.bbs-topic-card {
		padding: 20rpx;
		display: flex;
		border-radius: 20rpx;
		border: 1rpx solid #E1E1E1;
		margin-top: 20rpx;
		.bbs-topic-card-left {
			flex: 1;
			width: 0;
			.bbs-topic-card-left-title {
				font-size: 26rpx;
				color: #000000;
				line-height: 37rpx;
				display: flex;
				align-items: center;
				.bbs-topic-card-left-title-img {
					height: 30rpx;
					width: 30rpx;
					margin-right: 10rpx;
				}
				.bbs-topic-card-left-title-text {
					flex: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.bbs-topic-card-left-info {
				margin-top: 15rpx;
				font-size: 20rpx;
				color: rgba(0,0,0,0.4);
				line-height: 28rpx;
				.bbs-topic-card-left-info-text {
					margin-right: 40rpx;
				}
			}
		}
		.bbs-topic-card-right {
			width: 15rpx;
			display: flex;
			align-items: center;
			color: #949494;
		}
	}
</style>
