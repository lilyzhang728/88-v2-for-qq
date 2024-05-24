<!-- 新增情报 -->
<template>
	<view class="add-news" :style="{backgroundImage: backgroundImage,backgroundSize: '100%',backgroundColor: '#fff',backgroundRepeat: 'no-repeat'}">
		<z-paging ref="paging" :paging-style="{'top': '0px', 'left': '25rpx', 'right': '25rpx'}">
			<template #top>
				<back-topbar title="发布情报" class="add-news-title"></back-topbar>
			</template>
			
			<view class="add-new-post-edit">
				<!-- 标题 -->
				<view class="add-new-post-edit-title">
					<van-field
						class="add-new-post-edit-title-wrap"
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
				
				<!-- 正文 -->
				<van-field
					class="add-new-post-edit-textarea-wrap"
					input-class="add-new-post-edit-textarea"
					:value="postVal"
					type="textarea"
					:show-confirm-bar="false"
					placeholder="请输入情报正文"
					autosize
					:border="false"
					@change.native="inputPost($event)"
					@focus.native="inputBindFocus"
					@blur.native="inputBindBlur"
				  />
				
				
				<!-- 链接 -->
				<van-field
					class="add-new-post-edit-title-wrap"
					input-class="add-new-post-edit-title"
					:value="urlVal"
					placeholder="请输入情报链接"
					autosize
					:border="false"
					@change.native="inputUrl($event)"
					@focus.native="inputBindFocus"
					@blur.native="inputBindBlur"
				/>
				
				<view class="add-new-post-edit-title-split add-new-post-edit-title-split-bottom"></view>
				  
				<!-- uploader -->
				<!-- <van-uploader ref="imgUploader" class="img-uploader"
				:file-list="postImgList" deletable="true" max-count="3" 
				:preview-size="imageWidth" image-fit="aspectFit"
				use-before-read @beforeRead.native="beforeRead" multiple
				@afterRead.native="afterRead" @delete.native="deleteImg">
				</van-uploader> -->
			</view>
			
			<!-- 弹起键盘 -->
			<view class="add-new-post-keyboard" v-if="showKeyboard" :style="{bottom: bottomVal, height: keyboardHeight}">
				<!-- <view class="add-new-post-keyboard-topic">
					<img class="add-new-post-keyboard-topic-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/topicIcon.png" alt="">
					<text class="add-new-post-keyboard-topic-text">{{userName}}</text>
					<van-icon v-if="!selectedTopic" name="arrow" size="20px" color="#d9d9d9" />
					<van-icon v-else name="cross" size="20px" color="#d9d9d9" @click.native.stop="clearTopic($event)" />
				</view> -->
				
				<!-- 发布按钮 -->
				<view class="view-btn-box">
					<van-button icon="guide-o" color="#35C8A7" class="view-btn-wrap" :disabled="!postVal || !title" custom-class="view-btn" size="small" @click.native="send">发布</van-button>
				</view>
			</view>
			
			<!-- toast提示 -->
			<van-toast id="van-toast" />
		</z-paging>
	</view>
</template>

