<!-- 自定义返回头 -->
<template>
	<view class="back-topbar" :style="{height: customBar+'px', paddingTop: customBarTop+'px', position: 'relative', boxSizing: 'border-box'}">
		<view class="back-topbar-icon" v-if="!isWxShare" :style="{position: 'absolute', left: '25rpx', bottom: customBarIconBottom+'px'}" @click.native="handleBack"><van-icon name="arrow-left" size="22px" /></view>
		<van-button v-if="isWxShare" size="small" @click.native="toHome" icon="wap-home-o"  round color="#35C8A7">首页</van-button>
		<view v-if="!isWxShare" class="back-topbar-title" :style="{height: customBarHeight+'px', lineHeight: customBarHeight+'px', width: '100%', textAlign: 'center', fontSize: '38rpx', fontWeight: 'bold'}">{{title}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				required: false,
				default: ''
			},
			//返回上一页刷新的子组件ref
			refName: {
				type: String,
				required: false
			},
			//返回上一页刷新的方法名
			functionName: {
				type: String,
				required: false
			},
			//返回刷新tab页(使用时需-1)
			tabIndex: {
				type: String,
				required: false
			},
			isWxShare: {
				type: Boolean,
				required: false,
				default: false
			}
		},
		data() {
			return {
				customBar: uni.getStorageSync('customBar') ? uni.getStorageSync('customBar') : 0,
				customBarTop: uni.getStorageSync('customBarTop') ? uni.getStorageSync('customBarTop') : 0,
				customBarHeight: uni.getStorageSync('customBarHeight') ? uni.getStorageSync('customBarHeight') : 0,
				customBarIconBottom: uni.getStorageSync('customBarIconBottom') ? uni.getStorageSync('customBarIconBottom') : 0
			}
		},
		methods: {
			handleBack() {
				uni.navigateBack({
				    success: () => {
				         let page = getCurrentPages().pop();//跳转页面成功之后
				         if (page && this.refName && this.functionName) {
							 //返回上一页并刷新
							 if(this.tabIndex) {
								 page.$vm.$refs[this.refName][Number(this.tabIndex)-1][this.functionName]()
							 } else {
								 page.$vm.$refs[this.refName][this.functionName]()
							 }
				         } else if(page && !this.refName && this.functionName) {
							 // 直接在上一页调刷新接口（不需要子组件）
							 page.$vm[this.functionName]()
						 }
				    }
				})
			},
			toHome() {
				uni.navigateTo({
					url: '/pages/launch/launch'
				});
			}
		}
	}
</script>

<style lang="less" scoped>
</style>
