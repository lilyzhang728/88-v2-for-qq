<!-- 个人主页 -->
<template>
	<view class="homepage"  style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/infos/infosBg.png?sign=0e86468cac06b3dca60ea1ef5fca01dc&t=1691397405');background-size: 100%;background-color: #F8F8F8;background-repeat: no-repeat;">
		<back-topbar title="个人主页"></back-topbar>
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': customBar + 'px', 'padding': '0 25rpx'}">
			<view class="homepage-content">
				<view class="homepage-user-info">
					<!-- 用户基本信息 -->
					<view class="homepage-user-info-basic">
						<img v-if="userInfo.avatar" :src="userInfo.avatar" class="homepage-user-info-basic-avatar" alt="">
						<img v-else :src="defaultAvatar" class="homepage-user-info-basic-avatar" alt="">
						<view class="homepage-user-info-basic-text">
							<view class="homepage-user-info-basic-text-name">{{userInfo.name}}
								<!-- 关注 -->
								<van-button v-if="!isMe && !isFollow" @click="handleFocus" plain class="homepage-user-info-basic-text-focus-wrap" custom-class="homepage-user-info-basic-text-focus">+关注</van-button>
								<van-button v-if="!isMe && isFollow" @click="handleFocus" plain class="homepage-user-info-basic-text-focus-wrap homepage-user-info-basic-text-focus-wrap-grey" custom-class="homepage-user-info-basic-text-focus">取消关注</van-button>
								<!-- 私信 -->
								<view v-if="!isMe" class="homepage-user-info-basic-text-mail" @click.native.stop="toChatPage($event)">
									<van-icon name="envelop-o" size="27rpx" color="#30C3BC" class="homepage-user-info-basic-text-mail-icon" />
								</view>
							</view>
							<view class="homepage-user-info-basic-text-follower">粉丝：{{userInfo.followers_ct ? userInfo.followers_ct : 0}}</view>
							<view class="homepage-user-info-basic-text-school">学校：{{userInfo.school ? userInfo.school : '未填写'}}</view>
						</view>
					</view>
					
					<!-- 雷达图 -->
					<view class="homepage-user-info-radar">
						<homepage-radar :userId="userId"></homepage-radar>
					</view>
				</view>
				<view class="homepage-split">
					<view class="homepage-split-left"></view>
					<view class="homepage-split-center"></view>
					<view class="homepage-split-right"></view>
				</view>
				<view class="homepage-achivement">
					<!-- 获得的徽章 -->
					<view class="homepage-achivement-badge" v-if="showBadge">
						<view class="homepage-achivement-title">
							<view class="homepage-achivement-title-icon"></view>获得的徽章
						</view>
						<view class="homepage-achivement-badge-content">
							<homepage-badge :userId="userId" :badgeList="badgeList" @showBadgeDetail="showBadgeDetail"></homepage-badge>
						</view>
					</view>
					<!-- 发表的攻略 -->
					<view class="homepage-achivement-guide" v-if="dataList.length">
						<view class="homepage-achivement-title">
							<view class="homepage-achivement-title-icon"></view>发表的攻略
						</view>
						<view class="homepage-achivement-guide-content">
							<homepage-guide :userId="userId" :dataList="dataList"></homepage-guide>
						</view>
					</view>
				</view>
				
				<!-- 分享按钮 -->
				<view class="homepage-user-info-share" @click.native.stop="handleShare($event)">
					<van-icon name="share-o" size="24rpx" class="homepage-user-info-share-icon" />分享
				</view>
			</view>
		</z-paging>
		
		<!-- 以下为弹窗 -->
		<!-- 徽章详情 -->
		<badge-detail ref="badgeDetail"></badge-detail>
	</view>
</template>

<script>
	import BackTopbar from '@/components/common/BackTopbar.vue'
	import HomepageRadar from '@/page_infos/components/HomepageRadar.vue'
	import HomepageBadge from '@/page_infos/components/HomepageBadge.vue'
	import BadgeDetail from "@/components/index/BadgeDetail.vue"
	import HomepageGuide from '@/page_infos/components/HomepageGuide.vue'
	import { profile, ownArticle, getBadgeList, follow, unfollow } from '@/network/api_infos.js'
	const myId = uni.getStorageSync('userId')
	const DEFAULT_AVATAR = 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg'
	export default {
		components: {
			BackTopbar,
			HomepageRadar,
			HomepageBadge,
			BadgeDetail,
			HomepageGuide
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
				showBadge: false,
				badgeList: [],
				defaultAvatar: DEFAULT_AVATAR,
				isFollow: true
			}
		},
		computed: {
			isMe() {
				return myId === this.userId
			},
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
			this.getUserBadgeList()
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
			// 查询badge
			getUserBadgeList() {
				getBadgeList({
					'per_page': 8,
					'page': 1,
					'id': this.userId
				}).then(res => {
					if(res.code == 0 && Object.keys(res.data).length) {
						this.badgeList = res.data.items
					}
					this.showBadge = res.data.items.length > 0
				}, err => {
					console.log('getBadgeList', err)
				})
			},
			showBadgeDetail(badgeInfo) {
				this.$refs.badgeDetail.getBadgeDetail(badgeInfo, 0)
			},
			queryList(pageNo, pageSize) {
				ownArticle({
					'post_type': 1,	//1 :tab2
					'per_page': pageSize,
					'page': pageNo,
					'id': this.userId
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
			//去私信
			toChatPage(e) {
				uni.navigateTo({
					url: `/page_infos/infosChat/infosChat?id=${this.userId}&name=${this.userInfo.name}`
				})
			},
			//关注
			handleFocus() {
				if(this.isFollow) {
					// 取消关注
					unfollow(this.userId).then(res => {
						if(res.code === 0) {
							// 切换关注状态
							this.isFollow = false
						}
					}, err => {
						console.log('unfollow: ', err)
					})
				} else {
					// 关注
					follow(this.userId).then(res => {
						if(res.code === 0) {
							// 切换关注状态
							this.isFollow = true
						}
					}, err => {
						console.log('follow: ', err)
					})
				}
			},
			
		}
	}
</script>

<style lang="less" scoped>
.homepage {
	width: 100%;
	height: 100%;
	.homepage-content {
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
			.homepage-achivement-badge {
				.homepage-achivement-badge-content {
				}
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
