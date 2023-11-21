<!-- tab4-话题广场 -->
<template>
	<view class="bbs-topic">
		<view class="bbs-topic-tip">你可能想写</view>
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
