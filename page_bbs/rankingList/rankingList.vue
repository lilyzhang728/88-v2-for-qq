<!-- 实时榜单 -->
<template>
	<view class="ranking-list">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'left': '25rpx', 'right': '25rpx'}">
			<ranking-card v-for="(item,index) in dataList" :key="index" :index="index" :rankingData="item" :rankId="rankId"></ranking-card>
		</z-paging>
	</view>
</template>

<script>
	import RankingCard from "@/components/bbs/RankingCard.vue"
	import { getRequest } from '@/network/https.js'
	export default {
		components: {
			RankingCard
		},
		data() {
			return {
				dataList: [],
				curLink: '',
				post_type: 3,
				page: 1,
				per_page: 10,
				rankId: ''
			}
		},
		computed: {
			queryPath() {
				return this.curLink + '?' + this.params
			}
		},
		onLoad(option) {
			if(option.link) {
				this.curLink = option.link
				this.post_type = option.post_type,
				this.page = option.page,
				this.per_page = option.per_page
				this.rankId = option.rankId
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				getRequest({
					path: this.curLink,
					data: {
						'post_type': this.post_type,
						'per_page': this.per_page,
						'page': this.page
					}
				}).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.$refs.paging.complete(res.data.items);
					} else {
						this.$refs.paging.complete([])
					}
				}, err => {
					this.$refs.paging.complete([])
					console.log('getCommentData: ', err)
				})
			}
			
		}
	}
</script>

<style lang="less" scoped>
	.ranking-list {
		margin: 0 25rpx;
	}
</style>
