<template>
	<view class="content index" style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/indexBg.png?sign=b371a636ad933c82f4188e6986e68d87&t=1687658284');background-size: 100%;background-color: #fff;background-repeat: no-repeat;">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': customBar + 'px'}">
			<!-- 个人信息 -->
			<view class="userInfo" style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/userInfoBg.png?sign=ffd748d25d6721cb672e63b6ff4b2625&t=1687599098');background-size: 100% 100%;background-repeat: no-repeat;" >
				<skill-radar :userId="userId" class="skill-radar" ref="skillRadar"></skill-radar>
				<portrait-info :userId="userId" class="portrait-info" ref="portraitInfo" @getTimeRange="getTimeRange"></portrait-info>
			</view>
			
			<!-- 徽章 -->
			<view class="badge">
				<badge-box ref="badgeBox" :userId="userId"></badge-box>
			</view>
			
			<!-- 大事年表 -->
			<view class="timeline">
				<timeline :userId="userId" ref="timeline" @toast="toast" @dialog="dialog" 
				:start_year="start_year" :graduate_year="graduate_year"
				:dataList="dataList" @reloadEvent="reloadEvent"></timeline>
			</view>

			<!-- 以下为弹窗 -->
			<!-- 徽章详情 -->
			<badge-detail ref="badgeDetail"></badge-detail>
			<!-- 添加事件选项弹框 -->
			<!-- <timeline-add-option ref="timelineAddOption" :start_year="start_year" :graduate_year="graduate_year"></timeline-add-option> -->
			
			<!-- dialog提示：点击雷达图提示/删除事件二次确认 -->
			<van-dialog id="van-dialog" />
			<!-- toast提示：删除事件 -->
			<van-toast id="van-toast" />
		</z-paging>
	</view>
</template>

<script>
	import SkillRadar from "@/components/index/SkillRadar.vue"
	import PortraitInfo from "@/components/index/PortraitInfo.vue"
	import BadgeBox from "@/components/index/BadgeBox.vue"
	import Timeline from "@/components/timeline/Timeline.vue"
	import BadgeDetail from "@/components/index/BadgeDetail.vue"
	// import TimelineAddOption from "@/components/timeline/TimelineAddOption.vue"
	import Dialog from "@/wxcomponents/vant/dialog/dialog"
	import Toast from '@/wxcomponents/vant/toast/toast'
	import { login } from "@/network/api_login.js"	
	import ZPInterceptor from '@/uni_modules/z-paging/components/z-paging/js/z-paging-interceptor'
	
	let _this = null
	export default {
		components: {
			SkillRadar,
			PortraitInfo,
			BadgeBox,
			Timeline,
			BadgeDetail
		},
		data() {
			return {
				statusBar: 0, // 状态栏高度
				customBar: 0, // 状态栏高度 + 导航栏高度
				windowHeight: 0,
				dataList: [],	//大事年表-事件列表
				pageNo: 1,		//分页-第几页
				pageSize: 8,	//分页-一页多少条
				start_year: new Date().getFullYear(),
				graduate_year: new Date().getFullYear(),
				showPage: false,
				userId: ''
			}
		},
		onLoad() {
			_this = this
			uni.getSystemInfo({
				success: (e) => {
					// #ifdef MP-WEIXIN
					this.statusBar = e.statusBarHeight
					this.windowHeight = e.windowHeight
					// @ts-ignore
					const custom = wx.getMenuButtonBoundingClientRect()
					this.customBar = custom.bottom + custom.top - e.statusBarHeight
					// #endif
				}
			})
			this.login()
		},
		onShow() {
			//TODO： 分页参数改回来
			ZPInterceptor.handleQuery((pageNo, pageSize, from)=>{
				//修改分页参数
				pageSize = 8
				return [pageNo, pageSize, from];
			})
		},
		mounted() {
			uni.$on('showBadgeDetail', function(badgeInfo){
				_this.showDetail(badgeInfo, 0)
			})
			uni.$on('showDialog', function(){
				_this.showDialog()
			})
			// uni.$on('clickAddEvent', function(start_year, graduate_year){
			// 	_this.$refs.timelineAddOption.showAddOption = true
			// })
			
			// _this.showDetail({
			// 	achievement_id: 1
			// }, 0)
		},
		onUnload() {
			uni.$off('showBadgeDetail')
			uni.$off('showDialog')
			uni.$off('clickAddEvent')
		},
		methods: {
			login() {
				login().then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						// 存token，user_id
						uni.setStorageSync('token', res.data.token);
						uni.setStorageSync('userId', res.data.user_id);
						this.userId = res.data.user_id
						if(res.data.user_id) {
							this.$refs.paging.reload()
						}
						console.log('userid: ', res.data.user_id)
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
			//请求大事年表
			queryList(pageNo, pageSize) {
				// console.log('开始请求： ', pageNo, pageSize)
				this.pageNo = pageNo
				this.pageSize = Number(pageSize)
				this.$refs.timeline.getEventList(this.pageNo, this.pageSize).then(res => {
					this.$refs.paging.complete(res);
				})
			},
			//切换大事年表-月份
			reloadEvent() {
				// console.log('reload---')
				this.$refs.paging.reload()
			},
			// 展示徽章详情
			showDetail(badgeInfo, type) {
				this.$refs.badgeDetail.getBadgeDetail(badgeInfo, type)
			},
			
			showDialog() {
				Dialog.alert({
					title: '标题',
					message: '弹窗内容',
				}).then(() => {
					// on close
				});
			},
			
			toast(type, msg) {
				Toast({
				  type: type,
				  message: msg
				})
			},
			dialog(msg, id) {
				Dialog.confirm({
				  title: '',
				  message: msg,
				}).then(() => {
				    // on confirm
					this.$refs.timeline.confirmDeleteEvent(id)
				}).catch(() => {
					// on cancel
				});
			},
			getTimeRange(start_year, graduate_year) {
				this.start_year = start_year
				this.graduate_year = graduate_year
			}
		}
	}
</script>

<style scoped lang="less">
	.index {
		width: 100%;
		height: 100%;
		.userInfo {
			height: 647rpx;
			margin: 0 25rpx;
			.skill-radar {
				display: block;
				height: 420rpx;
			}
			.portrait-info {
				display: block;
				margin: 30rpx 35rpx;
				border: 1rpx solid #FFFFFF;
				border-radius: 20rpx;
				background: rgba(255,255,255,0.1);
				height: 166rpx;
			}
		}
		.badge {
			margin: 0 25rpx;
			margin-top: 50rpx;
		}
		.timeline {
			margin-top: 50rpx;
		}
	}
</style>
