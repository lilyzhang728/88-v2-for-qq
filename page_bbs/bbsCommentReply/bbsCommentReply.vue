<template>
	<view class="wrap">
		<view class="comment">
			<view class="top">
				<view class="left">
					<view class="heart-photo"><image :src="getAvatar(commentData)" mode=""></image></view>
					<view class="user-info">
						<view class="name">{{ commentData.author.name }}</view>
						<view class="date">{{commentData.timestamp}}</view>
					</view>
				</view>
				<view class="right" :class="{ highlight: commentData.is_like }">
					{{ handleTransform(commentData.likers_count) }}
					<van-icon v-if="!commentData.is_like" name="like-o" size="25rpx" class="like" color="#9a9a9a" @click.native="getLike(true)"></van-icon>
					<van-icon v-if="commentData.is_like" name="like" size="25rpx" class="like" @click.native="getLike(false)"></van-icon>
				</view>
			</view>
			<!-- 1级评论正文 -->
			<view class="content" @click="handleReply(commentData)">{{ commentBody(commentData.body) }}</view>
		</view>
		<view class="all-reply">
			<view class="all-reply-top">全部回复（{{ subReplyNum }}）</view>
			<view class="item" v-for="(item, index) in commentData.descendants" :key="index">
				<view class="comment">
					<view class="top">
						<view class="left">
							<view class="heart-photo"><image :src="getAvatar(item)" mode=""></image></view>
							<view class="user-info">
								<view class="name">{{ item.author.name }}</view>
								<view class="date">{{ item.timestamp }}</view>
							</view>
						</view>
						<view class="right"  :class="{ highlight: item.is_like }">
							<view class="num">{{ handleTransform(item.likers_count) }}</view>
							<van-icon v-if="!item.is_like" name="like-o" class="like" size="25rpx" color="#9a9a9a" @click.native="getLike(true, index, 'sub')"></van-icon>
							<van-icon v-if="item.is_like" name="like" class="like" size="25rpx" @click.native="getLike(false, index, 'sub')"></van-icon>
						</view>
					</view>
					<!-- <view class="reply" v-if="item.reply">
						<view class="username">{{ item.reply.name }}</view>
						<view class="text">{{ item.reply.contentStr }}</view>
					</view> -->
					<!-- 2级评论正文 -->
					<view class="content" @click="handleReply(item, index)">{{ commentBody(item.body) }}</view>
				</view>
			</view>
		</view>
		
		<!-- 回复键盘 -->
		<van-overlay :show="showReply" @click.native="onClickHide" :custom-style="'height:auto;bottom: '+(bottomVal)+'; '" />
		<bbs-comment-keyboard :showReply="showReply" :showReplyPostBox="showReplyPostBox" 
		:curReplyAvatar="curReplyAvatar" :curReplyContent="curReplyContent"
		@submit="submit" @changeBottomVal="changeBottomVal"></bbs-comment-keyboard>
	</view>
</template>

