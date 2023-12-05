<!-- 公共组件：页面顶部1级tab -->
<template>
	<view class="page-tabs">
		<z-paging-swiper :swiper-style="{'top': statusBar + 'px'}">
			<template #top>
				<van-tabs :active="active" animated @change.native="changeTab"
				line-height="8rpx" line-width="60rpx" class="first-level-tabs" :swipeable="true" >
				  <van-tab :title="item" v-for="(item,index) in titleList" :key="index"></van-tab>
				</van-tabs>
			</template>
			<swiper class="swiper" :current="active" @animationfinish="swiperAnimationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in slotName" :key="index">
					<slot name="{{item}}"></slot>
				</swiper-item>
			</swiper>
		</z-paging-swiper>
	</view>
</template>

<script>
	export default {
		options: {
			styleIsolation: 'shared'
		},
		props: {
			// tab-title
			titleList: {
				type: Array,
				required: true,
				default: []
			},
			slotName: {
				type: Array,
				required: true,
				default: []
			}
		},
		data() {
			return {
			}
		},
		computed: {
			// 状态栏高度
			statusBar() {
				return uni.getStorageSync('statusBar')
			}
		}
	}
</script>

<style lang="less" scoped>
	.page-tabs {
		.first-level-tabs {
			/deep/ .van-tabs__scroll{
				background: transparent;
				.van-tabs__nav {
					background: transparent;
					width: 65%;
					// margin-left: 25rpx;
					.van-tabs__line {
						background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
						bottom: 5px;
					}
		
					.van-tab {
						font-size: 36rpx;
						color: rgba(0,0,0,0.5);
						padding: 0;
					}
					.van-tab--active {
						color: #000;
					}
				}
			} 
		}
		.swiper {
			height: 100%;
		}
	}
</style>
