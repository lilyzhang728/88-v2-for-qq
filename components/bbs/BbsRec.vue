<!-- tab4-发现 -->
<template>
	<view class="bbs-rec">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'left': '25rpx', 'right': '25rpx'}">

			<!-- 帖子列表 -->
			<view class="bbs-rec-post">
				<bbs-post-card v-for="(item,index) in dataList" :key="index" :postData="item" :index="index"  
				@clickMore="clickMore" @click.native="toPostDetail(item.id, index)" @checkoutLike="checkoutLike"></bbs-post-card>
			</view>
		</z-paging>
		
		<!-- 举报面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" type="0"
		@backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	import BbsPostCard from "@/components/bbs/BbsPostCard.vue"
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
				contentId: '',
			}
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
			toPostDetail(id, index) {
				uni.navigateTo({
					url: `/page_bbs/bbsPostDetail/bbsPostDetail?id=${id}&postIndex=${index}`
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
			// 帖子被删除，返回这一页删掉这条帖子
			deleteSinglePost(index) {
				this.dataList.splice(index, 1)
			}
		}
	}
</script>

<style lang="less" scoped>
.bbs-rec {
	margin: 0 25rpx;
	.bbs-rec-post {
		margin-top: 20rpx;
	}
}
</style>
