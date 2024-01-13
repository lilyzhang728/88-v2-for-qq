<template>
	<view class="guide-edit-step-item">
		<!-- <view class="guide-edit-step-title">步骤{{index + 1}}</view> -->

		<!-- 步骤副标题 -->
		<van-field :value="step.subtile" type="textarea" :show-confirm-bar="false" placeholder="添加副标题" autosize :border="false"
			@change.native="changeStepSubtitle"
			placeholder-style="font-size: 28rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; padding-left: 0; padding-right: 0;"
			custom-style="font-size: 28rpx; background-color: transparent; border-bottom: 1px solid #E8E8E8; padding-left: 0; padding-right: 0;" />

		<!-- 步骤说明 -->
		<van-field :value="step.body" type="textarea" :show-confirm-bar="false" placeholder="添加步骤说明" autosize :border="false" @change.native="changeStepBody"
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
			<van-field :value="link.url" placeholder="添加链接" class="guide-edit-step-item-url-url"
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
		<view class="guide-edit-step-pic">
			<van-uploader :file-list="step.pics" deletable="true" max-count="3" 
			:preview-size="imageWidth" image-fit="aspectFit"
			use-before-read @beforeRead.native="beforeRead"
			@afterRead.native="afterRead" @delete.native="deleteImg" />
		</view>
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
				fileList: this.pics
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
				callback(file.type === 'image');
			},
			afterRead(event) {
				const file = event.detail.file
				//鉴黄
				imgSecCheck(file.url).then(res => {
					this.$emit('updateStepPics', this.index, file.url)
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
</style>
