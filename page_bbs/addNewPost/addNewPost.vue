<!-- 发布新帖子 -->
<template>
	<view class="add-new-post" :style="{backgroundImage: backgroundImage,backgroundSize: '100%',backgroundColor: '#fff',backgroundRepeat: 'no-repeat'}">
		<back-topbar title="发布帖子"></back-topbar>
		<!-- 入口 -->
		<view class="add-new-post-entrance" v-if="!showEdit">
			<view class="add-new-post-header">
				<text class="add-new-post-header-title">新的动态</text>
				<!-- <van-button size="small" class="add-new-post-header-btn-wrap" custom-class="add-new-post-header-btn">发布</van-button> -->
			</view>
			<view class="add-new-post-topic" @click="editAddTopic">#{{selectedTopic && addedTopicContent.body ? addedTopicContent.body : '试试添加话题'}}</view>
			<view class="add-new-post-content" @click="handleInput">
				<view class="add-new-post-content-line">
					<img src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg" class="add-new-post-content-avatar" alt="">
					<text class="add-new-post-content-placeholder">交流，但不强求共鸣…</text>
				</view>
				<img src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/bbs/addImgIcon.png" alt="" class="add-new-post-content-img-icon">
			</view>
		</view>
		
		<!-- 编辑 -->
		<view class="add-new-post-edit" v-else>
			<van-field
				class="add-new-post-edit-textarea-wrap"
				input-class="add-new-post-edit-textarea"
				:value="postVal"
				type="textarea"
				:show-confirm-bar="false"
				placeholder="请输入留言"
				autosize
				auto-focus
				:border="false"
				@change.native="inputPost($event)"
				@focus.native="inputBindFocus"
				@blur.native="inputBindBlur"
			  />
			  
			<!-- uploader -->
			<van-uploader ref="imgUploader" class="img-uploader"
			:file-list="postImgList" deletable="true" max-count="9" 
			:preview-size="imageWidth" image-fit="aspectFit"
			use-before-read @beforeRead.native="beforeRead"
			@afterRead.native="afterRead" @delete.native="deleteImg">
			</van-uploader>
		</view>
		
		<!-- 弹起键盘 -->
		<view class="add-new-post-keyboard" v-if="showKeyboard" :style="{bottom: bottomVal, height: keyboardHeight}">
			<view class="add-new-post-keyboard-topic" @click.native="addTopic">
				<img class="add-new-post-keyboard-topic-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/topicIcon.png" alt="">
				<text class="add-new-post-keyboard-topic-text">{{selectedTopic ? (addedTopicContent.body ? addedTopicContent.body : '') : topicPlaceholder}}</text>
				<van-icon v-if="!selectedTopic" name="arrow" size="20px" color="#d9d9d9" />
				<van-icon v-else name="cross" size="20px" color="#d9d9d9" @click.native.stop="clearTopic($event)" />
			</view>
			<!-- <view class="add-new-post-keyboard-img">
				<van-uploader ref="imgUploader" v-if="showUploader" class="img-uploader" 
				:file-list="postImgList" deletable="true" max-count="9" 
				:preview-size="imageWidth" image-fit="aspectFit"
				use-before-read @beforeRead.native="beforeRead"
				@afterRead.native="afterRead" @delete.native="deleteImg">
					<van-icon name="photo-o" size="30px" color="#6d6d6d" />
				</van-uploader>
				<van-icon v-else name="photo-o" size="30px" color="#6d6d6d" />
			</view> -->
			
			<!-- 发布按钮 -->
			<view class="view-btn-box">
				<van-button class="view-btn-wrap" :class="{'view-btn-wrap-active': postVal}" custom-class="view-btn" size="small" @click.native="send">发送</van-button>
			</view>
		</view>
		
		<!-- toast提示 -->
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import BackTopbar from '@/components/common/BackTopbar.vue'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import { guideDetail, addGuide, editGuide } from '@/network/api_guide.js'
	import { imgSecCheck } from "@/tools/sec_check.js"
	export default {
		components: {
			BackTopbar
		},
		data() {
			return {
				showEdit: false,	//是否显示编辑页
				postVal: '',		//发帖内容
				showKeyboard: false,	//是否显示键盘上的话题
				bottomVal: '0px',	//键盘上话题bottom
				keyboardHeight: '85px',	//键盘上话题height	1行54px，2行85px
				selectedTopic: false,	//是否已经选好话题
				addedTopicContent: {
					body: '',
					field: '',
					id: '',
					posts_count: 0,
					timestamp: '',
					views: 0
				},	//选好的话题内容
				topicPlaceholder: '添加话题',	//默认提示
				postImgList: [],	//上传图片list
				screenWidth: null,		//屏幕宽度
			}
		},
		computed: {
			backgroundImage() {
				return this.showEdit ? 'none' : 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)'
			},
			imageWidth() {
				// 两边padding: 25*2+30*2=110; 图片margin-right:8px 8*3=24; 计算误差多-5
				return this.screenWidth ? ((this.screenWidth - this.rpxToPx(110) - 24 - 5) / 3) + 'px' : 0
			}
		},
		onLoad(option) {
			if(option.topicInfo) {
				this.addedTopicContent = JSON.parse(decodeURIComponent(option.topicInfo))
				this.selectedTopic = true
			}
		},
		onShow() {
			let that = this
			uni.getSystemInfo({
				success: (e) => {
					// #ifdef MP-WEIXIN
					this.statusBar = e.statusBarHeight
					this.screenWidth = e.screenWidth
					// #endif
				}
			})
		},
		methods: {
			// rpx转px
			rpxToPx(rpx) {
			  return (this.screenWidth * Number.parseInt(rpx)) / 750
			},
			//切换为编辑页面并跳转添加话题页
			editAddTopic() {
				uni.navigateTo({
					url: '/page_bbs/addPostTopic/addPostTopic?showEdit=1'
				})
			},
			//切换为编辑页面
			handleInput() {
				this.showEdit = true
				this.showKeyboard = true
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
			//去话题列表页
			addTopic() {
				uni.navigateTo({
					url: '/page_bbs/addPostTopic/addPostTopic'
				})
			},
			//清空已选话题
			clearTopic(e) {
				e.preventDefault();
				this.selectedTopic = false
				this.addedTopicContent = {
					body: '',
					field: '',
					id: '',
					posts_count: 0,
					timestamp: '',
					views: 0
				}
			},
			
			
			//before-read 事件可以在上传前进行校验，调用 callback 方法传入 true 表示校验通过，传入 false 表示校验失败。
			beforeRead(event) {
				const {
					file,
					callback
				} = event.detail;
				callback(file.type === 'image');
			},
			afterRead(event) {
				const file = event.detail.file
				//鉴黄
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
				
				
			},
			//鉴黄通过，回显 + 上传至云存储
			updateImg(file) {
				//回显
				this.postImgList.push({})
				this.$set(this.postImgList[this.postImgList.length-1], 'status', 'uploading')
				// 上传至云存储, 文件路径为 bbs/userid/时间戳/index.png: index为第几张图片
				const userId = uni.getStorageSync('userId')
				this.timestamp = this.timestamp ? this.timestamp : new Date().getTime()
				wx.cloud.uploadFile({
				  cloudPath: `bbs/${userId}/${this.timestamp}/${this.postImgList.length-1}.png`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
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
				if(this.postVal) {
					addGuide({
						'title': 'title',
						'body': {
							'body': this.postVal,
							'urls': this.transformImg()
						},
						'post_type': 3,
						'status': 1,
						'topics': this.selectedTopic ? [this.addedTopicContent.id] : []
					}).then(res => {
						if(res.code === 0) {
							//发布成功，回到列表页，并刷新列表
							Toast('发布成功！')
							uni.navigateBack({
							    success: () => {
							         let page = getCurrentPages().pop();//跳转页面成功之后
									 if (page) {
										 page.$vm.active = 0
							             page.$vm.$refs.bbsRec.$refs.paging.reload()
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
			}
			
		}
	}
</script>

<style lang="less" scoped>
.add-new-post {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 0 25rpx;
	.add-new-post-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 50rpx;
		.add-new-post-header-title {
			font-size: 38rpx;
			font-weight: 600;
			color: #000000;
			line-height: 53rpx;
		}
		.add-new-post-header-btn-wrap {
			/deep/ .add-new-post-header-btn {
				padding: 4rpx 26rpx !important;
				line-height: 43rpx !important;
				font-weight: 600 !important;
				font-size: 26rpx !important;
				background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%) !important;
				border-radius: 8rpx !important;
				border: none !important;
				color: #fff !important;
			}
		}
	}
	.add-new-post-topic {
		margin-top: 23rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		border: 1rpx solid #E1E1E1;
		padding: 30rpx;
		color: #000000;
		line-height: 42rpx;
		font-size: 30rpx;
	}
	.add-new-post-content {
		margin-top: 30rpx;
		height: 624rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		border: 1rpx solid #E1E1E1;
		padding: 30rpx;
		box-sizing: border-box;
		position: relative;
		.add-new-post-content-line {
			display: flex;
			align-items: center;
			.add-new-post-content-avatar {
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			.add-new-post-content-placeholder {
				font-size: 30rpx;
				color: rgba(0,0,0,0.2);
				line-height: 42rpx;
			}
		}
		.add-new-post-content-img-icon {
			width: 110rpx;
			height: 110rpx;
			position: absolute;
			left: 30rpx;
			bottom: 30rpx;
		}
	}
	
	.add-new-post-edit {
		.add-new-post-edit-textarea-wrap {
			/deep/ .add-new-post-edit-textarea{
				min-height: 100px;
			}
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
					color: #ccc;
					border: none;
					font-size: 16px;
				}
			}
			.view-btn-wrap-active {
				/deep/ .view-btn {
					color: #35C8A7;
				}
			}
		}
	}
}
</style>
