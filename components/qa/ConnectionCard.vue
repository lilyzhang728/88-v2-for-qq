<!-- 人脉卡片 -->
<!-- 本组件被 人脉页|邀请回答-搜索结果页  复用 -->
<template>
	<view class="connections-item-card">
		<view class="connections-item-card-content">
			<view class="connections-item-card-avatar-box">
				<img class="connections-item-card-avatar" :src="item.avatar ? item.avatar : defaultAvatar" alt="">
			</view>
			<view class="connections-item-card-body">
				<view class="connections-item-card-body-title">
					<text class="connections-item-card-body-title-name">{{item.name}}</text>
					<view class="connections-item-card-body-title-btn" :class="{'connections-item-card-body-title-btn-grey': item.is_mentioned}" @click.native.stop="toAskQuestion($event, item)">{{item.is_mentioned ? '已被邀请' : '邀ta回答'}}</view>
				</view>
				<view class="connections-item-card-body-info">{{item.school ? item.school : ''}} {{item.major ? item.major : ''}}</view>
				<view class="connections-item-card-body-labels" v-if="item.target || item.tags.length">
					<van-tag v-if="item.target" plain color="#35C7AD"  class="connections-item-card-body-labels-item connections-item-card-body-labels-item-target">{{targetMap[Number(item.target)]}}</van-tag>
					<van-tag v-for="(tag, subIndex) in item.tags" :key="subIndex" color="#FF6F61" class="connections-item-card-body-labels-item">{{tag.body}}</van-tag>
				</view>
			</view>
		</view>
		<view class="connections-item-card-skillbar">
			<view class="connections-item-card-skillbar-item" :class="'connections-item-card-skillbar-item-'+skillKey" v-for="(skillVal, skillKey, skillIndex) in getRatingList(item.ratings)" :key="skillIndex">
				<view class="connections-item-card-skillbar-item-name">{{skillMap[skillKey]}}</view>
				<view class="connections-item-card-skillbar-item-progress">
					<van-progress :percentage="skillVal/5*100" :color="skillColorMap[skillKey]" :show-pivot="false" class="connections-item-card-skillbar-item-progress-bar" />
				</view>
			</view>
		</view>
			
	</view>
</template>

<script>
	import { target_value_key_map, type_value_key_map, skill_color_map } from '@/tools/transform_data.js'
	export default {
		props: {
			item: {
				type: Object,
				default: {
					
				}
			},
			parent: {
				type: String,
				default: ''
			},
			index: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				defaultAvatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',
				targetMap : target_value_key_map,
				skillMap: type_value_key_map,
				skillColorMap: skill_color_map
			}
		},
		methods: {
			toAskQuestion(e, item) {
				//防止冒泡
				e.preventDefault()
				if(this.parent === 'connection') {
					// 人脉页，跳转发布问题页
					uni.navigateTo({
						url: `/page_qa/askQuestion/askQuestion?userName=${item.name}&userId=${item.id}`
					})
				} else {
					if(!item.is_mentioned) {
						// 邀请回答-搜索结果页，改变状态
						this.$emit('changeState', this.index, item.id)
					}
				}
			},
			// 根据能力值由大到小排序
			getRatingList(ratings) {
				if(!ratings) return {}
				return Object.fromEntries(Object.entries(ratings).sort((a, b) => (a[1] - b[1])*-1))
			}
		},
	}
</script>

<style lang="less" scoped>
	.connections-item-card {
		padding: 30rpx 0;
		border-bottom: 1rpx solid #EAEAEA;
		.connections-item-card-content {
			display: flex;
			.connections-item-card-avatar-box {
				width: 140rpx;
				height: 140rpx;
				.connections-item-card-avatar {
					width: 140rpx;
					height: 140rpx;
					border-radius: 50%;
				}
			}
			.connections-item-card-body {
				flex: 1;
				overflow: hidden;
				margin-left: 37rpx;
				.connections-item-card-body-title {
					height: 55rpx;
					display: flex;
					.connections-item-card-body-title-name {
						font-size: 32rpx;
						font-weight: 500;
						color: rgba(0,0,0);
						line-height: 45rpx;
						width: calc(100% - 150rpx);
						vertical-align: top;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.connections-item-card-body-title-btn {
						width: 150rpx;
						height: 55rpx;
						background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
						border-radius: 10rpx;
						line-height: 55rpx;
						text-align: center;
						font-size: 24rpx;
						font-weight: 600;
						color: #FFFFFF;
					}
					.connections-item-card-body-title-btn-grey {
						background: #DFDFDF !important;
					}
				}
				.connections-item-card-body-info {
					font-size: 24rpx;
					color: rgba(0,0,0);
					line-height: 33rpx;
				}
				.connections-item-card-body-labels {
					margin-top: 14rpx;
					display: flex;
					flex-wrap: wrap;
					.connections-item-card-body-labels-item {
						margin-right: 10rpx;
						/deep/ .van-tag {
							color: #fff;
							line-height: 30rpx;
							padding: 5rpx 16rpx;
							border-radius: 8rpx;
							border: 1px solid #F5F5F7;
							font-size: 22rpx;
						}
					}
					.connections-item-card-body-labels-item-target {
						/deep/ .van-tag {
							color: #35C7AD !important;
							line-height: 30rpx;
							padding: 5rpx 16rpx;
							border-radius: 8rpx;
							border: 1px solid #35C7AD !important;
							font-size: 22rpx;
							background-color: #EFFDFB;
						}
					}
				}
			}
		}
		.connections-item-card-skillbar {
			margin-top: 25rpx;
			display: flex;
			flex-wrap: wrap;
			.connections-item-card-skillbar-item {
				padding: 12rpx 14rpx;
				margin-right: 10rpx;
				margin-bottom: 10rpx;
				border-radius: 8rpx;
				display: flex;
				align-items: center;
				.connections-item-card-skillbar-item-name {
					font-size: 20rpx;
					font-weight: 500;
					color: rgba(0,0,0,0.8);
					line-height: 28rpx;
					height: 28rpx;
					margin-right: 10rpx;
				}
				.connections-item-card-skillbar-item-progress {
					width: 78rpx;
					.connections-item-card-skillbar-item-progress-bar {
						/deep/ .van-progress {
							height: 8rpx !important;
							background: #E5E5E5 !important;
							border-radius: 7rpx !important;
							// .van-progress__portion {
							// 	background: #FFA849 !important;
							// }
						}
					}
				}
				&:last-child {
					margin-right: 0;
				}
			}
			.connections-item-card-skillbar-item-academic {
				background: #FFF9F2;
			}
			.connections-item-card-skillbar-item-grade {
				background: #FFF8F7;
			}
			.connections-item-card-skillbar-item-interest {
				background: #EFFDFB;
			}
			.connections-item-card-skillbar-item-practice {
				background: #F5F9FF;
			}
			.connections-item-card-skillbar-item-reputation {
				background: #FEF9FF;
			}
			.connections-item-card-skillbar-item-skill {
				background: #FBF9FF;
			}
		}
		&:last-child {
			border-bottom: none;
		}
	}
</style>