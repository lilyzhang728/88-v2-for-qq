<!-- tab4-发现 -->
<template>
	<view class="bbs-rec">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'left': '25rpx', 'right': '25rpx'}">
			<!-- 热门话题 -->
			<view class="bbs-rec-topic" v-if="topicList.length">
				<view class="bbs-rec-topic-title">
					<text class="bbs-rec-topic-title-text">#推荐话题</text>
					<text class="bbs-rec-topic-title-more" @click="toTopicList">
						更多推荐内容<van-icon size="25rpx" name="arrow" class="bbs-rec-topic-title-more-icon"/>
					</text>
				</view>
				<view class="bbs-rec-topic-list">
					<view class="bbs-rec-topic-item" v-for="(item, index) in topicList" :key="index" @click="toTopicDetail(item)">
						<img class="bbs-rec-topic-item-img" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/news/topicIcon.png" alt="">
						<text class="bbs-rec-topic-item-text">{{item.body}}</text>
					</view>
				</view>
			</view>
			
			
			<!-- 帖子列表 -->
			<view class="bbs-rec-post">
				<bbs-post-card v-for="(item,index) in dataList" :key="index" :postData="item" :index="index"  
				@clickMore="clickMore" @click.native="toPostDetail(item.id)" @checkoutLike="checkoutLike"></bbs-post-card>
			</view>
		</z-paging>
		
		<!-- 举报面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" type="0"
		@backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	import BbsPostCard from "@/components/bbs/BbsPostCard.vue"
	import { topicList } from '@/network/api_bbs.js'
	import { recArticle } from '@/network/api_guide.js'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	export default {
		components: {
			BbsPostCard,
			DeleteAndComplaint
		},
		data() {
			return {
				dataList: [],
				topicList: [],
				contentId: ''
			}
		},
		created() {
			this.getTopicList()
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.getRecPostList(pageNo, pageSize).then(res => {
					this.$refs.paging.complete(res);
				})
			},
			//获取发现（帖子）列表
			getRecPostList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					recArticle({
						'post_type': 3,	//3 :tab4
						'per_page': pageSize,
						'page': pageNo
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							resolve(res.data.items)
						} else {
							resolve([])
						}
					}, err => {
						resolve([])
						console.log('recArticle: ', err)
					})
				})
			},
			//获取话题列表
			getTopicList() {
				topicList({
					'per_page': 3,
					'page': 1
				}).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.topicList = res.data.items
					}
				}, err => {
					console.log('topicList: ', err)
				})
			},
			toPostDetail(id) {
				uni.navigateTo({
					url: `/page_bbs/bbsPostDetail/bbsPostDetail?id=${id}`
				});
			},
			//跳转话题列表
			toTopicList() {
				this.$emit('toTopicList')
			},
			//跳转话题详情
			toTopicDetail(item) {
				uni.navigateTo({
					url: `/page_bbs/bbsTopicDetail/bbsTopicDetail?id=${item.id}`
				});
			},
			//切换点赞状态
			checkoutLike(cardIndex, status) {
				this.dataList[cardIndex].is_like = status
				if(status) {
					this.dataList[cardIndex].likers_count++
				} else {
					this.dataList[cardIndex].likers_count--
				}
			},
			// 删除成功，刷新
			backRefresh() {
				this.$refs.paging.reload()
			},
			// 点更多，弹出面板
			// 参数： id, type: 0：帖子，1：评论，2：话题
			clickMore(id, type) {
				this.contentId = id
				this.$refs.deleteAndComplaint.handleLongpress()
			},
		}
	}
</script>

<style lang="less" scoped>
.bbs-rec {
	margin: 0 25rpx;
	.bbs-rec-topic {
		padding: 30rpx;
		background: linear-gradient(180deg, #F1FFF7 0%, #FFFFFF 100%);
		box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
		border-radius: 20rpx;
		.bbs-rec-topic-title {
			line-height: 36rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 5rpx;
			.bbs-rec-topic-title-text {
				font-size: 30rpx;
				font-weight: 600;
				color: #000000;
			}
			.bbs-rec-topic-title-more {
				font-size: 22rpx;
				color: rgba(0,0,0,0.6);
				.bbs-rec-topic-title-more-icon {
					margin-left: 10rpx;
				}
			}
		}
		.bbs-rec-topic-list {
			.bbs-rec-topic-item {
				font-size: 26rpx;
				color: #000000;
				line-height: 37rpx;
				display: flex;
				align-items: center;
				margin-top: 25rpx;
				.bbs-rec-topic-item-img {
					height: 30rpx;
					width: 30rpx;
					margin-right: 10rpx;
				}
				.bbs-rec-topic-item-text {
					height: 37rpx;
					flex: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
	.bbs-rec-post {
		margin-top: 20rpx;
	}
}
</style>
