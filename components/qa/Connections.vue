<!-- 人脉页 -->
<template>
	<view class="connections">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': '30rpx', 'left': '25rpx', 'right': '25rpx'}">
			<template #top>
				<!-- 搜索 -->
				<view class="connections-search" v-if="dataList.length">
					<top-search-box  @toSearch="toSearch"></top-search-box>
				</view>
				
				<!-- 子tab -->
				<!-- <van-tabs :active="subActive" animated @change.native="subTabsChange" ref="subTabs"
				line-height="0" line-width="0" class="connections-subTabs" :swipeable="false">
					<van-tab title="考研"></van-tab>
					<van-tab title="找工作"></van-tab>
					<van-tab title="出国"></van-tab>
					<van-tab title="考公/编"></van-tab>
				</van-tabs> -->	
			</template>
			
			<!-- connections列表 -->
			<view class="connections-list" v-if="dataList.length">
				<view class="connections-item-card" v-for="(item, index) in dataList" :key="index">
					<view class="connections-item-card-content">
						<view class="connections-item-card-avatar-box">
							<img class="connections-item-card-avatar" :src="item.avatar ? item.avatar : defaultAvatar" alt="">
						</view>
						<view class="connections-item-card-body">
							<view class="connections-item-card-body-title">
								<text class="connections-item-card-body-title-name">{{item.name}}</text>
								<view class="connections-item-card-body-title-btn" @click="toAskQuestion(item)">向ta提问</view>
							</view>
							<view class="connections-item-card-body-info">{{item.school ? item.school : ''}} {{item.major ? item.major : ''}}</view>
							<view class="connections-item-card-body-labels" v-if="item.target || item.tags.length">
								<van-tag v-if="item.target" color="#EFFDFB" class="connections-item-card-body-labels-item connections-item-card-body-labels-item-target">{{targetMap[Number(item.target)]}}</van-tag>
								<van-tag v-for="(tag, subIndex) in item.tags" :key="subIndex" color="#F5F5F7" class="connections-item-card-body-labels-item">{{tag.body}}</van-tag>
							</view>
						</view>
					</view>
					<view class="connections-item-card-skillbar">
						<view class="connections-item-card-skillbar-item" :class="'connections-item-card-skillbar-item-'+skillKey" v-for="(skillVal, skillKey, skillIndex) in item.ratings" :key="skillIndex">
							<view class="connections-item-card-skillbar-item-name">{{skillMap[skillKey]}}</view>
							<view class="connections-item-card-skillbar-item-progress">
								<van-progress :percentage="skillVal/5*100" :color="skillColorMap[skillKey]" :show-pivot="false" class="connections-item-card-skillbar-item-progress-bar" />
							</view>
						</view>
					</view>
		
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import TopSearchBox from '@/components/common/TopSearchBox.vue'
	import { connections } from '@/network/api_qa.js'
	import { target_value_key_map, type_value_key_map, skill_color_map } from '@/tools/transform_data.js'
	export default {
		options: {
			styleIsolation: 'shared'
		},
		components: {
			TopSearchBox
		},
		props: {
			active: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				dataList: [],
				defaultAvatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',
				targetMap : target_value_key_map,
				skillMap: type_value_key_map,
				skillColorMap: skill_color_map
			}
		},
		watch: {
			active() {
				this.$refs.paging.reload()
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				if(this.active === 1) {
					this.getConnections(pageNo, pageSize).then(res => {
						this.$refs.paging.complete(res);
					})
				}
			},
			getConnections(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					connections({
						'per_page': pageSize,
						'page': pageNo
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							resolve(res.data.items)
						} else {
							resolve([])
						}
					}, err => {
						resolve([])
						console.log('connections: ', err)
					})
				})
				
			},
			toAskQuestion(item) {
				uni.navigateTo({
					url: `/page_qa/askQuestion/askQuestion?userName=${item.name}&userId=${item.id}`
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.connections {
		.connections-search {
			margin: 25rpx 0;
		}
		.connections-subTabs {
			margin-top: 25rpx;
			/deep/ .van-tabs__scroll{
				background: transparent;
				.van-tabs__nav {
					background: transparent;
					padding-left: 25rpx;
					.van-tab {
						color:#000;
						font-size:24rpx; 
						border-radius:28rpx; 
						margin-top:25rpx; 
						flex-basis: 15% !important;
						padding: 12rpx 30rpx !important;
						margin-right: 20rpx;
						background-color: #fff;
						box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
						border-radius: 28rpx;
						.van-ellipsis {
							line-height: 33rpx;
						}
						
					}
					.van-tab--active {
						color: #fff;
						background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
						border-radius: 28rpx;
					}
				}
			}
		}
		.connections-list {
			padding: 10rpx 25rpx;
			background: #FFFFFF;
			border-radius: 30rpx 30rpx 0rpx 0rpx;
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
									color: rgba(0,0,0,0.8);
									line-height: 30rpx;
									padding: 5rpx 16rpx;
									border-radius: 8rpx;
									border: 1px solid #F5F5F7;
									font-size: 22rpx;
								}
							}
							.connections-item-card-body-labels-item-target {
								/deep/ .van-tag {
									color: #35C7AD;
									line-height: 30rpx;
									padding: 5rpx 16rpx;
									border-radius: 8rpx;
									border: 1px solid #35C7AD;
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
		}
	}
</style>
