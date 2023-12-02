<template>
	<view class="launch" v-if="showLaunch">
		前置引导页
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showLaunch: false
			}
		},
		onLoad() {
			// 查询是否是新用户
			setTimeout(() => {
				// 新用户，显示引导页
				// this.showLaunch = true
				// 老用户，直接跳转index页
				this.showLaunch = false
				uni.switchTab({
					url: '/pages/index/index'
				})
			}, 2000)
		},
		methods: {
			
		}
	}
</script>

<style lang="less" scoped>
.launch {
	color: #000;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: red;
	z-index: 10000;
}
</style>
