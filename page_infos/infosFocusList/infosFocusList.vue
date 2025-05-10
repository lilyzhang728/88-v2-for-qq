<template>
	<view class="infos-focus-list">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'padding': '20rpx 25rpx'}">
			<infos-focus-card v-for="(item,index) in dataList" :key="index" :item="item"></infos-focus-card>
		</z-paging>
	</view>
</template>

<script>
	import InfosFocusCard from '@/page_infos/components/InfosFocusCard.vue'
	import { mentionList } from "@/network/api_infos.js"
	export default {
		components: {
			InfosFocusCard
		},
		data() {
			return {
				dataList: []
			}
		},
		onLoad(option) {
			// 动态设置页面标题
			uni.setNavigationBarTitle({
				title: '邀请回答'
			});
		},
		methods: {
			queryList(pageNo, pageSize) {
				mentionList({
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
					console.log('mentionList: ', err)
				})
			},
		}
	}
</script>

<style lang="less" scoped>
.infos-focus-list {
	width: 100%;
	height: 100%;
}
</style>
