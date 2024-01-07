<!-- tab4-关注 -->
<template>
	<view class="bbs-focus">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'left': '25rpx', 'right': '25rpx'}">
			<!-- 帖子列表 -->
			<bbs-topic-card @click.native="toTopicDetail(item.id)" v-for="(item,index) in dataList" :key="index" :topicData="item"></bbs-topic-card>
		</z-paging>
	</view>
</template>

<script>
	import BbsTopicCard from "@/components/bbs/BbsTopicCard.vue"
	import { focusedTopic } from '@/network/api_bbs.js'
	export default {
		components: {
			BbsTopicCard
		},
		data() {
			return {
				dataList: [],
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.getFocusedTopicList(pageNo, pageSize).then(res => {
					this.$refs.paging.complete(res);
				})
			},
			//获取关注的话题列表
			getFocusedTopicList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					focusedTopic({
						'field':'考研',
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
						console.log('focusedTopic: ', err)
					})
				})
			},
			toTopicDetail(id) {
				uni.navigateTo({
					url: `/page_bbs/bbsTopicDetail/bbsTopicDetail?id=${id}`
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.bbs-focus {
	margin: 0 25rpx;
}
</style>
