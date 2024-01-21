<!-- 查看全部回复 -->
<template>
	<view class="wrap">
		<view class="comment">
			<!-- 头像、昵称、学校 -->
			<card-user v-if="commentData.author" :item="commentData" parent="detail"></card-user>
			<!-- 1级评论正文 -->
			<view class="comment-content-body" @click="handleReply(commentData)">{{ commentBody(commentData.body) }}</view>
			<!-- 第一层: 时间、点赞、评论 -->
			<view class="comment-content-footer">
				<view class="comment-content-footer-left">{{transformTimestamp(commentData)}}</view>
				<view class="comment-content-footer-right">
					<view class="comment-content-footer-right-like">
						<van-icon v-if="!commentData.is_like" name="good-job" size="34rpx" color="#D7D7D7" @click.native="getLike(true)"></van-icon>
						<van-icon v-if="commentData.is_like" name="good-job" size="34rpx" color="#8B8B8B" @click.native="getLike(false)"></van-icon>
						<view class="num">{{ handleTransform(commentData.likers_count) }}</view>
					</view>
					<view class="comment-content-footer-right-reply">
						<van-icon name="comment" size="34rpx" color="#D7D7D7" @click="handleReply(commentData)" />
					</view>
				</view>
			</view>
		</view>
		<view class="all-reply">
			<view class="all-reply-top">全部回复（{{ subReplyNum }}）</view>
			<view class="item" v-for="(item, index) in commentData.descendants" :key="index">
				<view class="comment">
					<card-user v-if="item.author" :item="item" parent="detail"></card-user>
					<!-- 2级评论正文 -->
					<view class="comment-content-body" @click="handleReply(item, index)">
						<text v-if="!item.is_first_descend">回复 <text style="color: #999999;">{{item.parent_author}}</text>：</text>
						{{ commentBody(item.body) }}
					</view>
					<!-- 第2层: 时间、点赞、评论 -->
					<view class="comment-content-footer">
						<view class="comment-content-footer-left">{{transformTimestamp(item)}}</view>
						<view class="comment-content-footer-right">
							<view class="comment-content-footer-right-like">
								<van-icon v-if="!item.is_like" name="good-job" size="40rpx" color="#8B8B8B" @click.native="getLike(true, index, 'sub')"></van-icon>
								<van-icon v-if="item.is_like" name="good-job" size="40rpx" :color="activeColor" @click.native="getLike(false, index, 'sub')"></van-icon>
								<view class="num" :style="{'color': item.is_like ? activeColor : '#00000099'}">{{ handleTransform(item.likers_count) }}</view>
							</view>
							<view class="comment-content-footer-right-reply">
								<van-icon name="comment" size="34rpx" color="#D7D7D7" @click="handleReply(item, index)" />
							</view>
						</view>
					</view>
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
import { transformMaxNum, transformTime } from '@/tools/transform_time.js'
import { utf16toEntities, uncodeUtf16 } from '@/tools/transform_emoji.js'
import CardUser from '@/components/common/CardUser.vue'
import { themeColor } from '@/common/common.less'
export default {
	components: {
		BbsCommentKeyboard,
		CardUser
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
			activeColor: themeColor,
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
		transformTimestamp(item) {
			return item.timestamp ? transformTime(item.timestamp) : item.timestamp
		},
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
	padding: 0 25rpx;
	font-size: 32rpx;
	background-color: #ffffff;
	
	.comment-content-body {
		font-size: 30rpx;
		margin-top: 10rpx;
	}
	.comment-content-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		color: rgba(0,0,0,0.6);
		overflow: hidden;
		.comment-content-footer-left {
			
		}
		.comment-content-footer-right {
			display: flex;
			align-items: center;
			.comment-content-footer-right-like {
				display: flex;
				align-items: center;
				color: #9a9a9a;
				font-size: 26rpx;
			}
			.comment-content-footer-right-reply {
				margin-top: 12rpx;
				margin-left: 20rpx;
			}
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
		margin-bottom: 30rpx;
		padding-left: 20rpx;
		border-left: solid 4rpx #35C8A6;
		font-size: 30rpx;
		font-weight: bold;
	}
	.item {
		margin: 25rpx;
	}
	
}
</style>
