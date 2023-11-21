<!-- 时间轴 -->
<template>
	<view class="timeline">
		<view class="timeline-title">
			<text class="timeline-title-left">时间轴</text>
			<view class="timeline-title-right">
				<img class="timeline-title-right-icon" @click.native="toLastYear" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/timelineIconLeft.png" alt="">
				<text class="timeline-title-right-text">{{year}}</text>
				<img class="timeline-title-right-icon" @click.native="toNextYear" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/timelineIconRight.png" alt="">
			</view>
		</view>
		
		<timeline-swiper ref="timelineSwiper" @changeYear="changeYear" @changeDate="changeDate" :start_year="start_year" :graduate_year="graduate_year"></timeline-swiper>
		<timeline-list :start_year="start_year" :graduate_year="graduate_year" 
		@handleDeleteEvent="handleDeleteEvent" @toast="toast" :dataList="dataList"></timeline-list>
	
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import TimelineSwiper from '@/components/timeline/TimelineSwiper.vue'
	import TimelineList from '@/components/timeline/TimelineList.vue'
	import { eventListStar, eventListPublic, deleteEvent } from '@/network/api_index.js'
	import Toast from '@/wxcomponents/vant/toast/toast'
	export default {
		components: {
			TimelineSwiper,
			TimelineList
		},
		props: {
			dataList: {
				type: Array,
				required: true,
				default: []
			},
			start_year: {
				type: Number,
				default: new Date().getFullYear()
			},
			graduate_year: {
				type: Number,
				default: new Date().getFullYear()
			},
			userId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				eventListStar: [],		//事件列表-收藏
				eventListPublic: [],	//事件列表-公共
				year: new Date().getFullYear(),
				month: new Date().getMonth() + 1,
				// start_year: 2020,
				// graduate_year: 2024,
			}
		},
		methods: {
			//事件汇总（收藏+公共）
			getEventList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					let list = []
					this.getEventListStar(pageNo, pageSize).then(res => {
						if(res instanceof Array) {
							// list = list.concat(res)
							list.push(res)
						} else {
							list.push([])
						}
					}).catch(err => {
						list.push([])
					}).finally(() => {
						this.getEventListPublic(pageNo, pageSize).then(res => {
							if(res instanceof Array) {
								// list = list.concat(res)
								list.push(res)
							} else {
								list.push([])
							}
						}).catch(err => {
							list.push([])
						}).finally(() => {
							resolve(list)
						})
					})
				})
			},
			//获取收藏事件
			getEventListStar(pageNo, pageSize) {
				// console.log('获取收藏事件-----')
				return new Promise((resolve, reject) => {
					eventListStar({
						'event_year': this.year,
						'event_month':this.month,
						'per_page': pageSize,
						'page':pageNo,
						'userId': this.userId
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							this.eventListStar = res.data.items
							resolve(res.data.items)
						} else {
							reject()
						}
					}, err => {
						console.log('eventListStar: ' + err)
						reject(err)
					})
				})
				
			},
			//获取公共事件
			getEventListPublic(pageNo, pageSize) {
				// console.log('获取公共事件-----')
				return new Promise((resolve, reject) => {
					eventListPublic({
						'event_year': this.year,
						'event_month':this.month,
						'per_page': pageSize,
						'page':pageNo,
						'userId': this.userId
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							this.eventListPublic = res.data.items
							resolve(res.data.items)
						} else {
							reject()
						}
					}, err => {
						console.log('eventListPublic: ' + err)
						reject(err)
					})
				})
			},
			//切换月份
			changeDate(month, year) {
				this.year = year
				this.month = month
				this.$emit('reloadEvent')
			},
			// 删除事件-发起二次确认
			handleDeleteEvent(item) {
				// 二次确认
				this.$emit('dialog', '确认删除当前事件？', item.id)
			},
			// 删除事件
			confirmDeleteEvent(id) {
				deleteEvent(id).then(res => {
					if(res.code === 0) {
						//删除成功，刷新列表
						this.$emit('reloadEvent')
					} else {
						// 删除失败，提示
						this.$emit('toast', 'fail', '删除失败')
					}
				}, err => {
					console.log('deleteEvent: ' + err)
				})
			},
			toast(type, msg) {
				this.$emit('toast', type, msg)
				if(type === 'success') {
					//收藏成功，刷新列表
					this.$emit('reloadEvent')
				}
			},
			// 去上一年
			toLastYear() {
				let num = this.$refs.timelineSwiper.yearList.length - 1
				if (this.$refs.timelineSwiper.current <= 0) {
					this.$refs.timelineSwiper.current = num
				} else {
					this.$refs.timelineSwiper.current--
				}
			},
			// 去下一年
			toNextYear() {
				let num = this.$refs.timelineSwiper.yearList.length - 1
				if (this.$refs.timelineSwiper.current >= num) {
					this.$refs.timelineSwiper.current = 0
				} else {
					this.$refs.timelineSwiper.current++
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.timeline {
		.timeline-title {
			margin: 0 25rpx;
			display: flex;
			justify-content: space-between;
			color: rgba(0, 0, 0);
			font-size: 30rpx;
			font-weight: bold;
			.timeline-title-left {
				
			}
			.timeline-title-right {
				display: flex;
				align-items: center;
				.timeline-title-right-text {
					margin: 0 12rpx;
				}
				.timeline-title-right-icon {
					height: 60rpx;
					width: 50rpx;
				}
			}
		}
		
		
	}
</style>