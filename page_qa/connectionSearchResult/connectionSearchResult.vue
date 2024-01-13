<!-- 人脉搜索结果页 -->
<template>
	<view class="connection-search-result">
		<!-- 搜索框 -->
		<view class="news-search-box">
			<fake-search-box :searchVal="searchVal" @clearAll="clearAll"></fake-search-box>
		</view>
		
		<!-- 搜索结果列表 -->
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': '40px', 'padding': '0 25rpx'}" 
		loading-more-default-text="点击加载更多" loading-more-no-more-text="没有更多了" :auto-show-system-loading="true">
			<connection-card v-for="(item, index) in dataList" :item="item" :key="index"
			@click.native.stop="toHomepage($event, item.id)"></connection-card>
		</z-paging>
	</view>
</template>

<script>
	import FakeSearchBox from "@/components/common/FakeSearchBox.vue"
	import ConnectionCard from '@/components/qa/ConnectionCard.vue'
	import { searchUser } from '@/network/api_index.js'
	export default {
		components: {
			FakeSearchBox,
			ConnectionCard
		},
		data() {
			return {
				dataList: [],
				searchVal: '',
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
					searchUser({
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
			toHomepage(e, id) {
				//防止冒泡
				e.preventDefault()
				uni.navigateTo({
					url: `/page_infos/homepage/homepage?userId=${id}`
				})
			},
			//切换like状态
			checkoutLike(index, status) {
				this.dataList[index].is_like = status
				if(status) {
					this.dataList[index].likers_count++
				} else {
					this.dataList[index].likers_count--
				}
			},
			//切换collect状态
			checkoutCollect(index, status) {
				this.dataList[index].is_collect = status
				if(status) {
					this.dataList[index].collectors_count++
				} else {
					this.dataList[index].collectors_count--
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
			}
		}
	}
</script>

<style>

</style>
