<template>
	<view class="news-detail" :style="{backgroundImage: 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)',backgroundSize: '100%',backgroundColor: '#fff',backgroundRepeat: 'no-repeat'}">
		<back-topbar refName="swiperItem" functionName="reloadPage" tabIndex="1"></back-topbar>
		<z-paging ref="paging" :paging-style="{'top': (customBar+20) + 'px', 'bottom': '66px', paddingLeft: '25rpx', paddingRight: '25rpx'}">
			<!-- 资讯标题 -->
			<view class="news-detail-title">{{newsData.title}}</view>
			
			<!-- 作者|日期 -->
			<view class="news-detail-author">
				<text class="news-detail-author-text">{{newsData.author.name}}</text>
				<text class="news-detail-author-split"></text>
				<text class="news-detail-author-date">{{newsData.timestamp}}</text>
			</view>
			
			<!-- 资讯摘要 -->
			<!-- <view class="news-detail-summary">{{newsData.body.summary}}</view> -->
			
			<!-- 资讯正文 -->
			<view class="news-detail-content">{{newsData.body.body}}</view>
			
			<!-- 图片 -->
			<view class="news-detail-img-box" v-if="newsData.body.urls.length">
				<img v-for="(item, index) in newsData.body.urls" :index="index" :src="item" alt="" class="news-detail-img">
			</view>
			
			<van-divider />
			
			<!-- 推荐话题 -->
			<view class="news-detail-rec-topic" v-if="newsData.bind_topics.length && newsData.bind_topics[0].body">
				<view class="news-detail-rec-topic-title">
					<text class="news-detail-rec-topic-title-text">推荐话题</text>
					<text class="news-detail-rec-topic-title-more">
						更多推荐内容<van-icon size="25rpx" name="arrow" class="news-detail-rec-topic-title-more-icon"/>
					</text>
				</view>
				<view class="news-detail-rec-topic-list">
					<view class="news-detail-rec-topic-item">
						<img class="news-detail-rec-topic-item-img" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/topicIcon.png" alt="">
						<text class="news-detail-rec-topic-item-text">{{newsData.bind_topics[0].body}}</text>
					</view>
				</view>
			</view>
		</z-paging>
		
		<!-- 按钮 -->
		<view class="news-detail-btn-box">
			<van-button v-if="!newsData.is_record" block class="news-detail-btn-wrap" custom-class="news-detail-btn" @click.native="toAddTimeline">一键添加至我的大事年表</van-button>
			<van-button v-else block disabled class="news-detail-btn-wrap news-detail-btn-wrap-grey" custom-class="news-detail-btn">已添加</van-button>
			<img v-if="newsData.is_like" @click="clickLike(false)" class="news-detail-btn-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/likeIcon.png" alt="">
			<img v-if="!newsData.is_like" @click="clickLike(true)" class="news-detail-btn-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/unLikeIcon.png" alt="">
			<img v-if="newsData.is_collect" @click="clickStar(false)" class="news-detail-btn-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/collectIcon.png" alt="" >
			<img v-if="!newsData.is_collect" @click="clickStar(true)" class="news-detail-btn-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/unCollectIcon.png" alt="" >
		</view>
	</view>
</template>

