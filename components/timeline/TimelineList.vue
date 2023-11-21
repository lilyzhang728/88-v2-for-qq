<template>
	<view class="timeline-list">
		<view style="z-index: 100;position: sticky;top :0;">
			<van-button plain icon="plus"  block @tap="toAddTimeline" color="#50D2B7">添加事件</van-button>
		</view>
		<view class="timeline-list-wrap">
			<!-- 已收藏事件 -->
			<view class="timeline-item" :class="{'timeline-item-top': item.isTop}" 
			v-for="(item, index) in dataList[0]" :key="index">
			
				<view>
					<view class="node">{{item.event_date}}</view>
					<view class="borderLeft"></view>
				</view>
				
				<van-swipe-cell right-width="140">
					<view class="timeline-item-box">
						<view class="timeline-item-left">
							<view class="timeline-item-header">
								<text class="timeline-item-name">{{item.name}}</text>
							</view>
							<view class="timeline-item-descrip" v-if="item.description">{{item.description}}</view>
							<text class="timeline-item-type">{{importance(item.importance)}}</text>
							<text class="timeline-item-level">{{emergency(item.emergency)}}</text>
						</view>
						<!-- <view class="timeline-item-right" @click="clickStar(item)">
							<img src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/starIcon.png" v-if="item.is_collect" alt="" class="timeline-item-right-icon">
							<img src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/unStarIcon.png" v-else alt="" class="timeline-item-right-icon">
						</view> -->
					</view>
					
					<view slot="right"><van-icon name="edit" color="#a0a0a0" @click.native="toEditEvent(item)" class="timeline-item-right-btn timeline-item-right-btn-left" /></view>
					<view slot="right"><van-icon name="delete-o" color="#a0a0a0" @click.native="handleDelete(item)" class="timeline-item-right-btn"/></view>
				</van-swipe-cell>
			</view>
			
			<!-- 分割线 -->
			<view class="timeline-list-split" v-if="dataList[1].length"><img class="timeline-list-split-img" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/timelineListSplit.png" alt=""></view>
			
			<!-- 未收藏事件 -->
			<view class="timeline-item" :class="{'timeline-item-top': item.isTop}"
			v-for="(item, index) in dataList[1]" :key="index">
			
				<view>
					<view class="node">{{item.event_date}}</view>
					<view class="borderLeft"></view>
				</view>
				
				<!-- <van-swipe-cell right-width="140"> -->
					<view class="timeline-item-box">
						<view class="timeline-item-left">
							<view class="timeline-item-header">
								<text class="timeline-item-name">{{item.name}}</text>
							</view>
							<view class="timeline-item-descrip" v-if="item.description">{{item.description}}</view>
							<text class="timeline-item-type">{{importance(item.importance)}}</text>
							<text class="timeline-item-level">{{emergency(item.emergency)}}</text>
						</view>
						<view class="timeline-item-right" @click="clickStar(item)">
							<img src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/starIcon.png" v-if="item.is_collect" alt="" class="timeline-item-right-icon">
							<img src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/unStarIcon.png" v-else alt="" class="timeline-item-right-icon">
						</view>
					</view>
					
					<!-- <view slot="right"><van-icon name="edit" color="#a0a0a0" @click.native="toEditEvent(item)" class="timeline-item-right-btn timeline-item-right-btn-left" /></view> -->
					<!-- <view slot="right"><van-icon name="delete-o" color="#a0a0a0" @click.native="handleDelete(item)" class="timeline-item-right-btn"/></view> -->
				<!-- </van-swipe-cell> -->
			</view>
		</view>
	</view>
</template>

