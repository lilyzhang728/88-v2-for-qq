<!-- 假搜索框 -->
<template>
	<view class="fake-search-box">
		<view class="fake-search">
			<view class="fake-search-text" @click="goBack">{{searchVal}}</view>
			<van-icon class="fake-search-icon" size="24rpx" color="#c1c1c1" name="clear" @click.native="handleClear" />
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			searchVal: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
			}
		},
		methods: {
			handleClear() {
				this.$emit('clearAll')
			},
			// 回到搜索页
			goBack() {
				// 返回搜索页
				let pages = getCurrentPages()
				//上一页面 
				let prevPage = pages[pages.length - 2]
				prevPage.$vm.searchVal = this.searchVal
				uni.navigateBack({ 
				    delta: 1
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.fake-search-box {
		height: 36px;
		padding: 0 25rpx;
		box-shadow: 0rpx 0rpx 15rpx 0rpx rgba(81, 211, 184, 0.1);
		.fake-search {
			padding-left: 25rpx;
			padding-right: 25rpx;
			height: 100%;
			background-color: #fff;
			color: #323233;
			font-size: 28rpx;
			border-radius: 20rpx;
			display: flex;
			align-items: center;
			.fake-search-text {
				flex: 1;
				white-space: nowrap;
			}
			.fake-search-icon {
				width: 30rpx;
			}
		}
	}
</style>
