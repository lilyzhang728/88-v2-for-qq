<template>
	<view class="guide-wrap" style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/guide/guideBg.png?sign=71e600a50a8b225db7fbee09ef45653e&t=1687920580');background-size: 100%;background-color: #F8F8F8;background-repeat: no-repeat;">
		<z-paging-swiper :swiper-style="{'top': statusBar + 'px'}">
			<template #top>
				<!-- 选项卡 -->
				<van-tabs :active="active" animated @change.native="changeTab"
				line-height="8rpx" line-width="60rpx" class="guide-tabs" :swipeable="true" >
				  <van-tab title="发现攻略" class="guide-tabs-item"></van-tab>
				  <van-tab title="我的收藏"></van-tab>
				  <van-tab title="我的创作"></van-tab>
				</van-tabs>
				
				<!-- 搜索 -->
				<view class="guide-search">
					<top-search-box @toSearch="toSearch"></top-search-box>
				</view>
				<!-- <van-search :value="searchVal" background="transparent" @click.native="toSearch"
				custom-class="guide-search" class="guide-search-wrap" placeholder="请输入搜索关键词" /> -->

			</template>
			<swiper class="swiper" :current="active" @animationfinish="swiperAnimationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
					<swiper-list-item ref="swiperItem" :tabIndex="index" :currentIndex="active" @openOptionSheet="openOptionSheet" @pageQuery="pageQuery"></swiper-list-item>
				</swiper-item>
			</swiper>
		</z-paging-swiper>
		
		<!-- 新增攻略按钮 -->
		<side-add-btn @addNew="addNewGuide"></side-add-btn>		
		
		<!-- 选项面板:编辑/删除 -->
		<van-action-sheet
			:show="showOptionSheet"
			:actions="actions"
			@close.native="closeOptionSheet"
			@select.native="selectOptionSheet"
			@cancel.native="closeOptionSheet"
			cancel-text="取消"
		/>
		
		<!-- toast提示 -->
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import GuideSwiperItem from '@/components/guide/GuideSwiperItem.vue'
	import TopSearchBox from '@/components/common/TopSearchBox.vue'
	import { deleteGuide } from '@/network/api_guide.js'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import SideAddBtn from '@/components/common/SideAddBtn.vue'
	export default {
		components: {
			'swiper-list-item': GuideSwiperItem,
			TopSearchBox,
			SideAddBtn
		},
		data() {
			return {
				statusBar: 0,		// 状态栏高度
				menuButtonWidth: 0,	// 小程序右上角胶囊宽度
				active: 0,
				tabList: ['发现', '我的收藏', '我的创作'],
				searchVal: '',
				showOptionSheet: false,		//是否展开选项面板（编辑、删除）
				actions: [{
					name: '编辑',
					value: 0
				},
				{
					name: '删除',
					value: 1
				}],
				swiperIndex: 0,		//当前长按的swiper的index
				cardIndex: 0,		//当前长按的card的index
				openGuideId: 0,		//打开选项面板的攻略id，删除攻略用
				curStatus: 0,		//打开选项面板的攻略status,跳转编辑页用，能及时显示按钮（不用等接口返回再切换1个/2个按钮
				pageSize: 0,
				pageNo: 0,
				noRefresh: false,	//从后2个tab查回来会自动跳到第一个tab，此时不需要请求列表
			};
		},
		onShow() {
			uni.getSystemInfo({
				success: (e) => {
					// #ifdef MP-WEIXIN
					this.statusBar = e.statusBarHeight
					// @ts-ignore
					const custom = wx.getMenuButtonBoundingClientRect()
					this.menuButtonWidth = custom.width
					// #endif
				}
			})
		},
		methods: {
			//tabs通知swiper切换
			changeTab(e) {
				this.active = e.detail.index;
				if(this.noRefresh) {
					this.noRefresh = !this.noRefresh
				} else {
					// 更新list
					this.$refs.swiperItem[e.detail.index].$refs.paging.reload()
				}
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.active = e.detail.current;
			},
			// 创建guide
			addNewGuide(e) {
				e.preventDefault();
				uni.navigateTo({
					url: '/page_guide/guideEdit/guideEdit'
				});
			},
			//长按打开选项面板
			openOptionSheet(swiperIndex, cardIndex, guideId, status) {
				this.swiperIndex = swiperIndex
				this.cardIndex = cardIndex
				this.showOptionSheet = true
				this.openGuideId = guideId
				this.curStatus = status
			},
			//选择选项面板
			selectOptionSheet(e) {
				if(e.detail.value) {
					// 删除
					deleteGuide(this.openGuideId).then(res => {
						if(res.code === 0) {
							//toast提示：删除成功，从列表里删除
							Toast('删除成功')
							this.$refs.swiperItem[this.swiperIndex].dataList.splice(this.cardIndex, 1)
						} else {
							Toast('删除失败，请重试~')
						}
					}, err => {
						Toast('删除失败')
						console.log('deleteRequest: ', err)
					})
				} else {
					// 编辑，去编辑页
					let guideId = this.$refs.swiperItem[this.swiperIndex].dataList[this.cardIndex].id
					uni.navigateTo({
						url: `/page_guide/guideEdit/guideEdit?guideId=${guideId}&active=${this.active}$status=${this.curStatus}`
					});
				}
			},
			//关闭选项面板
			closeOptionSheet(e) {
				this.showOptionSheet = false
			},
			//reload
			reloadList() {
				this.$refs.swiperItem[this.active].$refs.paging.reload()
			},
			//搜索
			toSearch() {
				//tabIndex: 1-tab1, 2-tab2, 3-tab3, 4-tab4
				uni.navigateTo({
					url: `/page_editPersonalInfo/commonSearch/commonSearch?tabIndex=2&searchVal=${this.searchVal}`
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
.guide-wrap {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	.guide-tabs {
		/deep/ .van-tabs__scroll{
			background: transparent;
			.van-tabs__nav {
				background: transparent;
				width: 65%;
				// margin-left: 25rpx;
				.van-tabs__line {
					background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
					bottom: 5px;
				}
	
				.van-tab {
					font-size: 36rpx;
					color: rgba(0,0,0,0.5);
					padding: 0;
				}
				.van-tab--active {
					color: #000;
				}
			}
		} 
	}
	// .guide-search-wrap {
	// 	/deep/ .guide-search {
	// 		padding-left: 0 !important;
	// 		padding-right: 0 !important;
	// 		line-height: 75rpx !important;
	// 		margin: 0 25rpx !important;
			
	// 		.van-search__content {
	// 			box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(81,211,184,0.1) !important;
	// 			border-radius: 20rpx !important;
	// 			// .van-cell {
	// 			// 	padding: 0 !important;
	// 			// 	line-height: 75rpx !important;
	// 			// }
	// 		}
	// 	}
	// }
	
	.guide-search {
		margin: 10rpx 25rpx;
	}
	
	.swiper {
		height: 100%;
	}
	
}
</style>
