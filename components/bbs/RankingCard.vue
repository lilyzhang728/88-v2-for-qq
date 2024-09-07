<!-- 榜单卡片 -->
<template>
	<view class="ranking-card">
		<view class="ranking-card-left">
			<view class="ranking-card-left-title">
				<img class="ranking-card-left-title-img" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/topicIcon.png" alt="">
				<text class="ranking-card-left-title-text">{{contentText}}</text>
			</view>
			<view class="ranking-card-left-info">
				<text class="ranking-card-left-info-text">{{rankingData.author.name}}</text>
				<text class="ranking-card-left-info-text">点赞数 {{rankingData.likers_count}}</text>
			</view>
		</view>
		<view class="ranking-card-right">{{index+1}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			rankingData: {
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
			rankId: {
				type: String,
				default: '',
				required: false
			},
			index: {
				type: Number,
				default: 0,
				required: false
			}
		},
		computed: {
			contentText() {
				const id_map = {
					'ID_00002': 'title',
					'ID_00003': 'title',
					'ID_00004': 'body'
				}
				if(this.rankId === 'ID_00001') {
					return this.rankingData.body.body
				} else {
					return this.rankingData[id_map[this.rankId]]
				}
			}
		},
	}
</script>

<style lang="less" scoped>
	.ranking-card {
		padding: 20rpx;
		display: flex;
		border-radius: 20rpx;
		border: 1rpx solid #E1E1E1;
		margin-top: 20rpx;
		.ranking-card-left {
			flex: 1;
			width: 0;
			.ranking-card-left-title {
				font-size: 28rpx;
				color: #000000;
				line-height: 37rpx;
				display: flex;
				align-items: center;
				.ranking-card-left-title-img {
					height: 30rpx;
					width: 30rpx;
					margin-right: 10rpx;
				}
				.ranking-card-left-title-text {
					flex: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.ranking-card-left-info {
				margin-top: 15rpx;
				font-size: 20rpx;
				color: rgba(0,0,0,0.4);
				line-height: 28rpx;
				.ranking-card-left-info-text {
					margin-right: 40rpx;
				}
			}
		}
		.ranking-card-right {
			width: 15rpx;
			display: flex;
			align-items: center;
			color: #949494;
		}
	}
</style>
