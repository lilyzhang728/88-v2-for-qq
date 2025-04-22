<!-- 攻略详情-第X步 -->
<!-- 待删除 -->
<template>
	<view class="guide-detail-step">
		<view class="guide-detail-step-title">
			卷 {{index + 1}}
			<!-- <text class="guide-detail-step-title-tip">建议用时： 1h</text> -->
		</view>
		<view class="guide-detail-step-content">
			<view class="guide-detail-step-subtitle">{{stepData.subtile}}</view>
			<view class="guide-detail-step-desc">{{stepData.body}}</view>
			<view class="guide-detail-step-link" v-for="(link, index) in stepData.links" @click="clickLink(link.url)" :key="index" v-if="link.name && link.url">
				<img class="guide-detail-step-link-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/linkIcon.png" alt="">
				<view class="guide-detail-step-link-text">{{link.name}}</view>
			</view>
			<!-- <view class="guide-detail-step-tip">辅助说明</view> -->
			<view class="guide-detail-step-img" v-if="picsList.length">
				<van-image 
				  width="100%"
				  height="100%"
				  fit="cover"
				  :src="pic.url"
				  class="guide-detail-step-img-item"
				  v-for="(pic, index) in picsList"
				  :key="index"
				  @click.native="previewImg(pic.url)"
				/>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			index: {
				type: Number,
				required: true,
				default: 0
			},
			stepData: {
				type: Object,
				required: true,
				default: {
					index: 0, 
					subtile: "", 
					body: "", 
					links: [],
					pics: []
				}
			}
		},
		data() {
			return {
			}
		},
		computed: {
			//限制长度<=3
			picsList() {
				return this.stepData.pics.slice(0, 3)
			}
		},
		methods: {
			// 预览图片
			previewImg(url) {
				uni.previewImage({
					current: 0,
					urls: [url]
				});
			},
			// 点击复制链接
			clickLink(url) {
				uni.setClipboardData({
					data: url,
					success() {
						uni.showToast({
							title:'已复制到剪贴板',
							icon:'none',
							position:'top'
						})
					}
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.guide-detail-step {
		border-radius: 8rpx;
		border: 1rpx solid #E2E2E2;
		padding: 20rpx 0 30rpx 0;
		margin-top: 30rpx;
		.guide-detail-step-title {
			display: inline-block;
			font-weight: bold;
			font-size: 32rpx;
			color: #FFFFFF;
			line-height: 40rpx;
			padding: 7rpx 30rpx;
			background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
			border-top-right-radius: 30%;  
			// .guide-detail-step-title-tip {
			// 	position: absolute;
			// 	right: 10px;
			// 	font-weight: normal;
			// 	font-size: 14px;
			// }
		}
		.guide-detail-step-content {
			margin: 20rpx 30rpx 0 30rpx;
			.guide-detail-step-subtitle {
				font-size: 36rpx;
				color: #000;
				line-height: 56rpx;
				font-weight: 500;
			}
			.guide-detail-step-desc {
				color: rgba(0,0,0,0.8);
				line-height: 56rpx;
				font-size: 34rpx;
				margin-top: 18rpx;
				white-space: pre-line;
			}
			.guide-detail-step-link {
				font-size: 28rpx;
				color: #35C8A7;
				line-height: 40rpx;
				display: flex;
				align-items: center;
				margin-top: 20rpx;
				.guide-detail-step-link-icon {
					height: 22rpx;
					width: 22rpx;
					margin-right: 10rpx;
				}
				.guide-detail-step-link-text {
					flex: 1;
				}
			}
			// .guide-detail-step-tip {
			// 	color: #7F7F7F;
			// 	font-size: 14/16rem;
			// 	margin-bottom: 5px;
			// }
			.guide-detail-step-img {
				margin-top: 30rpx;
				display: flex;
				height: 152rpx;
				.guide-detail-step-img-item {
					// flex: 1;
					width: calc((100% - 40rpx) / 3);
					margin-right: 20rpx;
					&:last-child {
						margin-right: 0;
					}
				}
			}
		}
	}
</style>