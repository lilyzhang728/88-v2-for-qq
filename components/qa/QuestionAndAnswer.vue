<!-- 问答页 -->
<template>
	<view class="question-and-answer">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'left': '25rpx', 'right': '25rpx'}">
			<view class="question-list">
				 <common-item-card v-for="(item, index) in dataList" :key="index" :index="index" 
				 :cardItem="item" @clickMore="clickMore"  @checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
				 :showStar="true" :showLeft="true" @click.native="toCardDetail(item, index)"></common-item-card>
			</view>
		</z-paging>
		
		<!-- 举报面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" type="0"
		@backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	import { recArticle, commonCardNew } from '@/network/api_guide.js'
	import { transformTime } from '@/tools/transform_time.js'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	import CommonItemCard from '@/components/common/CommonItemCard.vue'
	const hostSDKVersion = uni.getStorageSync('hostSDKVersion')
	import { compareVersion } from '@/tools/about_wx.js'
	export default {
		components: {
			DeleteAndComplaint,
			CommonItemCard
		},
		props: {
			active: {
				type: Number,
				default: 0
			},
			hasPublished: {
				type: Boolean,
				default: false,
				required: false
			},
			// 子类目：考研/找工作……
			subActive: {
				type: Number,
				required: true,
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
				// recArticle({
				// 	'post_type': 4,	
				// 	'per_page': pageSize,
				// 	'page': pageNo
				// }).then(res => {
				// 	if(res.code === 0 && Object.keys(res.data).length) {
				// 		this.$refs.paging.complete(res.data.items)
				// 	} else {
				// 		this.$refs.paging.complete([]);
				// 	}
				// }, err => {
				// 	this.$refs.paging.complete([]);
				// 	console.log('recArticle: ', err)
				// })
				this.getCommonCardNew(pageNo, pageSize).then(res => {
					if(this.hasPublished) {
						this.$emit('resetHasPublished')
					}
					// this.$refs.paging.complete(res);
					let noMore = !res.length
					this.$refs.paging.completeByNoMore(res, noMore);
				})
			},
			// 获取列表数据（新版）
			getCommonCardNew(pageNo, pageSize) {
				// 推荐：['1', '2', '3', '4', '5', '6', '7'], 考研：['1'], 实习工作：['2'],  考公/编：['6']
				const FIELD_MAP = [['1', '2', '3', '4', '5', '6', '7'], ['1'], ['2'], ['6']]
				let field = FIELD_MAP[Number(this.subActive)]
				return new Promise((resolve, reject) => {
					commonCardNew({
						'post_types':  ["2", "4", "5", "6", "7"],
						'per_page': pageSize,
						'page': pageNo,
						'fields': field,
						'has_published': this.hasPublished
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							resolve(res.data.items)
						} else {
							resolve([])
						}
					}, err => {
						resolve([])
						console.log('commonCardNew err: ', err)
					})
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
			// 去详情
			toCardDetail(item, index) {
				if(item.in_house) {
					// 1-内部链接
					uni.navigateTo({
						url: `/page_qa/questionDetail/questionDetail?id=${item.id}`
					})
				} else {
					// 0-外部链接
					this.toWXLink(item)
				}
			},
			// 跳外部链接
			toWXLink(item) {
				if(this.ifOfficialAccountLink(item)) {
					// 跳外部公众号文章链接
					if(compareVersion(hostSDKVersion, '3.4.8') < 0) {
						// 基础库低于3.4.8，无法打开外链公众号
						wx.showModal({
							title: '提示',
							content: '当前微信版本过低，请升级到最新微信版本后重试。',
							complete(res) {
								// 退出小程序
								// if(wx.exitMiniProgram) {
								// 	wx.exitMiniProgram()
								// }
							} 
						})
					} else {
						if(wx.openOfficialAccountArticle) {
							wx.openOfficialAccountArticle({
								url: item.source_link, // 此处填写公众号文章连接
							})
						}
					}
				}
			},
			// 是否为外部公众号链接
			ifOfficialAccountLink(item) {
				return parseInt(item.in_house) === 0
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
