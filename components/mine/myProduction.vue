<!-- 我的 -->
<template>
	<view class="my-production">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': '45rpx', 'left': '25rpx', 'right': '25rpx'}">
			<view class="my-production-btn">
				<view @click="clickTypeBtn(index)" class="my-production-btn-item" v-for="(item, index) in btnImgList" :key="index">
					<img :src="item.url" alt="" class="my-production-btn-img">
					<text class="my-production-btn-name">{{item.name}}</text>
				</view>
			</view>
			<view class="my-production-list">
				<view class="my-production-list-count">4篇内容</view>
				<view class="my-production-list-content">
					<view class="my-production-list-item" v-for="(item, index) in dataList1" :key="index">
						<view class="my-production-list-item-title">
							<view class="my-production-list-item-label">问答</view>
							<view class="my-production-list-item-text">{{item.title}}</view>
						</view>
						<view class="my-production-list-item-body">{{item.body}}</view>
						<view class="my-production-list-item-time">{{item.time}}</view>
						<view class="my-production-list-item-footer">
							<view class="my-production-list-item-footer-item my-production-list-item-footer-read">{{item.read}} 阅读</view>
							<view class="my-production-list-item-footer-item my-production-list-item-footer-like">{{item.like}} 点赞</view>
							<view class="my-production-list-item-footer-item my-production-list-item-footer-comment">{{item.comment}} 评论</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				dataList1: [{
					title: '你的专业让你明白了什么人生道理你的专业让你明白了什么人生道理q？',
					body: '我看过很多婚姻，我觉得七八成都没那么幸福，整天在为些鸡毛蒜皮的小事吵来吵去挺内耗的，浪费时间精力于毫无价值的事上。我之前相亲过一个人，我最初感受到什么是…',
					time: '2023-10-23 18:32',
					read: 423,
					like: 123,
					comment: 234
				}],
				btnImgList: [{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/iconAllMy.png',
					name: '全部'
				},{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/iconMyGuide.png',
					name: '攻略'
				},{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/iconMyQa.png',
					name: '回答'
				},{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/iconMyPost.png',
					name: '动态'
				},{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/iconMyCollection.png',
					name: '收藏'
				}]
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				
			},
			clickTypeBtn(index) {
				
			}
		},
	}
</script>

<style lang="less" scoped>
	.my-production {
		.my-production-btn {
			display: flex;
			justify-content: space-between;
			padding: 0 25rpx;
			.my-production-btn-item {
				display: flex;
				flex-direction: column;
				.my-production-btn-img {
					height: 55rpx;
					width: 55rpx;
				}
				.my-production-btn-name {
					margin-top: 19rpx;
					font-size: 28rpx;
					color: #000000;
					line-height: 40rpx;
				}
			}
		}
		.my-production-list {
			margin-top: 50rpx;
			.my-production-list-count {
				font-size: 28rpx;
				color: rgba(0,0,0,0.6);
				line-height: 40rpx;
			}
			.my-production-list-content {
				margin-top: 5rpx;
				.my-production-list-item {
					margin-top: 25rpx;
					padding: 33rpx 30rpx 28rpx 30rpx;
					background: #FFFFFF;
					box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(81,211,184,0.15);
					border-radius: 20rpx;
					.my-production-list-item-title {
						font-size: 34rpx;
						font-weight: 600;
						color: #000000;
						line-height: 48rpx;
						display: flex;
						.my-production-list-item-label {
							width: 72rpx;
							height: 45rpx;
							margin-right: 10rpx;
						}
						.my-production-list-item-text {
							flex: 1;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							word-break: break-all;
						}
					}
					.my-production-list-item-body {
						font-size: 28rpx;
						color: rgba(0,0,0,0.7);
						line-height: 45rpx;
						height: 135rpx;
						word-break: break-all;
						overflow: hidden;
						display: -webkit-box;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
					}
					.my-production-list-item-time {
						margin-top: 21rpx;
						font-size: 24rpx;
						color: rgba(0,0,0,0.3);
						line-height: 33rpx;
					}
					.my-production-list-item-footer {
						margin-top: 29rpx;
						font-size: 24rpx;
						font-weight: 500;
						color: rgba(0,0,0,0.5);
						line-height: 33rpx;
						display: flex;
						.my-production-list-item-footer-item {
							margin-right: 40rpx;
							&:last-child {
								margin-right: 0;
							}
						}
					}
				}
			}
		}
	}
</style>
