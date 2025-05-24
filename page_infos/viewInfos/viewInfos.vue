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
				<view class="infos-content-text" v-if="showTip">您有新的通知</view>
				<view class="infos-content-text" v-else>您暂时没有新的通知</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import { newNotificationNum } from "@/network/api_infos.js"
	import BackTopbar from '@/components/common/BackTopbar.vue'
	export default {
		components: {
			BackTopbar
		},
		data() {
			return {
				btnList: [{
					url: 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/infos/iconLike.png',
					text: '赞'
				},{
					url: 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/infos/iconCollect.png',
					text: '收藏'
				},{
					url: 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/infos/iconComment.png',
					text: '评论'
				},{
					url: 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/infos/iconNewFocus.png',
					text: '邀请回答'
				}],
				dataList: [],
				unread_posts_likes_count: 0,
				unread_posts_collects_count: 0,
				unread_recived_comments_count: 0,
				unread_posts_mentions_count: 0,
				unread_comments_likes_count: 0,
				notification_type: ['unread_posts_likes_count', 'unread_posts_collects_count', 'unread_recived_comments_count', 'unread_posts_mentions_count', 'unread_comments_likes_count']
			}
		},
		onShow() {
			this.getNewNotificationNum()
		},
		methods: {
			queryList(pageNo, pageSize) {
				
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
				if(index === 0) {
					// 收到的赞 = unread_posts_likes_count + unread_comments_likes_count
					return this.unread_posts_likes_count + this.unread_comments_likes_count
				} else {
					return this[this.notification_type[index]]
				}
			},
			showTip() {
				for(let i=0; i<4; i++) {
					if(this.getVal(i)>0) {
						return true
					}
				}
				return false
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
			margin-top: 105rpx;
			.infos-content-text {
				text-align: center;
			}
		}
	}

</style>
