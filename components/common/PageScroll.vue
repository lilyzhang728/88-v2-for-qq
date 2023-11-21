<!-- 页面滚动组件 -->
<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<!-- <view slot="top">我是固定在顶部的view</view>
			<view slot="top">我是固定在顶部的view222</view> -->
			<view class="banner-view" style="height: 250rpx;">
				<view style="font-size: 40rpx;font-weight: 700;">这是一个banner</view>
				<view style="font-size: 24rpx;margin-top: 5rpx;">下方tab滚动时可吸附在顶部</view>
			</view>
			<!-- 小程序中直接修改组件style为position: sticky;无效，需要在组件外层套一层view -->
			<view style="z-index: 100;position: sticky;top :0;width: 100%;background-color: #fff;">
				<van-button>test button</van-button>
			</view>
			<view class="item" v-for="(item,index) in dataList">
				<img :src="item" alt="" style="height: 80px;width: 80px;">
				<text style="color: red;">{{item.split('/')[item.split('/').length - 1]}}</text>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
					test1: ['https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/001_b.png',
					  'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/002_b.png',
					  'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/003_b.png',
					  'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/004_b.png',
					  'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/005_b.png',
					  'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/006_b.png',
					  'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/007_b.png',
					  'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/008_b.png',
					  'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/009_b.png',
					  'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/010_b.png'],
					test2: ['https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/011_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/012_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/013_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/014_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/015_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/016_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/017_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/018_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/019_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/020_b.png'],
					test3: ['https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/021_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/022_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/023_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/024_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/025_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/026_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/027_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/028_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/029_b.png',
					'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/skill_icon/icon/030_b.png']
			}
		},
		methods: {
			//模拟接口
			test(index) {
				let _index = 'test' + index
				return this[_index]
			},
			queryList(pageNo, pageSize) {
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//这里的请求只是演示，请替换成自己的项目的网络请求，并在网络请求回调中通过this.$refs.paging.complete(请求回来的数组)将请求结果传给z-paging
				// this.$request.queryList({ pageNo,pageSize }).then(res => {
				// 	//请勿在网络请求回调中给dataList赋值！！只需要调用complete就可以了
				// 	this.$refs.paging.complete(res.data.list);
				// }).catch(res => {
				// 	//如果请求失败写this.$refs.paging.complete(false)，会自动展示错误页面
				// 	//注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
				// 	//在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
				// 	this.$refs.paging.complete(false);
				// })
				console.log(pageNo, pageSize)
				let index = pageNo>3 ? pageNo % 3:pageNo
				console.log('index', index)
				console.log('pageScroll', this.$refs.pageScroll)
				setTimeout(()=>{
					this.$refs.paging.complete(this.test(index))
				}, 1000)
			}
		}
	}
</script>

<style lang="less" scoped>
	.banner-view {
		background-color: #007AFF;
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
