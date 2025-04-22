<!-- 个人主页 -->
<template>
	<view class="homepage"  style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/infos/infosBg.png?sign=0e86468cac06b3dca60ea1ef5fca01dc&t=1691397405');background-size: 100%;background-color: #F8F8F8;background-repeat: no-repeat;">
		<back-topbar title="个人主页"></back-topbar>
		<z-paging ref="paging" v-model="dataList" @query="queryList" :hide-empty-view="true" :paging-style="{'top': customBar + 'px', 'padding': '0 25rpx'}">
			<view class="homepage-content">
				<view class="homepage-user-info">
					<!-- 用户基本信息 -->
					<view class="homepage-user-info-basic">
						<img v-if="userInfo.avatar" :src="userInfo.avatar" class="homepage-user-info-basic-avatar" alt="">
						<img v-else :src="defaultAvatar" class="homepage-user-info-basic-avatar" alt="">
						<view class="homepage-user-info-basic-text">
							<view class="homepage-user-info-basic-text-name">{{userInfo.name}}</view>
							<!-- <view class="homepage-user-info-basic-text-follower">粉丝：{{userInfo.followers_ct ? userInfo.followers_ct : 0}}</view> -->
							<view class="homepage-user-info-basic-text-school">学校：{{userInfo.school ? userInfo.school : '暂无'}}</view>
							<view class="homepage-user-info-basic-text-school homepage-user-info-basic-text-target">目标：{{userInfo.target ? target : '暂无'}}</view>
						</view>
					</view>
					<view class="homepage-user-info-about-me" v-if="userInfo.about_me">
						<text class="homepage-user-info-about-me-text">个性签名: {{userInfo.about_me}}</text>
					</view>
					
					<!-- 雷达图 -->
					<view class="homepage-user-info-radar">
						<homepage-radar :userId="userId"></homepage-radar>
					</view>
				</view>
				<!-- <view class="homepage-split" v-if="showBadge || dataList.length">
					<view class="homepage-split-left"></view>
					<view class="homepage-split-center"></view>
					<view class="homepage-split-right"></view>
				</view> -->
				<!-- <view class="homepage-achivement">
					<view class="homepage-achivement-badge" v-if="showBadge">
						<view class="homepage-achivement-title">
							<view class="homepage-achivement-title-icon"></view>徽章墙
						</view>
						
					</view>
					<view class="homepage-achivement-guide" v-if="dataList.length">
						<view class="homepage-achivement-title homepage-achivement-title-post">
							<view class="homepage-achivement-title-icon"></view>发表的动态
						</view>
						<view class="homepage-achivement-guide-content">
							<homepage-post :userId="userId" :dataList="dataList" @checkoutLike="checkoutLike"></homepage-post>
						</view>
					</view>
				</view> -->
				
				<!-- 分享按钮 -->
				<!-- <view class="homepage-user-info-share" @click.native.stop="handleShare($event)">
					<van-icon name="share-o" size="24rpx" class="homepage-user-info-share-icon" />分享
				</view> -->
			</view>
		</z-paging>
		
		
	</view>
</template>

<script>
	import BackTopbar from '@/components/common/BackTopbar.vue'
	import HomepageRadar from '@/page_infos/components/HomepageRadar.vue'
	import HomepagePost from '@/page_infos/components/HomepagePost.vue'
	import { profile, ownArticle, getBadgeList, follow, unfollow, getUserPosts } from '@/network/api_infos.js'
	import { target_value_key_map } from "@/tools/transform_data.js"
	const myId = uni.getStorageSync('userId')
	const DEFAULT_AVATAR = 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg'
	export default {
		components: {
			BackTopbar,
			HomepageRadar,
			HomepagePost
		},
		data() {
			return {
				customBar: 0,
				userId: '',
				userInfo: {
					name: "",
					school: "",
					target: "",
					id: "",
					avatar: ''
				},
				dataList: [],
				defaultAvatar: DEFAULT_AVATAR,
			}
		},
		computed: {
			target() {
				return this.userInfo.target ? target_value_key_map[Number(this.userInfo.target)] : '暂无'
			}
		},
		watch: {
			userInfo(val) {
				if(val) {
					this.$refs.paging.reload()
				}
			}
		},
		onLoad(option) {
			this.userId = option.userId
			this.getUserInfo()
		},
		onUnload() {
			this.userId = ''
		},
		onShow() {
			let that = this
			uni.getSystemInfo({
				success: (e) => {
					// #ifdef MP-WEIXIN
					this.statusBar = e.statusBarHeight
					this.screenWidth = e.screenWidth
					// @ts-ignore
					const custom = wx.getMenuButtonBoundingClientRect()
					this.customBar = custom.bottom + custom.top - e.statusBarHeight
					// #endif
				}
			})
		},
		methods: {
			//查询个人信息
			getUserInfo() {
				profile(this.userId).then(res => {
					if (res.code == 0 && Object.keys(res.data).length) {
						this.userInfo = res.data
					}
				}, err => {
					console.log('profile', err)
				})
			},
			
			queryList(pageNo, pageSize) {
				getUserPosts({
					'post_type': 3,	//帖子
					'per_page': pageSize,
					'page': pageNo,
					'userId': this.userId
				}).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.$refs.paging.complete(res.data.items)
					} else {
						this.$refs.paging.complete([])
					}
				}, err => {
					this.$refs.paging.complete([])
					console.log('ownArticle: ', err)
				})
			},
			// 分享
			handleShare(e) {
				
			},
			// 切换帖子的点赞状态
			checkoutLike(cardIndex, status) {
				this.dataList[cardIndex].is_like = status
				if(status) {
					this.dataList[cardIndex].likers_count++
				} else {
					this.dataList[cardIndex].likers_count--
				}
			},
			// 删帖后返回刷新
			backRefresh() {
				this.$refs.paging.reload()
			}
		}
	}
