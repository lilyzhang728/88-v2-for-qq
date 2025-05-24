<template>
	<view class="launch" v-if="showLaunch"  style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/qa/qaBg.png?sign=dea87806eae980fcf46c05d496c6f02f&t=1702015391');background-size: 100%;background-color: #FFFFFF;background-repeat: no-repeat;">
		<!-- <view class="launch-step-box"> -->
			<view class="launch-skip" @click="handleSkip">一键跳过</view>
			<!-- 第一步 -->
			<view class="launch-step" v-if="activeStep === 0">
				<!-- 性别 -->
				<view class="launch-gender">
					<view class="launch-gender-title">你的性别是</view>
					<view class="launch-gender-img-box">
						<!-- 女生 -->
						<view class="launch-gender-img-box-item">
							<img v-show ="!gender" src="https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/launch/girlSelect.png" class="launch-gender-img" alt="">
							<img v-show="gender" @click="selectGender(0)" src="https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/launch/girlUnSelect.png" class="launch-gender-img" alt="">
							<img v-show="!gender" class="launch-gender-img-icon" src="https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/launch/iconSelect.png" alt="">
						</view>
						
						<!-- 男生 -->
						<view class="launch-gender-img-box-item">
							<img v-show="gender" src="https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/launch/boySelect.png" class="launch-gender-img" alt="">
							<img v-show="!gender" @click="selectGender(1)" src="https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/launch/boyUnSelect.png" class="launch-gender-img" alt="">
							<img v-show="gender" class="launch-gender-img-icon" src="https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/launch/iconSelect.png" alt="">
						</view>
						
					</view>
				</view>
				
				<!-- 性格标签 -->
				<view class="launch-character">
					<view class="launch-title" v-if="characterList.length">向大家介绍一下自己吧</view>
					<view class="launch-labels launch-labels-scroll" v-if="characterList.length" :style="{'height': characterHeight}">
						<view @click="selectLabel(index, 'characterList')" class="launch-label-item" :class="{'launch-label-item-active': label.active}" v-for="(label, index) in characterList" :key="index">{{label.body}}</view>
					</view>
				</view>
			</view>
			
			<!-- 第二步 -->
			<view class="launch-step launch-step2" v-if="activeStep === 1">
				<!-- 学历 -->
				<view class="launch-title">你的学历是</view>
				<view class="launch-labels launch-labels-center">
					<view @click="selectLabelSingle(index, 'educationList')" class="launch-label-item" :class="{'launch-label-item-active': label.active}" v-for="(label, index) in educationList" :key="index">{{label.body}}</view>
				</view>
				
				<!-- 在校状态 -->
				<view class="launch-title">你目前的状态是</view>
				<view class="launch-labels launch-labels-center">
					<view @click="selectLabelSingle(index, 'ifStudentList')" class="launch-label-item" :class="{'launch-label-item-active': label.active}" v-for="(label, index) in ifStudentList" :key="index">{{label.body}}</view>
				</view>
				
				<!-- 目标 -->
				<view class="launch-title">现阶段你的目标是</view>
				<view class="launch-labels launch-labels-center">
					<view @click="selectLabelSingle(index, 'targetList')" class="launch-label-item" :class="{'launch-label-item-active': label.active}" v-for="(label, index) in targetList" :key="index">{{label.body}}</view>
				</view>
			</view>
			
			<!-- 第三步 -->
			<view class="launch-step launch-step-3" v-if="activeStep === 2">
				<!-- 成就 -->
				<view class="launch-title" v-if="achievementList.length">已经达成了哪些成就？</view>
				<view class="launch-labels launch-labels-scroll" v-if="achievementList.length" :style="{'height': achievementsHeight}">
					<view @click="selectLabel(index, 'achievementList')" class="launch-label-item" :class="{'launch-label-item-active': label.active}" v-for="(label, index) in achievementList" :key="index">{{label.name}}</view>
				</view>
			</view>
			
			<!-- 按钮 -->
			<view class="launch-btn-box">
				<van-button @click.native="clickNext"  class="launch-btn-wrap" custom-class="launch-btn">{{activeStep < 2 ? '下一步' : '保存'}}</van-button>
			</view>
		<!-- </view> -->
		
	</view>
</template>

