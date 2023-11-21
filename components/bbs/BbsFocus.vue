<!-- tab4-关注 -->
<template>
	<view class="bbs-focus">
		<!-- 帖子列表 -->
		<bbs-topic-card @click.native="toTopicDetail(item.id)" v-for="(item,index) in dataList" :key="index" :topicData="item"></bbs-topic-card>
	</view>
</template>

<script>
	import BbsTopicCard from "@/components/bbs/BbsTopicCard.vue"
	export default {
		components: {
			BbsTopicCard
		},
		props: {
			dataList: {
				type: Array,
				required: true,
				default: []
			},
		},
		data() {
			return {
				
			}
		},
		methods: {
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
