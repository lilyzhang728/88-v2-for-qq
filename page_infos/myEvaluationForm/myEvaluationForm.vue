<!-- 个人主页-测评问卷题目 -->
<template>
	<view class="my-evaluation-form" style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/infos/infosBg.png?sign=0e86468cac06b3dca60ea1ef5fca01dc&t=1691397405');background-size: 100%;background-color: #F8F8F8;background-repeat: no-repeat;">
		<back-topbar title="个人评估问卷" @handleBack="handleBack" :backToCurPage="true"></back-topbar>
		<z-paging ref="paging" :paging-style="{'top': customBar + 'px', 'bottom': '59px', 'padding': '0 25rpx', 'background-color': '#F8F8F8'}">
			<view class="my-evaluation-form-content">
				<!-- 第一页 -->
				<view class="my-evaluation-form-content-box" v-for="(item) in formData1" :key="item.index" v-if="curPage < 2">
					<view class="my-evaluation-form-content-box-title">{{item.question}}</view>
					<view class="my-evaluation-form-content-box-form">
						<div class="my-evaluation-form-content-box-form-item" v-for="(subItem, subIndex) in item.answers" :key="subIndex">
							<van-checkbox :value="subItem.is_select" shape="square" icon-size="16px" @change.native="changeCheckbox($event, item.index, subIndex)">{{subItem.name}}</van-checkbox>
						</div>
					</view>
				</view>
				
				<!-- 第2页-最后一页 -->
				<view v-for="(gourp, index) in groupedData" :key="index" v-if="index+2 == curPage">
					<view class="my-evaluation-form-content-box" v-for="(item) in gourp" :key="item.index">
						<view class="my-evaluation-form-content-box-title">{{item.question}}{{item.type=='多选'?'（多选）':''}}</view>
						<view class="my-evaluation-form-content-box-form">
							<div class="my-evaluation-form-content-box-form-item" v-for="(subItem, subIndex) in item.answers" :key="subIndex">
								<van-checkbox :value="subItem.is_select" shape="square" icon-size="16px" @change.native="changeCheckbox($event, item.index, subIndex)">{{subItem.name}}</van-checkbox>
							</div>
						</view>
					</view>
				</view>
			</view>
			<view class="my-evaluation-form-btn-box">
				<van-button color="#74d9c7" :disabled="page1Disabled" block round class="my-evaluation-form-btn-wrap" custom-class="my-evaluation-form-btn" @click.native="clickStart" v-if="curPage<2">开始评测</van-button>
				<van-button color="#74d9c7" :disabled="otherPageDisabled" block round class="my-evaluation-form-btn-wrap" custom-class="my-evaluation-form-btn" @click.native="clickNextStep" v-if="curPage>1 && curPage<totalPageNum">下一页（{{curPage-1}}/{{totalPageNum}})</van-button>
				<van-button color="#74d9c7" :disabled="otherPageDisabled" block round class="my-evaluation-form-btn-wrap" custom-class="my-evaluation-form-btn" @click.native="clickSubmit" v-if="curPage>1 && curPage==totalPageNum">提交</van-button>
			</view>
		</z-paging>
		<van-overlay :show="showLoading">
		  <view class="loading-wrapper">
		    <van-loading type="spinner" />
		  </view>
		</van-overlay>
		
		<van-dialog id="van-dialog" />

	</view>
</template>

