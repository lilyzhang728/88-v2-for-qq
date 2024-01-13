<template>
	<view class="infos" style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/infos/infosBg.png?sign=0e86468cac06b3dca60ea1ef5fca01dc&t=1691397405');background-size: 100%;background-color: #FFF;background-repeat: no-repeat;">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{ 'padding': '0 25rpx'}">
				<!-- <view class="infos-title">收到的赞和收藏</view> -->
				<back-topbar title="收到的赞和收藏" refName="sideMessageBox" functionName="getNewNotifications"></back-topbar>
			<view class="infos-btns">
				<view class="infos-btns-item" v-for="(item, index) in btnList" :index="index" @click="clickBtn(index)">
					<view class="infos-btns-item-img-wrap">
						<img class="infos-btns-item-img" :src="item.url" alt="">
						<uv-badge class="infos-btns-item-img-badge" type="error" max="99" :value="getVal(index)"></uv-badge>
					</view>
					<text class="infos-btns-item-text">{{item.text}}</text>
				</view>
			</view>
			<view class="infos-content">
				<infos-list-card v-for="(item,index) in dataList" :key="index" :item="item"></infos-list-card>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import InfosListCard from '@/components/infos/InfosListCard.vue'
	import { newNotificationNum, messagesList } from "@/network/api_infos.js"
	import BackTopbar from '@/components/common/BackTopbar.vue'
	export default {
		components: {
			InfosListCard,
			BackTopbar
		},
		data() {
			return {
				customBar: 0,
				pagingTop: 0,
				btnList: [{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/infos/iconLike.png',
					text: '赞'
				},{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/infos/iconCollect.png',
					text: '收藏'
				},{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/infos/iconComment.png',
					text: '评论'
				},{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/infos/iconNewFocus.png',
					text: '邀请回答'
				}],
				dataList: [],
				unread_posts_likes_count: 0,
				unread_posts_collects_count: 0,
				unread_recived_comments_count: 0,
				unread_posts_mentions_count: 0,
				notification_type: ['unread_posts_likes_count', 'unread_posts_collects_count', 'unread_recived_comments_count', 'unread_posts_mentions_count']
			}
		},
		onShow() {
			uni.getSystemInfo({
				success: (e) => {
					// #ifdef MP-WEIXIN
					this.statusBar = e.statusBarHeight
					this.windowHeight = e.windowHeight
					// @ts-ignore
					const custom = wx.getMenuButtonBoundingClientRect()
					this.customBar = custom.bottom + custom.top - e.statusBarHeight
					this.pagingTop = this.customBar - 25 - (this.customBar - this.statusBar - custom.height)
					// #endif
				}
			})
			this.getNewNotificationNum()
		},
		methods: {
			queryList(pageNo, pageSize) {
				messagesList({
					'per_page':pageSize,
					'page':pageNo
				}).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.$refs.paging.complete(res.data.items);
					} else {
						this.$refs.paging.complete([])
					}
				}, err => {
					this.$refs.paging.complete([])
					console.log('messagesList: ', err)
				})
			},
			getNewNotificationNum() {
				newNotificationNum().then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						res.data.forEach((item) => {
							if(item.name && this.notification_type.indexOf(item.name) > -1) {
								this[item.name] = item.payload
							}
						})
					}
				}, err => {
					console.log('newNotificationNum: ', err)
				})
			},
			getVal(index) {
				return this[this.notification_type[index]]
			},
			clickBtn(index) {
				switch (index){
					//收到的赞
					case 0:
						uni.navigateTo({
							url: '/page_infos/infosLikeList/infosLikeList'
						})
						break;
					//收到的收藏
					case 1:
						uni.navigateTo({
							url: '/page_infos/infosCollectList/infosCollectList'
						})
						break;
					//收到的评论
					case 2:
						uni.navigateTo({
							url: '/page_infos/infosCommentList/infosCommentList'
						})
						break;
					//邀请回答
					case 3:
						uni.navigateTo({
							url: '/page_infos/infosFocusList/infosFocusList'
						})
						break;
					default:
						break;
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.infos {
		width: 100%;
		height: 100%;
		// .infos-title {
		// 	font-size: 36rpx;
		// 	font-weight: 500;
		// 	color: #000000;
		// 	line-height: 50rpx;
		// }
		.infos-btns {
			margin-top: 20rpx;
			display: flex;
			justify-content: space-around;
			.infos-btns-item {
				display: flex;
				flex-direction: column;
				width: 152rpx;
				.infos-btns-item-img-wrap{
					height: 152rpx;
					width: 152rpx;
					position: relative;
					/deep/ .uv-badge {
						position: absolute;
						right: 0;
						top: 0;
					}
				}
				.infos-btns-item-img {
					height: 152rpx;
					width: 152rpx;
				}
				.infos-btns-item-text {
					font-size: 28rpx;
					color: #000000;
					line-height: 40rpx;
					text-align: center;
				}
			}
			
		}
		.infos-content {
			margin-top: 55rpx;
		}
	}

</style>
