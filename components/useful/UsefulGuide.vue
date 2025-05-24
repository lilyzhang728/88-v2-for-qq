<!-- 资讯 -->
<template>
	<view class="useful-guide">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'left': '25rpx', 'right': '25rpx'}">
			<view class="guide-list">
				<!-- <guide-item-card v-for="(item, index) in dataList" :key="index" :index="index"
				:guideItem="item" :tabIndex="tabIndex" @clickMore="clickMore"
				@checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
				></guide-item-card> -->
				<common-item-card v-for="(item, index) in dataList" :key="index" :index="index"
				:cardItem="item" @clickMore="clickMore" @click.native="toCardDetail(item, index)"
				@checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
				:showStar="true" :showLeft="true"></common-item-card>
			</view>
		</z-paging>
		
		<!-- 更多面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" :type="actionType"
		@backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	import GuideItemCard from '@/components/guide/GuideItemCard.vue'
	import { recArticle, commonCardNew } from '@/network/api_guide.js'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	import CommonItemCard from '@/components/common/CommonItemCard.vue'
	const hostSDKVersion = uni.getStorageSync('hostSDKVersion')
	import { compareVersion } from '@/tools/about_wx.js'
	export default {
		components: {
			GuideItemCard,
			DeleteAndComplaint,
			CommonItemCard
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
				// this.getRecGuideList(pageNo, pageSize).then(res => {
				// 	this.$refs.paging.complete(res);
				// })
				this.getCommonCardNew(pageNo, pageSize).then(res => {
					// this.$refs.paging.complete(res);
					let noMore = !res.length
					this.$refs.paging.completeByNoMore(res, noMore);
					this.$emit('loaded')
				})
			},
			//请求攻略列表-发现
			getRecGuideList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					// 0-推荐, 1-考研, 2-实习工作, 3-校园指南 4-成绩学术 5-竞赛证书 6-考公/编 7-其他
					// 临时加的逻辑：因为改成只展示：0-推荐, 1-考研, 2-实习工作,  6-考公/编，为了保证上送参数field正确加的映射数组
					const FIELD_MAP = [0, 1, 2, 6]
					let field = FIELD_MAP[Number(this.subActive)]
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
			// 获取列表数据（新版）
			getCommonCardNew(pageNo, pageSize) {
				// 推荐：['1', '2', '3', '4', '5', '6', '7'], 考研：['1'], 实习工作：['2'],  考公/编：['6']
				const FIELD_MAP = [['1', '2', '3', '4', '5', '6', '7'], ['1'], ['2'], ['6']]
				let field = FIELD_MAP[Number(this.subActive)]
				return new Promise((resolve, reject) => {
					commonCardNew({
						'post_types': ['1'],
						'per_page': pageSize,
						'page': pageNo,
						'fields': field
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
			},
			// 去资讯详情
			toCardDetail(item, index) {
				if(this.ifOfficialAccountLink(item)) {
					// 跳外部公众号文章链接
					if(compareVersion(hostSDKVersion, '3.4.8') < 0) {
						// 基础库低于3.4.8，无法打开外链公众号
						wx.showModal({
							title: '提示',
							content: '该内容为微信公众号文章，可从“勾重点”微信小程序打开。。',
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
		}
	}
</script>

<style>
</style>
