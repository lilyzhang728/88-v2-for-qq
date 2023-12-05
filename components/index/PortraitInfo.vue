<!-- 头像 -->
<template>
	<view class="portrait-container">
		<!-- <van-image class="portrait-img" width="130rpx" height="130rpx" fit="cover" round :src="userInfo.avatar" @click="changePotrait" /> -->
		<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar.native="onChooseAvatar">
			<image :src="userInfo.avatar" mode="" slot="value" class="edit-personal-img"></image>
		</button>
		
		<view class="portrait-content">
			<view class="portrait-name">{{userInfo.name}}</view>
			<view class="portrait-info">
				<text class="portrait-info-item">学校：{{userInfo.school ? userInfo.school : '未填写'}}</text>
				<text>目标：{{target}}</text>
			</view>
		</view>
		
		<view class="portrait-icon"><text class="iconfont icon-editor portrait-icon-img" @tap="toEdit"></text></view>
		
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import { profile, updateProfile } from '@/network/api_index.js'
	import { target_value_key_map, target_key_value_map } from "@/tools/transform_data.js"
	import { imgSecCheck } from "@/tools/sec_check.js"
	import Toast from '@/wxcomponents/vant/toast/toast'
	export default {
		name: "PortraitInfo",
		props: {
			userId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				userInfo: {
					name: "",
					school: "",
					target: "",
					id: "",
					avatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg'
				},
			};
		},
		computed: {
			target() {
				return this.userInfo.target ? target_value_key_map[Number(this.userInfo.target)] : '未填写'
			}
		},
		watch: {
			userId(val) {
				if(val) {
					this.getUserInfo()
				}
			}
		},
		created() {
			if(this.userId) {
				this.getUserInfo()
			}
		},
		methods: {
			//查询个人信息
			getUserInfo() {
				profile(this.userId).then(res => {
					if (res.code == 0 && Object.keys(res.data).length) {
						this.userInfo = res.data
						this.$emit('getTimeRange', res.data.start_year, res.data.graduate_year)
					}
				}, err => {
					console.log('profile', err)
				})
			},
			// 点击头像
			onChooseAvatar(e) {
				const url = e.detail.avatarUrl
				//鉴黄
				imgSecCheck(url).then(res => {
					this.updateImg(url)
				}, err => {
					uni.showModal({
						title: '提示',
						content: '鉴黄不通过',
						success: function(res) {
							if (res.confirm) {
								// 执行确认后的操作
							} 
							else {
								// 执行取消后的操作
							}
						}
					})
				})
			},
			//鉴黄通过，回显 + 上传至云存储
			updateImg(url) {
				//回显
				this.userInfo.avatar = url
				// 上传至云存储, 文件路径为 profile_photos/userid/xxx.png
				const userId = uni.getStorageSync('userId')
				wx.cloud.uploadFile({
				  cloudPath: `profile_photos/${userId}/avatar-${new Date().getTime()}.png`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
				  filePath: url, 
				  config: {
				    env: 'prod-4gkvfp8b0382845d' // 需要替换成自己的微信云托管环境ID
				  }
				}).then(res => {
					//传给后台
					updateProfile({
						avatar: res.fileID
					}).then(res => {
						if(res.code === 0) {
							Toast({message: '修改成功！', context: this, type: 'success'})
						}
					}, err => {
						console.log('updateProfile: ', err)
					})
				}).catch(error => {
				  console.error(error)
				})
			},
			// changePotrait() {
			// 	console.log(888)
			// 	uni.chooseImage({ // 从本地相册选择图片或使用相机拍照。
			// 		count: 1, //默认选择1张图片
			// 		sizeType: ['original', 'compressed'], //original 原图，compressed 压缩图，默认二者都有
			// 		success: (res) => {
			// 			console.log(res.tempFilePaths[0])
			// 			this.userInfo.avatar = res.tempFilePaths[0] //更新本地浏览头像图片
			// 			this.updatePortrait(res.tempFilePaths[0]) //上传图片
			// 		}
			// 	});
			// },
			// // 上传头像
			// updatePortrait(url) {
			// 	wx.cloud.uploadFile({
			// 		cloudPath: 'example.png', // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
			// 		filePath: url, // 'wxfile://test' 微信本地文件，通过选择图片，聊天文件等接口获取
			// 		config: {
			// 			env: 'prod-4gkvfp8b0382845d' // 需要替换成自己的微信云托管环境ID
			// 		}
			// 	}).then(res => {
			// 		console.log(res.fileID)
			// 	}).catch(error => {
			// 		console.error(error)
			// 	})
			// },
			toEdit() {
				uni.navigateTo({
					url: '/page_editPersonalInfo/editPersonalInfo/editPersonalInfo'
				});
			},
		}
	}
</script>

<style lang="less" scoped>
	.portrait-container {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		color: #fff;
		padding: 18rpx 25rpx;
		position: relative;
		display: flex;
		.portrait-img {
			width: 130rpx;
			margin-right: 15rpx;
		}
		.avatar-wrapper {
			width: 130rpx;
			height: 130rpx;
			padding: 0;
			border-radius: 50%;
			margin-right: 15rpx;
		}
		.edit-personal-img {
			width: 130rpx;
			height: 130rpx;
			border-radius: 50%;
		}
		.portrait-content {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			overflow: hidden;
			.portrait-name {
				margin-bottom: 10rpx;
				font-size: 30rpx;
				font-weight: bold;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.portrait-info {
				font-size: 20rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				.portrait-info-item {
					margin-right: 35rpx;
				}
			}
		}
		
		.portrait-icon {
			width: 52rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.portrait-icon-img {
				font-size: 40rpx;
			}
		}
	}
</style>
