<!-- tab4-发现 -->
<template>
	<view class="bbs-rec">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'left': '25rpx', 'right': '25rpx'}">

			<!-- 帖子列表 -->
			<view class="bbs-rec-post">
				<view v-for="(item,index) in dataList" :key="index">
					<bbs-post-card v-if="item.post_type == 3" :postData="item" :index="index"
					@clickMore="clickMore" @click.native="toPostDetail(item.id, index)" @checkoutLike="checkoutLike"></bbs-post-card>
				
					<common-item-card v-else :index="index" :cardItem="item"
					@clickMore="clickMore" @click.native="toCardDetail(item, index)" @checkoutLike="checkoutLike"
					:showComment="true" :showLeft="true"></common-item-card>
				</view>
				
			</view>
		</z-paging>
		
		<!-- 举报面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" type="0"
		@backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	import BbsPostCard from "@/components/bbs/BbsPostCard.vue"
	import { recArticle, commonCardNew } from '@/network/api_guide.js'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	import CommonItemCard from '@/components/common/CommonItemCard.vue'
	const hostSDKVersion = uni.getStorageSync('hostSDKVersion')
	import { compareVersion } from '@/tools/about_wx.js'
	export default {
		components: {
			BbsPostCard,
			DeleteAndComplaint,
			CommonItemCard
		},
		data() {
			return {
				dataList: [],
				contentId: '',
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				// this.getRecPostList(pageNo, pageSize).then(res => {
				// 	this.$refs.paging.complete(res);
				// })
				this.getCommonCardNew(pageNo, pageSize).then(res => {
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
			// 获取列表数据（新版）
			getCommonCardNew(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					commonCardNew({
						'post_types': ['1', '2', '3', '4', '5', '6', '7'],
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
						console.log('commonCardNew err: ', err)
					})
				})
			},
			toPostDetail(id, index) {
				uni.navigateTo({
					url: `/page_bbs/bbsPostDetail/bbsPostDetail?id=${id}&postIndex=${index}`
				});
			},
			// 去详情
			toCardDetail(item, index) {
				switch (item.post_type){
					case 1:
						// 资讯
						this.toGuideDetail(item)
						break;
					case 2:
					case 4:
					case 5:
					case 6:
						// 经验|问答|资料|活动
						this.toQaDetail(item)
						break;
					default:
						break;
				}
			},
			// 跳转至资讯详情
			toGuideDetail(item) {
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
			// 跳转至问答详情
			toQaDetail(item) {
				uni.navigateTo({
					url: `/page_qa/questionDetail/questionDetail?id=${item.id}`
				})
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
