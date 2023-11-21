<template>
	<view class="select-achievement" :style="{backgroundImage: 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)',backgroundSize: '100%',backgroundColor: '#F8F8F8',backgroundRepeat: 'no-repeat'}">
		<back-topbar functionName="getAchievementList"></back-topbar>
		<z-paging ref="paging" :paging-style="{'top': (customBar+20) + 'px', 'bottom': '66px', paddingLeft: '25rpx', paddingRight: '25rpx'}">
			<view class="select-achievement-title">
				选择您已经达成的成就
				<view class="select-achievement-title-right" @click="toHome">跳过此步骤</view>
			</view>
			<view class="select-achievement-subTitle">选择您已经达成的成就，勾选后可以直接获得</view>
			<view class="select-achievement-content">
				<view v-for="(item, index) in optionList" :key="index">
					<view class="select-achievement-content-title" :class="{'select-achievement-content-title-first': index===0}">{{item.type}}</view>
					<view class="select-achievement-content-option">
						<view class="select-achievement-content-option-item"
						:class="{'select-achievement-content-option-item-active': subItem.selected}"
						@click="clickItem(subItem, index, subIndex)"
						 v-for="(subItem, subIndex) in item.options" :key="subIndex">{{subItem.name}}</view>
					</view>
				</view>
				<view class="select-achievement-tip">没有找到擅长的技能？请告诉我们<van-icon name="service-o" size="30rpx" class="select-achievement-tip-icon" /></view>
			</view>
		</z-paging>
		<view class="select-achievement-btn-box">
			<van-button block class="select-achievement-btn-wrap" custom-class="select-achievement-btn" @click.native="handleSave">保存</van-button>
		</view>
	</view>
</template>

<script>
	import BackTopbar from '@/components/common/BackTopbar.vue'
	import { addToMyBadge } from '@/network/api_badge.js'
	export default {
		components: {
			BackTopbar
		},
		data() {
			return {
				optionList: [{
					type: '技术类型',
					options: [{
						name: '微服务架构',
						selected: false
					},{
						name: 'Socke技术',
						selected: true
					},{
						name: '分布式技术',
						selected: false
					},{
						name: '网络协议',
						selected: false
					}]
				},{
					type: '后端框架',
					options: [{
						name: 'SpringBoot',
						selected: false
					},{
						name: 'SpringCloud',
						selected: true
					}]
				},{
					type: '技术类型',
					options: [{
						name: '微服务架构',
						selected: false
					},{
						name: 'Socke技术',
						selected: true
					},{
						name: '分布式技术',
						selected: false
					},{
						name: '网络协议',
						selected: false
					}]
				},{
					type: '技术类型',
					options: [{
						name: '微服务架构',
						selected: false
					},{
						name: 'Socke技术',
						selected: true
					},{
						name: '分布式技术',
						selected: false
					},{
						name: '网络协议',
						selected: false
					}]
				},{
					type: '技术类型',
					options: [{
						name: '微服务架构',
						selected: false
					},{
						name: 'Socke技术',
						selected: true
					},{
						name: '分布式技术',
						selected: false
					},{
						name: '网络协议',
						selected: false
					}]
				},],
				customBar: 0
			}
		},
		onShow() {
			let that = this
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
		},
		
		methods: {
			getAchievementList() {
				console.log('getAchievementList')
			},
			//切换选项状态
			clickItem(item, index, subIndex) {
				this.optionList[index].options[subIndex].selected = !this.optionList[index].options[subIndex].selected
			},
			//回到首页
			toHome() {
				uni.switchTab({
					url: '/pages/index/index',
					success: () => {
						let page = getCurrentPages().pop();//跳转页面成功之后
						if (page) {
							page.$vm.$refs.portraitInfo.getUserInfo()
						};
					}
				});
			},
			handleSave() {
				console.log(2222222)
				// addToMyBadge().then(res => {
					
				// }, err => {
					
				// })
			}
		}
	}
</script>

<style lang="less" scoped>
.select-achievement {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	padding: 0 25rpx;
	.select-achievement-title {
		font-size: 38rpx;
		font-weight: 600;
		color: #000000;
		line-height: 53rpx;
		position: relative;
		// margin-top: 50rpx;
		.select-achievement-title-right {
			display: inline-block;
			background: #FFFFFF;
			border-radius: 8rpx;
			border: 1rpx solid #E8E8E8;
			font-size: 22rpx;
			font-weight: 400;
			color: rgba(0,0,0,0.4);
			line-height: 30rpx;
			position: absolute;
			right: 0;
			top: 0;
			padding: 10rpx 16rpx;
		}
	}
	.select-achievement-subTitle {
		font-size: 24rpx;
		line-height: 33rpx;
		color: rgba(0,0,0,0.4);
		margin-top: 17rpx;
	}
	.select-achievement-content {
		margin-top: 40rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 15rpx 0rpx rgba(81,211,184,0.1);
		border-radius: 20rpx;
		padding: 30rpx;
		box-sizing: border-box;
		.select-achievement-content-title {
			font-size: 30rpx;
			font-weight: 600;
			line-height: 42rpx;
			color: #000000;
			margin-top: 60rpx;
		}
		.select-achievement-content-title-first {
			margin-top: 0;
		}
		.select-achievement-content-option {
			.select-achievement-content-option-item {
				display: inline-block;
				border-radius: 8rpx;
				border: 1rpx solid #D3D3D3;
				padding: 10rpx 20rpx;
				box-sizing: border-box;
				color: rgba(0,0,0,0.8);
				margin: 20rpx 20rpx 0 0;
				font-size: 26rpx;
			}
			.select-achievement-content-option-item-active {
				color: rgba(53, 200, 167, 1);
				border: 1rpx solid #50D2B7;
				background: rgba(53,200,167,0.06);
			}
			
		}
		.select-achievement-tip {
			font-size: 26rpx;
			color: rgba(0,0,0,0.4);
			line-height: 37rpx;
			margin-top: 60rpx;
			.select-achievement-tip-icon{
				margin-left: 20rpx;
			}
		}
	}
	
	.select-achievement-btn-box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		box-shadow: 0rpx -1rpx 13rpx 0rpx rgba(0,0,0,0.1);
		padding: 11px 14px;   //因为z-paging只能设置px,所以这里都换算成px， button的height固定44px
		.select-achievement-btn-wrap {
			/deep/ .select-achievement-btn {		
				font-size: 32rpx;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 45rpx;
				padding: 18rpx 0;
				background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
				border-radius: 10rpx;
			}
		}
	}
}
</style>
