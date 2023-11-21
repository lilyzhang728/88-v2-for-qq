<!-- 徽章库-查看更多徽章 -->
<template>
	<view class="more-badge">
		<z-paging-swiper>
			<template #top>
				<view class="more-badge-tabs">
					<van-tabs animated :active="active" line-height="0" class="badgelist-tabs" @change.native="changeTab">
					  <van-tab 
					  v-for="(item, index) in tabList" :key="index"
					  :title="item.name"
					  :title-style="index==activeIndex ? tabTitleStyle : tabDefaultStyle">
					  </van-tab>
					</van-tabs>
					<view class="badgelist-search" @click="toSearch"><van-icon name="search" class="badgelist-search-icon" size="40rpx" /></view>
				</view>
			</template>
			<!-- swiper必须设置height:100%，因为swiper有默认的高度，只有设置高度100%才可以铺满页面  -->
			<swiper class="swiper" :current="active" @animationfinish="swiperAnimationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
					<swiper-list-item :ref="'swiper'+index" :title="title" :field="field" :tabIndex="index" :activeIndex="active" :source="source" :badgeType="badgeType" @pageQuery="pageQuery"></swiper-list-item>
				</swiper-item>
			</swiper>
			
			<!-- 徽章详情弹窗 -->
			<badge-detail ref="badgeDetail"></badge-detail>
		</z-paging-swiper>
	</view>
</template>

<script>
	import { type_list } from '@/tools/transform_data.js'
	import '@/common/iconfont.css'
	import BadgeList from "@/page_aboutBadge/components/BadgeList.vue"
	import BadgeDetail from "@/components/index/BadgeDetail.vue"
	import MoreBadgeSwiper from '@/page_aboutBadge/components/MoreBadgeSwiper.vue'
	import ZPInterceptor from '@/uni_modules/z-paging/components/z-paging/js/z-paging-interceptor'
	ZPInterceptor.handleQuery((pageNo, pageSize, from)=>{
		//修改分页参数
		pageSize = 40
		return [pageNo, pageSize, from];
	})
	
	let _this = null
	export default {
		components: {
			BadgeList,
			BadgeDetail,
			'swiper-list-item': MoreBadgeSwiper
		},
		data() {
			return {
				title: '',
				badgeType: 0,
				source: '',
				active: 0,
				tabList: type_list,
				field: 'grade',
				pageSize: 0,
				pageNo: 0,
			}
		},
		onLoad(option) {
			_this = this
			this.title = option.title
			this.badgeType = option.type
			this.source = option.source
			// 动态设置页面标题
			uni.setNavigationBarTitle({
			    title: option.title
			});
		},
		onUnload() {
			uni.$off('showMakeBadge')
			uni.$off('showBadgeLibraryDetail')
		},
		mounted() {
			uni.$on('showMakeBadge', function(){
				// _this.$refs.makeBadge.showDetail = true
				uni.navigateTo({
					url: '/page_aboutBadge/makeBadge/makeBadge'
				})
			})
			uni.$on('showBadgeLibraryDetail', function(badgeInfo) {
				// 展示徽章详情
				_this.$refs.badgeDetail.getBadgeDetail(badgeInfo, 2)
			})
		},
		methods: {
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.active = e.detail.current;
			},
			changeTab(e) {
				this.active = e.detail.index;
				this.field = type_list[e.detail.index].value
				this.refs['swiper'+e.detail.index].reloadList()
			},
			toSearch() {
				uni.navigateTo({
					url: `/page_editPersonalInfo/commonSearch/commonSearch?searchContentType=1`
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
.more-badge {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #F8F8F8;
	.add-badge-icon {
		// width: 60%;
		// height: 60%;
		// border-radius: 50%;
		font-size: 16 / 16rem;
		margin-left: 5px;
	}
	.more-badge-tabs {
		position: relative;
		.badgelist-tabs {
			margin-top: 30rpx;
			/deep/ .van-tabs__scroll {
				background: transparent;
				width: calc(100vw - 25rpx - 106rpx);
				padding-left: 25rpx;
				.van-tab {
					color:#000;
					font-size:24rpx; 
					border-radius:28rpx; 
					background-color: #fff; 
					margin-top:7px; 
					font-weight:normal;
					flex-basis: 20% !important;
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
		.badgelist-search {
			z-index: 99;
			position: absolute;
			right: 0;
			top: -20rpx;
			width: 106rpx;
			height: 106rpx;
			display: flex;
			justify-content: center;
			.badgelist-search-icon {
				width: 70%;
				height: 70%;
				margin-top: 20rpx;
				border-radius: 50%;
				background-color: #fff;
				box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
			}
		}
	}
	
	
}
.swiper {
		height: 100%;
	}
</style>
