<!-- 搜索话题结果页 -->
<template>
	<view class="bbs-search-topic-result">
		<!-- 搜索框 -->
		<view class="guide-search-box">
			<fake-search-box :searchVal="searchVal" @clearAll="clearAll"></fake-search-box>
		</view>
		
		<!-- 搜索结果列表 -->
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': '40px', 'padding': '0 25rpx'}" 
		loading-more-default-text="点击加载更多" loading-more-no-more-text="没有更多了" :auto-show-system-loading="true">
			<bbs-topic-card @click.native="toTopicDetail(item.id)" v-for="(item,index) in dataList" :key="index" :topicData="item"></bbs-topic-card>
		</z-paging>
	</view>
</template>

<script>
	import FakeSearchBox from "@/components/common/FakeSearchBox.vue"
	import BbsTopicCard from "@/components/bbs/BbsTopicCard.vue"
	import { searchTopic } from '@/network/api_index.js'
	export default {
		components: {
			FakeSearchBox,
			BbsTopicCard
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
				this.handleSearchTopic(pageNo, pageSize).then(res => {
					this.$refs.paging.complete(res);
				})
			},
			//调搜索话题接口
			handleSearchTopic(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					searchTopic({
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
						console.log('searchTopic: ', err)
					})
				})
			},
			toTopicDetail(id) {
				uni.navigateTo({
					url: `/page_bbs/bbsTopicDetail/bbsTopicDetail?id=${id}`
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
.bbs-search-topic-result {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #F8F8F8;
}
</style>
