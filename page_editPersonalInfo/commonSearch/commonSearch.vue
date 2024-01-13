<!-- 公共的搜索页面 -->
<template>
	<view class="common-search-container">
		<!-- 搜索框 -->
		<van-search :focus="true" ref="commonSearch" :value="searchVal" placeholder="请输入搜索关键词" @search.native="handleSearch($event.detail)"
		custom-class="common-search" class="common-search-wrap" placeholder-style="color: rgba(0,0,0,0.3);" />
		
		<!-- 搜索历史 -->
		<!-- <view class="common-search-history">
			<view class="common-search-title common-search-history-title">搜索历史</view>
			<view class="common-search-content common-search-history-content">
				<view class="common-search-item common-search-history-item" v-for="(item, index) in historyList" :key="index">{{item}}</view>
			</view>
		</view> -->
		
		<!-- 搜索发现 -->
		<!-- <view class="common-search-find" v-if="findList.length">
			<view class="common-search-title common-search-find-title">搜索发现</view>
			<view class="common-search-content common-search-find-content">
				<view class="common-search-item common-search-find-item" v-for="(item, index) in findList" :key="index">{{item}}</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchVal: '',
				tabIndex: 2,  				//tabIndex: 1-tab1, 2-tab2, 3-tab3, 4-tab4
				searchContentType: 0,	// 0:搜索文章  1:搜索徽章  2:搜索话题
				historyList: ['体育馆预定', '停车泊位', '爱心捐赠', '蚂蚁借呗'],
				findList: ['体育馆预定', '停车泊位', '爱心捐赠', '蚂蚁借呗', '蚂蚁借呗蚂蚁借呗蚂蚁借呗蚂蚁借呗'],
				postId: ''
			}
		},
		onLoad(option) {
			if(option.tabIndex) {
				this.tabIndex = Number(option.tabIndex)
			}
			// if(option.searchVal) {
			// 	this.searchVal = option.searchVal
			// }
			// 徽章或者话题页会传
			if(option.searchContentType) {
				this.searchContentType = Number(option.searchContentType)
			}
			// 问题详情-邀请回答-搜索，带上了postId，跳转6的时候带上
			if(option.postId) {
				this.postId = option.postId
			}
		},
		onUnload() {
			this.searchVal = ''
			this.tabIndex = 2
			this.searchContentType = 0
		},
		methods: {
			handleSearch(searchVal) {
				this.searchVal = searchVal
				let pages = getCurrentPages()
				//上一页面 
				let prevPage = pages[pages.length - 2]
				// 如果搜索值为空，直接返回上一页面
				if(!searchVal) {
					prevPage.$vm.searchVal = ''
					uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
					    delta: 1
					});
					return
				}
				switch(this.searchContentType) {
					case 0:
						// 搜索文章, 跳转文章搜索结果页
						switch(this.tabIndex) {
							case 2:
								// 跳转guide搜索结果页
								uni.navigateTo({
									url: `/page_guide/guideSearchResult/guideSearchResult?searchVal=${searchVal}`
								})
								break
							case 3:
								// 跳转news搜索结果页
								uni.navigateTo({
									url: `/page_news/newsSearchResult/newsSearchResult?searchVal=${searchVal}`
								})
								break
							case 4:
								// 跳转bbs搜索结果页
								uni.navigateTo({
									url: `/page_bbs/bbsSearchResult/bbsSearchResult?searchVal=${searchVal}`
								})
								break
							case 5:
								// 跳转qa搜索结果页
								uni.navigateTo({
									url: `/page_qa/qaSearchResult/qaSearchResult?searchVal=${searchVal}`
								})
								break
							case 6:
								// 跳转人脉搜索结果页
								uni.navigateTo({
									url: `/page_qa/connectionSearchResult/connectionSearchResult?searchVal=${searchVal}&postId=${this.postId}`
								})
								break
						}
						break
					case 1:
						// 搜索徽章, 跳转徽章搜索结果页
						uni.navigateTo({
							url: `/page_aboutBadge/badgeSearchResult/badgeSearchResult?searchVal=${searchVal}`
						})
						break
					case 2:
						// 搜索话题, 跳转话题搜索结果页
						uni.navigateTo({
							url: `/page_bbs/bbsSearchTopicResult/bbsSearchTopicResult?searchVal=${searchVal}`
						})
						break
					default:
						break;
				}
				
			},
			
		}
	}
</script>

<style lang="less" scoped>
.common-search-container {
	padding: 25rpx;
	.common-search-wrap {
		/deep/ .common-search {
			padding-left: 0 !important;
			padding-right: 0 !important;
			line-height: 65rpx !important;
			
			.van-search__content {
				background: #FFFFFF;
				box-shadow: 0rpx 0rpx 9rpx 0rpx rgba(81,211,184,0.05);
				border-radius: 20rpx;
				border: 1rpx solid #E2E2E2 ;
				.van-cell {
					// color: #fff;
				}
			}
		}
	}
	
	.common-search-history {
		margin-top: 50rpx;
	}
	.common-search-find {
		margin-top: 70rpx;
	}
	.common-search-title {
		font-size: 28rpx;
		font-weight: 600;
		color: rgba(0,0,0,0.5);
		line-height: 40rpx;
	}
	.common-search-content {
		margin-top: 40rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		.common-search-item {
			font-size: 26rpx;
			color: rgba(0,0,0,0.8);
			line-height: 37rpx;
			padding: 10rpx 20rpx;
			background: #F8F8F8;
			border-radius: 8rpx;
			margin-right: 20rpx;
			max-width: 200rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			margin-bottom: 20rpx;
		}
	}
}
</style>
