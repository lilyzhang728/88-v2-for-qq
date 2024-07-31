<!-- 话题详情 -->
<template>
	<view class="bbs-topic-detail" :style="{backgroundImage: 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)',backgroundSize: '100%',backgroundColor: '#F8F8F8',backgroundRepeat: 'no-repeat'}">
		<view v-if="!showEmpty">
			<back-topbar title="话题" ></back-topbar>
			<z-paging ref="paging" v-model="dataList" :auto-clean-list-when-reload="false"
				:auto-scroll-to-top-when-reload="false" :refresher-status.sync="refresherStatus" @query="queryList"
				:paging-style="{'top': (customBar) + 'px', 'bottom': '0', paddingLeft: '25rpx', paddingRight: '25rpx'}">
			
				<view class="bbs-topic-detail-header" @longpress="handleLongpress">
					<view class="bbs-topic-detail-title">{{topicData.body}}</view>
					<van-button v-if="!topicData.is_collect" size="small" class="bbs-topic-detail-btn-wrap" custom-class="bbs-topic-detail-btn" @click.native="handleFocusTopic">关注</van-button>
					<view v-else class="bbs-topic-detail-focus" @click="handleUnfocusTopic"><van-icon name="success" class="bbs-topic-detail-focus-icon" />已关注</view>
				</view>
				<view class="bbs-topic-detail-info">{{topicData.posts_count}}篇内容·{{topicData.views}}次浏览</view>
				
				<!-- <view style="z-index: 100;position: sticky;top :0;">
					<van-tabs :active="active" animated @change.native="tabsChange" ref="tabs"
					line-height="8rpx" line-width="60rpx" class="bbs-tabs" swipeable>
						<van-tab title="热门"></van-tab>
						<van-tab title="最新"></van-tab>
					</van-tabs>
				</view> -->
				
				<!-- list -->
				<view class="bbs-topic-post-list">
					<bbs-topic-post-card v-for="(item,index) in dataList" :key="index" 
					:postData="item" :index="index" @checkoutLike="checkoutLike" @click.native="toPostDetail(item.id, index)"></bbs-topic-post-card>
				</view>
					
			</z-paging>
			
			<van-dialog id="van-dialog" />
			
			<!-- 新增攻略按钮 -->
			<side-add-btn @addNew="addNewPost"></side-add-btn>
			
			<!-- 举报面板 -->
			<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" :type="actionType"
			@backRefresh="backRefresh"></delete-and-complaint>
		</view>
		<van-empty v-else description="找不到该话题……" />
	</view>
</template>

