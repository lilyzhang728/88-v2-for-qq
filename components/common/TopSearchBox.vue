<!-- 页面顶部搜索栏 -->
<template>
	<view class="top-search-box" :class="{'top-search-box-news': tabIndex == 3}" @click="toCommonSearch">
		<view class="top-search">
			<van-icon class="top-search-icon" size="30rpx" :color="tabIndex == 3 ? '#fff' : '#535353'" name="search" />
			<view class="top-search-text" :class="{'top-search-text-news': tabIndex == 3}">{{placeholder}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			//1-tab1, 2-tab2, 3-tab3, 4-tab4
			tabIndex: {
				type: Number,
				default: 2
			}
		},
		data() {
			return {
				placeholder: '请输入搜索关键词'
			}
		},
		methods: {
			// 点击搜索框，直接跳转搜索页
			toCommonSearch() {
				this.$emit('toSearch')
			}
		}
	}
</script>

<style lang="less" scoped>
	.top-search-box {
		height: 38px;
		padding: 9px 15px;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 5px 0rpx rgba(81,211,184,0.1);
		border-radius: 10px;
		box-sizing: border-box;
		.top-search {
			height: 100%;
			display: flex;
			align-items: center;
			.top-search-text {
				color: rgba(0,0,0,0.3);
				font-size: 13px;
				flex: 1;
				white-space: nowrap;
				line-height: 19px;
			}
			.top-search-icon {
				width: 15px;
				margin-right: 15px;
			}
		}
	}
	.top-search-box-news {
		height: 33px !important;;
		padding: 9px 15px !important;;
		background: rgba(255,255,255,0.2) !important;;
		border-radius: 10px !important;;
		border: 1px solid rgba(255,255,255,0.6) !important;;
		box-sizing: border-box !important;;
		.top-search-text-news {
			font-size: 12px !important;;
			color: rgba(255,255,255,0.6) !important;
			line-height: 17px !important;;
		}
	}
</style>