<script>
const DEFAULT_AVATAR = 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg'
import { allReply, likeComment, disLikeComment, postComment } from "@/network/api_bbs.js"
import BbsCommentKeyboard from "@/page_bbs/components/BbsCommentKeyboard.vue"
import { transformMaxNum } from '@/tools/transform_time.js'
import { utf16toEntities, uncodeUtf16 } from '@/tools/transform_emoji.js'
export default {
	components: {
		BbsCommentKeyboard
	},
	data() {
		return {
			commentList: [],
			comment: '',
			id: '',
			commentData: {},
			showReply: false,	//是否打开键盘
			bottomVal: this.showReplyPostBox ? '150px' : '115px',	//打开键盘后遮罩bottom（150：引用别人评论，115：不引用别人评论（发表1级评论））
			curReplyId: '',		//当前回复的评论的id
			// curReplyLevel: 1,	//当前回复的评论是1级/2级
			// curReplyIndex: 0,	//如果回复的是2级评论，2级评论所属1级评论的Index
			curReplySubIndex: 0,	//如果回复的是2级评论，2级评论的Index
			curReplyAvatar: '',		//当前回复的评论的头像
			curReplyContent: '',	//当前回复的评论的内容
			showReplyPostBox: false,	//是否显示引用评论
		};
	},
	computed: {
		subReplyNum() {
			return this.commentData && this.commentData.descendants && this.commentData.descendants.length ? this.commentData.descendants.length : 0
		}
	},
	onLoad(option) {
		this.id = option.id
		this.getAllReply(option.id)
	},
	methods: {
		// 点赞、评论 大数单位转化
		handleTransform(val) {
			return transformMaxNum(val)
		},
		getAvatar(item) {
			return item.author && item.author.avatar ? item.author.avatar : DEFAULT_AVATAR
		},
		getAllReply(id) {
			allReply(id).then(res => {
				if(res.code === 0 && Object.keys(res.data).length) {
					this.commentData = res.data
				} else {
					//接口返回失败，返回上一页
					uni.navigateBack({
						success: () => {
							 let page = getCurrentPages().pop();//跳转页面成功之后
							 if (page) {
								 page.$vm.active = 0
								 page.$vm.getPostDetail()
							 } 
						},
					})
				}
			}, err => {
				console.log('getAllReply: ', err)
			})
		},
		// 点赞评论
		getLike(status, index, sub) {
			let param = ''
			if(sub) {
				//2级评论
				param = this.commentData.descendants[index].id
			} else {
				//1级评论
				param = this.commentData.id
			}
			if(status) {
				//unlike ——> like
				likeComment(param).then(res => {
					if(res.code === 0) {
						//点赞成功，改变icon状态
						if(sub) {
							//2级评论
							this.commentData.descendants[index].is_like = status
							this.commentData.descendants[index].likers_count++
						} else {
							//1级评论
							this.commentData.is_like = status
							this.commentData.likers_count++
						}
					}
				}, err => {
					console.log('likeGuide: ', err)
				})
			} else {
				//like ——> unlike
				disLikeComment(param).then(res => {
					if(res.code === 0) {
						//取消点赞成功，改变icon状态
						if(sub) {
							//2级评论
							this.commentData.descendants[index].is_like = status
							this.commentData.descendants[index].likers_count--
						} else {
							//1级评论
							this.commentData.is_like = status
							this.commentData.likers_count--
						}
					}
				}, err => {
					console.log('disLikeGuide: ', err)
				})
			}
		},
		//回复评论
		handleReply(item, subIndex) {
			//当前回复的评论的位置（用于评论成功后即时回显）
			this.curReplyId = item.id
			// this.curReplyLevel = level
			// this.curReplyIndex = index
			this.curReplySubIndex = subIndex
			this.curReplyAvatar = item.author.avatar ? item.author.avatar : DEFAULT_AVATAR
			this.curReplyContent = item.body
			//显示引用的评论
			this.showReplyPostBox = true
			//打开评论键盘
			this.showReply = true
		},
		//关闭评论键盘
		onClickHide() {
			this.showReply = false
		},
		//计算遮罩bottom（val为键盘弹起后高度）
		changeBottomVal(val) {
			let height = this.showReplyPostBox ? 150 : (150-35)
			this.bottomVal = (height + val) + 'px'
		},
		//发送评论（调评论接口）
		submit(val) {
			this.showReply = false
			let params = {
				body: utf16toEntities(val),
				post_id: this.commentData.post.id,
				parent_id: this.curReplyId
			}
			postComment(params).then(res => {
				if(res.code === 0) {
					//评论成功，1级回显到第1条，2级回显到回复的评论下面  TODO：
					//先刷新
					this.getAllReply(this.id)
				}
			}, err => {
				console.log('postComment: ', err)
			})
		},
		// 评论正文emoji解码
		commentBody(val) {
			return val ? uncodeUtf16(val) : ''
		},
	}
};
</script>

<style lang="less" scoped>
page {
	background-color: #f2f2f2;
}
.comment {
	padding: 25rpx;
	font-size: 32rpx;
	background-color: #ffffff;
	.top {
		display: flex;
		justify-content: space-between;
	}
	.left {
		display: flex;
		.heart-photo {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}
		.user-info {
			margin-left: 10rpx;
			.name {
				color: #35C8A6;
				font-size: 28rpx;
				margin-bottom: 4rpx;
			}
			.date {
				font-size: 20rpx;
				color: #ccc;
			}
		}
	}
	.right {
		display: flex;
		font-size: 20rpx;
		align-items: center;
		color: #9a9a9a;
		.like {
			margin-left: 6rpx;
		}
		.num{
			font-size: 26rpx;
			color: #9a9a9a;
		}
	}
	.highlight {
		color: #35C8A6;
		.num{
			color: #35C8A6;
		}
	}
}
.all-reply {
	margin-top: 10rpx;
	padding-top: 20rpx;
	padding-bottom: 50rpx;
	background-color: #ffffff;
	.all-reply-top {
		margin-left: 20rpx;
		padding-left: 20rpx;
		border-left: solid 4rpx #35C8A6;
		font-size: 30rpx;
		font-weight: bold;
	}
	.item {
		margin: 25rpx;
		// border-bottom: solid 2rpx #ccc;
	}
	.reply {
		padding: 20rpx;
		background-color: rgb(242, 242, 242);
		border-radius: 12rpx;
		margin: 10rpx 0;
		.username {
			font-size: 24rpx;
			color: #7a7a7a;
		}
	}
}
</style>
