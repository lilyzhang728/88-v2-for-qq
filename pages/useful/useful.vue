<!-- 干货页，包含：攻略，资讯，2个子tab -->
<template>
	<view class="useful"  :style="{backgroundImage: 'url('+backgroundImgUrl+')',backgroundSize: '100% '+backgroundImgHeight,backgroundColor: '#f8f8f8',backgroundRepeat: 'no-repeat'}">
		<z-paging-swiper :swiper-style="{'top': statusBar + 'px'}">
			<template #top>
				<!-- 顶层tab -->
				<van-tabs :active="active" animated @change.native="tabsChange" ref="tabs"
				line-height="8rpx" line-width="60rpx" class="useful-tabs" :swipeable="true">
					<van-tab title="资讯"></van-tab>
					<!-- <van-tab title="资讯"></van-tab> -->
				</van-tabs>
				
				<!-- 搜索 -->
				<view class="useful-search">
					<top-search-box tabIndex="3" @toSearch="toSearch"></top-search-box>
				</view>
				
				<!-- 子tab -->
				<van-tabs :active="subActive" animated @change.native="subTabsChange" ref="subTabs"
				line-height="0" line-width="0" class="useful-subTabs" :swipeable="false">
					<van-tab :title="item" v-for="(item, index) in subTabList" :key="index"></van-tab>
				</van-tabs>
			</template>
			
			<!-- useful列表 -->
			<swiper class="swiper" :current="active" @animationfinish="swiperAnimationfinish">
				<swiper-item class="swiper-item">
					<useful-guide ref="guide" :subActive="subActive" :currentIndex="active" @loaded="showLoading=false"></useful-guide>
					<view class="loading-wrapper" v-if="showLoading">
					  <van-loading type="spinner" color="#35C8A7" />
					</view>
				</swiper-item>
				<!-- <swiper-item class="swiper-item">
					<useful-news ref="news" :subActive="subActive" :currentIndex="active"></useful-news>
				</swiper-item> -->
			</swiper>
		</z-paging-swiper>
			
		<!-- toast提示 -->
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import PageTabs from '@/components/common/PageTabs.vue'
	import UsefulGuide from '@/components/useful/UsefulGuide.vue'
	import UsefulNews from '@/components/useful/UsefulNews.vue'
	import TopSearchBox from '@/components/common/TopSearchBox.vue'
	import Toast from '@/wxcomponents/vant/toast/toast'
	export default {
		components: {
			PageTabs,
			UsefulGuide,
			UsefulNews,
			TopSearchBox
		},
		data() {
			return {
				backgroundImgUrl: 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/news/newsBg.png?sign=8d29dfa78445d34a014f34744b633a8b&t=1688955606',
				slotName: ['guide', 'news'],
				active: 0,
				subActive: 0,
				showLoading: true
			}
		},
		computed: {
			// 状态栏高度
			statusBar() {
				return uni.getStorageSync('statusBar')
			},
			backgroundImgHeight() {
				//44:父tab， 55:搜索框， 44:子tab
				let height = Number(this.statusBar) + 44 + 55 + 44
				return height + 'px'
			},
			guideFieldList() {
				// 0-推荐, 1-考研, 2-实习工作, 3-校园指南 4-成绩学术 5-竞赛证书 6-考公/编 7-其他
				return ['推荐', '考研', '实习工作', '校园指南', '成绩学术', '竞赛证书', '考公/编', '其他']
			},
			newsFieldList() {
				return ['推荐', '考研', '实习工作', '考公/编']
			},
			subTabList() {
				// return this.active ? this.newsFieldList : this.guideFieldList
				return this.newsFieldList
			}
		},
		methods: {
			tabsChange(e) {
				this.active = e.detail.index;
				this.subActive = 0
			},
			subTabsChange(e) {
				this.subActive = e.detail.index;
				// 更新list
				this.reloadList()
				this.showLoading = true
			},
			// 更新list
			reloadList() {
				// if(this.active) {
				// 	this.$refs.news.$refs.paging.reload()
				// } else {
				// 	this.$refs.guide.$refs.paging.reload()
				// }
				this.$refs.guide.$refs.paging.reload()
			},
			swiperAnimationfinish(e) {
				this.active = e.detail.current;
			},
			toSearch() {
				//tabIndex: 3-news, 2-guide
				// let tabIndex = this.active ? 3 : 2
				uni.navigateTo({
					url: `/page_editPersonalInfo/commonSearch/commonSearch?tabIndex=2&searchVal=${this.searchVal}`
				})
			},
			toastMsg(type) {
				if(type) {
					Toast('发布成功！')
				} else {
					Toast('发布失败')
				}
			},
			// 删帖后返回刷新
			backRefresh(type) {
				this.active = type == 'guide' ? 0 : 1
				this.reloadList()
			}
		}
	}
</script>

<style lang="less" scoped>
.useful {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	.useful-tabs {
		/deep/ .van-tabs__scroll{
			background: transparent;
			.van-tabs__nav {
				background: transparent;
				width: 50%;
				// margin-left: 25rpx;
				.van-tabs__line {
					// background: #fff;
					// bottom: 5px;
					display: none;
				}
	
				.van-tab {
					font-size: 36rpx;
					color: #fff;
					padding: 0;
					padding-left: calc(25rpx + 15px);
					text-align: left;
				}
				.van-tab--active {
					color: #fff;
				}
			}
		} 
	}
	.useful-subTabs {
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
					flex-basis: auto !important;
					padding: 10rpx 15rpx;
					margin-right: 15rpx;
					.van-ellipsis {
						line-height: 24rpx;
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
	.useful-search {
		margin: 10px 25rpx;
	}
	.swiper {
		height: 100%;
	}
	.loading-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
}
</style>
