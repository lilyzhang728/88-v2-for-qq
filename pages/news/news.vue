<template>
	<view class="news"  :style="{backgroundImage: 'url('+backgroundImgUrl+')',backgroundSize: '100% '+backgroundImgHeight,backgroundColor: '#fff',backgroundRepeat: 'no-repeat'}">
		<z-paging-swiper :swiper-style="{'top': statusBar + 'px'}">
			<template #top>
				<!-- 顶层tab -->
				<van-tabs :active="active" animated @change.native="tabsChange" ref="tabs"
				line-height="8rpx" line-width="60rpx" class="news-tabs" :swipeable="true">
					<van-tab title="发现"></van-tab>
					<van-tab title="收藏"></van-tab>
				</van-tabs>
				
				<!-- 搜索 -->
				<view class="news-search">
					<top-search-box tabIndex="3" @toSearch="toSearch"></top-search-box>
				</view>
				<!-- <van-search :value="searchVal" placeholder="请输入搜索关键词" background="transparent" @click.native="toSearch"
				custom-class="news-search" class="news-search-wrap" placeholder-style="color: rgba(255,255,255,0.6);" /> -->
				
				<!-- 子tab -->
				<van-tabs :active="subActive" animated @change.native="subTabsChange" ref="subTabs"
				line-height="0" line-width="0" class="news-subTabs" :swipeable="false">
					<van-tab title="考研" class="news-subTab-first"></van-tab>
					<van-tab title="找工作"></van-tab>
					<van-tab title="出国"></van-tab>
					<van-tab title="考公/编"></van-tab>
				</van-tabs>
			</template>
			
			<!-- news列表 -->
			<swiper class="swiper" :current="active" @animationfinish="swiperAnimationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
					<swiper-list-item ref="swiperItem" :tabIndex="index" :currentIndex="active" :subActive="subActive" @pageQuery="pageQuery"></swiper-list-item>
				</swiper-item>
			</swiper>
			
		</z-paging-swiper>
	</view>
</template>

<script>
	import NewsSwiperItem from "@/components/news/NewsSwiperItem.vue"
	import TopSearchBox from '@/components/common/TopSearchBox.vue'
	export default {
		components: {
			'swiper-list-item': NewsSwiperItem,
			TopSearchBox
		},
		data() {
			return {
				backgroundImgUrl: 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/news/newsBg.png?sign=8d29dfa78445d34a014f34744b633a8b&t=1688955606',
				tabList: ["发现", "收藏"],
				statusBar: 0,
				active: 0,
				subActive: 0,
				searchVal: '',
				pageSize: 0,
				pageNo: 0,
				noRefresh: false,	//从后个tab查回来会自动跳到第一个tab，此时不需要请求列表
			}
		},
		computed: {
			backgroundImgHeight() {
				//44:父tab， 55:搜索框， 44:子tab
				let height = Number(this.statusBar) + 44 + 55 + 44
				return height + 'px'
			}
		},
		onShow() {
			uni.getSystemInfo({
				success: (e) => {
					// #ifdef MP-WEIXIN
					this.statusBar = e.statusBarHeight
					// #endif
				}
			})
		},
		methods: {
			tabsChange(e) {
				this.active = e.detail.index;
				if(this.noRefresh) {
					this.noRefresh = !this.noRefresh
				} else {
					// 更新list
					this.$refs.swiperItem[e.detail.index].$refs.paging.reload()
				}
			},
			subTabsChange(e) {
				this.subActive = e.detail.index;
				// 更新list
				this.$refs.swiperItem[this.active].$refs.paging.reload()
			},
			swiperAnimationfinish(e) {
				this.active = e.detail.current;
			},
			toSearch() {
				//tabIndex: 1-tab1, 2-tab2, 3-tab3, 4-tab4
				uni.navigateTo({
					url: `/page_editPersonalInfo/commonSearch/commonSearch?tabIndex=3&searchVal=${this.searchVal}`
				})
			},
			// 同步pageNo, pageSize
			pageQuery(pageNo, pageSize) {
				this.pageNo = pageNo
				this.pageSize = pageSize
			}
		}
	}
</script>

<style lang="less" scoped>
.news {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	.news-tabs {
		/deep/ .van-tabs__scroll{
			background: transparent;
			.van-tabs__nav {
				background: transparent;
				width: 50%;
				// margin-left: 25rpx;
				.van-tabs__line {
					background: #fff;
					bottom: 5px;
				}
	
				.van-tab {
					font-size: 36rpx;
					color: #fff;
					padding: 0;
				}
				.van-tab--active {
					color: #fff;
				}
			}
		} 
	}
	.news-subTabs {
		/deep/ .van-tabs__scroll{
			background: transparent;
			.van-tabs__nav {
				background: transparent;
				padding-left: 25rpx;
				.van-tab {
					color:#fff;
					font-size:24rpx; 
					border-radius:28rpx; 
					margin-top:15rpx; 
					flex-basis: 15% !important;
					padding: 10rpx 15rpx;
					margin-right: 15rpx;
					.van-ellipsis {
						line-height: 24rpx
					}
					
				}
				.van-tab--active {
					color: #fff;
					background: rgba(255,255,255,0.3);
					border-radius: 28rpx;
				}
			}
		}
	}
	// .news-search-wrap {
	// 	/deep/ .news-search {
	// 		padding-left: 0 !important;
	// 		padding-right: 0 !important;
	// 		line-height: 65rpx !important;
	// 		margin: 0 25rpx !important;
			
	// 		.van-search__content {
	// 			background: rgba(255,255,255,0.2);
	// 			border-radius: 20rpx;
	// 			border: 1rpx solid rgba(255,255,255,0.6);
	// 			.van-cell {
	// 				color: #fff;
	// 			}
	// 		}
	// 	}
	// }
	.news-search {
		margin: 10px 25rpx;
	}
	.swiper {
		height: 100%;
	}
}
</style>
