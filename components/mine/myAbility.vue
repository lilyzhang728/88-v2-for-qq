<!-- 档案 -->
<template>
	<view class="content index" style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/indexBg.png?sign=b371a636ad933c82f4188e6986e68d87&t=1687658284');background-size: 100%;background-color: #fff;background-repeat: no-repeat;">
		<z-paging ref="paging" v-model="dataList"  :paging-style="{'top': customBar + 'px'}">
			<!-- 个人信息 -->
			<view class="userInfo" style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/userInfoBg.png?sign=ffd748d25d6721cb672e63b6ff4b2625&t=1687599098');background-size: 100% 100%;background-repeat: no-repeat;" >
				<skill-radar :userId="userId" class="skill-radar" ref="skillRadar"></skill-radar>
				<portrait-info :userId="userId" class="portrait-info" ref="portraitInfo" @getTimeRange="getTimeRange"></portrait-info>
			</view>
			
			<!-- 徽章 -->
			<view class="badge">
				<badge-box ref="badgeBox" :userId="userId" @showBadgeDetail="showBadgeDetail"></badge-box>
			</view>
			
			

			<!-- 以下为弹窗 -->
			<!-- 徽章详情 -->
			<badge-detail ref="badgeDetail"></badge-detail>
			
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
			BadgeDetail
		},
		data() {
			return {
				dataList: [],	//大事年表-事件列表
				pageNo: 1,		//分页-第几页
				pageSize: 8,	//分页-一页多少条
				start_year: new Date().getFullYear(),
				graduate_year: new Date().getFullYear(),
				showPage: false,
			}
		},
		computed: {
			customBar() {
				return uni.getStorageSync('customBar')
			},
			userId() {
				return uni.getStorageSync('userId')
			}
		},
		onLoad() {
			_this = this
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
			
			uni.$on('showDialog', function(){
				_this.showDialog()
			})
		},
		onUnload() {
			uni.$off('showDialog')
		},
		methods: {
			// 刷新个人信息
			reloadPortraitInfo() {
				this.$refs.portraitInfo.getUserInfo()
			},
			// 刷新徽章
			reloadBadge() {
				this.$refs.badgeBox.getUserBadgeList()
			},
			// 展示徽章详情
			showBadgeDetail(badgeInfo) {
				this.$refs.badgeDetail.getBadgeDetail(badgeInfo, 0)
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
