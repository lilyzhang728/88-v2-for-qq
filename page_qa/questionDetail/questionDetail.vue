<!-- 问题详情 -->
<template>
	<view class="question-detail" :style="{backgroundImage: 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)',backgroundSize: '100%',backgroundColor: '#fff',backgroundRepeat: 'no-repeat'}">
		<back-topbar :isWxShare="isWxShare"></back-topbar>
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': (customBar+20) + 'px', 'bottom': '64px', paddingLeft: '25rpx', paddingRight: '25rpx'}">
			<!-- 问题标题 -->
			<view class="question-detail-title">
				{{postData.title}}
			</view>
			
			<!-- 问题正文 -->
			<view class="bbs-post-detail-content">{{postBody}}</view>
			
			<!-- 图片 -->
			<view class="bbs-post-detail-img-box" v-if="postData.body.urls.length">
				<van-image width="100%" height="100%" fit="contain" :src="pic"
				  class="bbs-post-detail-img-item" v-for="(pic, index) in postData.body.urls" :key="index"
				   @click.native="previewImg($event, pic)" />
			</view>
			
			<view class="question-detail-info-box">
				<!-- 帖子作者 -->
				<view class="bbs-post-detail-author">
					<img v-if="postData.author.avatar" :src="postData.author.avatar" @error.once="imgError" alt="" class="bbs-post-detail-author-img"  @click.native.stop="toHomepage($event)">
					<view class="bbs-post-detail-author-text"  @click.native.stop="toHomepage($event)">
						<view class="bbs-post-detail-author-text-name">{{postData.author.name}}</view>
					</view>
				</view>
				<van-icon size="24rpx" color="#808080" name="arrow-down" @click.native.stop="handleLongpress" />
			</view>
			
			<!-- 发布时间 -->
			<view class="bbs-post-detail-edit-info">编辑于{{postData.timestamp}}</view>
			
			<!-- 跳转到有奖问答 -->
			<view v-if="postData.id!=='122723b14c0611ef85995254009327f0'" class="toActivity" @click.native="toActivity">
				<img class="toActivity-img" src="https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/news/topicIcon.png" alt="">
				【有奖问答】火热进行中
			</view>
			
			<van-divider />
			
			<!-- 邀请回答 -->
			<!-- <view class="question-detail-btns">
				<van-button @click.native="invideUser" class="question-detail-btn-wrap" custom-class="question-detail-btn">邀请回答</van-button>
				<van-icon size="24rpx" color="#808080" name="arrow-down" @click.native.stop="handleLongpress" />
			</view> -->
		
			<!-- 评论区 -->
			<view class="bbs-post-detail-comment">
				<view class="bbs-post-detail-comment-total">共{{commentNum}}个回答</view>
				<bbs-post-comment :commentData="dataList" :hideReply="true" @reply="reply"
				@checkoutCommentLike="checkoutCommentLike" @commentLongpress="commentLongpress"
				@checkoutCommentLikeLevel2="checkoutCommentLikeLevel2"></bbs-post-comment>
			</view>
		</z-paging>
		
		<!-- 底部操作区 -->
		<view class="bbs-post-detail-operate">
			<!-- <van-field placeholder="说点什么……" :border="false" class="bbs-post-detail-operate-input-wrap"
			 @focus="noBomBox" @clickInput.native.stop="clickInput" /> -->
			<view class="bbs-post-detail-operate-left" @click="clickInput">添加回答</view>
			
			<!-- 点赞icon -->
			<view class="bbs-post-detail-operate-icon-box" v-if="!postData.is_like">
				<van-icon name="good-job-o" size="44rpx" @click.native="clickLike(true)" /><text class="bbs-post-detail-operate-num">{{handleTransform(postData.likers_count)}}</text>
			</view>
			<view class="bbs-post-detail-operate-icon-box" v-else>
				<van-icon name="good-job" size="44rpx" color="#2FC2C5" @click.native="clickLike(false)" /><text class="bbs-post-detail-operate-num bbs-post-detail-operate-num-active">{{handleTransform(postData.likers_count)}}</text>
			</view>
			
			<!-- 收藏icon -->
			<view class="bbs-post-detail-operate-icon-box" v-if="!postData.is_collect">
				<van-icon name="star-o" size="44rpx" @click.native="clickCollect(true)" /><text class="bbs-post-detail-operate-num">{{handleTransform(postData.collectors_count)}}</text>
			</view>
			<view class="bbs-post-detail-operate-icon-box" v-else>
				<van-icon name="star" size="44rpx" color="#2FC2C5" @click.native="clickCollect(false)" /><text class="bbs-post-detail-operate-num bbs-post-detail-operate-num-active">{{handleTransform(postData.collectors_count)}}</text>
			</view>
			
			<!-- 评论icon -->
			<!-- <view class="bbs-post-detail-operate-icon-box">
				<van-icon name="comment-o" size="44rpx" @click.native="clickInput" /><text class="bbs-post-detail-operate-num">{{handleTransform(postData.comments_count)}}</text>
			</view> -->
		</view>
		
		<!-- 回复键盘 -->
		<van-overlay :show="showReply" @click.native="onClickHide" :custom-style="'z-index:0;height:auto;bottom:0;'" />
		<bbs-comment-keyboard :showReply="showReply" :showReplyPostBox="showReplyPostBox"
		:curReplyAvatar="curReplyAvatar" :curReplyContent="curReplyContent"
		@submit="submit"></bbs-comment-keyboard>
	
		<!-- 邀请用户列表弹窗 -->
		<invite-user-list :postId="postData.id" ref="inviteUserList" @closePopup="closePopup" v-if="showInviteUserList"></invite-user-list>
	
		
		<!-- toast提示 -->
		<van-toast id="van-toast" />
		
		<!-- 举报面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" :type="actionType"
		:author="author" @backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	const userId = uni.getStorageSync('userId')
	const DEFAULT_AVATAR = 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/profile_photos/default/001.jpg'
	// import BbsCommentItem from "@/page_bbs/components/BbsCommentItem.vue"
	import BackTopbar from "@/components/common/BackTopbar.vue"
	import BbsPostComment from '@/components/common/PostComment.vue'
	import BbsCommentKeyboard from "@/components/common/CommentKeyboard.vue"
	import { guideDetail, likeGuide, disLikeGuide, collectGuide, unCollectGuide } from '@/network/api_guide.js'
	import { getRequest } from '@/network/https.js'
	import { postComment } from "@/network/api_bbs.js"
	import { utf16toEntities, uncodeUtf16 } from '@/tools/transform_emoji.js'
	import { transformMaxNum } from '@/tools/transform_time.js'
	import InviteUserList from '@/page_qa/components/InviteUserList.vue'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	import aboutLogin from '@/mixins/aboutLogin.js'
	export default {
		components: {
			BbsPostComment,
			BackTopbar,
			BbsCommentKeyboard,
			InviteUserList,
			DeleteAndComplaint
		},
		mixins: [aboutLogin],
		data() {
			return {
				customBar: uni.getStorageSync('customBar'),
				id: '',
				postData: {
					author: {
						name: '',
						avatar: '',
						id: ''
					},
					body: {
						body: '',
						urls: []
					},
					is_like: false,
					likers_count: 0,
					comments_count: 0,
					title: "",
					views: 0,
					timestamp: '',
					status: 0,
					id: ''
				},
				showReply: false,	//是否打开键盘
				curGetCommentUrl: '',	//获取评论接口URL
				startGetComment: false,	//开始请求评论
				dataList: [],		//评论数据
				showInviteUserList: false,
				contentId: '',		// 传给长按面板的内容id （帖子/评论）
				actionType: 0,		// 长按面板内容类型：0：帖子，1：评论，2：话题
				from: '',			// from==='mine',表示从我的页面跳转过来，需要加more-icon
				isWxShare: false,	// 是否在微信分享里打开的，左上角返回替换为首页按钮
				curReplyId: '',		//当前回复的评论的id
				curReplyLevel: 1,	//当前回复的评论是1级/2级
				curReplyIndex: 0,	//如果回复的是2级评论，2级评论所属1级评论的Index
				curReplySubIndex: 0,	//如果回复的是2级评论，2级评论的Index
				curReplyAvatar: '',		//当前回复的评论的头像
				curReplyContent: '',	//当前回复的评论的内容
				showReplyPostBox: false,	//是否显示引用评论
			}
		},
		computed: {
			avatar() {
				return this.postData.author.avatar ?  this.postData.author.avatar : DEFAULT_AVATAR
			},
			//共xxx条评论
			commentNum() {
				return this.postData.comments_count ? this.postData.comments_count : 0
			},
			postBody() {
				return this.postData.body.body ? uncodeUtf16(this.postData.body.body) : this.postData.body.body
			},
			// 作者：0：自己 1：别人的
			author() {
				return this.from === 'mine' ? 0 : 1
			}
		},
		onLoad(option) {
			this.id = option.id
			if(option.showReply) {
				this.clickInput()
			}
			if(option.from) {
				this.from = option.from
			}
			if(option.scene === 'wxShare') {
				// 是在微信分享里打开的，左上角返回替换为首页按钮
				this.isWxShare = true
				// 获取token信息
				this.login()
			}
		},
		onUnload() {
			this.startGetComment = false
		},
		onShow() {
			
			this.getPostDetail()
		},
		methods: {
			imgError() {
				return this.postData.author.avatar = DEFAULT_AVATAR
			},
			// 点赞、评论 大数单位转化
			handleTransform(val) {
				return transformMaxNum(val)
			},
			//获取帖子详情
			getPostDetail() {
				guideDetail(this.id).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.postData = res.data
						this.postData.author.avatar = res.data.author.avatar ? res.data.author.avatar : DEFAULT_AVATAR
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
									 page.$vm.active = 0
						             page.$vm.$refs.swiperItem[0].$refs.paging.reload()
						         } 
						    },
						})
					}
				}, err => {
					console.log('guideDetail: ', err)
				})
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
						'post_type': 3,	//3 :tab4
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
			//点击底部输入框（说点什么……）评论帖子（1级评论）
			clickInput() {
				
				//打开评论键盘
				// this.showReply = true
				
				uni.navigateTo({
					url: `/page_qa/writeAnswer/writeAnswer?title=${this.postData.title}&id=${this.postData.id}`
				})
			},
			
			//发送评论（调评论接口）
			submit(val) {
				this.showReply = false
				let params = {
					body: utf16toEntities(val),
					post_id: this.postData.id
				}
				if(this.showReplyPostBox) {
					//回复评论（当前为2级评论）
					params.parent_id = this.curReplyId
				}
				postComment(params).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						//评论成功，1级回显到第1条，2级回显到回复的评论下面
						this.showReplyComment(res.data)
						//评论数+1
						this.postData.comments_count++
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
			//关闭评论键盘
			onClickHide() {
				this.showReply = false
			},
			//禁止手机键盘的弹出
			noBomBox(Event) {
			    document.activeElement.blur();
			},
			//（底部）对帖子点赞/取消点赞
			clickLike(status) {
				if(status) {
					//unlike ——> like
					//改变icon状态
					this.postData.is_like = status
					this.postData.likers_count++
					likeGuide(this.postData.id).then(res => {
						if(res.code === 0) {
							//点赞成功
						}
					}, err => {
						console.log('likeGuide: ', err)
					})
				} else {
					//like ——> unlike
					//改变icon状态
					this.postData.is_like = status
					this.postData.likers_count--
					disLikeGuide(this.postData.id).then(res => {
						if(res.code === 0) {
							//取消点赞成功
						}
					}, err => {
						console.log('disLikeGuide: ', err)
					})
				}
			},
			clickCollect(status) {
				if(status) {
					//unCollect ——> collect
					//改变icon状态
					this.postData.is_collect = status
					this.postData.collectors_count++
					collectGuide(this.postData.id).then(res => {
						if(res.code === 0) {
							//点赞成功
						}
					}, err => {
						console.log('likeGuide: ', err)
					})
				} else {
					//collect ——> unCollect
					//改变icon状态
					this.postData.is_collect = status
					this.postData.collectors_count--
					unCollectGuide(this.postData.id).then(res => {
						if(res.code === 0) {
							//取消点赞成功
						}
					}, err => {
						console.log('disLikeGuide: ', err)
					})
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
			// 点击头像，去个人主页
			toHomepage(e) {
				//防止冒泡
				// e.preventDefault()
				// uni.navigateTo({
				// 	url: `/page_infos/homepage/homepage?userId=${this.postData.author.id}`
				// })
			},
			// 邀请回答
			invideUser() {
				this.showInviteUserList = true
				if(this.$refs.inviteUserList) {
					this.$refs.inviteUserList.showDetail = true
				}
			},
			closePopup(success) {
				this.showInviteUserList = false
				this.$refs.inviteUserList.showDetail = false
				if(success) {
					Toast('邀请成功！')
				} else {
					Toast('邀请失败')
				}
			},
			// （帖子）长按，弹起面板
			handleLongpress() {
				this.contentId = this.id
				this.actionType = 0
				this.$refs.deleteAndComplaint.handleLongpress()
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
							 page.$vm.active = 0
				             page.$vm.$refs.questionAndAnswer.$refs.paging.reload()
				         } 
				    },
				})
			},
			// 预览图片
			previewImg(e, url) {
				//防止冒泡
				e.preventDefault()
				uni.previewImage({
					current: 0,
					urls: [url]
				});
			},
			onShareAppMessage() {
				// 返回该页面的分享内容
				return {
				  title: `${this.postData.title}`,
				  path: `/page_qa/questionDetail/questionDetail?id=${this.id}&scene=wxShare`,
				};
			},
			// onShareTimeline() {
			// 	// 返回该页面的分享到朋友圈的内容
			// 	return {
			// 	  title: `${this.postData.title}`,
			// 	  path: `/page_qa/questionDetail/questionDetail?id=${this.id}&scene=wxShare`,
			// 	};
			// },
			toActivity() {
				uni.navigateTo({
					url: `/page_qa/questionDetail/questionDetail?id=122723b14c0611ef85995254009327f0`
				})
			},
			//点击某一条评论（2级评论）
			reply(item, level, index, subIndex) {
				//当前回复的评论的位置（用于评论成功后即时回显）
				this.curReplyId = item.id
				this.curReplyLevel = level
				this.curReplyIndex = index
				this.curReplySubIndex = subIndex
				this.curReplyAvatar = item.author.avatar ? item.author.avatar : DEFAULT_AVATAR
				this.curReplyContent = item.body
				//显示引用的评论
				this.showReplyPostBox = true
				//打开评论键盘
				this.showReply = true
			},
		}
	}
