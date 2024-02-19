<template>
	<view class="guide-search-result">
		<!-- 搜索框 -->
		<view class="guide-search-box">
			<fake-search-box :searchVal="searchVal" @clearAll="clearAll"></fake-search-box>
		</view>
		
		<!-- 搜索结果列表 -->
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': '40px', 'padding': '0 25rpx'}" 
		loading-more-default-text="点击加载更多" loading-more-no-more-text="没有更多了" :auto-show-system-loading="true">
			<guide-item-card v-for="(item, index) in dataList" :key="index" :index="index"
				:guideItem="item" tabIndex="0" @clickMore="clickMore"
				@checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
			></guide-item-card>
		</z-paging>
		
		<!-- 更多面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" :type="actionType"
		@backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	import FakeSearchBox from "@/components/common/FakeSearchBox.vue"
	import GuideItemCard from '@/components/guide/GuideItemCard.vue'
	import { searchArticle } from '@/network/api_index.js'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	export default {
		components: {
			FakeSearchBox,
			GuideItemCard,
			DeleteAndComplaint
		},
		data() {
			return {
				dataList: [],
				searchVal: '',
				tabIndex: 1,
				contentId: '',		// 传给长按面板的内容id （帖子/评论）
				actionType: 0,		// 长按面板内容类型：0：帖子，1：评论，2：话题
			}
		},
		watch: {
			searchVal(val) {
				this.reloadList()
			}
		},
		onLoad(option) {
			this.searchVal = option.searchVal
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.handleSearchArticle(pageNo, pageSize).then(res => {
					this.$refs.paging.complete(res);
				})
			},
			//调搜索文章接口
			handleSearchArticle(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					searchArticle({
						'es_query': this.searchVal,
						'post_type': this.tabIndex,
						'per_page': pageSize,
						'page': pageNo
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							resolve(res.data.items)
						} else {
							resolve([])
						}
					}, err => {
						resolve([])
						console.log('searchArticle: ', err)
					})
				})
			},
			//切换like状态
			checkoutLike(index, status) {
				this.dataList[index].is_like = status
				if(status) {
					this.dataList[index].likers_count++
				} else {
					this.dataList[index].likers_count = this.dataList[index].likers_count ? this.dataList[index].likers_count-1 : 0
				}
			},
			//切换collect状态
			checkoutCollect(index, status) {
				this.dataList[index].is_collect = status
				if(status) {
					this.dataList[index].collectors_count++
				} else {
					this.dataList[index].collectors_count = this.dataList[index].collectors_count ? this.dataList[index].collectors_count-1 : 0
				}
			},
			reloadList() {
				this.$refs.paging.reload()
			},
			clearAll() {
				// 返回搜索页
				let pages = getCurrentPages()
				//上一页面 
				let prevPage = pages[pages.length - 2]
				prevPage.$vm.searchVal = ''
				uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
				    delta: 1
				});
			},
			// 点更多，弹出面板
			// 参数： id, type: 0：帖子，1：评论，2：话题
			clickMore(id, type) {
				this.contentId = id
				this.actionType = type
				this.$refs.deleteAndComplaint.handleLongpress()
			},
			// 删除成功，刷新
			backRefresh() {
				this.$refs.paging.reload()
			}
		}
	}
</script>

<style lang="less" scoped>
.guide-search-result {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #F8F8F8;
}
</style>
