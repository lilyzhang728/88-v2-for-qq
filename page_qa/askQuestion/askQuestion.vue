<!-- 提问页面 -->
<template>
	<view class="ask-question" :style="{backgroundImage: backgroundImage,backgroundSize: '100%',backgroundColor: '#fff',backgroundRepeat: 'no-repeat'}">
		<z-paging ref="paging" :paging-style="pagingStyle">
			<template #top>
				<back-topbar title="发布问题/经验"></back-topbar>
			</template>
			<!-- 编辑 -->
			<view class="add-new-post-edit">
				<!-- 问题标题 -->
				<view class="add-new-post-edit-title">
					<van-field
						class="add-new-post-edit-title-wrap field-input-custom"
						input-class="add-new-post-edit-title"
						:value="title"
						placeholder="请输入标题"
						auto-focus
						:border="false"
						@change.native="inputTitle($event)"
						@focus.native="inputBindFocus"
						@blur.native="inputBindBlur"
						maxlength=30
						clearable
					  />
				</view>
				
				<view class="add-new-post-edit-title-split"></view>
				
				<!-- 问题正文 -->
				<van-field
					class="add-new-post-edit-textarea-wrap field-input-custom"
					input-class="add-new-post-edit-textarea"
					:value="postVal"
					type="textarea"
					:show-confirm-bar="false"
					placeholder="请输入正文"
					autosize
					:border="false"
					@change.native="inputPost($event)"
					@focus.native="inputBindFocus"
					@blur.native="inputBindBlur"
					clearable
					:adjust-position="false"
				  />
				  
				<!-- uploader -->
				<van-uploader ref="imgUploader" class="img-uploader"
				:file-list="postImgList" deletable="true" max-count="3" 
				:preview-size="imageWidth" image-fit="aspectFit"
				use-before-read @beforeRead.native="beforeRead" multiple
				@afterRead.native="afterRead" @delete.native="deleteImg">
				</van-uploader>
				
				<!-- 解决ios键盘遮挡输入内容的问题 -->
				<view class="iosBottomBox" v-if="platform === 'ios'"></view>
								
				<view class="add-new-post-edit-title-split-bottom"></view>
			</view>
			
			<!-- 弹起键盘 -->
			<view class="add-new-post-keyboard" v-if="showKeyboard" :style="{bottom: bottomVal, height: keyboardHeight}">
				<view class="add-new-post-keyboard-topic" v-if="userName">
					<!-- <img class="add-new-post-keyboard-topic-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/topicIcon.png" alt=""> -->
					<text class="add-new-post-keyboard-topic-icon">@</text>
					<text class="add-new-post-keyboard-topic-text">{{userName}}</text>
					<!-- <van-icon v-if="!selectedTopic" name="arrow" size="20px" color="#d9d9d9" /> -->
					<!-- <van-icon v-else name="cross" size="20px" color="#d9d9d9" @click.native.stop="clearTopic($event)" /> -->
				</view>
				
				<!-- 发布按钮 -->
				<view class="view-btn-box">
					<van-button icon="guide-o" color="#35C8A7" class="view-btn-wrap" :disabled="!postVal || !title" custom-class="view-btn" size="small" @click.native="send">发布</van-button>
				</view>
			</view>
			
			<!-- toast提示 -->
			<van-toast id="van-toast" />
			
			<!-- 用于压缩上传图片 -->
			<view class="compress_canvas">
				<canvas canvas-id="myCanvas-0" :style="{width: w + 'px', height: h + 'px'}"></canvas>
				<canvas canvas-id="myCanvas-1" :style="{width: w + 'px', height: h + 'px'}"></canvas>
				<canvas canvas-id="myCanvas-2" :style="{width: w + 'px', height: h + 'px'}"></canvas>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import BackTopbar from '@/components/common/BackTopbar.vue'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import { addGuide } from '@/network/api_guide.js'
	import { imgSecCheck } from "@/tools/sec_check.js"
	import { invideUserAnswer } from '@/network/api_qa.js'
	export default {
		components: {
			BackTopbar
		},
		data() {
			return {
				title: '',
				postVal: '',	//提问内容
				bottomVal: '0px',	//键盘上话题bottom
				postImgList: [],	//上传图片list
				showKeyboard: true,
				// keyboardHeight: this.userName ? '85px' : '54px',	//键盘上话题height	1行54px，2行85px
				userName: '',
				userId: '',
				w: 0,
				h: 0,
				cloud_path: '',	//上传至对象存储的地址（单张）
				cloud_path_split: '',	//上传至对象存储的地址-截断（单张）
				fileID_list: [],	//上传至对象存储的地址（多张）
				fileID_list_split: [],	//上传至对象存储的地址-截断（多张）
				keyboardHeightVal: 0,
				platform: uni.getStorageSync('platform')
			}
		},
		computed: {
			backgroundImage() {
				return 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)'
			},
			imageWidth() {
				// 两边padding: 25*2+30*2=110; 图片margin-right:8px 8*3=24; 计算误差多-5
				return this.screenWidth ? ((this.screenWidth - this.rpxToPx(110) - 24 - 5) / 3) + 'px' : 0
			},
			screenWidth() {
				return uni.getStorageSync('screenWidth')
			},
			keyboardHeight() {
				return this.userName ? '85px' : '54px'
			},
			pagingStyle() {
				if(this.platform === 'android') {
					let keyboardHeight = this.userName ? 85 : 54
					let pagingBottom = (this.keyboardHeightVal + keyboardHeight) + 'px'
					return {'top': '0px', 'left': '25rpx', 'right': '25rpx', 'bottom': pagingBottom}
				} else {
					return {'top': '0px', 'left': '25rpx', 'right': '25rpx'}
				}
			}
		},
		watch: {
			platform(val) {
				if(val === 'android') {
					uni.onKeyboardHeightChange(res => {
						this.keyboardHeightVal = res.height; //软键盘高度 
					})
				}
			}
		},
		onLoad(option) {
			this.userName = option.userName ? option.userName : ''
			this.userId = option.userId ? option.userId : ''
			if(this.platform === 'android') {
				uni.onKeyboardHeightChange(res => {
					this.keyboardHeightVal = res.height; //软键盘高度 
				})
			}
		},
		methods: {
			// rpx转px
			rpxToPx(rpx) {
			  return (this.screenWidth * Number.parseInt(rpx)) / 750
			},
			//输入标题
			inputTitle(e) {
				this.title = e.detail
			},
			//编辑输入帖子
			inputPost(e) {
				this.postVal = e.detail
			},
			inputBindFocus(e) {
				// 获取手机键盘的高度，赋值给input 所在盒子的 bottom 值
				this.bottomVal = e.detail.height +  'px'
			},
			inputBindBlur() {
				this.bottomVal = 0
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
								// 1-3.压缩
								let [ w, h ] = this.calcImageSize(infoRes, file.size);
								this.w = w
								this.h = h
								// console.log(w, h, file.size)
								canvas.drawImage(infoRes.path, 0, 0, w, h)
								canvas.draw()
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
									  canvasId: "myCanvas-"+index,
									  success: (pathRes)=> {
										// 返回压缩后的图片路径
										resolve(pathRes.tempFilePath)
											
										// 获取文件信息
										 //  uni.getFileInfo({
											// filePath: pathRes.tempFilePath,
											// success: (fileInfo) => {
											//   console.log('绘制后图片文件大小：', fileInfo.size, '字节', fileInfo.size/1024, 'kb');
											// },
											// fail: (error) => {
											//   console.error('获取文件信息失败', error);
											// }
										 //  });
									  },
									   fail: (error) => {
									     console.error('返回压缩后的图片路径失败', error);
										 reject()
									   }
									})
								},500)
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
								return item.slice(item.indexOf('qa'))
							})
							this.fileID_list_split = [...fileID_list_split]
							
							resolve(fileID_list_split)
						}).catch(err => {
							// 上传失败，从本地文件列表中删除
							const newArrayLength = this.postImgList.length - file.length
							this.postImgList = this.postImgList.slice(0, newArrayLength)
							reject()
						})
					} else {
						// 上传1张
						this.uploadToCloud(file).then(res => {
							this.cloud_path = res
							this.cloud_path_split = res.slice(item.indexOf('qa'))
							resolve(this.cloud_path_split)
						}).catch(err => {
							// 上传失败，从本地文件列表中删除
							const newArrayLength = this.postImgList.length - 1
							this.postImgList = this.postImgList.slice(0, newArrayLength)
							reject()
						})
					}
				})
			},
			// 上传至云存储
			uploadToCloud(item) {
				return new Promise((resolve, reject) => {
					//回显（显示loading）
					this.postImgList.push({})
					this.$set(this.postImgList[this.postImgList.length-1], 'status', 'uploading')
					// 上传至云存储, 文件路径为 qa/userid/时间戳/随机数.jpg
					const userId = uni.getStorageSync('userId')
					this.timestamp = this.timestamp ? this.timestamp : new Date().getTime()
					let num = this.generateRandomNumber()
					wx.cloud.uploadFile({
					  cloudPath: `qa/${userId}/${this.timestamp}/${num}.jpg`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
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
							const newArrayLength = this.postImgList.length - this.fileID_list.length
							this.postImgList = this.postImgList.slice(0, newArrayLength)
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
							const newArrayLength = this.postImgList.length - 1
							this.postImgList = this.postImgList.slice(0, newArrayLength)
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
								this.$set(this.postImgList[this.postImgList.length-file_length+index], 'url', item)
								this.postImgList[this.postImgList.length-file_length+index].status = 'done'
							})
						}
					} else {
						if(this.cloud_path) {
							this.$set(this.postImgList[this.postImgList.length-1], 'url', this.cloud_path)
							this.postImgList[this.postImgList.length-1].status = 'done'
						}
					}
				}
				
			},
			
			// 点击预览的x号，将图片删除
			deleteImg(event) {
				const url = event.detail.file.url,
					  index = event.detail.index
				this.postImgList[this.postImgList.length-1].status = 'uploading'
				wx.cloud.deleteFile({
				  fileList: [url], // 对象存储文件ID列表，最多50个，从上传文件接口或者控制台获取
				}).then(res => {
				  this.postImgList[this.postImgList.length-1].status = 'done'
				  if(res.fileList[0].status === 0) {
					  //删除成功，同步到提交表单
					  this.postImgList.splice(index, 1)
				  } else {
					  //删除失败，提示
					  Toast('删除失败，请重试~')
				  }
				}).catch(err => {
					this.postImgList[index].status = 'done'
					console.error(err)
				})
			},
			//转换图片参数格式
			transformImg() {
				return this.postImgList.length ? this.postImgList.map(item => item.url) : []
			},
			//发帖
			send() {
				if(this.postVal && this.title) {
					addGuide({
						'title': this.title,
						'body': {
							'body': this.postVal,
							'urls': this.transformImg()
						},
						'post_type': 4,
						'status': 1,
						'topics': this.selectedTopic ? [this.addedTopicContent.id] : []
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							if(this.userId) {
								// 关联被邀请人
								invideUserAnswer({
									'user_id': this.userId,
									'id': res.data.id
								}).then(res2 => {
									if(res2.code === 0) {
										//发布成功，回到列表页，并刷新列表
										uni.navigateBack({
										    success: () => {
										         let page = getCurrentPages().pop();//跳转页面成功之后
										         if (page) {
													page.$vm.active = 0
										            page.$vm.$refs.questionAndAnswer.$refs.paging.reload()
													page.$vm.$refs.questionAndAnswer.toastMsg(true)
												 } 
										    },
										})
									}  else {
										Toast('邀请失败')
									}
								}, err => {
									Toast('邀请失败')
									console.log('invideUserAnswer: ', err)
								})
							} else {
								//发布成功，回到列表页，并刷新列表
								uni.navigateBack({
								    success: () => {
								         let page = getCurrentPages().pop();//跳转页面成功之后
										 if (page) {
											page.$vm.active = 0
								            page.$vm.$refs.questionAndAnswer.$refs.paging.reload()
											page.$vm.$refs.questionAndAnswer.toastMsg(true)
										 } 
								    },
								})
							}
						} else {
							Toast('发布失败')
						}
					}, err => {
						Toast('发布失败')
						console.log('addGuide: ', err)
					})
					// this.$emit("submit",this.val)
					// this.val = '';
				}
			},
		}
	}
