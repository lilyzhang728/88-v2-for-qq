<!-- 编辑个人信息 -->
<template>
	<view class="edit-personal-info" :style="{backgroundImage: 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)',backgroundSize: '100%',backgroundColor: '#fff',backgroundRepeat: 'no-repeat'}">
		<back-topbar title="编辑个人信息" refName="myAbility" functionName="reloadPortraitInfo"></back-topbar>
		<van-cell-group inset class="edit-personal-info-group" custom-class="edit-personal-info-wrap">
			<!-- 头像 -->
			<view class="edit-personal-info-avatar">
				<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar.native="onChooseAvatar">
					<image :src="userInfo.avatar" mode="" slot="value" class="edit-personal-img"></image>
				</button>
			</view>
			<van-field
			    :value="userInfo.name"
			    placeholder="请输入姓名"
			    @change.native="onChange($event, 'name')"
				label="姓名"
				required
				name="name"
				clearable
				:error="validator && !userInfo.name"
				custom-style="background: transparent"
			/>
			<van-field
			    :value="userInfo.school"
			    placeholder="请输入学校"
			    @change.native="onChange($event, 'school')"
				label="学校"
				required
				name="school"
				clearable
				:error="validator && !userInfo.school"
				custom-style="background: transparent"
			/>
			<van-field
			    :value="userInfo.major"
			    placeholder="请输入专业"
			    @change.native="onChange($event, 'major')"
				label="专业"
				required
				name="major"
				clearable
				:error="validator && !userInfo.major"
				custom-style="background: transparent"
			/>
			<van-field
			    :value="userInfo.startDay"
			    placeholder="请选择入学时间"
				label="入学时间"
				required
				name="startDay"
				right-icon="arrow"
				readonly
				@clickInput="clickDate('start')"
				@clickIcon.native="clickDate('start')"
				:error="validator && !userInfo.startDay"
				custom-style="background: transparent"
			/>
			<van-field
			    :value="userInfo.graduateDay"
			    placeholder="请选择毕业时间"
				label="毕业时间"
				required
				name="graduateDay"
				right-icon="arrow"
				readonly
				@clickInput="clickDate('end')"
				@clickIcon.native="clickDate('end')"
				:error="validator && !userInfo.graduateDay"
				custom-style="background: transparent"
			/>
			<van-field
			    :value="userInfo.target"
			    placeholder="请选择目标"
				label="目标"
				required
				name="target"
				right-icon="arrow"
				readonly
				@clickInput="clickTarget"
				@clickIcon.native="clickTarget"
				:error="validator && !userInfo.target"
				custom-style="background: transparent"
			/>
			<van-field
			    :value="userInfo.about_me"
			    placeholder="请输入个性签名"
			    @change.native="onChange($event, 'about_me')"
				label="个性签名"
				required
				name="about_me"
				clearable
				:error="validator && !userInfo.about_me"
				custom-style="background: transparent"
			/>
		</van-cell-group>

		<view class="save-btn-box">
			<van-button class="save-btn-wrap" custom-class="save-btn" @click="handleSave">保存</van-button>
		</view>


		<!-- 时间选择器 -->
		<van-popup :show="showDatePicker" position="bottom">
			<van-datetime-picker type="year-month" :value="currentDate" :title="datePickerTitle"
				:min-date="minDate" :max-date="maxDate" @confirm.native="selectedDate" @cancel.native="onClose" />
		</van-popup>

		<!-- 目标选择器 -->
		<van-popup :show="showTargetPicker"  position="bottom">
			<van-picker :columns="columns" value-key="name" title="目标" :show-toolbar="true" :default-index="targetIndex"
			 @confirm.native="selectTarget" @cancel.native="closeTargetPicker" />
		</van-popup>

		<van-toast id="van-toast" />
		
		<!-- 用于压缩上传图片 -->
		<view class="compress_canvas">
			<canvas canvas-id="myCanvas" :style="{width: w + 'px', height: h + 'px'}"></canvas>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import { profile, updateProfile } from "@/network/api_index.js"
	import Toast from '@/wxcomponents/vant/toast/toast'
	import BackTopbar from '@/components/common/BackTopbar.vue'
	import { target_value_key_map, target_key_value_map } from "@/tools/transform_data.js"
	import { imgSecCheck } from "@/tools/sec_check.js"
	const userId = uni.getStorageSync('userId')
	export default {
		components: {
			BackTopbar
		},
		data() {
			return {
				userInfo: {
					graduate_year: null,
					graduate_month: null,
					graduateDay: '',
					avatar: '',
					major: "",
					name: "",
					school: "",
					start_year: null,
					start_month: null,
					startDay: '',
					target: "",
					id: "",
					about_me: ''
				},
				start_year_backup: null,
				graduate_year_backup: null,
				currentDate: new Date().getTime(),		// 时间选择器显示时间（时间戳）
				minDate: new Date(2010, 1, 1).getTime(),	//时间选择器时间范围
				maxDate: new Date(2030, 12, 31).getTime(),	//时间选择器时间范围
				showDatePicker: false,
				showTargetPicker: false,
				// columns: ['出国', '考研', '读博', '工作', '创业'],
				columns: [{
					name: '考研',
					value: 1
				},{
					name: '找工作',
					value: 2
				},{
					name: '出国',
					value: 3
				},{
					name: '考公/编',
					value: 4
				}],
				tagActive: true,
				datePickerType: '', // 入学 or 毕业 日期选择器
				targetIndex: 0,		// 目标选择器当前选择Index
				datePickerTitle: '', //时间选择器title
				validator: false,		// 校验开关，点击提交按钮时变为true
				w: 0,
				h: 0,
				cloud_path: '',	//上传至对象存储的地址（单张）
				cloud_path_split: '',	//上传至对象存储的地址-截断（单张）
				default_avatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',
				tmp_url: ''
			}
		},
		computed: {
			dateChange() {
				const { start_year, start_month, graduate_year, graduate_month } = this.userInfo
				return { start_year, start_month, graduate_year, graduate_month }
			}
		},
		watch: {
			dateChange(val) {
				if (new Date(this.userInfo.startDay).getTime() > new Date(this.userInfo.graduateDay).getTime()) {
					Toast.fail('入学时间不能超过毕业时间');
				}
			},
		},
		created() {
			this.getUserInfo()
		},
		methods: {
			// 查询用户信息
			getUserInfo() {
				profile(userId).then(res => {
					if (res.code == 0 && Object.keys(res.data).length) {
						this.userInfo = res.data
						//初始化时间选择器反显 van-field回显
						this.userInfo.startDay = (this.userInfo.start_year && this.userInfo.start_month) ? this.userInfo.start_year + '-' + this.userInfo.start_month : ''
						this.userInfo.graduateDay = (this.userInfo.graduate_year && this.userInfo.graduate_month) ? this.userInfo.graduate_year + '-' + this.userInfo.graduate_month : ''
						//目标反显（处理成name）
						this.userInfo.target = target_value_key_map[res.data.target]
						if(!res.data.avatar) {
							// 如返回头像为空，设置默认头像
							this.userInfo.avatar = this.default_avatar
						}
					}
				}, err => {
					console.log('ratings', err)
				})
			},
			// 表单值双向绑定
			onChange(e, label) {
				this.userInfo[label] = e.detail
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
				// //回显
				// this.userInfo.avatar = url
				// // 上传至云存储, 文件路径为 profile_photos/userid/xxx.png
				// const userId = uni.getStorageSync('userId')
				// wx.cloud.uploadFile({
				//   cloudPath: `profile_photos/${userId}/avatar-${new Date().getTime()}.png`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
				//   filePath: url, 
				//   config: {
				//     env: 'prod-4gkvfp8b0382845d' // 需要替换成自己的微信云托管环境ID
				//   }
				// }).then(res => {
				// 	//传给后台
				// 	updateProfile({
				// 		avatar: res.fileID
				// 	}).then(res => {
				// 		if(res.code === 0) {
				// 			Toast({message: '修改成功！', context: this, type: 'success'})
				// 		}
				// 	}, err => {
				// 		console.log('updateProfile: ', err)
				// 	})
				// }).catch(error => {
				//   console.error(error)
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
							// this.$emit('updateWidthHeight', [w, h])
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
					wx.cloud.uploadFile({
					  cloudPath: `profile_photos/${userId}/avatar-${new Date().getTime()}.jpg`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
					  filePath: this.tmp_url, 
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
			
			
			
			
			//打开时间选择器：设置 datePicker的回显
			clickDate(type) {
				this.datePickerType = type
				//设置时间选择器反显
				if(type === 'start') {
					this.datePickerTitle = '入学时间'
					if(this.userInfo.start_year && this.userInfo.start_month) {
						this.currentDate = new Date(this.userInfo.start_year + '-' + this.userInfo.start_month).getTime()
					} else {
						// 默认为今天
						this.currentDate = new Date().getTime()
					}
				} else {
					this.datePickerTitle = '毕业时间'
					if(this.userInfo.graduate_year && this.userInfo.graduate_month) {
						this.currentDate = new Date(this.userInfo.graduate_year + '-' + this.userInfo.graduate_month).getTime()
					} else {
						// 默认为今天
						this.currentDate = new Date().getTime()
					}
				}
				this.showDatePicker = true
			},
			// 时间选择器-点击确定：1.更新userInfo值 2.更新van-filed回显值
			selectedDate(event) {
				if(this.datePickerType === 'start') {
					// 当前打开的是入学时间
					this.userInfo.start_year = new Date(event.detail).getFullYear()
					this.userInfo.start_month = new Date(event.detail).getMonth() + 1
					this.userInfo.startDay = this.userInfo.start_year + '-' + this.userInfo.start_month
				} else {
					// 毕业时间
					this.userInfo.graduate_year = new Date(event.detail).getFullYear()
					this.userInfo.graduate_month = new Date(event.detail).getMonth() + 1
					this.userInfo.graduateDay = this.userInfo.graduate_year + '-' + this.userInfo.graduate_month
				}
				this.showDatePicker = false
			},
			// 关闭时间选择器
			onClose() {
				this.showDatePicker = false
			},
			// 打开目标选择器
			clickTarget() {
				//设置Picker默认返显
				if(this.userInfo.target) {
					this.targetIndex = target_key_value_map[this.userInfo.target] ? target_key_value_map[this.userInfo.target]-1 : 0
				} else {
					this.targetIndex = 0
				}
				this.showTargetPicker = true
			},
			// 目标选择器-点确认
			selectTarget(e) {
				//设置选择器默认选中项
				this.targetIndex = e.detail.index
				//更新表单提交值
				this.userInfo.target = target_value_key_map[e.detail.value.value]
				this.showTargetPicker = false
			},
			// 关闭目标选择器
			closeTargetPicker() {
				this.showTargetPicker = false
			},
			
			
			// changePotrait() {
			// 	uni.chooseImage({ // 从本地相册选择图片或使用相机拍照。
			// 		count: 1, //默认选择1张图片
			// 		sizeType: ['original', 'compressed'], //original 原图，compressed 压缩图，默认二者都有
			// 		success: (res) => {
			// 			console.log(res.tempFilePaths[0])
			// 			this.userInfo.avatar = res.tempFilePaths[0] //更新本低浏览头像图片
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
			// 		console.error(err)
			// 	})
			// },
			
			// 保存
			handleSave() {
				this.validator = true
				if(this.userInfo.avatar && this.userInfo.name && this.userInfo.school && this.userInfo.major && this.userInfo.start_year && this.userInfo.start_month && this.userInfo.graduate_year && this.userInfo.graduate_month && this.userInfo.target) {
					// 校验时间
					if (new Date(this.userInfo.startDay).getTime() > new Date(this.userInfo.graduateDay).getTime()) {
						Toast.fail('入学时间不能超过毕业时间');
						return
					}
					// let params = Object.assign(this.userInfo, {target: target_key_value_map[this.userInfo.target]})
					let params = JSON.parse(JSON.stringify(this.userInfo))
					params.target = target_key_value_map[this.userInfo.target]
					//校验通过：提交
					updateProfile(params).then(res => {
						if(res.code === 0) {
							// 提交成功，回到首页
							Toast({
							  type: 'success',
							  message: '编辑成功',
							  onClose: () => {
								uni.navigateBack({
									success: () => {
									    let page = getCurrentPages().pop();//跳转页面成功之后
										if (page) {
										  page.$vm.$refs.myAbility.$refs.portraitInfo.getUserInfo()
									    };
									}
								})
							  },
							});
						} else {
							//提交失败，提示，留在当前页面
							Toast.fail('编辑失败')
						}
					}, err => {
						console.log('updateProfile', err)
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.edit-personal-info {
		padding: 0 25rpx;
		.edit-personal-info-group {
			/deep/ .edit-personal-info-wrap {
				margin: 0 !important;
			}
			/deep/ .edit-personal-info-wrap:after {
				border-top: none !important;
			}
		}
		.edit-personal-info-avatar {
			text-align: center;
			padding: 50rpx 0;
			.avatar-wrapper {
				width: 120rpx;
				height: 120rpx;
				padding: 0;
				border-radius: 50%;
			}
			.edit-personal-img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
			}
		}

		.save-btn-box {
			margin-top: 99rpx;
			text-align: center;
			.save-btn-wrap {
				/deep/ .save-btn {
					padding: 0 238rpx !important;
					line-height: 45rpx !important;
					font-weight: 600 !important;
					font-size: 32rpx !important;
					background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%) !important;
					border-radius: 10rpx !important;
					color: #fff !important;
				}
			}
		}
	}
	.compress_canvas{
	    position: absolute;
	    left: -99999px;
	    top:-99999px;
	}
</style>
