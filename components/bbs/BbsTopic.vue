<!-- tab4-话题广场 -->
<template>
	<view class="bbs-topic">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'left': '25rpx', 'right': '25rpx'}">
			<view class="bbs-topic-tip">你可能想写</view>
			<bbs-topic-card @click.native="toTopicDetail(item.id)" @longpress.native="handleLongpress(item.id)"
			v-for="(item,index) in dataList" :key="index" :topicData="item"></bbs-topic-card>
		</z-paging>
		
		<!-- 举报面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" type="2"
		@backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	import BbsTopicCard from "@/components/bbs/BbsTopicCard.vue"
	import { topicList } from '@/network/api_bbs.js'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	export default {
		components: {
			BbsTopicCard,
			DeleteAndComplaint
		},
		data() {
			return {
				dataList: [],
				contentId: ''
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.getTopicList(pageNo, pageSize).then(res => {
					this.$refs.paging.complete(res);
				})
			},
			//获取话题列表
			getTopicList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					topicList({
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
						console.log('topicList: ', err)
					})
				})
			},
			toTopicDetail(id) {
				uni.navigateTo({
					url: `/page_bbs/bbsTopicDetail/bbsTopicDetail?id=${id}`
				})
			},
			// 长按，弹起面板
			handleLongpress(id) {
				this.contentId = id
				this.$refs.deleteAndComplaint.handleLongpress()
			},
			// 删除成功，刷新
			backRefresh() {
				this.$refs.paging.reload()
			}
		}
	}
</script>

<style lang="less" scoped>
.bbs-topic {
	margin: 0 25rpx;
	.bbs-topic-tip {
		font-size: 30rpx;
		font-weight: 600;
		color: rgba(0,0,0,0.3);
		line-height: 42rpx;
		margin-top: 25rpx;
	}
}
</style>
