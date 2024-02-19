<!-- 问答页 -->
<template>
	<view class="question-and-answer">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'left': '25rpx', 'right': '25rpx'}">
			<view class="question-list">
				<question-and-answer-card v-for="(item,index) in dataList" :key="index"
				 :item="item" :index="index" @checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
				 @clickMore="clickMore"></question-and-answer-card>
			</view>
		</z-paging>
		
		<!-- 举报面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" type="0"
		@backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	import { recArticle } from '@/network/api_guide.js'
	import { transformTime } from '@/tools/transform_time.js'
	import QuestionAndAnswerCard from './QuestionAndAnswerCard.vue'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	export default {
		components: {
			QuestionAndAnswerCard,
			DeleteAndComplaint
		},
		props: {
			active: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				dataList: [],
				contentId: ''
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
			toastMsg(type) {
				this.$emit('toastMsg', type)
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
		},
	}
</script>

<style lang="less" scoped>
	.question-and-answer {
		.question-list {
			
		}
	}
</style>
