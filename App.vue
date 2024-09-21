<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')

			// 使用 callContainer 前一定要 init 一下，全局执行一次即可
			wx.cloud.init({
				env: "prod-4gkvfp8b0382845d"
			})
		},
		onShow: function() {
			console.log('App Show')
			// 计算自定义返回头的样式
			uni.getSystemInfo({
				success: (e) => {
					// #ifdef MP-WEIXIN
					// @ts-ignore
					// 小程序基础库版本
					uni.setStorageSync('hostSDKVersion', e.hostSDKVersion)
					const custom = wx.getMenuButtonBoundingClientRect()
					uni.setStorageSync('customBar', custom.bottom + custom.top - e.statusBarHeight)	//topbar高度
					uni.setStorageSync('customBarTop', custom.top)		//topbar的 padding-top
					uni.setStorageSync('customBarHeight', custom.height)	//topbar标题的高度、line-height
					uni.setStorageSync('customBarIconBottom', custom.bottom - e.statusBarHeight - custom.height)	//topbar的icon的bottom
					uni.setStorageSync('statusBar', e.statusBarHeight)
					uni.setStorageSync('screenWidth', e.screenWidth)
					uni.setStorageSync('platform', e.platform)
					// #endif
				}
			})
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 注意:引入css的格式 */
	@import url("@/wxcomponents/vant/common/index.wxss");
	
	/* 样式的value不加""   */
	page {
		background-color: #fff;
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		/* padding: 0 25rpx; */
	}

	/*每个页面公共css */
	/* 解决小程序和app滚动条的问题 */
	/* #ifdef MP-WEIXIN || APP-PLUS */
	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}

	/* #endif */

	/* 解决H5 的问题 */
	/* #ifdef H5 */
	uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}

	/* #endif */
	
	.field-input-custom .van-field__control {
	  font-size: 36rpx;
	  line-height: 50rpx;
	}
	.field-input-custom .van-field__label {
	  font-size: 34rpx;
	  line-height: 40rpx;
	}
</style>

