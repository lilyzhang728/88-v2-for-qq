<!-- 我的徽章 -->
<template>
	<view class="badge-box">
		<view class="badge-title">
			<text class="badge-title-left">我的徽章</text>
			<text class="badge-title-right" @tap="toMyBadge" v-if="showBadgeList.length">查看/添加更多徽章 > </text>
		</view>
		<view class="badge-content" v-if="showBadgeList.length">
			<view class="badge-item" v-for="(item,index) in showBadgeList" :key="index" @tap="showDetail(item)">
				<img :src="item.image_bg" alt="" class="badge-img-bg">
				<img :src="item.image" alt="" class="badge-img-content">
				<view class="badge-name">{{item.name}}</view>
			</view>
		</view>
		<view class="badge-content-empty" v-if="!showBadgeList.length">
			<view class="badge-content-empty-text">您还没有佩戴徽章，赶快到徽章库添加属于您的徽章吧！</view>
			<van-button color="linear-gradient(to right, #2FC2C5, #37C9A3)" size="small" @click.native="toMyBadge">去徽章库</van-button>
		</view>
	</view>
</template>

<script>
	import { getBadgeList } from "@/network/api_index.js"
	export default {
		props: {
			userId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				badgeList: []
			}
		},
		computed: {
			showBadgeList() {
				return this.badgeList.slice(0, 8)
			}
		},
		watch: {
			userId(val) {
				if(val) {
					this.getUserBadgeList()
				}
			}
		},
		created() {
			if(this.userId) {
				this.getUserBadgeList()
			}
		},
		methods: {
			getUserBadgeList() {
				getBadgeList({
					'per_page': 8,
					'page': 1,
					'userId': this.userId
				}).then(res => {
					if(res.code == 0 && Object.keys(res.data).length) {
						this.badgeList = res.data.items
					}
				}, err => {
					console.log('getBadgeList', err)
				})
			},
			toMyBadge() {
				uni.navigateTo({
					url: '/page_aboutBadge/myBadgeAndBadgeLibrary/myBadgeAndBadgeLibrary'
				});
			},
			showDetail(item) {
				this.$emit('showBadgeDetail', item)
			}
		}
	}
</script>

<style scoped lang="less">
	.badge-box {

		.badge-title {
			display: flex;
			justify-content: space-between;
			.badge-title-left {
				color: rgba(0, 0, 0);
				font-size: 30rpx;
				font-weight: bold;
			}
			.badge-title-right {
				color: rgba(0, 0, 0, 0.60);
				font-size: 22rpx;
			}
		}

		.badge-content {
			padding: 0 25rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start; // 替代原先的space-between布局方式

			.badge-item {
				flex: 1;
				margin: 30rpx 50rpx 0 0; // 间隙为50rpx
				width: calc((100vw - 150rpx - 60rpx - 50rpx) / 4); // 这里的150rpx = (分布个数4-1)*间隙50rpx, 可以根据实际的分布个数和间隙区调整
				min-width: calc((100vw - 150rpx - 60rpx - 50rpx) / 4); // 加入这两个后每个item的宽度就生效了
				max-width: calc((100vw - 150rpx - 60rpx - 50rpx) / 4); // 加入这两个后每个item的宽度就生效了
				height: calc((100vw - 150rpx - 60rpx - 50rpx) / 4);
				text-align: center;
				position: relative;
				&:nth-child(4n) {
					// 去除第4n个的margin-right
					margin-right: 0;
				}

				.badge-img-content {
					width: 70%;
					height: 70%;
					position: absolute;
					left: 15%;
					top: 0;
				}
				.badge-img-bg {
					width: 70%;
					height: 70%;
					position: absolute;
					left: 15%;
					top: 0;
				}

				.badge-name {
					width: 100%;
					font-size: 24rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					text-align: center;
					position: absolute;
					top: 80%;
				}
			}
		}
		.badge-content-empty{
			margin-top: 20rpx;
			border: 1px solid #51D3B8;
			border-radius: 20rpx;
			background-color: #F6FFFE;
			height: 224rpx;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-items: center;
			align-items: center;
			.badge-content-empty-text {
				text-align: center;
				color: rgba(0, 0, 0, 0.80);
				width: 492rpx;
				line-height: 42rpx;
				margin: 36rpx 0 22rpx 0;
				font-size: 26rpx;
			}
		}
	}
</style>
