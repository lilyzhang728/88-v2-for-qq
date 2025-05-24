<!-- 头像 -->
<template>
	<view class="portrait-container">
		<view class="portrait-container-top">
			<!-- <van-image class="portrait-img" width="130rpx" height="130rpx" fit="cover" round :src="userInfo.avatar" @click="changePotrait" /> -->
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar.native="onChooseAvatar">
				<image :src="userInfo.avatar" mode="" slot="value" class="edit-personal-img"></image>
			</button>
			
			<view class="portrait-content">
				<view class="portrait-name">{{userInfo.name}}</view>
				<view class="portrait-info">
					<text class="portrait-info-item">学校：{{userInfo.school ? userInfo.school : '未填写'}}</text>
					<!-- <text>目标：{{target}}</text> -->
				</view>
				<view class="portrait-info">目标：{{target}}</view>
			</view>
			
			<view class="portrait-icon"><text class="iconfont icon-editor portrait-icon-img" @tap="toEdit"></text></view>
		</view>
		
		<!-- 个性签名 -->
		<view class="portrait-container-about-me" v-if="userInfo.about_me">
			<van-icon class="portrait-container-about-me-icon" name="edit" color="#fff" @tap="toEdit" />
			<text class="portrait-container-about-me-text">个性签名: {{userInfo.about_me}}</text>
		</view>
		
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
			},
			// 下拉刷新flag
			refreshFlag: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				userInfo: {
					name: "",
					school: "",
					target: "",
					id: "",
					avatar: '',
				},
				w: 0,
				h: 0,
				cloud_path: '',	//上传至对象存储的地址（单张）
				cloud_path_split: '',	//上传至对象存储的地址-截断（单张）
				default_avatar: 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/profile_photos/default/001.jpg',
				tmp_url: ''
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
			},
			refreshFlag() {
				if(this.userId) {
					this.getUserInfo()
				}
			}
		},
		// created() {
		// 	if(this.userId) {
		// 		this.getUserInfo()
		// 	}
		// },
		methods: {
			//查询个人信息
			getUserInfo() {
				profile(this.userId).then(res => {
					if (res.code == 0 && Object.keys(res.data).length) {
						this.userInfo = res.data
						this.$emit('getTimeRange', res.data.start_year, res.data.graduate_year)
						if(!res.data.avatar) {
							// 如返回头像为空，设置默认头像
							this.userInfo.avatar = this.default_avatar
						}
					}
				}, err => {
					console.log('profile', err)
				})
			},
			// 点击头像
			async onChooseAvatar(e) {
				try {
					const file = e.detail.avatarUrl
					// console.log('原图大小', file)
					// 1. 压缩，返回 file_list / file
					let result = await this.handleCompressImg(file)
					// console.log(result)
					
					// 2. 上传, 返回对象存储中的地址
					let result2 = await this.uploadCloud(result)
					// console.log(result2)
					
					// 3. 鉴黄，返回：鉴黄是否通过 true/false
					let result3 = await this.checkImgValid(result2)
					// console.log('result3', result3)
					
					// 4. 回显
					this.showUploadImg(result3)
					
				} catch(error) {
					console.error(error);
				}
				
				// const url = e.detail.avatarUrl
				// //鉴黄
				// imgSecCheck(url).then(res => {
				// 	this.updateImg(url)
				// }, err => {
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: '您发布的图片可能包括敏感信息，请重新发布',
				// 		success: function(res) {
				// 			if (res.confirm) {
				// 				// 执行确认后的操作
				// 			} 
				// 			else {
				// 				// 执行取消后的操作
				// 			}
				// 		}
				// 	})
				// })
			},
			// 1. 图片大小压缩在100k左右
			handleCompressImg(file) {
				this.tmp_url = ''
				return new Promise((resolve, reject) => {
					this.compressImageSize(file, 0).then(result => {
						this.tmp_url = result
						resolve(file)
					}).catch(err => {
						reject()
					})
				})
			},
			// 图片压缩函数
			compressImageSize(url, index) {
				return new Promise((resolve, reject) => {
					// 1-1. 获取图片信息
					uni.getImageInfo({
						src: url,
						success: (infoRes)=> {
							const pixels = 100000;
							// 1-2.创建canvas
							let canvas = uni.createCanvasContext("myCanvas");
							// 1-3.压缩
							let [ w, h ] = this.calcImageSize(infoRes);
							this.$emit('updateWidthHeight', [w, h])
							this.w = w
							this.h = h
							// console.log(w, h, file.size)
							canvas.drawImage(infoRes.path, 0, 0, w, h)
							canvas.draw(false, () => {
								// 1-4. canvas 根据配置生成指定大小的图片，并返回文件路径
								setTimeout(() => {
									uni.canvasToTempFilePath({
									  x: 0,
									  y: 0,
									  width: w, 
									  height: h, 
									  destWidth: w, 
									  destHeight: h,
									  quality:.7,
									  fileType:"jpg",
									  canvasId: "myCanvas",
									  success: (pathRes)=> {
										// 返回压缩后的图片路径
										resolve(pathRes.tempFilePath)
											
										// 获取文件信息
										  uni.getFileInfo({
											filePath: pathRes.tempFilePath,
											success: (fileInfo) => {
											  console.log('绘制后图片文件大小：', fileInfo.size, '字节', fileInfo.size/1024, 'kb');
											},
											fail: (error) => {
											  console.error('获取文件信息失败', error);
											}
										  });
									  },
									   fail: (error) => {
										 console.error('返回压缩后的图片路径失败', error);
										 reject()
									   }
									})
								},500)
							})
							
						},
						fail: (error) => {
							console.error('获取图片信息失败', error);
							reject()
						}
					})
					
				})
			},
			// 压缩规则：宽高压到1000*560以下
			calcImageSize(res) {
				let cW = res.width,
					cH = res.height,
					cHeight = cH,
					cWidth = cW;
				// console.log('压缩前：', cW, cH)
				if ((cW / cH) < 0.56) { //说明 要依高为缩放比例--0.56是 750/1334的结果，这个是官方要求，但是实际上按照这个尺寸，有时还是会太大，因此按等比例规定最大尺寸为560/1000
						if (cH > 1000) {
						cHeight = 1000;
						cWidth = parseInt((cW * 1000) / cH);
					}
				} else { //要依宽为缩放比例
					if (cW > 560) {
						cWidth = 560;
						cHeight = parseInt((cH * 560) / cW);
					}
				}
				// console.log('压缩后：', cWidth, cHeight)
				return [cWidth, cHeight]
			},
			// 2. 上传对象存储
			uploadCloud(file) {
				this.cloud_path = ''
				this.cloud_path_split = ''
				return new Promise((resolve, reject) => {
					this.uploadToCloud(file).then(res => {
						this.cloud_path = res
						this.cloud_path_split = res.slice(res.indexOf('profile_photos'))
						resolve(this.cloud_path_split)
					}).catch(err => {
						// 上传失败，从本地文件列表中删除
						// const newArrayLength = this.postImgList.length - 1
						// this.postImgList = this.postImgList.slice(0, newArrayLength)
						reject()
					})
				})
			},
			// 上传至云存储
			uploadToCloud(item) {
				return new Promise((resolve, reject) => {
					//回显
					this.userInfo.avatar = this.tmp_url
					// 上传至云存储, 文件路径为 bbs/userid/时间戳/随机数.jpg
					const userId = uni.getStorageSync('userId')
					this.timestamp = this.timestamp ? this.timestamp : new Date().getTime()
					qq.cloud.uploadFile({
					  cloudPath: `profile_photos/${userId}/avatar-${new Date().getTime()}.jpg`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
					  filePath: this.tmp_url, 
					  config: {
					    env: 'cloudbase-baas-8g07uffq8068e555' // 需要替换成自己的微信云托管环境ID
					  }
					}).then(res => {
						let result = res.fileID ? res.fileID.replace('cloud://cloudbase-baas-8g07uffq8068e555.636c-cloudbase-baas-8g07uffq8068e555-1314114854',
							'https://636c-cloudbase-baas-8g07uffq8068e555-1314114854.tcb.qcloud.la') : ''
						resolve(result)
					}).catch(error => {
						console.error(error)
						reject('上传失败')
					})
				})
			},
			// 3. 鉴黄方法：本方法入参：图片的对象存储地址，正常返回（resolve)：都通过了检测
			// 鉴黄接口：上送图片地址，返回是否通过检查
			checkImgValid(path) {
				return new Promise((resolve, reject) => {
					imgSecCheck([path]).then(res => {
						// 通过
						resolve(true)
					}, err => {
						// 未通过
						uni.showModal({
							title: '提示',
							content: '您发布的图片可能包括敏感信息，请重新发布',
							success: function(res) {}
						})
						// 从本地文件列表中删除
						this.userInfo.avatar = this.default_avatar
						// 对象存储中同步删除
						wx.cloud.deleteFile({
						  fileList: [this.cloud_path], // 对象存储文件ID列表，最多50个，从上传文件接口或者控制台获取
						})
						resolve(false)
					})
				})
			},
			// 4. 回显图片
			showUploadImg(res) {
				if(res) {
					// 鉴黄通过
					this.userInfo.avatar = this.cloud_path
					//传给后台
					updateProfile({
						avatar: this.cloud_path
					}).then(res => {
						if(res.code === 0) {
							Toast({message: '修改成功！', context: this, type: 'success'})
						}
					}, err => {
						console.log('updateProfile: ', err)
					})
				}
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
		border: 1rpx solid #FFFFFF;
		border-radius: 20rpx;
		background: rgba(255,255,255,0.1);
		box-sizing: border-box;
		color: #fff;
		padding: 18rpx 25rpx;
		position: relative;
		.portrait-container-top {
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
					font-size: 26rpx;
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
		.portrait-container-about-me {
			font-size: 26rpx;
			color: #FFFFFF;
			line-height: 30rpx;
			margin-top: 22rpx;
			display: flex;
			align-items: center;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			.portrait-container-about-me-icon {
				margin-left: 15rpx;
				margin-right: 10rpx;
				height: 20rpx;
				width: 20rpx;
			}
		}
	}
</style>