<script>
	import BackTopbar from '@/components/common/BackTopbar.vue'
	import BbsTopicPostCard from '@/page_bbs/components/BbsTopicPostCard.vue'
	import { topicDetail, focusTopic, unFocusTopic } from "@/network/api_bbs.js"
	import Dialog from "@/wxcomponents/vant/dialog/dialog"
	import SideAddBtn from '@/components/common/SideAddBtn.vue'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	export default {
		components: {
			BackTopbar,
			BbsTopicPostCard,
			SideAddBtn,
			DeleteAndComplaint
		},
		data() {
			return {
				customBar: 0,
				active: 0,
				tabList: ["热门", "最新"],
				statusBar: 0,
				topicId: '',
				topicData: {
					body: '',
					id: '',
					posts_count: 0,
					timestamp: '',
					views: 0,
					posts: {
						items: []
					}
				},
				dataList: [],	// 话题下的帖子
				contentId: '',		// 传给长按面板的内容id （帖子/评论）
				actionType: 2,		// 长按面板内容类型：0：帖子，1：评论，2：话题
				showEmpty: false
			}
		},
		watch: {
			topicId(newValue, oldValue) {
				if(newValue) {
					this.$refs.paging.reload()
				}
			}
		},
		onLoad(option) {
			this.topicId = option.id
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
					// #endif
				}
			})
		},
		methods: {
			// tabsChange(e) {
			// 	this.active = e.detail.index;
			// 	// 更新list
			// 	this.$refs.swiperItem[e.detail.index].$refs.paging.reload()
			// },
			swiperAnimationfinish(e) {
				this.active = e.detail.current;
			},
			queryList(pageNo, pageSize) {
				if(this.topicId) {
					topicDetail({
						per_page: pageSize,
						page: pageNo,
						post_type: 3,
						id: this.topicId
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							this.topicData = res.data
							this.$refs.paging.complete(res.data.posts.items);
						} else {
							this.$refs.paging.complete([])
						}
					}, err => {
						console.log('topicDetail: ', err)
						if(err == 'statusCode404') {
							this.showEmpty = true
							setTimeout(() => {
								uni.navigateBack({
								    success: () => {
								         let page = getCurrentPages().pop();//跳转页面成功之后
								         if (page) {
											 page.$vm.active = 1
								             page.$vm.$refs.bbsTopic.$refs.paging.reload()
								         } 
								    },
								})
							}, 1000)
						}
					})
				}
			},
			//切换点赞状态
			checkoutLike(cardIndex, status) {
				this.topicData.posts.items[cardIndex].is_like = status
				if(status) {
					this.topicData.posts.items[cardIndex].likers_count++
				} else {
					this.topicData.posts.items[cardIndex].likers_count--
				}
			},
			//跳转帖子详情
			toPostDetail(id, index) {
				uni.navigateTo({
					url: `/page_bbs/bbsPostDetail/bbsPostDetail?id=${id}&postIndex=${index}`
				});
			},
			//关注话题
			handleFocusTopic() {
				focusTopic(this.topicId).then(res => {
					if(res.code === 0) {
						//关注成功，切换关注按钮样式 
						this.topicData.is_collect = true
					}
				}, err => {
					console.log('focusTopic: ', err)
				})
			},
			//取消关注话题
			handleUnfocusTopic() {
				Dialog.confirm({
				  title: '确定取消关注？',
				  message: '',
				})
				  .then(() => {
				    unFocusTopic(this.topicId).then(res => {
				    	if(res.code === 0) {
				    		//取消关注成功，切换关注按钮样式
				    		this.topicData.is_collect = false
				    	}
				    }, err => {
				    	console.log('unFocusTopic: ', err)
				    })
				  })
				  .catch(() => {
				  });
			},
			//发帖
			addNewPost(e) {
				e.preventDefault();
				uni.navigateTo({
					url: `/page_bbs/addNewPost/addNewPost?topicInfo=${encodeURIComponent(JSON.stringify(this.topicData))}`
				});
			},
			// 长按，弹起面板
			handleLongpress() {
				this.contentId = this.topicData.id
				this.actionType = 2
				this.$refs.deleteAndComplaint.handleLongpress()
			},
			// 删除成功，返回上一页并刷新
			backRefresh() {
				uni.navigateBack({
				    success: () => {
				         let page = getCurrentPages().pop();//跳转页面成功之后
				         if (page) {
							 page.$vm.active = 1
				             page.$vm.$refs.bbsTopic.$refs.paging.reload()
				         } 
				    },
				})
			},
			// 帖子被删除，返回这一页删掉这条帖子
			deleteSinglePost(index) {
				topicData.posts.items.splice(index, 1)
			}
		}
	}
</script>

<style lang="less" scoped>
.bbs-topic-detail {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	.bbs-topic-detail-header {
		display: flex;
		margin: 28rpx 25rpx 0 25rpx;
		.bbs-topic-detail-title {
			flex: 1;
			font-size: 40rpx;
			font-weight: 600;
			color: #000000;
			line-height: 56rpx;
			word-break: break-all;
		}
		.bbs-topic-detail-btn-wrap {
			/deep/ .bbs-topic-detail-btn {
				padding: 0 26rpx !important;
				line-height: 45rpx !important;
				font-weight: 400 !important;
				font-size: 26rpx !important;
				background: #fff !important;
				border-radius: 8rpx !important;
				border: 1rpx solid #CECECE !important;
				color:rgba(0,0,0,0.8) !important;
			}
		}
		.bbs-topic-detail-focus {
			color: rgba(0, 0, 0, 0.4);
			font-size: 30rpx;
			line-height: 56rpx;
			heihgt: 56rpx;
			.bbs-topic-detail-focus-icon {
				margin-right: 10rpx;
			}
		}
	}
	.bbs-topic-detail-info {
		margin: 20rpx 25rpx 0 25rpx;
		font-size: 22rpx;
		color: rgba(0,0,0,0.4);
		line-height: 30rpx;
	}
	.bbs-tabs {
		/deep/ .van-tabs__scroll{
			background: transparent;
			.van-tabs__nav {
				background: transparent;
				width: 50%;
				margin-left: 25rpx;
				.van-tabs__line {
					background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
					bottom: 5px;
				}
	
				.van-tab {
					font-size: 30rpx;
					color: rgba(0,0,0,0.5);
				}
				.van-tab--active {
					color: #000;
				}
			}
		} 
	}
	
}
</style>