<script>
	import { login, characterList, achievementsList, collectCharacterList } from "@/network/api_login.js"
	import { updateProfile } from "@/network/api_index.js"
	import { addToMyBadge } from '@/network/api_badge.js'
	export default {
		data() {
			return {
				showLaunch: false,
				activeStep: 0,
				userId: '',
				gender: 0,	//0:女生  1：男生
				characterList: [],	//性格标签
				educationList: [{
					body: '博士',
					active: false,
					id: 4
				},{
					body: '硕士',
					active: false,
					id: 3
				},{
					body: '本科',
					active: false,
					id: 2
				},{
					body: '大专',
					active: false,
					id: 1
				}],	//学历
				ifStudentList: [{
					body: '在校学生',
					active: false,
					id: 0
				},{
					body: '已经毕业',
					active: false,
					id: 1
				}],
				targetList: [{
					body: '考研',
					active: false,
					id: 1
				},{
					body: '找工作',
					active: false,
					id: 2
				},{
					body: '出国',
					active: false,
					id: 3
				},{
					body: '考公/编',
					active: false,
					id: 4
				}],		//目标
				achievementList: [],	//成就
				screenHeight: 0
			}
		},
		computed: {
			characterHeight() {
				let otherHeight = 242+48+50+187+105+48+50+68+50
				return `calc(${this.screenHeight}px - ${otherHeight}rpx - 44px) `
			},
			achievementsHeight() {
				let otherHeight = 200+48+50+50+68
				return `calc(${this.screenHeight}px - ${otherHeight}rpx - 44px) `
			}
		},
		onLoad() {
			let _this = this
			qq.login({
			  success(res) {
				if (res.code) {
					uni.setStorageSync('qqCode', res.code);
					_this.login()
				} else {
				  console.log('登录失败！' + res.errMsg)
				}
			  }
			})
			this.screenHeight = uni.getSystemInfoSync().windowHeight//获取当前页面的高度
			// this.getCharacterList()
		},
		methods: {
			login() {
				login().then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						// res.data.user_id = null		//测试用
						if(!res.data.user_id) {
							// 未获取到user_id，重新进入小程序
							uni.showModal({
								title: '提示',
								content: '获取信息失败，请重新进入',
								success: function (res) {
									if (res.confirm) {
										uni.reLaunch({
											url: '/pages/launch/launch'
										});
									} else if (res.cancel) {
										uni.reLaunch({
											url: '/pages/launch/launch'
										});
									}
								}
							})
						} else {
							// res.data.is_new = true   //测试用
							if(res.data.is_new) {
								// 新用户，显示引导页
								this.showLaunch = true
							}
							// 存用户角色：1：管理员 0：非管理员
							uni.setStorageSync('role', res.data.is_admin);
							// 存token，user_id
							uni.setStorageSync('token', res.data.token);
							uni.setStorageSync('userId', res.data.user_id);
							this.userId = res.data.user_id
							console.log('userid: ', res.data.user_id)
							if(res.data.is_new) {
								// 新用户,请求获取成就(因为headers里要带token，所以必须存之后再调这个接口，否则会401)
								this.getAchievementsList(res.data.user_id)
							} else {
								// 老用户，跳首页
								uni.switchTab({
									url: '/pages/bbs/bbs'
								})
							}
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
			// 获取性格标签
			getCharacterList() {
				characterList({
					'page':1,
					'per_page':20
				}).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.characterList = res.data.items
					}
				}, err => {
					console.log('characterList: ', err)
				})
			},
			// 获取成就标签（徽章库的官方徽章）
			getAchievementsList(userId) {
				achievementsList({
					'source': 'guide',		//官方徽章
					'per_page': 20,
					'page': 1,
					'userId': userId
				}).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.achievementList = res.data.items
					}
				}, err => {
					console.log()
				})
			},
			selectGender(val) {
				this.gender = val
			},
			selectLabel(index, list) {
				if(this[list][index].active === undefined) {
					this.$set(this[list][index], 'active', true)
				} else {
					this[list][index].active = !this[list][index].active
				}
			},
			// 单选
			selectLabelSingle(index, list) {
				this[list].forEach(item => {
					this.$set(item, 'active', false)
				})
				this[list][index].active = true
			},
			clickNext() {
				if(this.activeStep < 2) {
					this.activeStep++
				} else {
					//调保存接口
					this.saveCollectCharacterList()
					this.saveProfile()
					this.saveAchievement()
					//跳转到正文
					uni.switchTab({
						url: '/pages/bbs/bbs'
					})
				}
			},
			// 保存性格标签
			saveCollectCharacterList() {
				let temp = this.characterList.filter(item => item.active)
				let characterId = temp.map(item => item.id)
				if(characterId.length) {
					collectCharacterList({
						'tag_ids': characterId
					}).then(res => {
						if(res.code === 0) {
							// 保存成功
						}
					}, err => {
						console.log('collectCharacterList: ', err)
					})
				}
			},
			// 保存基本信息
			saveProfile() {
				let targetIds = this.targetList.filter(target => target.active).map(item => item.id)
				let graduatedId = this.ifStudentList.filter(graduated => graduated.active).map(item => item.id)
				let stageId = this.educationList.filter(stage => stage.active).map(item => item.id)
				let params = {
					'target': targetIds[0],
					'gender': this.gender ? 'M' : 'F',
					'is_graduated': graduatedId[0],
					'stage': stageId[0]
				}
				updateProfile(params).then(res => {
					if(res.code === 0) {
						//保存成功
					}
				}, err => {
					console.log('updateProfile: ', err)
				})
			},
			// 保存成就
			saveAchievement() {
				let achievementId = this.achievementList.filter(achievement => achievement.active).map(item => item.id) 
				if(achievementId.length) {
					addToMyBadge({
						'achievement_ids': achievementId
					}).then(res => {
						if(res.code === 0) {
							//保存成功
						}
					}, err => {
						console.log('addToMyBadge: ', err)
					})
				}
				
			},
			// 一键跳过
			handleSkip() {
				//跳转到正文
				uni.switchTab({
					url: '/pages/bbs/bbs'
				})
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
	// .launch-step-box {
		
	// }
	.launch-skip {
		position: absolute;
		left: 50rpx;
		top: 100rpx;
		color: rgba(0,0,0,0.6);
		display: inline-block;
		padding: 20rpx;
	}
	.launch-step {
		width: 100vw;
	}
	.launch-step2 {
		margin-top: 300rpx; 
	}
	.launch-step-3 {
		margin-top: 200rpx;
	}
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
	.launch-title {
		margin-top: 105rpx;
		text-align: center;
		font-size: 34rpx;
		font-weight: 500;
		color: #000000;
		line-height: 48rpx;
	}
	.launch-labels {
		margin-top: 50rpx;
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
	.launch-labels-center {
		justify-content: space-around;
	}
	.launch-labels-scroll {
		overflow: scroll;
	}
	
	.launch-btn-box {
		text-align: center;
		position: fixed;
		bottom: 68rpx;
		left: 0;
		right: 0;
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
