<!-- 我的徽章+徽章库 -->
<template>
	<view class="my-badge-and-badge-library" style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/badgeLibraryBg.png?sign=c56c0c7a5e5f279e9a47efa12f40f4cc&t=1687658695');background-size: 100%;background-color: #F8F8F8;background-repeat: no-repeat;">
		<back-topbar title="所有徽章"></back-topbar>
		<z-paging-swiper :swiper-style="{'top': customBar + 'px'}">
			<template #top>
				<van-tabs :active="active" animated @change.native="tabsChange" ref="tabs"
				line-height="8rpx" line-width="60rpx" class="badge-tabs" :swipeable="true">
					<van-tab title="我的徽章"></van-tab>
					<van-tab title="徽章库"></van-tab>
				</van-tabs>
			</template>
			<swiper class="swiper" :current="active" @animationfinish="swiperAnimationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
					<swiper-list-item ref="swiperItem" :tabIndex="index" :currentIndex="active"></swiper-list-item>
				</swiper-item>
			</swiper>
			
			
		</z-paging-swiper>
		<!-- 徽章详情弹窗 -->
		<badge-detail ref="badgeDetail"></badge-detail>
	</view>
</template>

<script>
	import BadgeLibrary from "@/page_aboutBadge/components/BadgeLibrary.vue"
	import BadgeList from "@/page_aboutBadge/components/BadgeList.vue"
	import BadgeDetail from "@/components/index/BadgeDetail.vue"
	import SwiperListItem from "@/page_aboutBadge/components/SwiperListItem.vue"
	import BackTopbar from '@/components/common/BackTopbar.vue'
	
	let _this = null
	export default {
		components: {
			BadgeLibrary,
			BadgeList,
			BadgeDetail,
			SwiperListItem,
			BackTopbar
		},
		data() {
			return {
				active: 0,
				windowHeight: 0,
				dataList: [],
				tabList: ["我的徽章", "徽章库"],
				customBar: 0,
			}
		},
		onLoad(option) {
			_this = this
			if(option && option.tabIndex) {
				this.active = parseInt(option.tabIndex)
			}
			const {
				windowHeight
			} = uni.getSystemInfoSync();
			this.windowHeight = windowHeight
		},
		onShow() {
			_this = this
			uni.getSystemInfo({
				success: (e) => {
					// #ifdef MP-WEIXIN
					this.statusBar = e.statusBarHeight
					this.windowHeight = e.windowHeight
					// @ts-ignore
					const custom = wx.getMenuButtonBoundingClientRect()
					this.customBar = custom.bottom + custom.top - e.statusBarHeight
					// #endif
				}
			})
		},
		onUnload() {
			uni.$off('showMyBadgeDetail')
			uni.$off('showLibraryDetail')
		},
		mounted() {
			// uni.$on 能够全局响应 uni.$emit 的调用
			uni.$on('showMyBadgeDetail', function(badgeInfo){
				// 我的徽章 - 展示徽章详情
				_this.$refs.badgeDetail.getBadgeDetail(badgeInfo, 1)
			})
			// uni.$on('showMakeBadge', function(){
			// 	uni.navigateTo({
			// 		url: '/page_aboutBadge/makeBadge/makeBadge'
			// 	})
			// })
			uni.$on('showLibraryDetail', function(badgeInfo){
				// 徽章库 - 展示徽章详情
				_this.showBadgeDetail = true
				_this.$refs.badgeDetail.getBadgeDetail(badgeInfo, 2)
			})
		},
		methods: {
			//tabs通知swiper切换
			tabsChange(e) {
				this.active = e.detail.index;
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.active = e.detail.current;
			},
			//制作徽章返回刷新
			refreshOwnBadge() {
				this.$refs.swiperItem[1].$refs.badgeLibrary.getOwnList()
			}
		}
	}
</script>

<style scoped lang="less">
.my-badge-and-badge-library {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	.badge-tabs {
		/deep/ .van-tabs__scroll{
			background: transparent;
			.van-tabs__nav {
				background: transparent;
				width: 50%;
				margin-left: 25rpx;
				.van-tabs__line {
					background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
					bottom: 5px;
				}

				.van-tab {
					font-size: 30rpx;
					color: rgba(0,0,0,0.5);
				}
				.van-tab--active {
					color: #000;
				}
			}
		} 
	}
	.swiper {
		.swiper-item {
			/deep/ .van-tabs__scroll {
				background: transparent;
				// width: calc(100vw - 25rpx - 106rpx);
				padding-left: 25rpx;
				padding-right: 25rpx;
				.van-tab {
					color:#000;
					font-size:24rpx; 
					border-radius:28rpx; 
					background-color: #fff; 
					margin-top:7px; 
					font-weight:normal;
					flex-basis: 16% !important;
					padding: 10rpx 18rpx;
					margin-right: 15rpx;
					box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
					.van-ellipsis {
						line-height: 24rpx
					}
				}
				.van-tab--active {
					color: #fff;
					background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
				}
			}
		}
	}
}
.swiper {
		height: 100%;
	}
</style>
