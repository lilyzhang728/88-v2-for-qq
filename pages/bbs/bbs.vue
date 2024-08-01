<template>
	<view class="bbs"  :style="{backgroundImage: 'url('+backgroundImgUrl+')',backgroundSize: '100% '+backgroundImgHeight,backgroundColor: '#f2f4f8',backgroundRepeat: 'no-repeat'}">
		<z-paging-swiper :swiper-style="{'top': statusBar + 'px'}">
			<template #top>
				<!-- 顶层tab -->
				<van-tabs :active="active" animated @change.native="tabsChange" ref="tabs"
				line-height="8rpx" line-width="60rpx" class="bbs-tabs" :swipeable="true">
					<van-tab title="发现"></van-tab>
					<van-tab title="话题广场"></van-tab>
					<van-tab title="关注"></van-tab>
				</van-tabs>
				
				<!-- 搜索 -->
				<view class="bbs-search">
					<top-search-box @toSearch="toSearch"></top-search-box>
				</view>
			</template>
			<swiper class="swiper" :current="active" @animationfinish="swiperAnimationfinish">
				<swiper-item class="swiper-item">
					<bbs-rec ref="bbsRec" @toTopicList="toTopicList"></bbs-rec>
				</swiper-item>
				<swiper-item class="swiper-item">
					<bbs-topic ref="bbsTopic"></bbs-topic>
				</swiper-item>
				<swiper-item class="swiper-item">
					<bbs-focus ref="bbsFocus"></bbs-focus>
				</swiper-item>
			</swiper>
		</z-paging-swiper>
		
		<!-- 新增攻略按钮 -->
		<side-add-btn @addNew="addNewPost"></side-add-btn>
	
	</view>
</template>

<script>
	import TopSearchBox from '@/components/common/TopSearchBox.vue'
	import SideAddBtn from '@/components/common/SideAddBtn.vue'
	import BbsRec from "@/components/bbs/BbsRec.vue"
	import BbsFocus from "@/components/bbs/BbsFocus.vue"
	import BbsTopic from "@/components/bbs/BbsTopic.vue"
	export default {
		components: {
			TopSearchBox,
			SideAddBtn,
			BbsRec,
			BbsFocus,
			BbsTopic
		},
		data() {
			return {
				backgroundImgUrl: 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/bbs/bbsBg.png?sign=c0f613e91ba42b583649b23d7922d3b2&t=1689556699',
				tabList: ["发现", "收藏", "话题广场"],
				statusBar: 0,
				active: 0,
				searchVal: '',
			}
		},
		computed: {
			backgroundImgHeight() {
				//44:tab， 58:搜索框，25/2:搜索框margin-bottom, 44:子tab
				let height = Number(this.statusBar) + 44 + (58-25/2)
				// return this.active === 2 ? (height+44) + 'px' : height + 'px'
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
			},
			swiperAnimationfinish(e) {
				this.active = e.detail.current;
			},
			//发帖
			addNewPost(e) {
				e.preventDefault();
				uni.navigateTo({
					url: '/page_bbs/addNewPost/addNewPost'
				});
			},
			//切到话题列表
			toTopicList() {
				this.active = 1
			},
			// 搜索帖子
			toSearch() {
				// 0:搜索文章  1:搜索徽章  2:搜索话题
				const searchContentType = this.active ? 2 : 0	
				//tabIndex: 1-tab1, 2-tab2, 3-tab3, 4-tab4
				uni.navigateTo({
					url: `/page_editPersonalInfo/commonSearch/commonSearch?tabIndex=4&searchVal=${this.searchVal}&searchContentType=${searchContentType}`
				})
			},
			// 删帖后返回刷新
			backRefresh(postIndex) {
				this.active = 0
				this.$refs.bbsRec.deleteSinglePost(postIndex)
			}
		}
	}
</script>

<style lang="less" scoped>
.bbs {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	.bbs-tabs {
		/deep/ .van-tabs__scroll{
			background: transparent;
			.van-tabs__nav {
				background: transparent;
				width: 70%;
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
	.bbs-subTabs {
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
	
	.bbs-search {
		margin: 10px 25rpx;
		/deep/ .top-search-box {
			box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.35) !important;
		}
	}
	.swiper {
		height: 100%;
	}
	
}
</style>
