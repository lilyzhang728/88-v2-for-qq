<!-- 帖子-评论区 -->
<template>
	<view class="bbs-post-comment">
		<view class="comment" v-for="(item, index) in commentData" :key="index">
			<view class="left"><image :src="getAvatar(item)" mode="aspectFill"></image></view>
			<view class="right">
				<view class="top">
					<view class="name">{{ item.author.name }}</view>
					<view class="like">
						<van-icon v-if="!item.is_like" name="good-job" size="30rpx" color="#D7D7D7" @click="getLike(index, true)"></van-icon>
						<van-icon v-if="item.is_like" name="good-job" size="30rpx" color="#8B8B8B" @click="getLike(index, false)"></van-icon>
						<view class="num">{{ handleTransform(item.likers_count) }}</view>
					</view>
				</view>
				<view class="content" @click="handleReply(item, 1, index)">{{ commentBody(item.body) }}</view>
				<view class="reply-box">
					<view class="item" v-for="(reply, subIndex) in item.descendants" :key="subIndex">
						<view class="username">
							<image :src="reply.author.avatar" mode="aspectFill" class="reply-box-avatar"></image>
							{{ reply.author.name }}
						</view>
						<view class="text reply-item-content" @click="handleReply(reply, 2, index, subIndex)">
							<text v-if="!reply.is_first_descend">回复 <text style="color: #999999;">{{reply.parent_author}}</text>：</text>
							{{ commentBody(reply.body) }}
						</view>
					</view>
					<view class="all-reply" @tap="toAllReply(item)" v-if="item.descendants_count && item.descendants_count > 3">
						共{{ item.descendants.length }}条回复
						<!-- <u-icon class="more" name="arrow-right" :size="26"></u-icon> -->
					</view>
				</view>
				<!-- <view class="bottom">
					{{ res.date }}
					<view class="reply" @click="handleReply">回复</view>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	const DEFAULT_AVATAR = 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/profile_photos/default/001.jpg'
	import { likeComment, disLikeComment } from "@/network/api_bbs.js"
	import { utf16toEntities, uncodeUtf16 } from '@/tools/transform_emoji.js'
	import { transformMaxNum } from '@/tools/transform_time.js'
	export default {
		props: {
			commentData: {
				type: Array,
				default: []
			},
		},		
		methods: {
			// 点赞、评论 大数单位转化
			handleTransform(val) {
				return transformMaxNum(val)
			},
			getAvatar(item) {
				return item.author && item.author.avatar ? item.author.avatar : DEFAULT_AVATAR
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
		
			// 回复   item:回复的评论，level: 回复的是1级/2级评论，如果回复的是2级评论: index:1级评论的index, subIndex：2级评论的index
			handleReply(item, level, index, subIndex) {
				this.$emit('reply', item, level, index, subIndex)
			}
		}
	}
</script>

<style lang="less" scoped>
	.bbs-post-comment {
		margin-top: 15rpx;
		.comment {
			display: flex;
			margin-top: 25rpx;
			.left {
				margin-right: 20rpx;
				image {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
					background-color: #f2f2f2;
				}
			}
			.right {
				flex: 1;
				font-size: 30rpx;
				// border-bottom: 1rpx solid #E8E8E8;
				.top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin: 10rpx 0;
					.name {
						color: rgba(0,0,0,0.5);
					}
					.like {
						display: flex;
						flex-direction: column;
						text-align: center;
						color: #9a9a9a;
						font-size: 26rpx;
						.num {
							color: #000;
							width: 50rpx;
						}
					}
				}
				.content {
					margin-bottom: 15rpx;
				}
				.reply-box {
					.item {
						padding: 15rpx 0;
						.username {
							font-size: 24rpx;
							color: #999999;
							display: flex;
							align-items: center;
							.reply-box-avatar {
								width: 50rpx;
								height: 50rpx;
								border-radius: 50%;
								background-color: #f2f2f2;
								margin-right: 20rpx;
							}
						}
						.reply-item-content {
							margin-left: 70rpx;
						}
					}
					.all-reply {
						padding: 5rpx 0 25rpx 70rpx;
						display: flex;
						color: #35C8A7;
						align-items: center;
						.more {
							margin-left: 6rpx;
						}
					}
				}
				.bottom {
					margin-top: 20rpx;
					display: flex;
					font-size: 24rpx;
					color: #9a9a9a;
					.reply {
						color: #35C8A7;
						margin-left: 10rpx;
					}
				}
			}
		}
	}
</style>
