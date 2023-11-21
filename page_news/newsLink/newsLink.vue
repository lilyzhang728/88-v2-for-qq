<!-- 打开文章外链 -->
<template>
	<view class="news-link">
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(option) {
			console.log(option)
			this.url = option.url
		},
		methods: {
			
		}
	}
</script>

<style lang="less" scoped>
.news-link {
	width: 100%;
	height: 100%;
}
</style>
