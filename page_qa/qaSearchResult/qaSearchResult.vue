<!-- 问答搜索结果页 -->
<template>
	<view class="qa-search-result">
		<!-- 搜索框 -->
		<view class="news-search-box">
			<fake-search-box :searchVal="searchVal" @clearAll="clearAll"></fake-search-box>
		</view>
		
		<!-- 搜索结果列表 -->
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': '40px', 'padding': '0 25rpx'}" 
		loading-more-default-text="点击加载更多" loading-more-no-more-text="没有更多了" :auto-show-system-loading="true">
			<common-item-card v-for="(item, index) in dataList" :key="index" :index="index"
			:cardItem="item" @clickMore="clickMore"  @checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
			:showStar="true" :showLeft="true" @click.native="toCardDetail(item, index)"></common-item-card>
		</z-paging>
		
		<!-- 举报面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" type="0"
		@backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	import FakeSearchBox from "@/components/common/FakeSearchBox.vue"
	import { searchArticle, searchArticleNew } from '@/network/api_index.js'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	import CommonItemCard from '@/components/common/CommonItemCard.vue'
	const hostSDKVersion = uni.getStorageSync('hostSDKVersion')
	import { compareVersion } from '@/tools/about_wx.js'
	export default {
		components: {
			FakeSearchBox,
			DeleteAndComplaint,
			CommonItemCard
		},
		data() {
			return {
				dataList: [],
				searchVal: '',
				contentId: ''
			}
		},
		// watch: {
		// 	searchVal(val) {
		// 		this.reloadList()
		// 	}
		// },
		onLoad(option) {
			this.searchVal = option.searchVal
		},
		methods: {
			queryList(pageNo, pageSize) {
				// this.handleSearchArticle(pageNo, pageSize).then(res => {
				// 	this.$refs.paging.complete(res);
				// })
				this.getCommonCardNew(pageNo, pageSize).then(res => {
					// this.$refs.paging.complete(res);
					let noMore = !res.length
					this.$refs.paging.completeByNoMore(res, noMore);
				})
			},
			//调搜索文章接口
			handleSearchArticle(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					searchArticle({
						'es_query': this.searchVal,
						'post_type': 4,
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
			// 获取列表数据（新版）
			getCommonCardNew(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					searchArticleNew({
						'es_query': this.searchVal,
						'post_types':  ["2", "4", "5", "6", "7"],
						'per_page': pageSize,
						'page': pageNo,
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							resolve(res.data.items)
						} else {
							resolve([])
						}
					}, err => {
						resolve([])
						console.log('commonCardNew err: ', err)
					})
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
			},
			// 删除成功，刷新
			backRefresh() {
				this.$refs.paging.reload()
			},
			// 点更多，弹出面板
			// 参数： id, type: 0：帖子，1：评论，2：话题
			clickMore(id, type) {
				this.contentId = id
				this.$refs.deleteAndComplaint.handleLongpress()
			},
			// 去详情
			toCardDetail(item, index) {
				if(item.in_house) {
					// 1-内部链接
					uni.navigateTo({
						url: `/page_qa/questionDetail/questionDetail?id=${item.id}`
					})
				} else {
					// 0-外部链接
					this.toWXLink(item)
				}
			},
			// 跳外部链接
			toWXLink(item) {
				if(this.ifOfficialAccountLink(item)) {
					// 跳外部公众号文章链接
					if(compareVersion(hostSDKVersion, '3.4.8') < 0) {
						// 基础库低于3.4.8，无法打开外链公众号
						wx.showModal({
							title: '提示',
							content: '该内容为微信公众号文章，可从“勾重点”微信小程序打开。。',
							complete(res) {
								// 退出小程序
								// if(wx.exitMiniProgram) {
								// 	wx.exitMiniProgram()
								// }
							} 
						})
					} else {
						if(wx.openOfficialAccountArticle) {
							wx.openOfficialAccountArticle({
								url: item.source_link, // 此处填写公众号文章连接
							})
						}
					}
				}
			},
			// 是否为外部公众号链接
			ifOfficialAccountLink(item) {
				return parseInt(item.in_house) === 0
			},
		}
	}
</script>

<style>

</style>
