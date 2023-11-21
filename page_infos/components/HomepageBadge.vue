<!-- 个人主页-徽章 -->
<template>
	<view class="homepage-badge">
		<view class="badge-item" v-for="(item,index) in showBadgeList" :key="index" @tap="showDetail(item)">
			<img :src="item.image_bg" alt="" class="badge-img-bg">
			<img :src="item.image" alt="" class="badge-img-content">
			<view class="badge-name">{{item.name}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			userId: {
				type: String,
				default: ''
			},
			badgeList: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
			}
		},
		computed: {
			showBadgeList() {
				return this.badgeList.slice(0, 8)
			}
		},
		methods: {
			showDetail(item) {
				this.$emit('showBadgeDetail', item)
			}
		}
	}
</script>

<style lang="less" scoped>
	.homepage-badge {
		padding: 0 25rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start; // 替代原先的space-between布局方式
		
		.badge-item {
			flex: 1;
			margin: 30rpx 40rpx 0 0; // 间隙为50rpx
			width: calc((100vw - 150rpx - 60rpx - 50rpx - 28rpx) / 4); // 这里的150rpx = (分布个数4-1)*间隙50rpx, 可以根据实际的分布个数和间隙区调整
			min-width: calc((100vw - 150rpx - 60rpx - 50rpx - 28rpx) / 4); // 加入这两个后每个item的宽度就生效了
			max-width: calc((100vw - 150rpx - 60rpx - 50rpx - 28rpx) / 4); // 加入这两个后每个item的宽度就生效了
			height: calc((100vw - 150rpx - 60rpx - 50rpx - 28rpx) / 4);
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
</style>
