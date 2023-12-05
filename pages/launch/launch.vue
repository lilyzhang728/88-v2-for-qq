<template>
	<view class="launch" v-if="showLaunch">
		前置引导页
	</view>
</template>

<script>
	import { login } from "@/network/api_login.js"
	export default {
		data() {
			return {
				showLaunch: false,
				userId: ''
			}
		},
		onLoad() {
			// 查询是否是新用户
			setTimeout(() => {
				// 新用户，显示引导页
				// this.showLaunch = true
				// 老用户，直接跳转index页
				this.showLaunch = false
				// uni.switchTab({
				// 	url: '/pages/mine/mine'
				// })
				uni.navigateTo({
					url: '/pages/mine/mine'
				})
			}, 2000)
			this.login()
		},
		methods: {
			login() {
				login().then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						// 存token，user_id
						uni.setStorageSync('token', res.data.token);
						uni.setStorageSync('userId', res.data.user_id);
						this.userId = res.data.user_id
						console.log('userid: ', res.data.user_id)
					} else {
						uni.showToast({
							title: '登录失败，请重新打开小程序',
							icon:'none'
						});
					}
				}, err => {
					console.log(err)
				})
			},
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
