<!-- 评论区组件 -->
<!-- 此组件被问答详情、资讯详情页复用 -->
<template>
	<view class="bbs-post-comment">
		<view class="comment" v-for="(item, index) in commentData" :key="index">
			<!-- 头像、昵称、学校 -->
			<card-user :item="item" :isComment="true" parent="detail"></card-user>
			
			<view class="comment-content">
				<!-- 第一层: 评论内容 -->
				<view class="comment-content-body" @click="handleReply(item, 1, index)" @longpress="handleLongpress(item.id)">{{ commentBody(item.body) }}</view>
				<!-- 第一层: 时间、点赞、评论 -->
				<view class="comment-content-footer">
					<view class="comment-content-footer-left">{{transformTimestamp(item)}}</view>
					<view class="comment-content-footer-right">
						<view class="comment-content-footer-right-like">
							<van-icon v-if="!item.is_like" name="good-job" size="34rpx" color="#D7D7D7" @click="getLike(index, true)"></van-icon>
							<van-icon v-if="item.is_like" name="good-job" size="34rpx" :color="activeColor" @click="getLike(index, false)"></van-icon>
							<view class="num" :style="{'color': item.is_like ? activeColor : '#00000099'}">{{ handleTransform(item.likers_count) }}</view>
						</view>
						<view class="comment-content-footer-right-reply">
							<van-icon v-if="!hideReply" name="comment" size="34rpx" color="#D7D7D7" @click="handleReply(item, 1, index)" />
						</view>
					</view>
				</view>
				
				<!-- 第2层 -->
				<view class="comment-content-level2" v-for="(reply, subIndex) in item.descendants" :key="subIndex">
					<!-- 第2层: 头像、昵称、学校 -->
					<card-user :item="reply" :isComment="true" parent="detail"></card-user>
					<!-- 第2层: 评论内容 -->
					<view class="comment-content-body" @click="handleReply(reply, 2, index, subIndex)" @longpress="handleLongpress(reply.id)">
						<text v-if="!reply.is_first_descend">回复 <text style="color: #999999;">{{reply.parent_author}}</text>：</text>
						{{ commentBody(reply.body) }}
					</view>
					<!-- 第2层: 时间、点赞、评论 -->
					<view class="comment-content-footer">
						<view class="comment-content-footer-left">{{transformTimestamp(reply)}}</view>
						<view class="comment-content-footer-right">
							<view class="comment-content-footer-right-like">
								<van-icon v-if="!reply.is_like" name="good-job" size="34rpx" color="#D7D7D7" @click="getLikeLevel2(index, subIndex, true)"></van-icon>
								<van-icon v-if="reply.is_like" name="good-job" size="34rpx" :color="activeColor" @click="getLikeLevel2(index, subIndex, false)"></van-icon>
								<view class="num" :style="{'color': reply.is_like ? activeColor : '#00000099'}">{{ handleTransform(reply.likers_count) }}</view>
							</view>
							<view class="comment-content-footer-right-reply">
								<van-icon v-if="!hideReply" name="comment" size="34rpx" color="#D7D7D7" @click="handleReply(reply, 2, index, subIndex)" />
							</view>
						</view>
					</view>
				</view>
				
				<!-- 更多 -->
				<view class="all-reply" @tap="toAllReply(item)" v-if="item.descendants_count && item.descendants_count > 3">
					共{{ item.descendants.length }}条回复
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	const DEFAULT_AVATAR = 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/profile_photos/default/001.jpg'
	import { likeComment, disLikeComment } from "@/network/api_bbs.js"
	import { utf16toEntities, uncodeUtf16 } from '@/tools/transform_emoji.js'
	import { transformMaxNum, transformTime } from '@/tools/transform_time.js'
	import CardUser from '@/components/common/CardUser.vue'
	import { themeColor } from '@/common/common.less'
	export default {
		props: {
			commentData: {
				type: Array,
				default: []
			},
			hideReply: {
				type: Boolean,
				default: false,
				required: false
			}
		},	
		components: {
			CardUser
		},
		data() {
			return {
				activeColor: themeColor,
			}
		},
		methods: {
			transformTimestamp(item) {
				return item.timestamp ? transformTime(item.timestamp) : item.timestamp
			},
			// 点赞、评论 大数单位转化
			handleTransform(val) {
				return transformMaxNum(val)
			},
			
			// 评论正文emoji解码
			commentBody(val) {
				return val ? uncodeUtf16(val) : ''
			},
			// 跳转到全部回复
			toAllReply(item) {
				uni.navigateTo({
					url: `/page_bbs/bbsCommentReply/bbsCommentReply?id=${item.id}`
				});
			},
			// 点赞,index为1级评论的index
			getLike(index, status) {
				if(status) {
					//unlike ——> like
					likeComment(this.commentData[index].id).then(res => {
						if(res.code === 0) {
							//点赞成功，改变icon状态
							this.$emit('checkoutCommentLike', index, status)
						}
					}, err => {
						console.log('likeGuide: ', err)
					})
				} else {
					//like ——> unlike
					disLikeComment(this.commentData[index].id).then(res => {
						if(res.code === 0) {
							//取消点赞成功，改变icon状态
							this.$emit('checkoutCommentLike', index, status)
						}
					}, err => {
						console.log('disLikeGuide: ', err)
					})
				}
			},
			// 点赞,index为1级评论的index, subIndex为2级评论的index
			getLikeLevel2(index, subIndex, status) {
				if(status) {
					this.$emit('checkoutCommentLikeLevel2', index, subIndex, status)
					//unlike ——> like
					likeComment(this.commentData[index].descendants[subIndex].id).then(res => {
						if(res.code === 0) {
							//点赞成功，改变icon状态
						}
					}, err => {
						console.log('likeGuide: ', err)
					})
				} else {
					//like ——> unlike
					this.$emit('checkoutCommentLikeLevel2', index, subIndex, status)
					disLikeComment(this.commentData[index].descendants[subIndex].id).then(res => {
						if(res.code === 0) {
							//取消点赞成功，改变icon状态
						}
					}, err => {
						console.log('disLikeGuide: ', err)
					})
				}
			},
			// 回复   item:回复的评论，level: 回复的是1级/2级评论，如果回复的是2级评论: index:1级评论的index, subIndex：2级评论的index
			handleReply(item, level, index, subIndex) {
				this.$emit('reply', item, level, index, subIndex)
			},
			// 长按，弹起面板
			handleLongpress(id) {
				this.$emit('commentLongpress', id)
			}
		}
	}
</script>

<style lang="less" scoped>
	.bbs-post-comment {
		margin-top: 15rpx;
		.comment {
			margin-top: 30rpx;
			.comment-content {
				margin-left: 90rpx;
				.comment-content-body {
					font-size: 30rpx;
					margin-top: 10rpx;
				}
				.comment-content-footer {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 22rpx;
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
			.comment-content-level2 {
				margin-top: 15rpx;
			}
			.all-reply {
				padding: 5rpx 0 25rpx 0;
				display: flex;
				color: #35C8A7;
				align-items: center;
				.more {
					margin-left: 6rpx;
				}
			}
			
			
			
		}
	}
</style>

