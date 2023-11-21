<template>
	<view class="timeline-swiper-card" :class="'timeline-swiper-card-' + cardIndex">
		<view class="timeline-swiper-card-wrap">
			<view class="timeline-swiper-card-item" 
			:class="{'timeline-swiper-card-item-active': index === activeIndex,
			'timeline-swiper-card-item-cur': index === curIndex}"
			v-for="(item, index) in cardList" :key="index"
			@click="clickCard(index)">
				<view>{{item}}月</view>
				<view>{{monthList[index]}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const CURRENT_YEAR = new Date().getFullYear()
	export default {
		props: {
			cardIndex: {
				type: String
			},
			year: {
				type: Number
			},
		},
		data() {
			return {
				cardList: [1,2,3,4,5,6,7,8,9,10,11,12],
				monthList: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
				activeIndex: CURRENT_YEAR == this.year ? new Date().getMonth() : 0,			// 当前点击月份index
				curIndex: CURRENT_YEAR == this.year ? new Date().getMonth() : '',			// 当前月份index(实际月份-1)
				curYear: new Date().getFullYear()
			}
		},
		methods: {
			clickCard(index) {
				this.activeIndex = index
				this.$emit('changeMonth', index, this.year)
			}
		}
	}
</script>

<style lang="less" scoped>
	.timeline-swiper-card{
		background: transparent;		
		height: 292rpx;
		.timeline-swiper-card-wrap {
			box-sizing: border-box;
			margin: 0 25rpx;
			height: 100%;
			padding: 32rpx 20rpx 40rpx 17rpx;
			overflow: hidden;
			display: flex;
			flex-wrap: wrap;		// 弹性项目换行
			justify-content: flex-start;
			background-color: #fff;
			box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
			border-radius: 20rpx;
			.timeline-swiper-card-item {
				flex: 1;
				margin: 0 5rpx 20rpx 0;
				width: calc((100vw - 50rpx - 17rpx - 20rpx - 25rpx - 26rpx) / 6);		// 20是最外层padding:10*2; 40是时间轴盒子padding:20*2; 100是5个间隙 20*5
				min-width: calc((100vw - 50rpx - 17rpx - 20rpx - 25rpx - 26rpx) / 6);
				max-width: calc((100vw - 50rpx - 17rpx - 20rpx - 25rpx - 26rpx) / 6);
				height: 100rpx;
				text-align: center;
				color: #000;
				font-size: 12/16rem;
				border: 1rpx solid transparent;
				box-sizing: border-box;
				padding: 12rpx 24rpx;
				&:nth-child(6n) {
					// 去除第6n个的margin-right
					margin-right: 0;
				}
			}
			.timeline-swiper-card-item-active {
				border: 2rpx solid #50D2B7;
				border-radius: 20rpx;
			}
			.timeline-swiper-card-item-cur {
				border: 2rpx solid transparent;
				border-radius: 20rpx;
				background: linear-gradient(#2FC2C5, #37C9A3);
				color: #fff;
			}
			
		}
	}

</style>