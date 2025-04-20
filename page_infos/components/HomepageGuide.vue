<!-- 个人主页-攻略 -->
<!-- 待删除？TODO -->
<template>
	<view class="homepage-guide">
		<view class="guide-list">
			<guide-item-card v-for="(item, index) in dataList" :key="index" :index="index"
			:guideItem="item" from="homepage" @openOptionSheet="openOptionSheet" 
			></guide-item-card>
		</view>
	</view>
</template>

<script>
	import GuideItemCard from '@/page_infos/components/HomepageGuideCard.vue'
	export default {
		components: {
			GuideItemCard
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
		data() {
			return {
			}
		},
		methods: {
			
		}
		
	}
</script>

<style lang="less" scoped>
	.homepage-guide {
		
	}
</style>
