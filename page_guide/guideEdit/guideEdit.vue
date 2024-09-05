<!-- 攻略编辑页 -->
<template>
	<view class="guide-edit" :style="{backgroundImage: 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)',backgroundSize: '100%',backgroundColor: '#fff',backgroundRepeat: 'no-repeat'}">
		<back-topbar :title="ifEdit ? '编辑攻略' : '新建攻略'"></back-topbar>
		<z-paging ref="paging" :paging-style="{'top': (customBar) + 'px', 'bottom': '66px', paddingLeft: '25rpx', paddingRight: '25rpx'}">
			<!-- 封面图 -->
			<view class="guide-edit-img">
				<van-image width="100%"
				  height="100%"
				  fit="contain"
				  :src="guideInfo.body.cover_url"
				/>
				<view class="guide-edit-img-change" @click="changeImg">更换封面</view>
			</view>
			
			<!-- 标题 -->
			<view class="guide-edit-title">
				 <van-field
					:value="guideInfo.title"
					type="textarea"
					:show-confirm-bar="false"
					placeholder="添加标题"
					autosize
					:border="false"
					size="large"
					maxlength=30
					@change.native="changeTitle"
					placeholder-style="font-size: 32rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; font-weight: bold; padding-left: 0; padding-right: 0;"
					custom-style="font-size: 32rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; font-weight: bold; padding-left: 0; padding-right: 0;"
				  />
			</view>
			
			<!-- 说明 -->
			<view class="guide-edit-desc">
				<van-field
				   :value="guideInfo.body.summary"
				   type="textarea"
				   :show-confirm-bar="false"
				   placeholder="添加说明"
				   autosize
				   :border="false"
				   maxlength=30
				   @change.native="changeDesc"
				   placeholder-style="font-size: 26rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; padding-left: 0; padding-right: 0;"
				   custom-style="font-size: 26rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; padding-left: 0; padding-right: 0;"
				 />
			</view>
			
			<!-- 教辅材料 -->
			<view class="guide-edit-material">
				<view class="guide-edit-form-title">
					关键词/教辅
				</view>
				<view class="guide-edit-material-content">
					<van-field
						v-for="(item, index) in guideInfo.body.references"
						:key="index"
					   :value="item"
					   type="textarea"
					   :show-confirm-bar="false"
					   placeholder="添加关键词/教辅材料(选填)"
					   autosize
					   clearable
					   clear-trigger="always"
					   :border="false"
					   size="small"
					   use-button-slot
					   @change.native="changeMaterial($event, index)"
					   placeholder-style="font-size: 28rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; padding-left: 0; padding-right: 0;"
					   custom-style="font-size: 28rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; padding-left: 0; padding-right: 0;"
					 >
					</van-field>
					<view class="guide-edit-add-btn-box">
						<van-button plain class="guide-edit-add-btn-wrap" custom-class="guide-edit-add-btn" @click="addMaterial">增加材料</van-button>
					</view>
				</view>
			</view>
			
			<!-- 步骤 -->
			<view class="guide-edit-step" v-for="(item, index) in guideInfo.body.steps" :key="index">
				<view class="guide-edit-form-title">卷 {{index+1}}</view>
				<van-icon name="close" color="#7F7F7F" size="34rpx" class="guide-edit-step-delete" @click.native="deleteStep(index)" />
				<guide-edit-step-item :index="index" :step="item" :screenWidth="screenWidth"
				@addURL="addURL" @deleteURL="deleteURL" @updateStep="updateStep" @updateStepLinks="updateStepLinks" 
				@updateStepPics="updateStepPics" @updateStepPicsMultiple="updateStepPicsMultiple" @deleteStepPics="deleteStepPics"
				@showStepItemImg="showStepItemImg" @deleteStepItemImg="deleteStepItemImg"></guide-edit-step-item>
			</view>
			<view class="guide-edit-add-btn-box guide-edit-add-btn-box-step">
				<van-button plain class="guide-edit-add-btn-wrap" custom-class="guide-edit-add-btn" @click="addStep">增加章节</van-button>
			</view>
			
			<!-- 小贴士 -->
			<view class="guide-edit-tip">
				<view class="guide-edit-tip-title">
					<img class="guide-edit-tip-title-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/tipIcon.png" alt="">
					小贴士</view>
				<view class="guide-edit-tip-content">
					<van-field
						:value="guideInfo.body.tips"
						placeholder="有哪些需要注意的细节和小技巧"
						type="textarea"
						:show-confirm-bar="false"
						autosize
						:border="false"
						@change.native="changeTip"
						placeholder-style="font-size: 26rpx; background-color: transparent; padding-left: 0; padding-right: 0; padding-top: 0;"
						custom-style="font-size: 26rpx; background-color: transparent; padding-left: 0; padding-right: 0; padding-top: 0;"
					  />
				</view>
			</view>
		</z-paging>
		<!-- 按钮: 编辑页：已发布：显示“发布”； 未发布：显示“保存草稿”+“发布” -->
		<view class="guide-edit-btn-box" :class="{'guide-edit-btn-box-single': published}">
			<van-button @tap="handlePublish(0)" block icon="records" class="guide-edit-btn-wrap guide-edit-btn-wrap-plain" custom-class="guide-edit-btn" v-if="!published">
				保存到草稿箱</van-button>
			<van-button @tap="handlePublish(1)" :disabled="disabledPublish" block icon="guide-o" class="guide-edit-btn-wrap" custom-class="guide-edit-btn">发布</van-button>
		</view>
		
		<!-- 封面图片选择器 -->
		<view class="guide-edit-cover">
			<van-action-sheet :show="showCoverList" title="攻略封面" @close.native="closeCoverList">
			  <view class="guide-edit-cover-content">
				  <view class="guide-edit-cover-item" v-for="(item,index) in coverList" :key="index" @tap="selectImg(item)">
				  	<img :src="item" alt="" class="guide-edit-cover-img">
				  </view>
			  </view>
			</van-action-sheet>
		</view>
		
		<!-- toast提示 -->
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	const BOOK_IMG_LIST = [
		'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/book1.png',
		'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/book2.png',
		'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/book3.png',
		'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/book4.png',
		'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/book5.png',
		'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/book6.png'
	]
	import GuideEditStepItem from '@/page_guide/components/GuideEditStepItem.vue'
	import BackTopbar from '@/components/common/BackTopbar.vue'
	import { guideDetail, addGuide, editGuide } from '@/network/api_guide.js'
	import Toast from '@/wxcomponents/vant/toast/toast'
	export default {
		components: {
			GuideEditStepItem,
			BackTopbar
		},
		data() {
			return {
				guideInfo: {
					title: '',
					body: {
						cover_url: BOOK_IMG_LIST[0],
						summary: '',
						references: [''],
						steps: [{						// 请求后台时注意，这里至少保留一组空值
							subtile: '',
							body: '',
							links: [{
								name: '',
								url: ''
							}],
							pics: []
						}],
						tips: ''
					}
				},
				screenWidth: null,		//屏幕宽度
				customBar: 0,
				showCoverList: false,	//是否显示封面图片选择器
				coverList: BOOK_IMG_LIST,
				timestamp: null,	//时间戳，用于确定该用户创建的这篇攻略的所有图片的唯一文件夹名
				ifEdit: false,		//true为编辑页，false为新建页
				published: false,	//true为编辑页&&当前攻略为“已发布”-只显示“发布” false-新建页或未发布的编辑页，显示“保存草稿”+“发布”
			}
		},
		computed: {
			disabledPublish() {
				// 检查所有对象
				const allValid = this.guideInfo.body.steps.every(obj => {
				  const hasTitle = obj.subtile != null && obj.subtile !== '';
				  const hasBody = obj.body != null && obj.body !== '';
				  return (hasTitle && hasBody) || (!hasTitle && !hasBody);
				});
				
				// 检查是否至少有一个对象的subtile和body都有值
				const someTitleBodyValid = this.guideInfo.body.steps.some(obj => {
				  const hasTitle = obj.subtile != null && obj.subtile !== '';
				  const hasBody = obj.body != null && obj.body !== '';
				  return hasTitle && hasBody;
				});
				
				const isValid = allValid && someTitleBodyValid;
				
				return !this.guideInfo.title || !isValid
			}
		},
		onLoad(option) {
			if(option.guideId) {
				if(option.guideId) {
					//编辑攻略，请求回显数据
					this.ifEdit = true
					this.published = Number(option.status) === 1
					this.getGuideDetail(option.guideId)
				}
			}
		},
		onShow() {
			let that = this
			uni.getSystemInfo({
				success: (e) => {
					// #ifdef MP-WEIXIN
					this.statusBar = e.statusBarHeight
					this.screenWidth = e.screenWidth
					// @ts-ignore
					const custom = wx.getMenuButtonBoundingClientRect()
					this.customBar = custom.bottom + custom.top - e.statusBarHeight
					// #endif
				}
			})
		},
		methods: {
			getGuideDetail(id) {
				guideDetail(id).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						if(res.data.status === 1) {
							//已发布, 不显示“保存草稿”
							this.published = true
						}
						this.guideInfo = res.data
					} else {
						//接口返回失败，返回上一页， 并刷新
						uni.navigateBack({
						    success: () => {
						         let page = getCurrentPages().pop();//跳转页面成功之后
						         if (page) {
									 page.$vm.backRefresh('guide')
						         } 
						    },
						})
					}
				}, err => {
					console.log('guideDetail: ', err)
				})
			},
			//切换封面图
			changeImg() {
				this.showCoverList = true
			},
			//关闭封面选择器
			closeCoverList() {
				this.showCoverList = false
			},
			//选择一个封面图
			selectImg(url) {
				this.guideInfo.body.cover_url = url
				this.showCoverList = false
			},
			// 更新输入值 - 标题
			changeTitle(e) {
				this.guideInfo.title = e.detail
			},
			// 更新输入值 - 说明
			changeDesc(e) {
				this.guideInfo.body.summary = e.detail
			},
			// 更新输入值 - 教辅材料
			changeMaterial(e, index) {
				if(e.detail) {
					// change
					this.guideInfo.body.references[index] = e.detail
				} else {
					// 清空
					if(this.guideInfo.body.references.length > 1) {
						// 直接删除这一项
						this.guideInfo.body.references.splice(index, 1)
					} else {
						// 第一项置为''
						this.guideInfo.body.references[0] = ''
					}
				}
			},
			// 更新输入值 - 步骤
			updateStep(index, key, value) {
				if(key === 'picList') {
					// 添加图片
					this.guideInfo.body.steps[index][key].push(value)
				} else {
					this.guideInfo.body.steps[index][key] = value
				}
			},
			// 更新输入值 - 步骤-links
			updateStepLinks(index, value, subIndex, key) {
				this.guideInfo.body.steps[index]['links'][subIndex][key] = value
			},
			// 更新输入值 - 步骤-上传一张图片
			updateStepPics(index, url) {
				// 回显
				this.guideInfo.body.steps[index]['pics'].push({})
				this.$set(this.guideInfo.body.steps[index]['pics'][this.guideInfo.body.steps[index]['pics'].length-1], 'status', 'uploading')
				// 上传至云存储, 文件路径为 guide/userid/时间戳/index-subindex.png: index为第几步，subindex为第几张图片
				const userId = uni.getStorageSync('userId')
				this.timestamp = this.timestamp ? this.timestamp : new Date().getTime()
				wx.cloud.uploadFile({
				  cloudPath: `guide/${userId}/${this.timestamp}/${index}-${this.guideInfo.body.steps[index]['pics'].length-1}.png`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
				  filePath: url, 
				  config: {
				    env: 'prod-4gkvfp8b0382845d' // 需要替换成自己的微信云托管环境ID
				  }
				}).then(res => {
					this.$set(this.guideInfo.body.steps[index]['pics'][this.guideInfo.body.steps[index]['pics'].length-1], 'url', res.fileID)
					this.guideInfo.body.steps[index]['pics'][this.guideInfo.body.steps[index]['pics'].length-1].status = 'done'
				}).catch(error => {
				  console.error(err)
				})
			},
			// 更新输入值 - 步骤-上传多张图片
			updateStepPicsMultiple(index, file) {
				// 上传多张
				file.forEach((item, subIndex) => {
					//回显
					this.guideInfo.body.steps[index]['pics'].push({})
					this.$set(this.guideInfo.body.steps[index]['pics'][this.guideInfo.body.steps[index]['pics'].length-1], 'status', 'uploading')
					// 上传至云存储, 文件路径为 guide/userid/时间戳/index-subindex.png: index为第几步，subindex为第几张图片
					const userId = uni.getStorageSync('userId')
					this.timestamp = this.timestamp ? this.timestamp : new Date().getTime()
					wx.cloud.uploadFile({
					  cloudPath: `guide/${userId}/${this.timestamp}/${index}-${this.guideInfo.body.steps[index]['pics'].length-1}.png`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
					  filePath: item.url, 
					  config: {
					    env: 'prod-4gkvfp8b0382845d' // 需要替换成自己的微信云托管环境ID
					  }
					}).then(res => {
						this.$set(this.guideInfo.body.steps[index]['pics'][this.guideInfo.body.steps[index]['pics'].length-file.length+subIndex], 'url', res.fileID)
						this.guideInfo.body.steps[index]['pics'][this.guideInfo.body.steps[index]['pics'].length-file.length+subIndex].status = 'done'
					}).catch(error => {
					  console.error(err)
					})
				})
			},
			showStepItemImg(index, length, url, subIndex) {
				if(length && url) {
					//回显（done)
					this.$set(this.guideInfo.body.steps[index]['pics'][this.guideInfo.body.steps[index]['pics'].length-length+subIndex], 'url', url)
					this.guideInfo.body.steps[index]['pics'][this.guideInfo.body.steps[index]['pics'].length-length+subIndex].status = 'done'
				} else {
					//回显（loading)
					this.guideInfo.body.steps[index]['pics'].push({})
					this.$set(this.guideInfo.body.steps[index]['pics'][this.guideInfo.body.steps[index]['pics'].length-1], 'status', 'uploading')
				}
				
			},
			deleteStepItemImg(index, length) {
				const newArrayLength = this.guideInfo.body.steps[index]['pics'].length - length
				this.postImgList = this.guideInfo.body.steps[index]['pics'].slice(0, newArrayLength)
			},
			//更新输入值 - 步骤-删除一张图片  url为图片在云存储的地址
			deleteStepPics(url, index, subIndex) {
				this.guideInfo.body.steps[index]['pics'][subIndex].status = 'uploading'
				wx.cloud.deleteFile({
				  fileList: [url], // 对象存储文件ID列表，最多50个，从上传文件接口或者控制台获取
				}).then(res => {
				  this.guideInfo.body.steps[index]['pics'][subIndex].status = 'done'
				  if(res.fileList[0].status === 0) {
					  //删除成功，同步到提交表单
					  this.guideInfo.body.steps[index]['pics'].splice(subIndex, 1)
				  } else {
					  //删除失败，提示
					  Toast('删除失败，请重试~')
				  }
				}).catch(err => {
					this.guideInfo.body.steps[index]['pics'][subIndex].status = 'done'
					console.error(err)
				})
			},
			//更新输入值 - tips
			changeTip(e) {
				this.guideInfo.body.tips = e.detail
			},
			//新增一行教辅材料
			addMaterial() {
				this.guideInfo.body.references.push('')
			},
			//添加链接
			addURL(index) {
				this.guideInfo.body.steps[index].links.push({
					name: '',
					url: ''
				})
			},
			//删除链接
			deleteURL(index, subIndex) {
				if(this.guideInfo.body.steps[index].links.length < 2) {
					this.guideInfo.body.steps[index].links = [{
						"name": "",
						"url": ""
					}]
				} else {
					this.guideInfo.body.steps[index].links.splice(subIndex, 1)
				}
			},
			//增加步骤
			addStep() {
				this.guideInfo.body.steps.push({
					"subtile": "",
					"body": "",
					"links": [
					  {
						"name": "",
						"url": ""
					  }
					],
					"pics": []
				})
			},
			// 删除步骤
			deleteStep(index) {
				if(this.guideInfo.body.steps.length < 2) {
					this.$set(this.guideInfo.body.steps, 0, {
						"subtile": "",
						"body": "",
						"links": [
						  {
							"name": "",
							"url": ""
						  }
						],
						"pics": []
					})
				} else {
					this.guideInfo.body.steps.splice(index, 1)
				}
			},
			//保存到草稿箱status===0（未发布）、发布status===1（已发布）
			handlePublish(status) {
				//只要点发布，无论新建还是编辑，状态都置为1（已发布）
				if(this.ifEdit) {
					// 当前为编辑页
					this.handleEditGuide(status)
				} else {
					// 当前为新增页
					this.handleAddGuide(status)
				}
			},
			//调用编辑接口
			handleEditGuide(status) {
				if(status && this.disabledPublish) {
					// 发布且未通过必输校验
					return
				} else {
					// 发布且通过必输校验，或者保存草稿箱
					editGuide({
						'title': this.guideInfo.title,
						'body': this.guideInfo.body,
						'post_type': 1,
						'id': this.guideInfo.id,
						'status': status
					}).then(res => {
						if(res.code === 0) {
							//编辑成功，回到上一页
							Toast('发布成功！')
							uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
							    delta: 1
							});
						} else {
							Toast('发布失败')
						}
					}, err => {
						Toast('发布失败')
						console.log('addGuide: ', err)
					})
				}
			},
			//调用新建接口
			handleAddGuide(status) {
				if(status && this.disabledPublish) {
					// 发布且未通过必输校验
					return
				} else {
					// 发布且通过必输校验，或者保存草稿箱
					addGuide({
						'title': this.guideInfo.title,
						'body': this.guideInfo.body,
						'post_type': 1,
						'status': status
					}).then(res => {
						if(res.code === 0) {
							//发布成功，回到列表页，并刷新列表
							Toast('发布成功！')
							// 3个入口：1./userful 2. /mine/myProduction 3./guideDetail
							uni.navigateBack({
								success: () => {
									 let page = getCurrentPages().pop();//跳转页面成功之后
									 if (page) {
										 page.$vm.backRefresh('guide')
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
				}
			}
		}
	}
</script>

<style lang="less" scoped>
.guide-edit {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	padding: 0 25rpx;
	.guide-edit-img {
		box-sizing: border-box;
		padding: 37rpx 0;
		margin-top: 25rpx;
		height: 511rpx;
		width: 100%;
		position: relative;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 15rpx 0rpx rgba(81,211,184,0.1);
		border-radius: 20rpx;
		.guide-edit-img-change {
			display: inline-block;
			position: absolute;
			bottom: 0;
			right: 0;
			font-size: 26rpx;
			color: rgba(0,0,0,0.8);
			background-color: #F2F2F2;
			padding: 20rpx 20rpx;
			border-top-left-radius: 30%;
			border-bottom-right-radius: 30%;
			line-height: 37rpx;
		}
	}
	.guide-edit-title {
		margin-top: 40rpx;
	}
	.guide-edit-desc {
		margin-top: 26rpx;
	}
	.guide-edit-material {
		margin-top: 39rpx;
		border: 1rpx solid #E9E9E9;
		padding: 20rpx 0 30rpx 0; 
		.guide-edit-material-content {
			padding: 0 30rpx;
		}
	}
	.guide-edit-step {
		margin-top: 30rpx;
		border: 1rpx solid #E9E9E9;
		padding: 20rpx 0 30rpx 0;
		position: relative;
		.guide-edit-step-delete{
			position: absolute;
			right: 20rpx;
			top: 20rpx;
		}
	}
	.guide-edit-form-title {
		display: inline-flex;
		font-weight: bold;
		font-size: 28rpx;
		color: #FFFFFF;
		line-height: 40rpx;
		padding: 7rpx 30rpx;
		background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
		border-top-right-radius: 20%; 
		align-items: center;
		position: relative;
		.guide-edit-material-title-icon {
			margin-left: 20rpx;
			position: absolute;
			right: -44rpx;
		}
	}
	.guide-edit-add-btn-box {
		margin-top: 20rpx;
		.guide-edit-add-btn-wrap {
			/deep/ .guide-edit-add-btn {
				font-size: 24rpx;
				color: #35C8A7;
				line-height: 33rpx;
				padding: 9rpx 27rpx;
				background: #fff;
				border: 1rpx solid #50D2B7;
				border-radius: 10rpx;
				height: auto
			}
		}
		.guide-edit-add-btn-wrap-del {
			margin-left: 20rpx;
			/deep/ .guide-edit-add-btn {
				border: 1rpx solid #D4D4D4;
				color: #000;
			}
		}
	}
	.guide-edit-add-btn-box-step {
		margin: 20rpx 30rpx 0 30rpx;
	}
	
	.guide-edit-tip {
		background-color: #fff;
		margin-bottom: 30rpx;
		margin-top: 40rpx;
		.guide-edit-tip-title {
			font-weight: 600;
			color: rgba(0,0,0,0.8);
			line-height: 41rpx;
			font-size: 28rpx;
			display: flex;
			align-items: center;
			margin-bottom: 10rpx;
			.guide-edit-tip-title-icon {
				height: 28rpx;
				width: 28rpx;
				margin-right: 10rpx;
			}
		}
		.guide-edit-tip-content {
			
		}
	}
	
	.guide-edit-btn-box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		box-shadow: 0rpx -1rpx 13rpx 0rpx rgba(0,0,0,0.1);
		padding: 11px 14px;   //因为z-paging只能设置px,所以这里都换算成px， button的height固定44px
		display: flex;
		.guide-edit-btn-wrap {
			width: 50%;
			margin-right: 20rpx;
			&:last-child {
				margin-right: 0;
			}
			/deep/ .guide-edit-btn {		
				font-size: 32rpx;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 45rpx;
				padding: 18rpx 0;
				background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
				border-radius: 10rpx;
			}
		}
		.guide-edit-btn-wrap-plain {
			/deep/ .guide-edit-btn {
				background: #fff;
				border: 2rpx solid #50D2B7;
				color: #35C8A7;
			}
		}
	}
	
	.guide-edit-btn-box-single {
		.guide-edit-btn-wrap {
			width: 100%;
		}
	}
	
	.guide-edit-cover {
		.guide-edit-cover-content {
			margin: 10px;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start; // 替代原先的space-between布局方式
			max-height: calc(100vw / 1.8);
			overflow: scroll;
			
			.guide-edit-cover-item {
				flex: 1;
				// background-color: aquamarine;
				margin: 0 5px 10px 0; // 间隙为5px
				width: calc((100vw - 15px - 20px) / 4); // 这里的15px = (分布个数4-1)*间隙5px, 可以根据实际的分布个数和间隙区调整
				min-width: calc((100vw - 15px - 20px) / 4); // 加入这两个后每个item的宽度就生效了
				max-width: calc((100vw - 15px - 20px) / 4); // 加入这两个后每个item的宽度就生效了
				height: calc((100vw - 15px - 20px) / 4);
				text-align: center;
				position: relative;
				&:nth-child(4n) {
					// 去除第4n个的margin-right
					margin-right: 0;
				}
				
				.guide-edit-cover-img {
					width: 90%;
					height: 90%;
					position: absolute;
					left: 5%;
					top: 5%;
				}
			}
		}
	}
}
</style>
