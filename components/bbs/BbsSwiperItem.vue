<template>
	<view class="bbs-swiper-item">
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<bbs-rec v-if="tabIndex == 0" :dataList="dataList" @checkoutLike="checkoutPostLike" @toTopicList="toTopicList"></bbs-rec>
			<bbs-focus v-if="tabIndex == 1" :dataList="dataList"></bbs-focus>
			<bbs-topic v-if="tabIndex == 2" :dataList="dataList"></bbs-topic>
		</z-paging>
	</view>
</template>

<script>
	import BbsRec from "@/components/bbs/BbsRec.vue"
	import BbsFocus from "@/components/bbs/BbsFocus.vue"
	import BbsTopic from "@/components/bbs/BbsTopic.vue"
	import { topicList, focusedTopic } from '@/network/api_bbs.js'
	import { recArticle } from '@/network/api_guide.js'
	export default {
		components: {
			BbsRec,
			BbsFocus,
			BbsTopic
		},
		props: {
			//swiper的Index: 0-发现，1-关注，2-话题广场
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
					switch (this.currentIndex){
						case 0:
							//发现
							this.getRecPostList(pageNo, pageSize).then(res => {
								this.$refs.paging.complete(res);
							})
							break;
						case 1:
							//关注
							this.getFocusedTopicList(pageNo, pageSize).then(res => {
								this.$refs.paging.complete(res);
							})
							break;	
						case 2:
							//话题广场
							this.getTopicList(pageNo, pageSize).then(res => {
								this.$refs.paging.complete(res);
							})
							break;
						default:
							break;
					}
				}
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
			//获取关注的话题列表
			getFocusedTopicList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					focusedTopic({
						'field':'考研',
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
						console.log('focusedTopic: ', err)
					})
				})
			},
			//获取话题列表
			getTopicList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					topicList({
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
						console.log('topicList: ', err)
					})
				})
			},
			//切换帖子点赞状态
			checkoutPostLike(cardIndex, status) {
				this.dataList[cardIndex].is_like = status
				if(status) {
					this.dataList[cardIndex].likers_count++
				} else {
					this.dataList[cardIndex].likers_count--
				}
			},
			//切到话题列表
			toTopicList() {
				this.$emit('toTopicList')
			},
		}
	}
</script>

<style lang="less" scoped>
	.bbs-swiper-item {
		padding: 0 25rpx;
	}
</style>
