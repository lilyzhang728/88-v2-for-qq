<!-- 草稿箱 -->
<template>
	<view class="guide-draft">
		<view class="guide-list">
			<guide-item-card v-for="(item, index) in list" :key="index" myGuide="true" inDraft="true"></guide-item-card>
		</view>
	</view>
</template>

<script>
	import GuideItemCard from '@/components/guide/GuideItemCard.vue'
	export default {
		components: {
			GuideItemCard
		},
		data() {
			return {
				list: [null,null,null,null,null,null,null,null],
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="less" scoped>
.guide-draft {
	padding: 10px;
}
</style>
