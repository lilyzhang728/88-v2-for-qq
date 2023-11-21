<!-- 我的徽章 -->
<template>
	<view class="badge-list">
		<!-- <view style="z-index: 100;position: sticky;top :0;"> -->
			<van-tabs sticky :active="activeIndex" line-height="0" class="badgelist-tabs" @change.native="changeTab">
			  <van-tab 
			  v-for="(item, index) in tabTitleList" :key="index"
			  :title="item.name">
			  </van-tab>
			</van-tabs>
		<!-- </view> -->
		
		<!-- <view class="badgelist-search" @click="toSearch" ><van-icon name="search" class="badgelist-search-icon" size="40rpx" /></view> -->
		
		<badge-list-content v-if="dataList.length > 0" :badgeType="badgeType" :myBadgeList="myBadgeList" :libBadgeList="libBadgeList"
		:dataList="dataList"></badge-list-content>
	</view>
</template>

<script>
	import BadgeListContent from "@/components/index/BadgeListContent.vue"
	import { type_list } from '@/tools/transform_data.js'
	export default {
		components: {
			BadgeListContent
		},
		props: {
			title: {
				type: String,
				required: false,
			},
			badgeType: {
				type: String,
				required: false,
			},
			source: {
				type: String,
				required: false,
			},
			dataList: {
				type: Array,
				required: true,
				default: []
			}
		},
		data() {
			return {
				tabTitleList: type_list,
				activeIndex: 0,
				myBadgeList: [],	//我的徽章列表
				libBadgeList: [],	//徽章库-更多列表
			}
		},
		computed: {
			tabTitleStyle() {
				return 'color:#fff; font-size:24rpx; border-radius:28rpx; background-color: #2FC2C5; height:50rpx; line-height:50rpx; margin-top:7px; font-weight:normal;'
			},
			tabDefaultStyle() {
				return 'color:#000; font-size:24rpx; border-radius:28rpx; background-color: #fff; height:50rpx; line-height:50rpx; margin-top:7px; font-weight:normal;'
			},
			isMyBadge() {
				// true - 我的徽章， false - 徽章库
				return this.badgeType == undefined || this.badgeType == "" || this.badgeType == null
			}
		},
		methods: {
			changeTab(param) {
				this.activeIndex = param.detail.index
				this.$emit('changeTab', type_list[param.detail.index].value)
			},
			// toSearch() {
			// 	this.$emit('toSearch')
			// }
		}
	}
</script>

<style lang="less" scoped>
	.badge-list {
		margin-top: 2px;
		position: relative;
		// .badgelist-search {
		// 	z-index: 99;
		// 	position: absolute;
		// 	right: 0;
		// 	top: -20rpx;
		// 	width: 106rpx;
		// 	height: 106rpx;
		// 	display: flex;
		// 	justify-content: center;
		// 	.badgelist-search-icon {
		// 		width: 70%;
		// 		height: 70%;
		// 		margin-top: 20rpx;
		// 		border-radius: 50%;
		// 		background-color: #fff;
		// 		box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
		// 	}
		// }
	}
</style>