<!-- 干货-新闻资讯 -->
<template>
	<view class="useful-news">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'left': '25rpx', 'right': '25rpx'}">
			<view class="news-list">
				<news-item-card v-for="(item, index) in dataList" :key="index" :newsItem="item" :index="index"
				@checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect" @clickMore="clickMore"></news-item-card>
			</view>
		</z-paging>
		
		<!-- 举报面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" type="0"
		@backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	import NewsItemCard from '@/components/news/NewsItemCard.vue'
	import { recArticle } from '@/network/api_guide.js'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	export default {
		props: {
			// 子类目：考研/找工作……
			subActive: {
				type: Number,
				required: true,
				default: 0
			},
			// 当前翻到的swiper的index
			currentIndex: {
				type: Number,
				required: true,
				default: 0
			},
		},
		components: {
			NewsItemCard,
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
				console.log('开始请求： ', pageNo, pageSize)
				this.pageNo = pageNo
				this.pageSize = Number(pageSize)
				this.getRecNewsList(pageNo, pageSize).then(res => {
					this.$refs.paging.complete(res);
				})
			},
			//请求资讯列表-发现
			getRecNewsList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					// 0-推荐, 1-考研, 2-找工作, 3-出国, 6-考公/编
					const fieldMap = {
						0: 0,
						1: 1,
						2: 2,
						3: 6
					}
					let field = fieldMap[Number(this.subActive)]
					recArticle({
						'post_type': 2,	//2 :tab3
						'per_page': pageSize,
						'page': pageNo,
						'field': field
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
	.useful-news {
		.news-list {
			margin-top: 20rpx;
		}
	}
</style>