<script>
	import BackTopbar from '@/components/common/BackTopbar.vue'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import { guideDetail, addGuide, editGuide } from '@/network/api_guide.js'
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
				urlVal: '',		//链接
				bottomVal: '0px',	//键盘上话题bottom
				postImgList: [],	//上传图片list
				showKeyboard: true,
				keyboardHeight: '54px',	//键盘上话题height	1行54px，2行85px
				userName: '',
				userId: '',
				customBarTop: uni.getStorageSync('customBarTop') ? uni.getStorageSync('customBarTop') : 0,
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
			}
		},
		onLoad(option) {
			this.userName = option.userName ? option.userName : ''
			this.userId = option.userId ? option.userId : ''
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
			//输入链接
			inputUrl(e) {
				this.urlVal = e.detail
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
			afterRead(event) {
				const file = event.detail.file
				//鉴黄
				if(Array.isArray(file)) {
					// 上传多张
					this.checkImgValid(file).then(res => {
						this.updateImg(file)
					}).catch(err => {
						uni.showModal({
							title: '提示',
							content: '您发布的图片可能包括敏感信息，请重新发布',
							success: function(res) {}
						})
					})
				} else {
					imgSecCheck(file.url).then(res => {
						this.updateImg(file)
					}, err => {
						uni.showModal({
							title: '提示',
							content: '您发布的图片可能包括敏感信息，请重新发布',
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
				}
			},
			//鉴黄
			checkImgValid(imagePaths) {
				// 创建一个 Promise 数组，每个 Promise 对应一张图片的鉴黄
				const checkPromises = imagePaths.map((imagePath) => {
					return new Promise((resolve, reject) => {
						imgSecCheck(imagePath.url).then(res => {
							resolve()
						}, err => {
							reject()
						})
					});
				});
				
				// 使用 Promise.all 等待所有上传任务完成
				return Promise.all(checkPromises);
			},
			//鉴黄通过，回显 + 上传至云存储
			updateImg(file) {
				if(Array.isArray(file)) {
					// 上传多张
					file.forEach((item, index) => {
						//回显
						this.postImgList.push({})
						this.$set(this.postImgList[this.postImgList.length-1], 'status', 'uploading')
						// 上传至云存储, 文件路径为 news/userid/时间戳/index.png: index为第几张图片
						const userId = uni.getStorageSync('userId')
						this.timestamp = this.timestamp ? this.timestamp : new Date().getTime()
						wx.cloud.uploadFile({
						  cloudPath: `news/${userId}/${this.timestamp}/${this.postImgList.length-1}.png`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
						  filePath: item.url, 
						  config: {
						    env: 'prod-4gkvfp8b0382845d' // 需要替换成自己的微信云托管环境ID
						  }
						}).then(res => {
							this.$set(this.postImgList[this.postImgList.length-file.length+index], 'url', res.fileID)
							this.postImgList[this.postImgList.length-file.length+index].status = 'done'
						}).catch(error => {
						  console.error(error)
						})
					})
				} else {
					//回显
					this.postImgList.push({})
					this.$set(this.postImgList[this.postImgList.length-1], 'status', 'uploading')
					// 上传至云存储, 文件路径为 news/userid/时间戳/index.png: index为第几张图片
					const userId = uni.getStorageSync('userId')
					this.timestamp = this.timestamp ? this.timestamp : new Date().getTime()
					wx.cloud.uploadFile({
					  cloudPath: `news/${userId}/${this.timestamp}/${this.postImgList.length-1}.png`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
					  filePath: file.url, 
					  config: {
					    env: 'prod-4gkvfp8b0382845d' // 需要替换成自己的微信云托管环境ID
					  }
					}).then(res => {
						this.$set(this.postImgList[this.postImgList.length-1], 'url', res.fileID)
						this.postImgList[this.postImgList.length-1].status = 'done'
					}).catch(error => {
					  console.error(err)
					})
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
				if(this.title && this.postVal) {
					addGuide({
						'title': this.title,
						'body': {
							'body': this.postVal,
							'urls': this.transformImg(),
							'source': this.urlVal,	// 情报来源
						},
						'post_type': 2,
						'status': 1
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							//发布成功，回到列表页，并刷新列表
							uni.navigateBack({
							    success: () => {
							         let page = getCurrentPages().pop();//跳转页面成功之后
									 if (page) {
										page.$vm.$refs.active = 0
							            page.$vm.$refs.news.$refs.paging.reload()
										page.$vm.toastMsg(true)
									 } 
							    },
							})
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
.add-news {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 0 25rpx;
	.add-news-title {
		
	}
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
		.add-new-post-edit-title-split-bottom {
			margin-bottom: 80rpx;
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
				height: 20px;
				width: 20px;
			}
			.add-new-post-keyboard-topic-text {
				margin-left: 10px;
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
</style>

