<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<badge-list :dataList="dataList" v-if="currentIndex===0" @changeTab="changeTab" @toSearch="toSearch"></badge-list>
			<badge-library ref="badgeLibrary" :dataList="dataList" v-if="currentIndex===1"></badge-library>
		</z-paging>
	</view>
</template>

<script>
	import BadgeList from "@/page_aboutBadge/components/BadgeList.vue"
	import BadgeLibrary from "@/page_aboutBadge/components/BadgeLibrary.vue"
	import { collectedAchievements, libraryAchievements } from '@/network/api_badge.js'
	import ZPInterceptor from '@/uni_modules/z-paging/components/z-paging/js/z-paging-interceptor'
	ZPInterceptor.handleQuery((pageNo, pageSize, from)=>{
		//修改分页参数
		pageSize = 50
		return [pageNo, pageSize, from];
	})
	
	export default {
		components: {
			BadgeList,
			BadgeLibrary
		},
		props: {
			// 0: 我的徽章  1：徽章库
			currentIndex: {
				type: Number,
				required: true,
				default: 0
			},
			tabIndex: {
				type: Number,
				required: true,
				default: 0
			},
		},
		data() {
			return {
				dataList: [],
				filed: 'grade',
				pageSize: 0,
				pageNo: 0,
			}
		},
		watch: {
			currentIndex(val) {
				//tab切换，刷新列表
				this.reloadList()
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.pageNo = pageNo
				this.pageSize = pageSize
				if(this.tabIndex === this.currentIndex) {
					console.log('开始请求： ', pageNo, pageSize)
					this.pageNo = pageNo
					this.pageSize = Number(pageSize)
					if(this.currentIndex) {
						// currentIndex===1： 徽章库
						this.$refs.badgeLibrary.getOfficialList()
						this.$refs.badgeLibrary.getRecList()
						this.$refs.badgeLibrary.getOwnList()
					} else {
						// currentIndex===0： 我的徽章
						this.getMyBadge(pageNo, Number(pageSize)).then(res => {
							this.$refs.paging.complete(res);
						})
					}
				}
				
			},
			// 获取我的徽章
			getMyBadge(pageNo, pageSize) {
				//TODO：field参数待定
				return new Promise((resolve, reject) => {
					collectedAchievements({
						'per_page': pageSize,
						'page': pageNo,
						'field': this.filed
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							// this.myBadgeList = res.data.items
							resolve(res.data.items)
						} else {
							resolve([])
						}
					}, err => {
						console.log(err)
						resolve([])
					})
				})
			},
			// 获取徽章库徽章（徽章库-查看更多）
			// getLibraryBadge(pageNo, pageSize) {
			// 	//TODO：field参数待定
			// 	return new Promise((resolve, reject) => {
			// 		libraryAchievements({
			// 			'field': "grades",
			// 			'source': this.source,
			// 			'per_page': pageSize,
			// 			'page': pageNo
			// 		}).then(res => {
			// 			if(res.code === 0 && Object.keys(res.data).length) {
			// 				// this.libBadgeList = res.data.items
			// 				resolve(res.data.items)
			// 			} else {
			// 				resolve([])
			// 			}
			// 		}, err => {
			// 			console.log('libraryAchievements: ' + err)
			// 			resolve([])
			// 		})
			// 	})
			// },
			reloadList() {
				this.$refs.paging.reload()
			},
			changeTab(filed) {
				this.filed = filed
				this.reloadList()
			},
			toSearch() {
				// uni.navigateTo({
				// 	url: `/page_editPersonalInfo/commonSearch/commonSearch?pageNo=${this.pageNo}&pageSize=${this.pageSize}&searchContentType=1`
				// })
			}
		}
	}
</script>

<style>
</style>
