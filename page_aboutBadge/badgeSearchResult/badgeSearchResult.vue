<!-- 徽章-搜索结果页 -->
<template>
	<view class="badge-search-result">
		<!-- 搜索框 -->
		<view class="badge-search-box">
			<fake-search-box :searchVal="searchVal" @clearAll="clearAll"></fake-search-box>
		</view>
		
		<!-- 搜索结果列表 -->
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': '40px'}" 
		loading-more-default-text="点击加载更多" loading-more-no-more-text="没有更多了" :auto-show-system-loading="true">
			<badge-list-content v-if="dataList.length" title="" :dataList="dataList" badgeType="5"></badge-list-content>
		</z-paging>
		
		<!-- 徽章详情弹窗 -->
		<badge-detail ref="badgeDetail"></badge-detail>
	</view>
</template>

<script>
	import BadgeListContent from "@/components/index/BadgeListContent.vue"
	import BadgeDetail from "@/components/index/BadgeDetail.vue"
	import FakeSearchBox from "@/components/common/FakeSearchBox.vue"
	import { searchBadge } from '@/network/api_index.js'
	let _this = null
	export default {
		components: {
			BadgeListContent,
			BadgeDetail,
			FakeSearchBox
		},
		data() {
			return {
				dataList: [],
				searchVal: ''
			}
		},
		watch: {
			searchVal(val) {
				this.reloadList()
			}
		},
		onLoad(option) {
			_this = this
			// const res =  JSON.parse(option.dataList)
			// if(res && res.length) {
			// 	this.$refs.paging.complete(res)
			// }
			this.searchVal = option.searchVal
		},
		mounted() {
			uni.$on('showBadgeLibraryDetail', function(badgeInfo) {
				// 展示徽章详情
				_this.$refs.badgeDetail.getBadgeDetail(badgeInfo, 2)
			})
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.handleSearchBadge(pageNo, pageSize).then(res => {
					this.$refs.paging.complete(res);
				})
			},
			//调搜索徽章接口
			handleSearchBadge(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					searchBadge({
						'es_query': this.searchVal,
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
			}
		}
	}
</script>

<style lang="less" scoped>
.badge-search-result {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #F8F8F8;
	.badge-search-box {
		
	}
}
</style>
