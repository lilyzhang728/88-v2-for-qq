<!-- 档案页：包含：档案，我的 2个子tab -->
<template>
	<view  class="mine" style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/indexBg.png?sign=b371a636ad933c82f4188e6986e68d87&t=1687658284');background-size: 100%;background-color: #f8f8f8;background-repeat: no-repeat;">
		<page-tabs :titleList="titleList" :slotName="slotName">
			<template v-slot:myAbility> 
				<!-- 档案 -->
				<my-ability ref="myAbility" @updateWidthHeight="updateWidthHeight" @pulldownRefresh="pulldownRefresh"></my-ability>			
			</template>
			<template v-slot:myProduction>
				<!-- 我的 -->
				<my-production ref="myProduction"></my-production>
			</template>
		</page-tabs>
		
		<!-- 侧边收信箱 -->
		<side-message-box ref="sideMessageBox"></side-message-box>
		
		<!-- 用于压缩上传图片 -->
		<view class="compress_canvas">
			<canvas canvas-id="myCanvas" :style="{width: w + 'px', height: h + 'px'}"></canvas>
		</view>
	</view>
</template>

<script>
	import PageTabs from '@/components/common/PageTabs.vue'
	import myAbility from '@/components/mine/myAbility.vue'
	import myProduction from '@/components/mine/myProduction.vue'
	import SideMessageBox from '@/components/common/SideMessageBox.vue'
	export default {
		components: {
			PageTabs,
			myAbility,
			myProduction,
			SideMessageBox
		},
		data() {
			return {
				active: 0,
				titleList: ['档案', '我的'],
				slotName: ['myAbility', 'myProduction'],
				w: 0,
				h: 0,
			}	
		},
		computed: {
			
		},
		watch: {
			
		},
		onLoad() {
			
		},
		methods: {
			updateWidthHeight(arr) {
				this.w = arr[0]
				this.h = arr[1]
			},
			// 下拉刷新，刷新信箱
			pulldownRefresh() {
				this.$refs.sideMessageBox.getNewNotifications()
			},
			// 删帖后返回刷新
			backRefresh(type) {
				this.active = 1
				if(type == 'guide') {
					this.$refs.myProduction.active = 1
				} else {
					this.$refs.myProduction.active = 0
				}
				this.$refs.myProduction.$refs.paging.reload()
			}
		}
	}
</script>

<style lang="less" scoped>
	.mine {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		
		
		
	}
.compress_canvas{
    position: absolute;
    left: -99999px;
    top:-99999px;
}
</style>