<script>
	import { guideDetail, likeGuide, disLikeGuide, collectGuide, unCollectGuide } from '@/network/api_guide.js'
	import BackTopbar from "@/components/common/BackTopbar.vue"
	export default {
		components: {
			BackTopbar
		},
		data() {
			return {
				customBar: 0,
				id: '',
				newsData: {
					author: {
						avatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',		//默认头像
						name: ''
					},
					body: {
						urls: [],
						body: '',
						summary: ''
					},
					collectors_count: 0,
					likers_count: 0,
					title: "",
					views: 0,
					status: 0,		//0:未发布  1：已发布
					id: '',			//guideId
					timestamp: '',
					is_like: false,
					is_collect: false
				},
			}
		},
		onLoad(option) {
			this.id = option.id
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
			this.getNewsDetail()
		},
		methods: {
			//获取资讯详情
			getNewsDetail() {
				guideDetail(this.id).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.newsData = res.data
					} else {
						//接口返回失败，返回上一页
						uni.navigateBack({
						    success: () => {
						         let page = getCurrentPages().pop();//跳转页面成功之后
						         if (page) {
									 page.$vm.active = 2
						             page.$vm.$refs.swiperItem[2].$refs.paging.reload()
						         } 
						    },
						})
					}
				}, err => {
					console.log('guideDetail: ', err)
				})
			},
			// 去创建事件
			toAddTimeline() {
				uni.navigateTo({
					url: `/page_editPersonalInfo/addTimelineItem/addTimelineItem?from=news&newsId=${this.newsData.id}`
				})
			},
			clickLike(status) {
				if(status) {
					//unlike ——> like
					likeGuide(this.newsData.id).then(res => {
						if(res.code === 0) {
							//点赞成功，改变icon状态
							this.newsData.is_like = true
							this.newsData.likers_count++
						}
					}, err => {
						console.log('likeGuide: ', err)
					})
				} else {
					//like ——> unlike
					disLikeGuide(this.newsData.id).then(res => {
						if(res.code === 0) {
							//取消点赞成功，改变icon状态
							this.newsData.is_like = false
							this.newsData.likers_count = this.newsData.likers_count ? this.newsData.likers_count-1 : 0
						}
					}, err => {
						console.log('disLikeGuide: ', err)
					})
				}
			},
			clickStar(status) {
				if(status) {
					//unstar ——> star
					collectGuide(this.newsData.id).then(res => {
						if(res.code === 0) {
							//收藏成功，改变icon状态
							this.newsData.is_collect = true
							this.newsData.collectors_count++
						}
					}, err => {
						console.log('collectGuide: ', err)
					})
				} else {
					//star ——> unstar
					unCollectGuide(this.newsData.id).then(res => {
						if(res.code === 0) {
							//取消收藏成功，改变icon状态
							this.newsData.is_collect = false
							this.newsData.collectors_count = this.newsData.collectors_count ? this.newsData.collectors_count : 0
						}
					}, err => {
						console.log('unCollectGuide: ', err)
					})
				}
				
			}
		}
	}
</script>

<style lang="less" scoped>
.news-detail {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	padding: 0 25rpx;
	.news-detail-title {
		font-size: 48rpx;
		font-weight: 600;
		color: #000000;
		line-height: 67rpx;
	}
	.news-detail-summary {
		margin-top: 36rpx;
		font-size: 30rpx;
		color: rgba(0,0,0,0.5);
		line-height: 49rpx;
	}
	.news-detail-author {
		margin-top: 40rpx;
		font-size: 24rpx;
		line-height: 33rpx;
		display: flex;
		.news-detail-author-text {
			color: #35C8A7;
		}
		.news-detail-author-split {
			width: 1rpx;
			border: 1rpx solid #E2E2E2;
			margin: 8rpx 20rpx;
		}
		.news-detail-author-date {
			color: rgba(0,0,0,0.4);
		}
	}
	.news-detail-content {
		margin-top: 35rpx;
		font-size: 32rpx;
		color: #000000;
		line-height: 56rpx;
		white-space: pre-line;
	}
	.news-detail-img-box {
		.news-detail-img {
			width: 100%;
			height: auto;
			margin-top: 20rpx;
		}
	}
	.news-detail-rec-topic {
		margin-top: 40rpx;
		.news-detail-rec-topic-title {
			line-height: 36rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 5rpx;
			.news-detail-rec-topic-title-text {
				font-size: 30rpx;
				font-weight: 600;
				color: #000000;
			}
			.news-detail-rec-topic-title-more {
				font-size: 22rpx;
				color: rgba(0,0,0,0.6);
				.news-detail-rec-topic-title-more-icon {
					margin-left: 10rpx;
				}
			}
		}
		.news-detail-rec-topic-list {
			.news-detail-rec-topic-item {
				font-size: 26rpx;
				color: #000000;
				line-height: 37rpx;
				display: flex;
				align-items: center;
				margin-top: 25rpx;
				.news-detail-rec-topic-item-img {
					height: 30rpx;
					width: 30rpx;
					margin-right: 10rpx;
				}
				.news-detail-rec-topic-item-text {
					flex: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
	.news-detail-btn-box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		box-shadow: 0rpx -1rpx 13rpx 0rpx rgba(0,0,0,0.1);
		padding: 11px 14px;   //因为z-paging只能设置px,所以这里都换算成px， button的height固定44px
		display: flex;
		align-items: center;
		.news-detail-btn-wrap {
			margin-right: 60rpx;
			flex: 1;
			/deep/ .news-detail-btn {		
				font-size: 32rpx;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 45rpx;
				padding: 18rpx 0;
				background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
				border-radius: 10rpx;
			}
		}
		.news-detail-btn-wrap-grey {
			/deep/ .news-detail-btn {	
				background: #DFDFDF;
			}
		}
		.news-detail-btn-icon {
			height: 60rpx;
			width: 60rpx;
			margin-right: 40rpx;
			&:last-child {
				margin-right: 0;
			}
		}
	}
}
</style>
