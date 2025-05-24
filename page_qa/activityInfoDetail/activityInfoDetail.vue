<!-- 卧谈会详情 -->
<template>
	<view class="activity-info-detail" :style="{backgroundImage: 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)',backgroundSize: '100%',backgroundColor: '#fff',backgroundRepeat: 'no-repeat'}">
		<back-topbar :isWxShare="isWxShare"></back-topbar>
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': (customBar+20) + 'px', 'bottom': '66px', paddingLeft: '25rpx', paddingRight: '25rpx'}">
			<!-- 标题 -->
			<view class="activity-info-detail-title">{{actInfoData.title}}</view>
			
			<!-- 作者 -->
			<view class="question-detail-info-box">
				<view class="bbs-post-detail-author">
					<img v-if="actInfoData.author.avatar" :src="actInfoData.author.avatar" @error.once="imgError" alt="" class="bbs-post-detail-author-img"  @click.native.stop="toHomepage($event)">
					<view class="bbs-post-detail-author-text"  @click.native.stop="toHomepage($event)">
						<view class="bbs-post-detail-author-text-name">{{actInfoData.author.name}}</view>
					</view>
				</view>
			</view>
			
			<!-- 日期 -->
			<view class="question-detail-date-box">
				<view class="bbs-post-detail-edit-info">编辑于{{actInfoData.timestamp}}</view>
				<van-icon class="more-icon" size="24rpx" color="#808080" name="arrow-down" @click.native.stop="clickMore($event)" />
			</view>
			
			<!-- 资讯摘要 -->
			<!-- <view class="activity-info-detail-summary">{{actInfoData.body.summary}}</view> -->
			
			<!-- 资讯正文 -->
			<view class="activity-info-detail-content">{{actInfoBody}}</view>
			
			<!-- 图片 -->
			<view class="activity-info-detail-img-box" v-if="actInfoData.body.urls && actInfoData.body.urls.length">
				<img v-for="(item, index) in actInfoData.body.urls" :index="index" :src="item" alt="" class="activity-info-detail-img">
			</view>
			
			<van-divider />
			
			<!-- 评论区 -->
			<view class="bbs-post-detail-comment">
				<view class="bbs-post-detail-comment-total">共{{commentNum}}条评论</view>
				<bbs-post-comment @reply="reply" :commentData="dataList" :hideReply="true" 
				@checkoutCommentLike="checkoutCommentLike" @commentLongpress="commentLongpress"
				@checkoutCommentLikeLevel2="checkoutCommentLikeLevel2"></bbs-post-comment>
			</view>
		</z-paging>
		
		<!-- 按钮 -->
		<view class="activity-info-detail-btn-box">
			<view class="bbs-post-detail-operate-left" @click="clickInput">添加评论</view>
			
			<img v-show="actInfoData.is_like" @click="clickLike(false)" class="activity-info-detail-btn-icon" src="https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/news/likeIcon.png" alt="">
			<img v-show="!actInfoData.is_like" @click="clickLike(true)" class="activity-info-detail-btn-icon" src="https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/news/unLikeIcon.png" alt="">
			<img v-show="actInfoData.is_collect" @click="clickStar(false)" class="activity-info-detail-btn-icon activity-info-detail-btn-icon-right" src="https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/news/collectIcon.png" alt="" >
			<img v-show="!actInfoData.is_collect" @click="clickStar(true)" class="activity-info-detail-btn-icon activity-info-detail-btn-icon-right" src="https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/news/unCollectIcon.png" alt="" >
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
	const DEFAULT_AVATAR = 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/profile_photos/default/001.jpg'
	import { guideDetail, likeGuide, disLikeGuide, collectGuide, unCollectGuide } from '@/network/api_guide.js'
	import BackTopbar from "@/components/common/BackTopbar.vue"
	import BbsCommentKeyboard from "@/components/common/CommentKeyboard.vue"
	import { utf16toEntities, uncodeUtf16 } from '@/tools/transform_emoji.js'
	import { postComment } from "@/network/api_bbs.js"
	import { getRequest } from '@/network/https.js'
	import BbsPostComment from '@/components/common/PostComment.vue'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	import aboutLogin from '@/mixins/aboutLogin.js'
	export default {
		components: {
			BackTopbar,
			BbsCommentKeyboard,
			BbsPostComment,
			DeleteAndComplaint
		},
		mixins: [aboutLogin],
		data() {
			return {
				customBar: 0,
				id: '',
				actInfoData: {
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
				curReplyLevel: 0,	//当前回复的评论是1级/2级
				curReplyId: '',		//当前回复的评论的id
				curReplyIndex: 0,	//如果回复的是2级评论，2级评论所属1级评论的Index
				curReplySubIndex: 0,	//如果回复的是2级评论，2级评论的Index
				isWxShare: false,	// 是否在微信分享里打开的，左上角返回替换为首页按钮
			}
		},
		computed: {
			avatar() {
				return this.actInfoData.author.avatar ?  this.actInfoData.author.avatar : DEFAULT_AVATAR
			},
			actInfoBody() {
				return this.actInfoData.body.body ? uncodeUtf16(this.actInfoData.body.body) : this.actInfoData.body.body
			},
			//共xxx条评论
			commentNum() {
				return this.actInfoData.comments_count ? this.actInfoData.comments_count : 0
			},
		},
		onLoad(option) {
			this.id = option.id
			this.customBar = uni.getStorageSync('customBar')
			if(option.scene === 'wxShare') {
				// 是在微信分享里打开的，左上角返回替换为首页按钮
				this.isWxShare = true
				// 获取token信息
				this.login()
			}
			this.getNewsDetail()
		},
		onUnload() {
			this.startGetComment = false
		},
		methods: {
			imgError() {
				return this.actInfoData.author.avatar = DEFAULT_AVATAR
			},
			//获取资讯详情
			getNewsDetail() {
				guideDetail(this.id).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.actInfoData = res.data
						this.actInfoData.author.avatar = res.data.author.avatar ? res.data.author.avatar : DEFAULT_AVATAR
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
					this.actInfoData.is_like = true
					this.actInfoData.likers_count++
					likeGuide(this.actInfoData.id).then(res => {
						if(res.code === 0) {
							//点赞成功
						}
					}, err => {
						console.log('likeGuide: ', err)
					})
				} else {
					//like ——> unlike
					//改变icon状态
					this.actInfoData.is_like = false
					this.actInfoData.likers_count = this.actInfoData.likers_count ? this.actInfoData.likers_count-1 : 0
					disLikeGuide(this.actInfoData.id).then(res => {
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
					this.actInfoData.is_collect = true
					this.actInfoData.collectors_count++
					collectGuide(this.actInfoData.id).then(res => {
						if(res.code === 0) {
							//收藏成功
						}
					}, err => {
						console.log('collectGuide: ', err)
					})
				} else {
					//star ——> unstar
					//改变icon状态
					this.actInfoData.is_collect = false
					this.actInfoData.collectors_count = this.actInfoData.collectors_count ? this.actInfoData.collectors_count : 0
					unCollectGuide(this.actInfoData.id).then(res => {
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
				//当前回复的是0级（发1级评论）
				this.curReplyLevel = 0
				//打开评论键盘
				this.showReply = true
			},
			//点击某一条评论（2级评论）
			reply(item, level, index, subIndex) {
				this.curReplyId = item.id
				this.curReplyLevel = level
				this.curReplyIndex = index
				this.curReplySubIndex = subIndex
				this.showReply = true				//打开评论键盘
			},
			//发送评论（调评论接口）
			submit(val) {
				this.showReply = false
				let params = {
					body: utf16toEntities(val),
					post_id: this.actInfoData.id
				}
				if(this.curReplyLevel > 0) {
					//回复评论（当前为2级评论）
					params.parent_id = this.curReplyId
				}
				postComment(params).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						//评论成功，1级回显到第1条，2级回显到回复的评论下面
						this.showReplyComment(res.data)
						//评论数+1
						this.actInfoData.comments_count++
					}
				}, err => {
					console.log('postComment: ', err)
				})
			},
			// 处理发评论回显：回复0级回显到1级的第1条，回复1级回显到2级的第1条，回复2级回显到回复的评论下面
			showReplyComment(comment) {
				switch (this.curReplyLevel){
					case 0:
						this.dataList.unshift(comment)
						break;
					case 1:
						comment.is_first_descend = true
						if(Object.keys(this.dataList[this.curReplyIndex]).indexOf('descendants') < 0) {
							this.$set(this.dataList[this.curReplyIndex], 'descendants', [])
						}
						this.dataList[this.curReplyIndex].descendants.unshift(comment)
						break;
					case 2:
						comment.is_first_descend = false
						this.dataList[this.curReplyIndex].descendants.splice(this.curReplySubIndex+1, 0, comment)
						break;
					default:
						break;
				}
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
			// 2级评论点赞切换
			checkoutCommentLikeLevel2(index, subIndex, status) {
				this.dataList[index].descendants[subIndex].is_like = status
				if(status) {
					this.dataList[index].descendants[subIndex].likers_count++
				} else {
					this.dataList[index].descendants[subIndex].likers_count--
				}
			},
			// 点击复制链接
			clickLink() {
				uni.setClipboardData({
					data: this.actInfoData.body.source,
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
				// 	url: `/page_infos/homepage/homepage?userId=${this.actInfoData.author.id}`
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
			onShareAppMessage() {
				// 返回该页面的分享内容
				return {
				  title: `${this.actInfoData.title}`,
				  path: `/page_qa/activityInfoDetail/activityInfoDetail?id=${this.id}&scene=wxShare`,
				};
			},
			// onShareTimeline() {
			// 	// 返回该页面的分享到朋友圈的内容
			// 	return {
			// 	  title: `${this.actInfoData.title}`,
			// 	  path: `/page_qa/activityInfoDetail/activityInfoDetail?id=${this.id}&scene=wxShare`,
			// 	};
			// },			
		}
	}
</script>

<style lang="less" scoped>
.activity-info-detail {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	padding: 0 25rpx;
	.activity-info-detail-title {
		word-break: break-all;
		font-size: 48rpx;
		font-weight: 600;
		color: #000000;
		line-height: 67rpx;
	}
	.activity-info-detail-summary {
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
	.activity-info-detail-content {
		margin-top: 35rpx;
		font-size: 34rpx;
		color: #000000;
		line-height: 56rpx;
		white-space: pre-line;
	}
	.activity-info-detail-img-box {
		.activity-info-detail-img {
			width: 100%;
			height: auto;
			margin-top: 20rpx;
		}
	}
	.activity-info-detail-url-title {
		margin-top: 35rpx;
		font-size: 32rpx;
		color: #000000;
		line-height: 56rpx;
	}
	.activity-info-detail-url {
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
	.activity-info-detail-btn-box {
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
		
		.activity-info-detail-btn-icon {
			height: 60rpx;
			width: 60rpx;
			margin-right: 40rpx;
		}
		.activity-info-detail-btn-icon-right {
			margin-right: 20rpx;
		}
	}
}
</style>