</script>

<style lang="less" scoped>
.ask-question {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 0 25rpx;
	.add-new-post-edit {
		.add-new-post-edit-textarea-wrap {
			/deep/ .add-new-post-edit-textarea{
				min-height: 100px;
			}
		}
		.add-new-post-edit-title-wrap {
			.add-new-post-edit-title {
			}
		}
		.add-new-post-edit-title-split {
			height: 1px;
			border-bottom: 1px solid #EAEAEA;
			margin: 0 25rpx;
		}
	}
	.add-new-post-keyboard {
		position: fixed;
		left: 0;
		right: 0;
		box-sizing: border-box;
		padding: 12px;
		background-color: #fff;
		.add-new-post-keyboard-topic {
			height: 25px;
			display: flex;
			margin-bottom: 10px;
			align-items: center;
			.add-new-post-keyboard-topic-icon {
				font-size: 40rpx;
				color: #35C8A7;
				font-weight: bold;
			}
			.add-new-post-keyboard-topic-text {
				// margin-left: 10px;
				flex: 1;
				width: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 16px;
				color: #000;
				white-space: nowrap;
			}
		}
		.view-btn-box{
			margin-top: 10px;
			text-align: right;
			.view-btn-wrap {
				/deep/ .view-btn {
					// color: #ccc;
					// border: none;
					font-size: 16px;
					border-radius: 14rpx;
				}
			}
			.view-btn-wrap-active {
				/deep/ .view-btn {
					// color: #35C8A7;
				}
			}
		}
	}
}
.compress_canvas{
    position: absolute;
    left: -99999px;
    top:-99999px;
}
.iosBottomBox {
	height: 480px;
}
.add-new-post-edit-title-split-bottom {
		height: 1px;
		border-bottom: 1px solid transparent;
		margin: 0 25rpx;
		margin-bottom: 150rpx;
	}
</style>
