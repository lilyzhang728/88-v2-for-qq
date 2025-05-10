<template>
	<view class="activity-infos">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'left': '25rpx', 'right': '25rpx'}">
			<view class="infoItem">
				<activity-info-card v-for="(item, index) in dataList" :key="index" :infoItem="item" :index="index"
				@checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect" @clickMore="clickMore"></activity-info-card>
			</view>
		</z-paging>
		
		<!-- 举报面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" type="0"
		@backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	import ActivityInfoCard from '@/components/qa/ActivityInfoCard.vue'
	import { recArticle } from '@/network/api_guide.js'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	export default {
		props: {
		},
		components: {
			ActivityInfoCard,
			DeleteAndComplaint
		},
		data() {
			return {
				dataList: [],
				contentId: ''
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.pageNo = pageNo
				this.pageSize = Number(pageSize)
				this.getRecNewsList(pageNo, pageSize).then(res => {
					// this.$refs.paging.complete(res);
					let noMore = !res.length
					this.$refs.paging.completeByNoMore(res, noMore);
				})
			},
			//请求列表
			getRecNewsList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					recArticle({
						'post_type': 7,
						'per_page': pageSize,
						'page': pageNo,
						'fields': ['1', '2', '3', '4', '5', '6', '7']
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
			//切换like状态
			checkoutLike(index, status) {
				this.dataList[index].is_like = status
				if(status) {
					this.dataList[index].likers_count++
				} else {
					this.dataList[index].likers_count--
				}
			},
			//切换collect状态
			checkoutCollect(index, status) {
				this.dataList[index].is_collect = status
				if(status) {
					this.dataList[index].collectors_count++
				} else {
					this.dataList[index].collectors_count--
				}
			},
			reloadPage() {
				this.$refs.paging.reload()
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
	.activity-infos {
		.news-list {
			margin-top: 20rpx;
		}
	}
</style>