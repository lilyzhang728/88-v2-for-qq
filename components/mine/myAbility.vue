<!-- 档案 -->
<template>
	<view class="content index">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': '45rpx', 'left': '25rpx', 'right': '25rpx'}">
			<!-- 个人信息 -->
			<view class="userInfo" style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/userInfoBg.png?sign=ffd748d25d6721cb672e63b6ff4b2625&t=1687599098');background-size: 100% 100%;background-repeat: no-repeat;" >
				<skill-radar :userId="userId" class="skill-radar" ref="skillRadar"></skill-radar>
				<portrait-info :userId="userId" :refreshFlag="refreshFlag" class="portrait-info" ref="portraitInfo" @getTimeRange="getTimeRange" @updateWidthHeight="updateWidthHeight"></portrait-info>
				<img class="chain-icon chain-icon-left" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/chainIcon.png" alt="">
				<img class="chain-icon chain-icon-right" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/chainIcon.png" alt="">
			</view>
			
			<my-report-card></my-report-card>
			
			<my-report-plan></my-report-plan>
			
			<van-button @click.native="ontest">test</van-button>

			<!-- 以下为弹窗 -->
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
	import Dialog from "@/wxcomponents/vant/dialog/dialog"
	import Toast from '@/wxcomponents/vant/toast/toast'
	import ZPInterceptor from '@/uni_modules/z-paging/components/z-paging/js/z-paging-interceptor'
	import myReportCard from '@/components/mine/myReportCard.vue'
	import myReportPlan from '@/components/mine/myReportPlan.vue'
	let _this = null
	export default {
		components: {
			SkillRadar,
			PortraitInfo,
			myReportCard,
			myReportPlan
		},
		data() {
			return {
				dataList: [],	//徽章列表
				start_year: new Date().getFullYear(),
				graduate_year: new Date().getFullYear(),
				refreshFlag: false
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
			queryList(pageNo, pageSize) {
				// 通知信箱刷新
				this.$emit('pulldownRefresh')
				// 通知雷达图和个人信息模块刷新
				this.refreshFlag = !this.refreshFlag
			},
			// 刷新个人信息
			reloadPortraitInfo() {
				this.$refs.portraitInfo.getUserInfo()
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
			},
			updateWidthHeight(arr) {
				this.$emit('updateWidthHeight', arr)
			},
			ontest() {
				uni.navigateTo({
					url: `/page_infos/myEvaluationForm/myEvaluationForm`
				});
			}
		}
	}
</script>

<style scoped lang="less">
	.index {
		width: 100%;
		height: 100%;
		.userInfo {
			height: 697rpx;
			position: relative;
			.skill-radar {
				display: block;
				height: 420rpx;
			}
			.portrait-info {
				display: block;
				margin: 30rpx 35rpx;
				
				height: 216rpx;
			}
			.chain-icon {
				position: absolute;
				bottom: -40rpx;
				width: 17rpx;
				height: 60rpx;
			}
			.chain-icon-left {
				left: 22rpx;
			}
			.chain-icon-right {
				right: 22rpx;
			}
		}
		
		
		
	}
</style>