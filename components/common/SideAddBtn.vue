<!-- 侧边-添加按钮 -->
<template>
	<view class="side-add-btn">
		<img class="side-add-btn-img" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/editBtn.png" alt="" @click.stop="addNew($event)">
	</view>
</template>

<script>
	export default {
		methods: {
			addNew(e) {
				this.$emit('addNew', e)
			}
		},
	}
</script>

<style lang="less" scoped>
	.side-add-btn {
		.side-add-btn-img {
			width: 128rpx;
			height: 80rpx;
			position: fixed;
			right: 0;
			top: 1000rpx;
		}
	}
</style>