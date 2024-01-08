<!-- 问答页 -->
<template>
	<view class="question-and-answer">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': '30rpx', 'left': '25rpx', 'right': '25rpx'}">
			<view class="question-list">
				<question-and-answer-card v-for="(item,index) in dataList" :key="index"
				 :item="item" :index="index" @checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"></question-and-answer-card>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import { recArticle } from '@/network/api_guide.js'
	import { transformTime } from '@/tools/transform_time.js'
	import QuestionAndAnswerCard from './QuestionAndAnswerCard.vue'
	export default {
		components: {
			QuestionAndAnswerCard
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
			// 点击头像，去个人主页
			toHomepage(e, id) {
				//防止冒泡
				e.preventDefault()
				uni.navigateTo({
					url: `/page_infos/homepage/homepage?userId=${id}`
				})
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
