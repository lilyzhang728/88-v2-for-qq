<!-- 干货-攻略 -->
<template>
	<view class="useful-guide">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'left': '25rpx', 'right': '25rpx'}">
			<view class="guide-list">
				<guide-item-card v-for="(item, index) in dataList" :key="index" :index="index"
				:guideItem="item" :tabIndex="tabIndex" @clickMore="clickMore"
				@checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
				></guide-item-card>
			</view>
		</z-paging>
		
		<!-- 更多面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" :type="actionType"
		@backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	import GuideItemCard from '@/components/guide/GuideItemCard.vue'
	import { recArticle, collectedArticle, ownArticle } from '@/network/api_guide.js'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	export default {
		components: {
			GuideItemCard,
			DeleteAndComplaint
		},
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
		data() {
			return {
				dataList: [],
				tabIndex: 0,	// 0-发现，1-我的收藏，2-我的创作
				contentId: '',		// 传给长按面板的内容id （帖子/评论）
				actionType: 0,		// 长按面板内容类型：0：帖子，1：评论，2：话题
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				console.log('开始请求： ', pageNo, pageSize)
				this.pageNo = pageNo
				this.pageSize = Number(pageSize)
				this.getRecGuideList(pageNo, pageSize).then(res => {
					this.$refs.paging.complete(res);
				})
			},
			//请求攻略列表-发现
			getRecGuideList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					// 0-推荐, 1-考研, 2-找工作, 3-出国, 4-考公/编, 目前先把出国扣除去，考公/编的subActive变成3了，需要手动修正到4
					let field = Number(this.subActive) > 2 ? Number(this.subActive)+1 : Number(this.subActive)
					recArticle({
						'post_type': 1,	//1 :tab2
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
					this.dataList[index].likers_count = this.dataList[index].likers_count ? this.dataList[index].likers_count-1 : 0
				}
			},
			//切换collect状态
			checkoutCollect(index, status) {
				this.dataList[index].is_collect = status
				if(status) {
					this.dataList[index].collectors_count++
				} else {
					this.dataList[index].collectors_count = this.dataList[index].collectors_count ? this.dataList[index].collectors_count-1 : 0
				}
			},
			// 点更多，弹出面板
			// 参数： id, type: 0：帖子，1：评论，2：话题
			clickMore(id, type) {
				this.contentId = id
				this.actionType = type
				this.$refs.deleteAndComplaint.handleLongpress()
			},
			// 删除成功，刷新
			backRefresh() {
				this.$refs.paging.reload()
			}
		}
	}
</script>

<style>
</style>
