<template>
	<view class="infos-collect-list">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'padding': '20rpx 25rpx'}">
			<infos-collect-card v-for="(item,index) in dataList" :key="index" :item="item"></infos-collect-card>
		</z-paging>
	</view>
</template>

<script>
	import InfosCollectCard from "@/page_infos/components/InfosCollectCard.vue"
	import { collectList } from "@/network/api_infos.js"
	export default {
		components: {
			InfosCollectCard
		},
		data() {
			return {
				dataList: []
			}
		},
		onLoad(option) {
			// 动态设置页面标题
			uni.setNavigationBarTitle({
				title: '收到的收藏'
			});
		},
		methods: {
			queryList(pageNo, pageSize) {
				collectList({
					'per_page':pageSize,
					'page':pageNo
				}).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						// this.$refs.paging.complete(res.data.items);
						let noMore = !res.data.items.length
						this.$refs.paging.completeByNoMore(res.data.items, noMore);
					} else {
						// this.$refs.paging.complete([])
						this.$refs.paging.completeByNoMore([], true);
					}
				}, err => {
					// this.$refs.paging.complete([])
					this.$refs.paging.completeByNoMore([], true);
					console.log('collectList: ', err)
				})
			},
			// 删除成功，刷新
			backRefresh() {
				this.$refs.paging.reload()
			}
		}
	}
</script>

<style lang="less" scoped>
	.infos-collect-list {
		width: 100%;
		height: 100%;
	}

</style>
