<template>
	<!-- <view class="launch" v-if="showLaunch"> -->
		<view class="launch" v-if="showLaunch" style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/qa/qaBg.png?sign=dea87806eae980fcf46c05d496c6f02f&t=1702015391');background-size: 100%;background-color: #FFFFFF;background-repeat: no-repeat;">
		<!-- 性别 -->
		<view class="launch-gender">
			<view class="launch-gender-title">你的性别是</view>
			<view class="launch-gender-img-box">
				<!-- 女生 -->
				<view class="launch-gender-img-box-item">
					<img v-if="!gender" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/launch/girlSelect.png" class="launch-gender-img" alt="">
					<img v-else @click="selectGender(0)" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/launch/girlUnSelect.png" class="launch-gender-img" alt="">
					<img v-if="!gender" class="launch-gender-img-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/launch/iconSelect.png" alt="">
				</view>
				
				<!-- 男生 -->
				<view class="launch-gender-img-box-item">
					<img v-if="gender" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/launch/boySelect.png" class="launch-gender-img" alt="">
					<img v-else @click="selectGender(1)" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/launch/boyUnSelect.png" class="launch-gender-img" alt="">
					<img v-if="gender" class="launch-gender-img-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/launch/iconSelect.png" alt="">
				</view>
				
			</view>
		</view>
		
		<!-- 标签选项 -->
		<view class="launch-labels">
			<view @click="selectLabel(index)" class="launch-label-item" :class="{'launch-label-item-active': label.active}" v-for="(label, index) in labelslist" :key="index">{{label.name}}</view>
		</view>
		
		<!-- 按钮 -->
		<view class="launch-btn-box">
			<van-button  class="launch-btn-wrap" custom-class="launch-btn">下一步</van-button>
		</view>
	</view>
</template>

<script>
	import { login } from "@/network/api_login.js"
	export default {
		data() {
			return {
				showLaunch: false,
				userId: '',
				gender: 0,	//0:女生  1：男生
				labelslist: [{
					name: '软萌妹子',
					active: true
				},{
					name: '人皮话多',
					active: false
				},{
					name: '御姐范',
					active: false
				},{
					name: '善',
					active: false
				},{
					name: '善良',
					active: false
				},{
					name: '豪放不羁',
					active: false
				}]
			}
		},
		onLoad() {
			// 查询是否是新用户
			// setTimeout(() => {
			// 	// 新用户，显示引导页
			// 	// this.showLaunch = true
			// 	// 老用户，直接跳转index页
			// 	this.showLaunch = false
			// 	// uni.switchTab({
			// 	// 	url: '/pages/mine/mine'
			// 	// })
			// 	uni.navigateTo({
			// 		url: '/pages/mine/mine'
			// 	})
			// }, 2000)
			
			
			this.login()
		},
		methods: {
			login() {
				login().then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						// res.data.is_new = true
						if(res.data.is_new) {
							// 新用户，显示引导页
							this.showLaunch = true
						}
						// 存token，user_id
						uni.setStorageSync('token', res.data.token);
						uni.setStorageSync('userId', res.data.user_id);
						this.userId = res.data.user_id
						console.log('userid: ', res.data.user_id)
						if(!res.data.is_new) {
							// 老用户，跳首页
							uni.switchTab({
								url: '/pages/bbs/bbs'
							})
						}
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
			selectGender(val) {
				this.gender = val
				console.log(this.gender)
			},
			selectLabel(index) {
				this.labelslist[index].active = !this.labelslist[index].active
			}
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
	z-index: 10000;
	.launch-gender {
		.launch-gender-title {
			margin-top: 242rpx;
			font-size: 34rpx;
			font-weight: 500;
			color: #000000;
			line-height: 48rpx;
			text-align: center;
		}
		.launch-gender-img-box {
			margin-top: 50rpx;
			display: flex;
			justify-content: space-around;
			.launch-gender-img-box-item {
				width: 187rpx;
				height: 187rpx;
				position: relative;
				.launch-gender-img {
					width: 187rpx;
					height: 187rpx;
					border-radius: 50%;
				}
				.launch-gender-img-icon {
					width: 46rpx;
					height: 46rpx;
					border-radius: 50%;
					position: absolute;
					bottom: -23rpx;
					left: 71rpx;
				}
			}
			
		}
	}
	
	.launch-labels {
		margin-top: 105rpx;
		display: flex;
		flex-wrap: wrap;
		padding: 0 45rpx;
		.launch-label-item {
			font-size: 26rpx;
			color: rgba(0,0,0,0.8);
			line-height: 37rpx;
			padding: 17rpx 33rpx;
			background: #F7F7F7;
			border-radius: 35rpx;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			&:last-child {
				margin-right: 0;
			}
		}
		.launch-label-item-active {
			background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
			color: #FFFFFF;
			font-weight: 500;
		}
	}
	
	.launch-btn-box {
		text-align: center;
		margin-top: 100rpx;
		.launch-btn-wrap {
			/deep/ .launch-btn {
				font-size: 32rpx;
				color: #fff;	
				line-height: 45rpx;
				padding: 18rpx 238rpx;
				background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
				border: 1rpx solid #50D2B7;
				border-radius: 10rpx;
				height: auto
			}
		}
	}
}
</style>
