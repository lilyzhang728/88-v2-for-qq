<!-- 创建徽章-徽章图片-默认图库 -->
<template>
	<view class="badge-img-default-library">
		<van-action-sheet :show="showDefaulImg" title="徽章图案" @close.native="closeDefaultImg">
		  <view class="badge-img-content">
			  <view class="badge-item" v-for="(item,index) in defaultList" :key="index" @tap="selectImg(item)">
			  	<img :src="item" alt="" class="badge-img">
			  </view>
		  </view>
		</van-action-sheet>
	</view>
</template>

<script>
	import { defaultBadgeImgList } from '@/network/api_badge.js'
	export default {
		data() {
			return {
				showDefaulImg: false,
				defaultList: [],
			}
		},
		methods: {
			closeDefaultImg() {
				this.showDefaulImg = false
			},
			selectImg(item) {
				this.showDefaulImg = false
				uni.$emit('select-img', item)
			},
			// 获取官方图库图片
			getDefaultBadgeImgList() {
				defaultBadgeImgList().then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.defaultList = res.data
					}
				}, err => {
					console.log('defaultBadgeImgList: ' + err)
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.badge-img-default-library {
		.badge-img-content {
			margin: 10px;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start; // 替代原先的space-between布局方式
			max-height: calc(100vw / 1.8);
			overflow: scroll;
			
			.badge-item {
				flex: 1;
				// background-color: aquamarine;
				margin: 0 5px 10px 0; // 间隙为5px
				width: calc((100vw - 15px - 20px) / 4); // 这里的15px = (分布个数4-1)*间隙5px, 可以根据实际的分布个数和间隙区调整
				min-width: calc((100vw - 15px - 20px) / 4); // 加入这两个后每个item的宽度就生效了
				max-width: calc((100vw - 15px - 20px) / 4); // 加入这两个后每个item的宽度就生效了
				height: calc((100vw - 15px - 20px) / 4);
				text-align: center;
				position: relative;
				&:nth-child(4n) {
					// 去除第4n个的margin-right
					margin-right: 0;
				}
				
				.badge-img {
					width: 90%;
					height: 90%;
					position: absolute;
					left: 5%;
					top: 5%;
				}
					

			}
		}
	}
</style>