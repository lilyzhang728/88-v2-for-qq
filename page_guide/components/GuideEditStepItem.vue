<template>
	<view class="guide-edit-step-item">
		<!-- <view class="guide-edit-step-title">步骤{{index + 1}}</view> -->

		<!-- 步骤副标题 -->
		<van-field :value="step.subtile" type="textarea" :show-confirm-bar="false" placeholder="添加副标题" autosize :border="false"
			@change.native="changeStepSubtitle"
			placeholder-style="font-size: 28rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; padding-left: 0; padding-right: 0;"
			custom-style="font-size: 28rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; padding-left: 0; padding-right: 0;" />

		<!-- 步骤说明 -->
		<van-field :value="step.body" type="textarea" :show-confirm-bar="false" placeholder="添加章节说明" autosize :border="false" @change.native="changeStepBody"
			placeholder-style="font-size: 28rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; padding-left: 0; padding-right: 0;"
			custom-style="font-size: 28rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; padding-left: 0; padding-right: 0;" />

		<!-- urlList -->
		<view class="guide-edit-step-item-url"  v-for="(link, index) in step.links" :key="index">
			<van-field :value="link.name" placeholder="链接说明" class="guide-edit-step-item-url-name"
				:border="false" @change.native="changeLinkName($event, index)"
				placeholder-style="font-size: 28rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; padding-left: 0; padding-right: 0;"
				custom-style="font-size: 28rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; padding-left: 0; padding-right: 0;">
				<view slot="left-icon">
					<img class="guide-edit-step-item-url-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/linkIcon.png" alt="">
				</view>
			</van-field>
			<van-field :value="link.url" placeholder="添加链接(选填)" class="guide-edit-step-item-url-url"
				:border="false" use-button-slot @change.native="changeLinkUrl($event, index)"
				placeholder-style="font-size: 28rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; padding-left: 0; padding-right: 0;"
				custom-style="font-size: 28rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; padding-left: 0; padding-right: 0;">
				<view slot="button">
					<van-icon name="delete-o" size="32rpx" color="#7F7F7F" @click="deleteURL(index)" />
				</view>
			</van-field>
		</view>
		
		<!-- 添加链接按钮 -->
		<view class="guide-edit-step-url-add-btn" @click.native="addURL">
			<van-icon name="add-o" color="#b6b5b5" class="guide-edit-step-url-add-btn-icon" />添加链接
		</view>
		

		<!-- 添加图片 -->
		<!-- <view class="guide-edit-step-pic">
			<van-uploader :file-list="step.pics" deletable="true" max-count="3" 
			:preview-size="imageWidth" image-fit="aspectFit"
			use-before-read @beforeRead.native="beforeRead" multiple
			@afterRead.native="afterRead" @delete.native="deleteImg" />
		</view> -->
		
		<!-- 用于压缩上传图片 -->
		<!-- <view class="compress_canvas">
			<canvas canvas-id="myCanvas-0" :style="{width: w + 'px', height: h + 'px'}"></canvas>
			<canvas canvas-id="myCanvas-1" :style="{width: w + 'px', height: h + 'px'}"></canvas>
			<canvas canvas-id="myCanvas-2" :style="{width: w + 'px', height: h + 'px'}"></canvas>
		</view> -->
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import { imgSecCheck } from "@/tools/sec_check.js"
	export default {
		props: {
			step: {
				type: Object,
				default: {
					"subtile": "",
					"body": "",
					"links": [
					  {
						"name": "",
						"url": ""
					  }
					],
					"pics": []
				}
			},
			index: {
				type: Number
			},
			screenWidth: {
				type: Number
			}
		},
		data() {
			return {
				picList: [],
				fileList: this.pics,
				w: 0,
				h: 0,
				cloud_path: '',	//上传至对象存储的地址（单张）
				cloud_path_split: '',	//上传至对象存储的地址-截断（单张）
				fileID_list: [],	//上传至对象存储的地址（多张）
				fileID_list_split: []	//上传至对象存储的地址-截断（多张）
			}
		},
		computed: {
			showAddIcon() {
				return this.picList.length < 3
			},
			imageWidth() {
				// 两边padding: 25*2+30*2=110; 图片margin-right:8px 8*3=24; 计算误差多-5
				return this.screenWidth ? ((this.screenWidth - this.rpxToPx(110) - 24 - 5) / 3) + 'px' : 0
			}
		},
		methods: {
			// rpx转px
			rpxToPx(rpx) {
			  return (this.screenWidth * Number.parseInt(rpx)) / 750
			},
			//删除链接
			deleteURL(index) {
				// this.step.urlList.splice(index, 1)
				this.$emit('deleteURL', this.index, index)
			},
			//添加链接
			addURL() {
				this.$emit('addURL', this.index)
			},
			addPic() {
				uni.chooseImage({ // 从本地相册选择图片或使用相机拍照。
					count: 1, //默认选择1张图片
					sizeType: ['original', 'compressed'], //original 原图，compressed 压缩图，默认二者都有
					success: (res) => {
						console.log(res.tempFilePaths[0])
						this.$emit('updateStep', this.index, 'picList', res.tempFilePaths[0])
					}
				});
			},
			// 更新步骤副标题
			changeStepSubtitle(e) {
				this.$emit('updateStep', this.index, 'subtile', e.detail)
			},
			// 更新步骤描述
			changeStepBody(e) {
				this.$emit('updateStep', this.index, 'body', e.detail)
			},
			// 更新link-name
			changeLinkName(e, index) {
				this.$emit('updateStepLinks', this.index, e.detail, index, 'name')
			},
			// 更新link-url
			changeLinkUrl(e, index) {
				this.$emit('updateStepLinks', this.index, e.detail, index, 'url')
			},
			//before-read 事件可以在上传前进行校验，调用 callback 方法传入 true 表示校验通过，传入 false 表示校验失败。
			beforeRead(event) {
				const {
					file,
					callback
				} = event.detail;
				if(Array.isArray(event.detail.file)) {
					// 上传多张
					file.forEach((item) => {
						callback(item.type === 'image');
					})
				} else {
					// 上传1张
					callback(file.type === 'image');
				}
			},
			async afterRead(event) {
				try {
					const file = event.detail.file
					console.log('原图大小', file[0].size/1024)
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
				// const file = event.detail.file
				// //鉴黄
				// if(Array.isArray(file)) {
				// 	// 上传多张
				// 	this.checkImgValid(file).then(res => {
				// 		this.$emit('updateStepPicsMultiple', this.index, file)
				// 	}).catch(err => {
				// 		uni.showModal({
				// 			title: '提示',
				// 			content: '您发布的图片可能包括敏感信息，请重新发布',
				// 			success: function(res) {}
				// 		})
				// 	})
				// } else { 
				// 	// 上传1张
				// 	imgSecCheck(file.url).then(res => {
				// 		this.$emit('updateStepPics', this.index, file.url)
				// 	}, err => {
				// 		uni.showModal({
				// 			title: '提示',
				// 			content: '您发布的图片可能包括敏感信息，请重新发布',
				// 			success: function(res) {
				// 				if (res.confirm) {
				// 					// 执行确认后的操作
				// 				} 
				// 				else {
				// 					// 执行取消后的操作
				// 				}
				// 			}
				// 		})
				// 	})
				// }
			},
			// 1. 图片大小压缩在100k左右
			handleCompressImg(file) {
				return new Promise((resolve, reject) => {
					if(Array.isArray(file)) {
						Promise.all(file.map((item, index) => {
							return this.compressImageSize(item, index)
						})).then(result => {
							file.forEach((item, index) => {
								item.tmp_url = result[index]
							})
							
							resolve(file)
						}).catch(err => {
							reject()
						})
					} else {
						this.compressImageSize(file, 0).then(result => {
							file.tmp_url = result
							resolve(file)
						}).catch(err => {
							reject()
						})
					}
				})
			},
			// 图片压缩函数
			compressImageSize(file, index) {
				return new Promise((resolve, reject) => {
					if(file.size / 1024 / 100 > 1) {
						// >100k，需要压缩
						// 1-1. 获取图片信息
						uni.getImageInfo({
							src: file.url,
							success: (infoRes)=> {
								const pixels = 100000;
								// 1-2.创建canvas
								let canvas = uni.createCanvasContext("myCanvas-"+index);
								console.log(canvas)
								// 1-3.压缩
								let [ w, h ] = this.calcImageSize(infoRes, file.size);
								this.w = w
								this.h = h
								console.log(w, h, file.size)
								canvas.drawImage(infoRes.path, 0, 0, w, h)
								console.log(canvas)
								canvas.draw(true, () => { 
									setTimeout(() => {
										console.log(111)
										uni.canvasToTempFilePath({
										  x: 0,
										  y: 0,
										  width: w, 
										  height: h, 
										  destWidth: w, 
										  destHeight: h,
										  quality:.7,
										  fileType:"jpg",
										  canvasId: "myCanvas-"+index,
										  success: (pathRes)=> {
											// 返回压缩后的图片路径
											console.log(pathRes)
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
									}, 500)
									
								})
								// console.log(canvas)
								// // 1-4. canvas 根据配置生成指定大小的图片，并返回文件路径
								// setTimeout(() => {
									
								// },500)
							},
							fail: (error) => {
								console.error('获取图片信息失败', error);
								reject()
							}
						})
					} else {
						resolve(file.url)
					}
				})
			},
			// 压缩规则：宽高压到1000*560以下
			calcImageSize(res, size) {
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
				this.fileID_list = []
				this.fileID_list_split = []
				return new Promise((resolve, reject) => {
					if(Array.isArray(file)) {
						// 上传多张
						let path_promise_list = file.map((item, index) => this.uploadToCloud(item))
						
						Promise.all(path_promise_list).then(res => {
							this.fileID_list = [...res]
							let fileID_list_split = res.map((item) => {
								return item.slice(item.indexOf('bbs'))
							})
							this.fileID_list_split = [...fileID_list_split]
							
							resolve(fileID_list_split)
						}).catch(err => {
							// 上传失败，从本地文件列表中删除
							this.$emit('deleteStepItemImg', this.index, file.length)
							// const newArrayLength = this.postImgList.length - file.length
							// this.postImgList = this.postImgList.slice(0, newArrayLength)
							reject()
						})
					} else {
						// 上传1张
						this.uploadToCloud(file).then(res => {
							this.cloud_path = res
							this.cloud_path_split = res.slice(item.indexOf('bbs'))
							resolve(this.cloud_path_split)
						}).catch(err => {
							// 上传失败，从本地文件列表中删除
							this.$emit('deleteStepItemImg', this.index, 1)
							// const newArrayLength = this.postImgList.length - 1
							// this.postImgList = this.postImgList.slice(0, newArrayLength)
							reject()
						})
					}
				})
			},
			// 上传至云存储
			uploadToCloud(item) {
				return new Promise((resolve, reject) => {
					//回显（显示loading）
					this.$emit('showStepItemImg', this.index)
					// this.postImgList.push({})
					// this.$set(this.postImgList[this.postImgList.length-1], 'status', 'uploading')
					// 上传至云存储, 文件路径为 guide/userid/时间戳/index-随机数.jpg: index为第几步
					const userId = uni.getStorageSync('userId')
					this.timestamp = this.timestamp ? this.timestamp : new Date().getTime()
					let num = this.generateRandomNumber()
					wx.cloud.uploadFile({
					  cloudPath: `guide/${userId}/${this.timestamp}/${index}-${num}.jpg`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
					  filePath: item.tmp_url, 
					  config: {
					    env: 'prod-4gkvfp8b0382845d' // 需要替换成自己的微信云托管环境ID
					  }
					}).then(res => {
						resolve(res.fileID)
					}).catch(error => {
						console.error(error)
						reject('上传失败')
					})
				})
			},
			// 获取6位随机数
			generateRandomNumber() {
			  const randomNumberArray = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)); // 生成一个包含 0 到 9 之间数字的数组
			  const sixDigitNumber = randomNumberArray.join(''); // 将数组转换为字符串
			  return sixDigitNumber;
			},
			// 3. 鉴黄方法：本方法入参：图片的对象存储地址，正常返回（resolve)：都通过了检测
			// 鉴黄接口：上送图片地址，返回是否通过检查
			checkImgValid(path) {
				return new Promise((resolve, reject) => {
					if(Array.isArray(path)) {
						// 多个路径
						imgSecCheck(path).then(res => {
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
							this.$emit('deleteStepItemImg', this.index, path.length)
							// const newArrayLength = this.postImgList.length - this.fileID_list.length
							// this.postImgList = this.postImgList.slice(0, newArrayLength)
							// 对象存储中同步删除
							wx.cloud.deleteFile({
							  fileList: this.fileID_list, // 对象存储文件ID列表，最多50个，从上传文件接口或者控制台获取
							})
							resolve(false)
						})
					} else {
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
							this.$emit('deleteStepItemImg', this.index, 1)
							// const newArrayLength = this.postImgList.length - 1
							// this.postImgList = this.postImgList.slice(0, newArrayLength)
							// 对象存储中同步删除
							wx.cloud.deleteFile({
							  fileList: [this.cloud_path], // 对象存储文件ID列表，最多50个，从上传文件接口或者控制台获取
							})
							resolve(false)
						})
					}
				})
			},
			// 4. 回显图片
			showUploadImg(res) {
				if(res) {
					// 鉴黄通过
					if(Array.isArray(this.fileID_list)) {
						let file_length = this.fileID_list.length
						if(file_length > 0) {
							this.fileID_list.forEach((item, index) => {
								this.$emit('showStepItemImg', this.index, this.fileID_list.length, item, index)
								// this.$set(this.postImgList[this.postImgList.length-file_length+index], 'url', item)
								// this.postImgList[this.postImgList.length-file_length+index].status = 'done'
							})
						}
					} else {
						if(this.cloud_path) {
							this.$emit('showStepItemImg', this.index, 1, item, 0)
							// this.$set(this.postImgList[this.postImgList.length-1], 'url', this.cloud_path)
							// this.postImgList[this.postImgList.length-1].status = 'done'
						}
					}
				}
				
			},
			
			
			// //鉴黄
			// checkImgValid(imagePaths) {
			// 	// 创建一个 Promise 数组，每个 Promise 对应一张图片的鉴黄
			// 	const checkPromises = imagePaths.map((imagePath) => {
			// 		return new Promise((resolve, reject) => {
			// 			imgSecCheck(imagePath.url).then(res => {
			// 				resolve()
			// 			}, err => {
			// 				reject()
			// 			})
			// 		});
			// 	});
				
			// 	// 使用 Promise.all 等待所有上传任务完成
			// 	return Promise.all(checkPromises);
			// },
			// 点击预览的x号，将图片删除
			deleteImg(event) {
				const file = event.detail.file.url,
				subIndex = event.detail.index
				this.$emit('deleteStepPics', file, this.index, subIndex)
			},
		}
	}
</script>

<style lang="less" scoped>
	.guide-edit-step-item {
		padding: 0 30rpx;

		// .guide-edit-step-title {
		// 	font-size: 20/16rem;
		// 	font-weight: bold;
		// }

		.guide-edit-step-item-url{
			display: flex;
			.guide-edit-step-item-url-name {
				flex: 1;
				margin-right: 30rpx;
				.guide-edit-step-item-url-icon {
					height: 22rpx;
					width: 22rpx;
					margin-right: 15rpx;
				}
			}
			.guide-edit-step-item-url-url {
				flex: 2;
			}
		}
		.guide-edit-step-url-add-btn {
			margin-top: 30rpx;
			padding: 10rpx 20rpx;
			background: #F7F7F7;
			color: rgba(0,0,0,0.5);
			line-height: 37rpx;		
			font-size: 26rpx;
			.guide-edit-step-url-add-btn-icon {
				margin-right: 15rpx;
			}
		}

		.guide-edit-step-pic {
			display: flex;
            margin-top: 40rpx;
		}
	}
	
	// .compress_canvas{
	//     position: absolute;
	//     left: -99999px;
	//     top:-99999px;
	// }
</style>
