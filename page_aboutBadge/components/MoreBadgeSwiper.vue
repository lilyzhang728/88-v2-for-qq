<!-- 更多徽章-swiper-item -->
<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" @query="queryList" loading-more-default-text="点击加载更多" loading-more-no-more-text="没有更多了">
			<badge-list-content :title="title" :dataList="dataList" :badgeType="badgeType"></badge-list-content>
		</z-paging>
	</view>
</template>

<script>
	import { libraryAchievements } from '@/network/api_badge.js'
	import BadgeListContent from "@/components/index/BadgeListContent.vue"
	export default {
		components: {
			BadgeListContent
		},
		props: {
			tabIndex: {
				type: Number,
				required: true,
				default: 0
			},
			activeIndex: {
				type: Number,
				required: true,
				default: 0
			},
			source: {
				type: String,
				required: false,
			},
			badgeType: {
				type: String,
				required: false,
			},
			title: {
				type: String,
				required: false,
			},
			field: {
				type: String,
				default: 'grade',
			},
		},
		data() {
			return {
				dataList: []
			}
		},
		watch: {
			activeIndex(val) {
				//tab切换，刷新列表
				this.reloadList()
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.$emit('pageQuery', pageNo, pageSize)
				console.log('开始请求： ', pageNo, pageSize)
				if(this.tabIndex === this.activeIndex) {
					this.getLibraryBadge(pageNo, Number(pageSize)).then(res => {
						this.$refs.paging.complete(res);
					})
				}
			},
			reloadList() {
				this.$refs.paging.reload()
			},
			// 获取徽章库徽章（徽章库-查看更多）
			getLibraryBadge(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					libraryAchievements({
						'field': this.field,
						'source': this.source,
						'per_page': pageSize,
						'page': pageNo
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							// this.libBadgeList = res.data.items
							resolve(res.data.items)
						} else {
							resolve([])
						}
					}, err => {
						console.log('libraryAchievements: ' + err)
						resolve([])
					})
				})
				
			}
		}
	}
</script>

<style>
</style>