<script>
	import { starEvent, unStarEvent } from '@/network/api_index.js'
	import { target_value_key_map, importance_value_key_map, emergency_value_key_map} from '@/tools/transform_data.js'
	export default {
		props: {
			start_year: {
				type: Number,
				required: true,
				default: 2020
			},
			graduate_year: {
				type: Number,
				required: true,
				default: 2028
			},
			dataList: {
				type: Array,
				required: true,
				default: []
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			importance(value) {
				return value ? importance_value_key_map[value] : ''
			},
			emergency(value) {
				return value ? emergency_value_key_map[value] : ''
			},
			// 去创建事件
			toAddTimeline() {
				// uni.$emit('clickAddEvent', this.start_year, this.graduate_year)
				uni.navigateTo({
					url: `/page_editPersonalInfo/addTimelineItem/addTimelineItem?start=${this.start_year}&graduate=${this.graduate_year}`
				})
			},
			// 去编辑事件
			toEditEvent(item) {
				console.log(item)
				uni.navigateTo({
					url: `/page_editPersonalInfo/addTimelineItem/addTimelineItem?start=${this.start_year}&graduate=${this.graduate_year}&id=${item.id}&edit=1`
				})
			},
			// 删除事件
			handleDelete(item) {
				this.$emit('handleDeleteEvent', item)
			},
			// 切换收藏状态（点击收藏Icon）
			clickStar(item) {
				if(item.is_collect) {
					// 收藏 ——> 取消收藏
					unStarEvent(item.id).then(res => {
						if(res.code === 0) {
							// 取消收藏成功，刷新列表
							this.$emit('toast', 'success', '取消收藏成功')
						} else {
							this.$emit('toast', 'fail', '取消收藏失败')
						}
					}, err => {
						console.log('unStarEvent: ' + err)
					})
				} else {
					// 未收藏 ——> 收藏
					starEvent(item.id).then(res => {
						if(res.code === 0) {
							// 收藏成功，刷新列表
							this.$emit('toast', 'success', '收藏成功')
						} else {
							this.$emit('toast', 'fail', '收藏失败')
						}
					}, err => {
						console.log('starEvent: ' + err)
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.timeline-list {
		margin: 40rpx 25rpx 25rpx 25rpx;
		.timeline-list-wrap {
			margin-top: 50rpx;
			padding-left: 15rpx;
			.timeline-item {
				list-style: none;
				box-sizing: border-box;
				padding-left: 32rpx;
				position: relative;
				margin-bottom: 27rpx;
				.node {
					font-size: 26rpx;
					line-height: 43rpx;
					font-weight: 600;
					color: #ACACAC;
				}
				.node:before {
					z-index: 1;
					content: "";
					width: 30rpx;
					height: 30rpx;
					color: #fff;
					position: absolute;
					border-radius: 50%;
					left: 0;
					top: 21.5rpx;
					transform: translate(-50%, -50%);
					background-image: url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/timelineIcon.png?sign=9cf69712964f61fc591489872abcce79&t=1687660525);
					background-repeat: no-repeat;
					background-size: 100% 100%;
				}
				
				.borderLeft {
					width: 1rpx;
					height: 100%;
					position: absolute;
					top: 21.5rpx;
					bottom: 0;
					left: -1rpx;
					background-image: linear-gradient(#51D3B7 35%, rgba(255,255,255,0) 0%); /* 35%设置虚线点y轴上的长度 */
					background-position: left; /* right配置右边框位置的虚线 */
					background-size: 1rpx 20rpx; /* 第一个参数设置虚线点x轴上的长度；第二个参数设置虚线点的间距 */
					background-repeat: repeat-y;
				}
				
				.timeline-item-box {
					margin-top: 10rpx;
					box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
					border-radius: 20rpx;
					border-left: 8rpx solid #33C5B6;
					padding: 20rpx 20rpx 20rpx 30rpx;
					.timeline-item-left {
						flex: 1;
						.timeline-item-header {
							font-size: 28rpx;
							color: rgba(0,0,0,0.9);
							line-height: 42rpx;
							margin-bottom: 10rpx;
						}
						.timeline-item-descrip {
							margin-bottom: 15rpx;
							color: rgba(0,0,0,0.5);
							line-height: 33rpx;
							font-size: 22rpx;
						}
						.timeline-item-type {
							color: #1FAFBB;
							font-size: 20rpx;
							line-height: 35rpx;
							margin-right: 30rpx;
						}
						.timeline-item-level {
							color: #D4A038;
							font-size: 20rpx;
							line-height: 35rpx;
						}
					}
					.timeline-item-right {
						width: 46rpx;
						height: 46rpx;
						border-radius: 50%;
						position: absolute;
						bottom: 20rpx;
						right: 20rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						.timeline-item-right-icon {
							height: 100%;
							width: 100%;
						}
					}
				}
				.timeline-item-right-btn {
					font-size: 30px;
					border-radius: 50%;
					border: 1px solid transparent;
					padding: 10px;
					box-shadow: 0px 0px 23px 0px rgba(81,211,184,0.15);
				}
				.timeline-item-right-btn-left {
					margin-right: 14px;
				}
			}
			.timeline-item-top {
				.timeline-item-box {
					border-left: 8rpx solid #E7B551;
				}
			}
			.timeline-list-split {
				margin: 40rpx 58rpx 37rpx 41rpx;
				.timeline-list-split-img {
					height: 34rpx;
					width: 100%;
				}
			}
		}
	}
	
	
</style>