<template>
	<view class="homepage-post">
		<view class="post-list">
			<homepage-post-card v-for="(item,index) in dataList" :key="index" :postData="item" :index="index"  
			@click.native="toPostDetail(item.id, index)" @checkoutLike="checkoutLike"></homepage-post-card>
		</view>
	</view>
</template>

<script>
	import HomepagePostCard from '@/page_infos/components/HomepagePostCard.vue'
	export default {
		components: {
			HomepagePostCard
		},
		props: {
			userId: {
				type: String,
				default: ''
			},
			dataList: {
				type: Array,
				default: []
			}
		},
		methods: {
			toPostDetail(id, index) {
				uni.navigateTo({
					url: `/page_bbs/bbsPostDetail/bbsPostDetail?id=${id}&postIndex=${index}`
				});
			},
			//切换点赞状态
			checkoutLike(cardIndex, status) {
				this.$emit('checkoutLike', cardIndex, status)
			},
		},
	}
	
</script>

<style>
</style>