<!-- 收到的评论list -->
<template>
	<view class="infos-comment-list">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'padding': '20rpx 25rpx'}">
			<infos-comment-card v-for="(item,index) in dataList" :key="index" :item="item"></infos-comment-card>
		</z-paging>
	</view>
</template>

<script>
	import InfosCommentCard from "@/page_infos/components/InfosCommentCard.vue"
	import { commentList } from "@/network/api_infos.js"
	export default {
		components: {
			InfosCommentCard
		},
		data() {
			return {
				dataList: []
			}
		},
		onLoad(option) {
			// 动态设置页面标题
			uni.setNavigationBarTitle({
				title: '收到的评论'
			});
		},
		methods: {
			queryList(pageNo, pageSize) {
				commentList({
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
					console.log('commentList: ', err)
				})
			},
		}
	}
</script>

<style lang="less" scoped>
.infos-comment-list {
	width: 100%;
	height: 100%;
}
</style>