</script>

<style lang="less" scoped>
.homepage {
	width: 100%;
	height: 100%;
	.homepage-content {
		margin-top: 20rpx;
		background-color: #fff;
		box-shadow: 0rpx 0rpx 15rpx 0rpx rgba(81,211,184,0.1);
		border-radius: 22rpx;
		padding: 40rpx 0;
		position: relative;
		.homepage-user-info {
			padding: 0 30rpx;
			.homepage-user-info-basic {
				display: flex;
				.homepage-user-info-basic-avatar {
					width: 90rpx;
					height: 90rpx;
					margin-right: 39rpx;
					border-radius: 50%;
				}
				.homepage-user-info-basic-text {
					.homepage-user-info-basic-text-name {
						font-size: 30rpx;
						font-weight: 600;
						color: #000000;
						line-height: 42rpx;
						display: flex;
						align-items: center;
						.homepage-user-info-basic-text-focus-wrap {
							margin-left: 20rpx;
							/deep/ .homepage-user-info-basic-text-focus {
								font-size: 20rpx;
								color: #30C3BC;
								line-height: 33rpx;
								padding: 4rpx 13rpx;
								background: #fff;
								border: 1rpx solid #30C4BF;
								border-radius: 8rpx;
								height: auto;
							}
						}
						.homepage-user-info-basic-text-focus-wrap-grey {
							/deep/ .homepage-user-info-basic-text-focus {
								color: rgba(0,0,0,0.5);
								border: 1px solid rgba(0,0,0,0.4);
							}
						}
						
						.homepage-user-info-basic-text-mail {
							margin-left: 20rpx;
							height: 45rpx;
							width: 45rpx;
							border-radius: 50%;
							background-color: rgb(240,240,240);
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}
					.homepage-user-info-basic-text-follower {
						font-size: 18rpx;
						color: rgba(0,0,0,0.5);
						line-height: 25rpx;
						margin-top: 2rpx;
					}
					.homepage-user-info-basic-text-school {
						font-size: 20rpx;
						color: rgba(0,0,0,0.5);
						line-height: 28rpx;
						margin-top: 10rpx;
					}
					.homepage-user-info-basic-text-target {
						margin-top: 5rpx;
					}
				}
			}
			.homepage-user-info-about-me {
				margin-top: 12rpx;
				padding: 12rpx 30rpx;
				background: #F9F9F9;
				border-radius: 8rpx;
				.homepage-user-info-about-me-text {
					font-size: 24rpx;
					color: #000;
					line-height: 30rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.homepage-user-info-radar {
				background: #F9FFFD;
				border-radius: 20rpx;
				border: 1rpx solid #31C4BE;
				height: 443rpx;
				margin-top: 50rpx;
			}
		}
		.homepage-split {
			height: 40rpx;
			margin-top: 15rpx;
			display: flex;
			justify-content: space-between;
			.homepage-split-left {
				height: 100%;
				width: 20rpx;
				border-top-right-radius: 20rpx;
				border-bottom-right-radius: 20rpx;
				background-color: #F8F8F8;
			}
			.homepage-split-center {
				width: calc(100% - 90rpx);
				height: 100%;
				background: linear-gradient(
					to left,
					transparent 0%,
					transparent 50%,
					#E8E8E8 50%,
					#E8E8E8 100%
				);
				background-size: 10px 1px;
				background-repeat: repeat-x;
				background-position: center; 
			}
			.homepage-split-right {
				height: 100%;
				width: 20rpx;
				border-top-left-radius: 20rpx;
				border-bottom-left-radius: 20rpx;
				background-color: #F8F8F8;
			}
		}
		.homepage-achivement {
			padding: 0 30rpx;
			.homepage-achivement-title {
				font-size: 28rpx;
				font-weight: 600;
				color: #000000;
				line-height: 40rpx;
				display: flex;
				align-items: center;
				margin-top: 60rpx;
				.homepage-achivement-title-icon {
					width: 8rpx;
					height: 22rpx;
					background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
					border-radius: 4rpx;
					margin-right: 9rpx;
				}
			}
			.homepage-achivement-title-post {
				margin-bottom: 25rpx;
			}
			
		}
		.homepage-user-info-share {
			width: 127rpx;
			height: 50rpx;
			line-height: 43rpx;
			font-size: 26rpx;
			font-weight: 600;
			background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
			border-radius: 25rpx 0rpx 0rpx 25rpx;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			right: 0;
			top: 70rpx;
			.homepage-user-info-share-icon {
				margin-right: 7rpx;
			}
		}
	}
	
}
</style>
