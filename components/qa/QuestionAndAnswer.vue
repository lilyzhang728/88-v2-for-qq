<!-- 问答页 -->
<template>
	<view class="question-and-answer">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': '30rpx', 'left': '25rpx', 'right': '25rpx'}">
			<view class="question-list">
				<view class="question-item-card" @click="toDetail(item)" v-for="(item,index) in dataList">
					<view class="question-item-card-title">{{item.title}}</view>
					<view class="question-item-card-body">{{item.body.body}}</view>
					<view class="bbs-post-img-box" v-if="item.body && item.body.urls && item.body.urls.length">
						<van-image
						  width="100%"
						  height="100%"
						  fit="contain"
						  :src="pic"
						  class="bbs-post-img-item"
						  v-for="(pic, subIndex) in item.body.urls.slice(0, 3)"
						  :key="subIndex"
						/>
					</view>
					<view class="question-item-card-split"></view>
					<view class="question-item-card-footer">
						<view class="question-item-card-footer-author">
							<img class="question-item-card-footer-author-avatar" :src="item.author.avatar ? item.author.avatar : defaultAvatar" alt="">
							<text class="question-item-card-footer-author-name">{{item.author.name}} 说</text>
						</view>
						<view class="question-item-card-footer-count">阅读 {{item.views}}</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import { recArticle } from '@/network/api_guide.js'
	export default {
		data() {
			return {
				dataList: [],
				defaultAvatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				recArticle({
					'post_type': 4,	
					'per_page': pageSize,
					'page': pageNo
				}).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.$refs.paging.complete(res.data.items)
					} else {
						this.$refs.paging.complete([]);
					}
				}, err => {
					this.$refs.paging.complete([]);
					console.log('recArticle: ', err)
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url: `/page_qa/questionDetail/questionDetail?id=${item.id}`
				})
			},
			toastMsg(type) {
				this.$emit('toastMsg', type)
			}
		},
	}
</script>

<style lang="less" scoped>
	.question-and-answer {
		.question-list {
			.question-item-card {
				margin-top: 20rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(81,211,184,0.15);
				border-radius: 20rpx;
				padding: 31rpx 30rpx 25rpx 30rpx;
				.question-item-card-title {
					font-size: 34rpx;
					font-weight: 600;
					color: #000000;
					line-height: 48rpx;
				}
				.question-item-card-body {
					margin-top: 13rpx;
					font-size: 28rpx;
					color: rgba(0,0,0,0.7);
					line-height: 45rpx;
				}
				.bbs-post-img-box {
					margin-top: 40rpx;
					display: flex;
					height: 200rpx;
					.bbs-post-img-item {
						flex: 1;
						margin-right: 20rpx;
						&:last-child {
							margin-right: 0;
						}
					}
				}
				.question-item-card-split {
					height: 1rpx;
					border-top: 1rpx solid #EAEAEA;
					margin-top: 30rpx;
				}
				.question-item-card-footer {
					margin-top: 24rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.question-item-card-footer-author {
						display: flex;
						align-items: center;
						.question-item-card-footer-author-avatar {
							width: 50rpx;
							height: 50rpx;
							border-radius: 50%;
						}
						.question-item-card-footer-author-name {
							font-size: 24rpx;
							color: rgba(0,0,0,0.5);
							line-height: 33rpx;
							margin-left: 20rpx;
						}
					}
					.question-item-card-footer-count {
						font-size: 24rpx;
						color: rgba(0,0,0,0.5);
						line-height: 33rpx;
					}
				}
			}
		}
	}
</style>