</script>

<style lang="less" scoped>
.question-detail {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	padding: 0 25rpx;
	.question-detail-title {
		font-size: 40rpx;
		font-weight: 600;
		color: #000000;
		line-height: 56rpx;
	}
	.bbs-post-detail-content {
		margin-top: 22rpx;
		font-size: 34rpx;
		color: rgba(0,0,0,0.7);
		line-height: 56rpx;
		white-space: pre-line;
	}
	.bbs-post-detail-img-box {
		margin-top: 40rpx;
		display: flex;
		flex-wrap: wrap;
		.bbs-post-detail-img-item {
			flex: 1;
			width: calc((100vw - 40rpx - 24px) / 3); 
			min-width: calc((100vw - 40rpx - 24px) / 3);
			max-width: calc((100vw - 40rpx - 24px) / 3);
			height: calc((100vw - 40rpx - 24px) / 3);
			margin-right: 20rpx;
			&:nth-child(3n) {
				margin-right: 0;
			}
		}
	}
	.question-detail-info-box {
		margin-top: 40rpx;
		display: flex;
		justify-content: space-between;
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
	.bbs-post-detail-edit-info {
		margin-top: 20rpx;
		font-size: 24rpx;
		color: rgba(0,0,0,0.5);
		line-height: 33rpx;
		text-align: left;
	}
	.toActivity {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #35C8A7;
		line-height: 33rpx;
		font-weight: 500;
		text-decoration: underline;
		display: flex;
		align-items: center;
		.toActivity-img {
			height: 32rpx;
			width: 32rpx;
			margin-right: 10rpx;
		}
	}
	.question-detail-btns {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.question-detail-btn-wrap {
			/deep/ .question-detail-btn {
				font-size: 24rpx;
				color: #fff;	
				line-height: 33rpx;
				padding: 9rpx 27rpx;
				background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
				border: 1rpx solid #50D2B7;
				border-radius: 10rpx;
				height: auto
			}
			/deep/ .question-detail-btn-2 {
				margin-left: 20rpx;
				font-size: 24rpx;
				color: #000;	
				line-height: 33rpx;
				padding: 9rpx 27rpx;
				background-color: #F2F2F2;
				border: 1rpx solid #F2F2F2;
				border-radius: 10rpx;
				height: auto
			}
		}
	}
	
	.bbs-post-detail-comment {
		margin-top: 80rpx;
		.bbs-post-detail-comment-total {
			font-size: 24rpx;
			color: rgba(0,0,0,0.5);
			line-height: 33rpx;
		}
	}
	
	.bbs-post-detail-operate {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		box-shadow: 0rpx -1rpx 13rpx 0rpx rgba(0,0,0,0.1);
		padding: 12px;   //因为z-paging只能设置px,所以这里都换算成px， button的height固定44px
		display: flex;
		align-items: center;
		.bbs-post-detail-operate-input-wrap {
			// width: 50%;
			flex: 1;
			margin-right: 58rpx;
			/deep/ .van-cell {
				background-color: #F6F6F6;
				border-radius: 20rpx;
				padding: 8px 15px;
			}
		}
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
		.bbs-post-detail-operate-icon-box {
			margin-right: 0rpx;
			display: flex;
			.bbs-post-detail-operate-num {
				font-size: 30rpx;
				line-height: 42rpx;
				margin-left: 13rpx;
				width: 90rpx;
				color: #000;
			}
			.bbs-post-detail-operate-num-active {
				color: #2FC2C5;
			}
			&:last-child {
				margin-right: 0;
			}
		}
	}
}
</style>
