<!-- 时间轴-点击add按钮新增一条-表单 -->
<template>
	<view class="add-timeline-item" :style="{backgroundImage: 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)',backgroundSize: '100%',backgroundColor: '#fff',backgroundRepeat: 'no-repeat',paddingTop: '0'}">
		<back-topbar :title="edit ? '编辑事件' : '添加事件'" refName="paging" functionName="reload"></back-topbar>
		<van-cell-group inset class="add-timeline-item-group" custom-class="add-timeline-item-wrap">
			<van-field
			    :value="event.name"
			    placeholder="请输入事件名称"
			    @change.native="onChange($event, 'name')"
				label="事件名称"
				required
				name="name"
				clearable
				:error="validator && !event.name"
				custom-style="background: transparent;"
			/>
			<van-field
				:value="event.description"
				placeholder="请输入徽章描述"
				@change.native="onChange($event, 'description')"
				label="徽章描述"
				required
				name="description"
				type="textarea"
				autosize
				maxlength="100"
				clearable
				:error="validator && !event.description"
				custom-style="background: transparent;"
			/>
			<van-field
			    :value="event.importance"
			    placeholder="请选择重要程度"
				label="重要程度"
				required
				name="importance"
				right-icon="arrow"
				readonly
				@clickInput="openPicker('importance')"
				@clickIcon.native="openPicker('importance')"
				:error="validator && !event.importance"
				custom-style="background: transparent;"
			/>
			<van-field
			    :value="event.emergency"
			    placeholder="请选择紧急程度"
				label="紧急程度"
				required
				name="emergency"
				right-icon="arrow"
				readonly
				@clickInput="openPicker('emergency')"
				@clickIcon.native="openPicker('emergency')"
				:error="validator && !event.emergency"
				custom-style="background: transparent;"
			/>
			<van-field
			    :value="event.target"
			    placeholder="请选择目标"
				label="目标"
				required
				name="target"
				right-icon="arrow"
				readonly
				@clickInput="openPicker('target')"
				@clickIcon.native="openPicker('target')"
				:error="validator && !event.target"
				custom-style="background: transparent;"
			/>
			<van-field
			    :value="event.date"
			    placeholder="请选择事件时间"
				label="事件时间"
				required
				name="date"
				right-icon="arrow"
				readonly
				@clickInput="clickDate"
				@clickIcon.native="clickDate"
				:error="validator && !event.date"
				custom-style="background: transparent;"
			/>
		</van-cell-group>
		
		<view class="save-btn-box">
			<van-button class="save-btn-wrap" custom-class="save-btn" @click="handleSave">保存</van-button>
		</view>
		
		<!-- 重要程度-选择器 -->
		<van-popup :show="showPicker" position="bottom">
			<van-picker :columns="pickerOptions" value-key="name" :title="pickerTitle" :show-toolbar="true" ref="van_picker"
			:default-index="defaultIndex" @confirm.native="pickerConfirm" @cancel.native="closePicker" />
		</van-popup>
		
		<!-- 时间选择器 -->
		<van-popup :show="showDatePicker" position="bottom">
			<van-datetime-picker type="date" :value="currentDate" title="选择日期"
				:min-date="minDate" :max-date="maxDate" @confirm.native="dateConfirm" @cancel.native="dateClose" />
		</van-popup>
		
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import { createEvent, eventDetail, editEvent, eventRecord } from '@/network/api_index.js'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import BackTopbar from '@/components/common/BackTopbar.vue'
	import { target_list, importance_list, emergency_list, importance_key_value_map, emergency_key_value_map, target_key_value_map,
	 target_value_key_map, importance_value_key_map, emergency_value_key_map} from '@/tools/transform_data.js'
	export default {
		components: {
			BackTopbar
		},
		data() {
			return {
				event: {
					name: '',
					description: '',
					importance: '',
					emergency: '',
					target: '',
					date: '',
					id: ''
				},
				showPicker: false,
				showDatePicker: false,
				pickerOptions: [],	//选择器选项
				pickerTitle: '',	//选择器title
				defaultIndex: 0,	//选择器选中Index
				importanceOptions: [1,2,3],
				emergencyOptions: [4,5,6],
				targetOptions: [7,8,9],
				curPickerType: '',		//当前打开的是哪个picker
				currentDate: new Date().getTime(),		// 时间选择器显示时间（时间戳）
				minDate: new Date(2010, 0, 1).getTime(),	//时间选择器时间范围
				maxDate: new Date(2030, 11, 31).getTime(),	//时间选择器时间范围
				validator: false,		// 校验开关，点击提交按钮时变为true
				edit: null,			// 为1时,此页面为编辑页面
				timestamp: '',		//时间戳
				from: '',	//从哪个页面跳转过来：news:公告详情，一键添加至大事年表
				newsId: '',	//绑定的新闻id
			}
		},
		onLoad(option) {
			if(option.start) {
				this.minDate = new Date(option.start, 0, 1).getTime()
			}
			if(option.graduate) {
				this.maxDate = new Date(option.graduate, 11, 31).getTime()
			}
			if(option.edit) {
				// 此页面为编辑页面
				this.edit = option.edit
				this.getEventDetail(option.id)
			}
			if(option.from) {
				this.from = option.from
				this.newsId = option.newsId
			}
		},
		methods: {
			// 编辑页面-获取回显数据
			getEventDetail(id) {
				eventDetail(id).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.event = res.data
						//反显（处理成name）
						this.event.importance = importance_value_key_map[Number(res.data.importance)]
						this.event.emergency = emergency_value_key_map[Number(res.data.emergency)]
						this.event.target = target_value_key_map[Number(res.data.event_target)]
						// 初始化日期
						this.event.date = res.data.event_date
						this.timestamp = res.data.event_date ? new Date(res.data.event_date).getTime() : ''
						// 初始化target
						// this.event.target = res.data.event_target
					}
				}, err => {
					console.log('eventDetail: ' + err)
				})
			},
			// 表单值双向绑定
			onChange(e, label) {
				this.event[label] = e.detail
			},
			//打开picker
			openPicker(type) {
				this.curPickerType = type
				// this.pickerOptions = [type + '_list']
				//设置正确的反显
				// this.$nextTick(()=>{
				// 	if(this.event[type]) {
				// 		this.$refs.van_picker.setColumnIndex(0, this[type + 'Options'].indexOf(this.event[type]))
				// 	} else {
				// 		this.$refs.van_picker.setColumnIndex(0, 0)
				// 	}
				// })
				switch(type) {
					case 'importance':
						this.pickerTitle = '重要程度'
						this.pickerOptions = importance_list
						this.$nextTick(()=>{
							this.defaultIndex = this.event.importance ? 3-importance_key_value_map[this.event.importance] : 0
						})
						break
					case 'emergency':
						this.pickerTitle = '紧急程度'
						this.pickerOptions = emergency_list
						this.$nextTick(()=>{
							this.defaultIndex = this.event.emergency ? 3-emergency_key_value_map[this.event.emergency] : 0
						})
						break
					case 'target':
						this.pickerTitle = '目标'
						this.pickerOptions = target_list
						this.$nextTick(()=>{
							this.defaultIndex = this.event.target ? target_key_value_map[this.event.target]-1 : 0
						})
						break
				}
				this.showPicker = true
			},
			//picker点击确定
			pickerConfirm(e) {
				// 更新表单值，显示在输入框
				this.event[this.curPickerType] = e.detail.value.name
				this.showPicker = false
			},
			//picker点击取消
			closePicker() {
				this.showPicker = false
			},
			//打开时间选择器
			clickDate() {
				this.currentDate = this.event.date ? (new Date(this.event.date).getTime()) : (new Date().getTime())
				this.showDatePicker = true
			},
			//时间选择器-确定
			dateConfirm(e) {
				this.event.date = new Date(e.detail).getFullYear() + '-' + (new Date(e.detail).getMonth() + 1) + '-' + new Date(e.detail).getDate()
				this.timestamp = new Date(e.detail).getTime()
				this.showDatePicker = false
			},
			//时间选择器-取消
			dateClose() {
				this.showDatePicker = false
			},
			handleSave() {
				this.validator = true
				if(this.event.name && this.event.date && this.event.emergency && this.event.importance && this.event.target) {
					//校验通过：提交
					if(this.edit) {
						this.handleEditEvent()
					} else {
						this.handleCreateEvent()
					}
				}
			},
			// 调用添加事件接口
			handleCreateEvent() {
				createEvent({
					"name": this.event.name,
					'event_date': this.event.date,
					"event_year": new Date(this.timestamp).getFullYear(),
					"event_month": new Date(this.timestamp).getMonth() + 1,
					"emergency": emergency_key_value_map[this.event.emergency],
					"importance": importance_key_value_map[this.event.importance],
					"event_target": target_key_value_map[this.event.target],
					"description": this.event.description
				}).then(res => {
					if(res.code === 0) {
						// 提交成功，回到首页
						Toast({
						  type: 'success',
						  message: '创建成功',
						  onClose: () => {
							uni.navigateBack({
								success: () => {
								    let page = getCurrentPages().pop();//跳转页面成功之后
								    if (page) {
									  page.$vm.$refs.paging.reload()
								    };
								}
							})
						  },
						});
						if(this.from === 'news') {
							//同步至后台
							eventRecord(this.newsId).then(res => {}, err => {
								console.log('eventRecord: ', err)
							})
						}
					} else {
						//提交失败，提示，留在当前页面
						Toast.fail('创建失败')
					}
				}, err => {
					console.log('createEvent: ' + err)
				})
			},
			// 调用编辑事件接口
			handleEditEvent() {
				editEvent({
					"name": this.event.name,
					"description": this.event.description,
					'event_date': this.event.date,
					"event_year": new Date(this.timestamp).getFullYear(),
					"event_month": new Date(this.timestamp).getMonth() + 1,
					"emergency": emergency_key_value_map[this.event.emergency],
					"importance": importance_key_value_map[this.event.importance],
					"event_target": target_key_value_map[this.event.target],
					"id": this.event.id
				}).then(res => {
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
										page.$vm.$refs.paging.reload()
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
					console.log('createEvent: ' + err)
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.add-timeline-item {
		padding: 25rpx;
		.add-timeline-item-group {
			/deep/ .add-timeline-item-wrap {
				margin: 0 !important;
			}
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
</style>
