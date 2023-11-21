<template>
	<view class="guide-swiper-item">
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<view class="guide-list">
				<guide-item-card v-for="(item, index) in dataList" :key="index" :index="index"
				:guideItem="item" :tabIndex="tabIndex" @openOptionSheet="openOptionSheet" 
				@checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
				></guide-item-card>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import GuideItemCard from '@/components/guide/GuideItemCard.vue'
	import { recArticle, collectedArticle, ownArticle } from '@/network/api_guide.js'
	export default {
		props: {
			//swiper的Index: 0-发现，1-我的收藏，2-我的创作
			tabIndex: {
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
			GuideItemCard
		},
		data() {
			return {
				dataList: []
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.$emit('pageQuery', pageNo, pageSize)
				if(this.tabIndex === this.currentIndex) {
					console.log('开始请求： ', pageNo, pageSize)
					this.pageNo = pageNo
					this.pageSize = Number(pageSize)
					switch (this.currentIndex){
						case 0:
							//发现
							this.getRecGuideList(pageNo, pageSize).then(res => {
								this.$refs.paging.complete(res);
							})
							break;
						case 1:
							//我的收藏
							this.getCollectedGuideList(pageNo, pageSize).then(res => {
								this.$refs.paging.complete(res);
							})
							break;
						case 2:
							//我的创作
							this.getOwnGuideList(pageNo, pageSize).then(res => {
								this.$refs.paging.complete(res);
							})
							break;
						default:
							break;
					}
				}
			},
			//请求攻略列表-发现
			getRecGuideList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					recArticle({
						'post_type': 1,	//1 :tab2
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
			//请求攻略列表-我的收藏
			getCollectedGuideList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					collectedArticle({
						'post_type': 1,	//1 :tab2
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
						console.log('collectedArticle: ', err)
					})
				})
			},
			//请求攻略列表-我的创作
			getOwnGuideList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					ownArticle({
						'post_type': 1,	//1 :tab2
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
						console.log('ownArticle: ', err)
					})
				})
			},
			// 弹起选项面板, tabIndex为swiper的Index，index为card的index, status：0当前攻略未发布，1已发布
			openOptionSheet(index, guideId, status) {
				this.$emit('openOptionSheet', this.tabIndex, index, guideId, status)
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
				if(this.currentIndex === 1) {
					// 如果当前为收藏页，需要刷新列表
					this.$refs.paging.reload()
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.guide-swiper-item {
		.guide-list {
			margin: -10rpx 25rpx 0 25rpx;
		}
	}
</style>
