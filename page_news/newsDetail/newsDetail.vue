<template>
	<view class="news-detail" :style="{backgroundImage: 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)',backgroundSize: '100%',backgroundColor: '#fff',backgroundRepeat: 'no-repeat'}">
		<back-topbar></back-topbar>
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': (customBar+20) + 'px', 'bottom': '66px', paddingLeft: '25rpx', paddingRight: '25rpx'}">
			<!-- 资讯标题 -->
			<view class="news-detail-title">{{newsData.title}}</view>
			
			<!-- 作者 -->
			<view class="question-detail-info-box">
				<view class="bbs-post-detail-author">
					<img v-if="newsData.author.avatar" :src="newsData.author.avatar" @error.once="imgError" alt="" class="bbs-post-detail-author-img"  @click.native.stop="toHomepage($event)">
					<view class="bbs-post-detail-author-text"  @click.native.stop="toHomepage($event)">
						<view class="bbs-post-detail-author-text-name">{{newsData.author.name}}</view>
					</view>
				</view>
			</view>
			
			<!-- 日期 -->
			<view class="question-detail-date-box">
				<view class="bbs-post-detail-edit-info">编辑于{{newsData.timestamp}}</view>
				<van-icon class="more-icon" size="24rpx" color="#808080" name="arrow-down" @click.native.stop="clickMore($event)" />
			</view>
			
			<!-- 资讯摘要 -->
			<!-- <view class="news-detail-summary">{{newsData.body.summary}}</view> -->
			
			<!-- 资讯正文 -->
			<view class="news-detail-content">{{newsBody}}</view>
			
			<!-- 图片 -->
			<view class="news-detail-img-box" v-if="newsData.body.urls && newsData.body.urls.length">
				<img v-for="(item, index) in newsData.body.urls" :index="index" :src="item" alt="" class="news-detail-img">
			</view>
			
			<!-- 链接 -->
			<view class="news-detail-url-title" v-if="newsData.body.source">资讯来源：</view>
			<view class="news-detail-url" v-if="newsData.body.source" @click="clickLink">
				<img class="guide-detail-step-link-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/linkIcon.png" alt="">
				{{newsData.body.source}}
			</view>
			
			<van-divider />
			
			<!-- 评论区 -->
			<view class="bbs-post-detail-comment">
				<view class="bbs-post-detail-comment-total">共{{commentNum}}条评论</view>
				<bbs-post-comment :commentData="dataList" :hideReply="true" 
				@checkoutCommentLike="checkoutCommentLike" @commentLongpress="commentLongpress"></bbs-post-comment>
			</view>
		</z-paging>
		
		<!-- 按钮 -->
		<view class="news-detail-btn-box">
			<view class="bbs-post-detail-operate-left" @click="clickInput">添加评论</view>
			
			<img v-show="newsData.is_like" @click="clickLike(false)" class="news-detail-btn-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/likeIcon.png" alt="">
			<img v-show="!newsData.is_like" @click="clickLike(true)" class="news-detail-btn-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/unLikeIcon.png" alt="">
			<img v-show="newsData.is_collect" @click="clickStar(false)" class="news-detail-btn-icon news-detail-btn-icon-right" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/collectIcon.png" alt="" >
			<img v-show="!newsData.is_collect" @click="clickStar(true)" class="news-detail-btn-icon news-detail-btn-icon-right" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/unCollectIcon.png" alt="" >
		</view>
		
		<!-- 回复键盘 -->
		<van-overlay :show="showReply" @click.native="onClickHide" :custom-style="'z-index:0;height:auto;bottom:0;'" />
		<bbs-comment-keyboard :showReply="showReply" 
		@submit="submit"></bbs-comment-keyboard>
		
		<!-- 举报面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" :type="actionType"
		@backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	const DEFAULT_AVATAR = 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg'
	import { guideDetail, likeGuide, disLikeGuide, collectGuide, unCollectGuide } from '@/network/api_guide.js'
	import BackTopbar from "@/components/common/BackTopbar.vue"
	import BbsCommentKeyboard from "@/components/common/CommentKeyboard.vue"
	import { utf16toEntities, uncodeUtf16 } from '@/tools/transform_emoji.js'
	import { postComment } from "@/network/api_bbs.js"
	import { getRequest } from '@/network/https.js'
	import BbsPostComment from '@/components/common/PostComment.vue'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	export default {
		components: {
			BackTopbar,
			BbsCommentKeyboard,
			BbsPostComment,
			DeleteAndComplaint
		},
		data() {
			return {
				customBar: 0,
				id: '',
				newsData: {
					author: {
						avatar: '',		//默认头像
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
				showReply: false,	//是否打开键盘
				dataList: [],		//评论数据
				startGetComment: false,	//开始请求评论
				contentId: '',		// 传给长按面板的内容id （帖子/评论）
				actionType: 0,		// 长按面板内容类型：0：帖子，1：评论，2：话题
			}
		},
		computed: {
			avatar() {
				return this.newsData.author.avatar ?  this.newsData.author.avatar : DEFAULT_AVATAR
			},
			newsBody() {
				return this.newsData.body.body ? uncodeUtf16(this.newsData.body.body) : this.newsData.body.body
			},
			//共xxx条评论
			commentNum() {
				return this.newsData.comments_count ? this.newsData.comments_count : 0
			},
		},
		onLoad(option) {
			this.id = option.id
		},
		onUnload() {
			this.startGetComment = false
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
			imgError() {
				return this.newsData.author.avatar = DEFAULT_AVATAR
			},
			//获取资讯详情
			getNewsDetail() {
				guideDetail(this.id).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.newsData = res.data
						this.newsData.author.avatar = res.data.author.avatar ? res.data.author.avatar : DEFAULT_AVATAR
						//获取评论区数据
						if(res.data._links.comments) {
							this.curGetCommentUrl = res.data._links.comments
							this.startGetComment = true
							this.$refs.paging.reload()
						}
					} else {
						//接口返回失败，返回上一页
						uni.navigateBack({
						    success: () => {
						         let page = getCurrentPages().pop();//跳转页面成功之后
						         if (page) {
									 page.$vm.backRefresh()
						         } 
						    },
						})
					}
				}, err => {
					console.log('guideDetail: ', err)
				})
			},
			clickLike(status) {
				if(status) {
					//unlike ——> like
					//改变icon状态
					this.newsData.is_like = true
					this.newsData.likers_count++
					likeGuide(this.newsData.id).then(res => {
						if(res.code === 0) {
							//点赞成功
						}
					}, err => {
						console.log('likeGuide: ', err)
					})
				} else {
					//like ——> unlike
					//改变icon状态
					this.newsData.is_like = false
					this.newsData.likers_count = this.newsData.likers_count ? this.newsData.likers_count-1 : 0
					disLikeGuide(this.newsData.id).then(res => {
						if(res.code === 0) {
							//取消点赞成功
						}
					}, err => {
						console.log('disLikeGuide: ', err)
					})
				}
			},
			clickStar(status) {
				if(status) {
					//unstar ——> star
					//改变icon状态
					this.newsData.is_collect = true
					this.newsData.collectors_count++
					collectGuide(this.newsData.id).then(res => {
						if(res.code === 0) {
							//收藏成功
						}
					}, err => {
						console.log('collectGuide: ', err)
					})
				} else {
					//star ——> unstar
					//改变icon状态
					this.newsData.is_collect = false
					this.newsData.collectors_count = this.newsData.collectors_count ? this.newsData.collectors_count : 0
					unCollectGuide(this.newsData.id).then(res => {
						if(res.code === 0) {
							//取消收藏成功
						}
					}, err => {
						console.log('unCollectGuide: ', err)
					})
				}
				
			},
			//拿到评论接口后请求评论数据
			queryList(pageNo, pageSize) {
				if(this.startGetComment) {
					this.getCommentData(this.curGetCommentUrl, pageSize, pageNo)
				}
			},
			//获取评论区数据
			getCommentData(url, pageSize, pageNo) {
				getRequest({
					path: url,
					data: {
						'post_type': 2,
						'per_page': pageSize,
						'page': pageNo
					}
				}).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.$refs.paging.complete(res.data.items);
					} else {
						this.$refs.paging.complete([])
					}
				}, err => {
					this.$refs.paging.complete([])
					console.log('getCommentData: ', err)
				})
			},
			//关闭评论键盘
			onClickHide() {
				this.showReply = false
			},
			//点击底部输入框（说点什么……）评论帖子（1级评论）
			clickInput() {
				//打开评论键盘
				this.showReply = true
			},
			//发送评论（调评论接口）
			submit(val) {
				this.showReply = false
				let params = {
					body: utf16toEntities(val),
					post_id: this.newsData.id
				}
				postComment(params).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						//评论成功，1级回显到第1条，2级回显到回复的评论下面
						this.showReplyComment(res.data)
						//评论数+1
						this.newsData.comments_count++
					}
				}, err => {
					console.log('postComment: ', err)
				})
			},
			// 处理发评论回显：回复0级回显到1级的第1条，回复1级回显到2级的第1条，回复2级回显到回复的评论下面
			showReplyComment(comment) {
				this.dataList.unshift(comment)
			},
			//评论区：（对评论）切换评论点赞状态
			checkoutCommentLike(index, status) {
				this.dataList[index].is_like = status
				if(status) {
					this.dataList[index].likers_count++
				} else {
					this.dataList[index].likers_count--
				}
			},
			// 点击复制链接
			clickLink() {
				uni.setClipboardData({
					data: this.newsData.body.source,
					success() {
						uni.showToast({
							title:'已复制到剪贴板',
							icon:'none',
							position:'top'
						})
					}
				})
			},
			// 点击头像，去个人主页
			toHomepage(e) {
				//防止冒泡
				// e.preventDefault()
				// uni.navigateTo({
				// 	url: `/page_infos/homepage/homepage?userId=${this.newsData.author.id}`
				// })
			},
			// （评论）长按，弹起面板
			commentLongpress(id) {
				this.contentId = id
				this.actionType = 1
				this.$refs.deleteAndComplaint.handleLongpress()
			},
			// 删除成功，返回上一页并刷新
			backRefresh() {
				uni.navigateBack({
				    success: () => {
				         let page = getCurrentPages().pop();//跳转页面成功之后
				         if (page) {
							 page.$vm.backRefresh()
				         } 
				    },
				})
			},
			// 点更多，弹出面板
			// 参数： id, type: 0：帖子，1：评论，2：话题
			clickMore() {
				this.contentId = this.id
				this.actionType = 0
				this.$refs.deleteAndComplaint.handleLongpress()
			},
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
		word-break: break-all;
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
	
	.question-detail-info-box {
		margin-top: 40rpx;
		.bbs-post-detail-author {
			height: 50rpx;
			display: flex;
			align-items: center;
			overflow: hidden;
			.bbs-post-detail-author-img {
				height: 50rpx;
				width: 50rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			.bbs-post-detail-author-text {
				flex: 1;
				overflow: hidden;
				.bbs-post-detail-author-text-name {
					font-size: 24rpx;
					color: rgba(0,0,0,0.5);
					line-height: 33rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}
	.question-detail-date-box {
		margin-top: 25rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.bbs-post-detail-edit-info {
			font-size: 24rpx;
			color: rgba(0,0,0,0.5);
			line-height: 33rpx;
			width: 80%;
			text-align: left;
		}
		.more-icon {
		}
	}
	.news-detail-content {
		margin-top: 35rpx;
		font-size: 34rpx;
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
	.news-detail-url-title {
		margin-top: 35rpx;
		font-size: 32rpx;
		color: #000000;
		line-height: 56rpx;
	}
	.news-detail-url {
		// margin-top: 20rpx;
		font-size: 28rpx;
		color: #35C8A7;
		line-height: 40rpx;
		display: flex;
		align-items: center;
		word-wrap: break-word;
		word-break: break-all;
		.guide-detail-step-link-icon {
			height: 22rpx;
			width: 22rpx;
			margin-right: 10rpx;
		}
	}
	
	.bbs-post-detail-comment {
		margin-top: 60rpx;
		.bbs-post-detail-comment-total {
			font-size: 24rpx;
			color: rgba(0,0,0,0.5);
			line-height: 33rpx;
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
		.bbs-post-detail-operate-left {
			// width: 50%;
			flex: 1;
			margin-right: 58rpx;
			background-color: #F6F6F6;
			border-radius: 20rpx;
			padding: 8px 15px;
			color: rgba(0,0,0,0.3);
			font-size: 28rpx;
			line-height: 40rpx;
		}
		
		.news-detail-btn-icon {
			height: 60rpx;
			width: 60rpx;
			margin-right: 40rpx;
		}
		.news-detail-btn-icon-right {
			margin-right: 20rpx;
		}
	}
}
</style>
