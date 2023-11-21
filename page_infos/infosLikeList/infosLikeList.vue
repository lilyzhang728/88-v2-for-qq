<template>
	<view class="infos-like-list">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'padding': '20rpx 25rpx'}">
			<infos-like-card v-for="(item,index) in dataList" :key="index" :item="item"></infos-like-card>
		</z-paging>
	</view>
</template>

<script>
	import InfosLikeCard from "@/page_infos/components/InfosLikeCard.vue"
	import { likeList } from "@/network/api_infos.js"
	export default {
		components: {
			InfosLikeCard
		},
		data() {
			return {
				dataList: []
			}
		},
		onLoad(option) {
			// 动态设置页面标题
			uni.setNavigationBarTitle({
				title: '收到的赞'
			});
		},
		methods: {
			queryList(pageNo, pageSize) {
				likeList({
					'per_page':pageSize,
					'page':pageNo
				}).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.$refs.paging.complete(res.data.items);
					} else {
						this.$refs.paging.complete([])
					}
				}, err => {
					this.$refs.paging.complete([])
					console.log('likeList: ', err)
				})
			},
		}
	}
</script>

<style lang="less" scoped>
.infos-like-list {
	width: 100%;
	height: 100%;
}
</style>
