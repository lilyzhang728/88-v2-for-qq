<!-- 邀请用户列表 -->
<template>
	<view class="invite-user-list">
		<van-popup :show="showDetail" round closeable position="bottom"
			@close.native="onClose" get-container="#app">
			<view class="detail-wrap">
				<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': '20%', 'left': '25rpx', 'right': '25rpx'}">
					<template #top>
						<!-- 搜索 -->
						<view class="connections-search">
							<top-search-box  @toSearch="toSearch"></top-search-box>
						</view>
					</template>
					
					<!-- connections列表 -->
					<view class="connections-list">
						<view class="connections-item-card" v-for="(item, index) in dataList" :key="index">
							<view class="connections-item-card-content">
								<view class="connections-item-card-avatar-box">
									<img class="connections-item-card-avatar" :src="item.avatar ? item.avatar : defaultAvatar" alt="">
								</view>
								<view class="connections-item-card-body">
									<view class="connections-item-card-body-title">
										<text class="connections-item-card-body-title-name">{{item.name}}</text>
										<view class="connections-item-card-body-title-btn" :class="{'connections-item-card-body-title-btn-grey': item.is_mentioned}" @click="toAskQuestion(item, index)">
											{{item.is_mentioned ? '已被邀请' : '邀ta回答'}}</view>
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
		</van-popup>
	</view>
</template>

<script>
	import { connections, invideUserAnswer } from '@/network/api_qa.js'
	import TopSearchBox from '@/components/common/TopSearchBox.vue'
	import { target_value_key_map, type_value_key_map, skill_color_map } from '@/tools/transform_data.js'
	export default {
		options: {
			styleIsolation: 'shared'
		},
		props: {
			postId: {
				type: String,
				default: ''
			}
		},
		components: {
			TopSearchBox
		},
		data() {
			return {
				showDetail: true,
				dataList: [],
				defaultAvatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',
				targetMap : target_value_key_map,
				skillMap: type_value_key_map,
				skillColorMap: skill_color_map
			}
		},
		computed: {
			
		},
		watch: {
			showDetail(val) {
				if(!val) {
					this.resetData()
				}
			}
		},
		methods: {
			onClose() {
				this.showDetail = false
			},
			resetData() {
				
			},
			queryList(pageNo, pageSize) {
				this.getConnections(pageNo, pageSize).then(res => {
					this.$refs.paging.complete(res);
				})
			},
			getConnections(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					connections({
						'per_page': pageSize,
						'page': pageNo,
						'post_id': this.postId
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
			// 向他提问
			toAskQuestion(item, index) {
				if(!item.is_mentioned) {
					this.$set(this.dataList[index], 'is_mentioned', true)
					invideUserAnswer({
						'user_id': item.id,
						'id': this.postId
					}).then(res => {
						if(res.code === 0) {
							// this.$emit('closePopup', true)
						} else {
						}
					}, err => {
						console.log('invideUserAnswer: ', err)
					})
				}
				
			},
			toSearch() {
				const searchContentType = 0
				let tabIndex = 6
				uni.navigateTo({
					url: `/page_editPersonalInfo/commonSearch/commonSearch?tabIndex=${tabIndex}&searchContentType=${searchContentType}&postId=${this.postId}`
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.invite-user-list {
		.detail-wrap {
			text-align: center;
			height: 80vh;
			.connections-search {
				margin: 25rpx 0;
				/deep/ .top-search-box {
					background-color: #F6F6F6;
				}
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
									text-align: left;
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
									background: #dfdfdf !important;
								}
							}
							.connections-item-card-body-info {
								font-size: 24rpx;
								color: rgba(0,0,0);
								line-height: 33rpx;
								text-align: left;
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
	}
	
</style>