<script>
	import { getQuestionnaires, submitQuestionnaires } from '@/network/api_infos.js'
	import BackTopbar from '@/components/common/BackTopbar.vue'
	import Dialog from "@/wxcomponents/vant/dialog/dialog"
	export default {
		components: {
			BackTopbar
		},
		data() {
			return {
				customBar: 0,
				formData: [],
				curPage: 1,		// 当前页数
				groupSize: 5,
				showLoading: false
			}
		},
		computed: {
			// 第一页表单内容
			formData1() {
				return this.formData && this.formData.length > 0 ? this.formData.slice(0, 3) : [] 
			},
			// 第2页-最后一页表单内容分组，groups里每一项是表单的一页
			groupedData() {
				let groups = [];
				let formData2 = this.formData && this.formData.length > 0 ? this.formData.slice(3) : []
				if(formData2.length > 0) {
					for (let i = 0; i < formData2.length; i += this.groupSize) {
						groups.push(formData2.slice(i, i + this.groupSize));
					}
				}
				return groups;
			},
			// 总页数
			totalPageNum() {
				let pageNum = 1
				if(this.curPage > 1) {
					let formData2 = this.formData && this.formData.length > 0 ? this.formData.slice(3) : []
					pageNum=Math.ceil(formData2.length / this.groupSize)
				}
				return pageNum
			},
			// 第一页校验不通过
			page1Disabled() {
				let result = false
				this.formData && this.formData1.length > 0 && this.formData1.forEach(item => {
					const hasSelectedAnswer = item.answers.some(answer => answer.is_select === true)
					if(!hasSelectedAnswer) {
						result = true
					}
				})
				return result
			},
			// 其他页校验不通过
			otherPageDisabled() {
				let result = false
				if(this.curPage > 1) {
					let curFormData = this.groupedData[this.curPage - 2]
					curFormData && curFormData.length > 0 && curFormData.forEach(item => {
						const hasSelectedAnswer = item.answers.some(answer => answer.is_select === true)
						if(!hasSelectedAnswer) {
							result = true
						}
					})
				}
				return result
			}
		},
		onLoad() {
			this.customBar = uni.getStorageSync('customBar')
			this.getFormData()
		},
		methods: {
			getFormData() {
				let param_id 
				if(this.curPage < 2) {
					param_id = 'base_info'
				} else {
					// 根据第一页第3题选择的项确定param_id参数值
					let selectedIndex = this.formData[2].answers.findIndex(item => item.is_select === true)
					const paramMap = ['xiaozhao_base', 'kaoyan_base', 'kaogong_base']
					if(selectedIndex > -1) {
						param_id = paramMap[selectedIndex]
					} else {
						return false
					}
				}
				getQuestionnaires({
					id:  param_id
				}).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.formData.push(...res.data.questionnaire_info)
					}
					console.log(this.formData)
				}, err => {
					console.log('getQuestionnaires err: ', err)
				})
			}, 
			// 开始评测
			clickStart() {
				if(!this.page1Disabled) {
					this.curPage++
					this.$refs.paging.scrollToTop()
					this.getFormData()
				}
			},
			// 下一步
			clickNextStep() {
				if(!this.otherPageDisabled) {
					this.curPage++
					this.$refs.paging.scrollToTop()
				}
			},
			// 提交
			clickSubmit() {
				if(!this.page1Disabled && !this.otherPageDisabled) {
					// this.showLoading = true
					submitQuestionnaires({
						questionnaire: this.formData
					}).then(res => {}, err => {
						console.log('submitQuestionnaires err: ', err)
					})
					// 因为会超时，接口400，索性直接提示用户返回，不用等待了
					Dialog.alert({
					  message: '提交成功！请1-2分钟后刷新页面查看测评报告',
					}).then(() => {
					   uni.navigateBack({
					       success: () => {
					            let page = getCurrentPages().pop();//跳转页面成功之后
					   		 if(page) {
					   			 page.$vm.$refs.myAbility.backRefresh()
					   		 }
					       }
					   })
					})
				}
			},
			changeCheckbox(event, index, subIndex) {
				if(this.formData[index].type == '单选') {
					this.formData[index].answers.forEach(item => {
						item.is_select = false
					})
				}
				this.formData[index].answers[subIndex].is_select = event.detail
			},
			handleBack() {
				if(this.curPage > 1) {
					this.curPage--
					this.$refs.paging.scrollToTop()
					if(this.curPage == 1) {
						this.formData.splice(3)
					}
				} else {
					// 返回我的，并刷新页面
					uni.navigateBack({
					    success: () => {
					         let page = getCurrentPages().pop();//跳转页面成功之后
							 if(page) {
								 page.$vm.$refs.myAbility.backRefresh()
							 }
					    }
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.my-evaluation-form {
		.my-evaluation-form-content {
			margin-bottom: 30rpx;
			.my-evaluation-form-content-box {
				margin-top: 55rpx;
				padding: 30rpx;
				background-color: #ffffff;
				border-radius: 48rpx;
				.my-evaluation-form-content-box-title {
					color: #52c1ac;
					font-size: 32rpx;
					line-height: 48rpx;
				}
				.my-evaluation-form-content-box-form {
					margin-top: 20rpx;
					color: #111111;
					font-size: 28rpx;
					line-height: 40rpx;
					.my-evaluation-form-content-box-form-item {
						line-height: 40rpx;
						margin-top: 16rpx;
					}
				}
			}
		}
		.my-evaluation-form-btn-box {
			background-color: #F8F8F8;
			margin-top: 30rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 0 14px 15px 14px;   //因为z-paging只能设置px,所以这里都换算成px， button的height固定44px
			.my-evaluation-form-btn-wrap {
				/deep/ .my-evaluation-form-btn {
					border-radius: 48rpx;
					background-color: #74d9c7;
					color: #111111;
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
		}
		.loading-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}
	}

</style>
