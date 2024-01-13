<template>
	<view class="make-badge" :style="{backgroundImage: 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)',backgroundSize: '100%',backgroundColor: '#fff',backgroundRepeat: 'no-repeat',paddingTop: '0'}">
		<back-topbar title="制作徽章" functionName="refreshOwnBadge"></back-topbar>
		<van-cell-group inset class="make-badge-group" custom-class="make-badge-wrap">
			<van-field
			    :value="form.name"
			    placeholder="请输入徽章名称"
			    @change.native="onChange($event, 'name')"
				label="徽章名称"
				required
				name="name"
				clearable
				:error="validator && !form.name"
				custom-style="background: transparent"
			/>
			<van-field
			  	label="徽章图片"
			  	required readonly
				custom-style="background: transparent">
				<view slot="right-icon" @click="beforeRead">
					<van-uploader :file-list="fileList" disabled
					max-count="1" preview-full-image="false" @delete.native="deleteImg" />
				</view>
			</van-field>
			<van-field
				:value="form.desc"
				placeholder="请输入徽章描述"
				@change.native="onChange($event, 'desc')"
				label="徽章描述"
				required
				name="desc"
				type="textarea"
				:show-confirm-bar="false"
				autosize
				maxlength="100"
				clearable
				:error="validator && !form.desc"
				custom-style="background: transparent"
			/>
			<van-field
			    :value="form.field"
			    placeholder="请选择徽章类别"
				label="徽章分类"
				required
				name="field"
				right-icon="arrow"
				readonly
				@clickInput="handleClickInput"
				@clickIcon.native="handleClickInput"
				:error="validator && !form.field"
				custom-style="background: transparent"
			/>
		</van-cell-group>
		
		<view class="save-btn-box">
			<van-button class="save-btn-wrap" custom-class="save-btn" @tap="handleSave">提交</van-button>
		</view>
		
		<!-- 徽章分类选择器 -->
		<van-popup :show="showTargetPicker" @close.native="closeTargetPicker" position="bottom">
			<van-picker :columns="columns" @change.native="changeTarget" value-key="name" :default-index="typeIndex" />
		</van-popup>
		
		<van-notify id="van-notify" />
		
		<!-- <badge-img-panel ref="badgeImgPanel"></badge-img-panel> -->
		
		<!-- 默认图库 -->
		<badge-img-default-library ref="badgeImgLibrary"></badge-img-default-library>
	</view>
</template>

<script>
	import { type_list, type_key_value_map, type_value_key_map } from '@/tools/transform_data.js'
	import { createAchievements } from "@/network/api_badge.js"
	import Notify from '@/wxcomponents/vant/notify/notify'
	import BadgeImgPanel from "@/page_aboutBadge/components/BadgeImgPanel.vue"
	import BadgeImgDefaultLibrary from "@/page_aboutBadge/components/BadgeImgDefaultLibrary.vue"
	import BackTopbar from '@/components/common/BackTopbar.vue'
	export default {
		components: {
			'badge-img-panel': BadgeImgPanel,
			'badge-img-default-library': BadgeImgDefaultLibrary,
			BackTopbar
		},
		data() {
			return {
				form: {
					name: '',
					desc: '',
					field: '',
					image: ''
				},
				
				fileList: [],
				showTargetPicker: false,
				columns: type_list,
				validator: false,		// 校验开关，点击提交按钮时变为true
				showUploader: true,		// 是否显示图片上传器
				selectedBadgeImg: '',	// 选择的徽章图片
				typeIndex: 0
			}
		},
		onShow() {
			let that = this
			// // 接收编辑页面值
			// uni.$on('update-form', function(val){
			// 	that[val.formName] = val.value
			// })
			uni.$on('select-img', function(val){
				if(val) {
					that.$set(that.fileList, 0, {url: val})
					that.form.image = val
				} else {
					that.fileList = []
					that.form.image = ''
				}
			})
		},
		onUnload() {
			uni.$off('select-img')
		},
		methods: {
			onChange(e, label) {
				this.form[label] = e.detail
			},
			// 点击徽章分类
			handleClickInput() {
				this.showTargetPicker = true
				this.typeIndex = 0
				this.form.field = type_list[0].name
			},
			closeTargetPicker() {
				this.showTargetPicker = false
			},
			// 选择徽章分类
			changeTarget(e) {
				this.typeIndex = e.detail.index
				this.form.field = e.detail.value.name
			},
			handleSave() {
				this.validator = true
				if(this.form.name && this.form.desc && this.form.image && this.form.field) {
					// 校验通过：提交
					createAchievements({
						'name': this.form.name, 
						'desc': this.form.desc,  
						'image': this.form.image, 
						'field': type_key_value_map[this.form.field]
					}).then(res => {
						if(res.code === 0) {
							// 提交成功，回到徽章库
							uni.showToast({
								title: '创建成功',
								icon: 'success'
							});
							uni.navigateBack({
							    success: () => {
							         let page = getCurrentPages().pop();//跳转页面成功之后
							         if (page) {
										 page.$vm.refreshOwnBadge()
									 }
							    }
							})
						} else {
							//提交失败，提示，留在当前页面
							uni.showToast({
								title: '创建失败',
								icon: 'fail'
							});
						}
					}, err => {
						console.log('createAchievements: ' + err)
						uni.showToast({
							title: '创建失败',
							icon: 'fail'
						});
					})
				}
			},
			beforeRead(event) {
				// this.$refs.badgeImgPanel.showPanel = true
				this.$refs.badgeImgLibrary.getDefaultBadgeImgList()
				this.$refs.badgeImgLibrary.showDefaulImg = true
			},
			deleteImg(event) {
				// event.detail.index: 删除图片的序号值
				const delIndex = event.detail.index
				this.fileList.splice(delIndex, 1)
			},
		}
	}
</script>

<style lang="less" scoped>
	.make-badge {
		padding: 25rpx;
		.make-badge-group {
			/deep/ .make-badge-wrap {
				margin: 0 !important;
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
		
		.select-img {
			width: 80px;
			height: 80px;
		}
	}
</style>
