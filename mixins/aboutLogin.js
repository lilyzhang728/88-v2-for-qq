import { login } from "@/network/api_login.js"

export default {
	methods: {
		// 在分享出去的页面里调用，获取token等值
		login() {
			login().then(res => {
				if(res.code === 0 && Object.keys(res.data).length) {
					// 存用户角色：1：管理员 0：非管理员
					uni.setStorageSync('role', res.data.is_admin);
					// 存token，user_id
					uni.setStorageSync('token', res.data.token);
					uni.setStorageSync('userId', res.data.user_id);
				}
			})
		}
	}
}