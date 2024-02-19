<!-- 我的 -->
<template>
	<view class="my-production">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': '45rpx', 'left': '25rpx', 'right': '25rpx'}">
			<view class="my-production-btn">
				<view @click="clickTypeBtn(index)" class="my-production-btn-item" v-for="(item, index) in btnImgList" :key="index">
					<img :src="item.url" alt="" class="my-production-btn-img">
					<text class="my-production-btn-name" :class="{'my-production-btn-name-active': index === active}">{{item.name}}</text>
				</view>
			</view>
			<view class="my-production-list">
				<view class="my-production-list-count">{{dataList.length}}篇内容</view>
				<view class="my-production-list-content">
					<!-- 我的动态 -->
					<view class="bbs" v-if="active === 0">
						<bbs-post-card v-for="(item,index) in dataList" :key="index" :postData="item" :index="index"
						@click.native="toPostDetail(item.id)" @checkoutLike="checkoutLike"
						@clickMore="clickMore"></bbs-post-card>
					</view>
					
					<!-- 我的攻略 -->
					<view class="guide" v-if="active === 1">
						<my-guide-card v-for="(item, index) in dataList" :key="index" :index="index"
						:guideItem="item" @openOptionSheet="openOptionSheet" @clickMore="clickMore"></my-guide-card>
					</view>
					
					<!-- 我的问答 -->
					<view class="qa" v-if="active === 2">
						<my-question-card v-for="(item,index) in dataList" :key="index" :item="item" 
						@toastMsg="toastMsg" @checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
						@clickMore="clickMore" from="mine"></my-question-card>
					</view>
					
					<!-- 我的收藏 -->
					<view class="collect" v-if="active === 3">
						<view class="collect-item" v-for="(item,index) in dataList" :key="index">
							<!-- 攻略 -->
							<guide-item-card v-if="item.post_type === 1" :index="index"
							:guideItem="item" tabIndex="1" @openOptionSheet="openOptionSheet" 
							@checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
							from="mine"></guide-item-card>
							<!-- 资讯 -->
							<news-item-card v-if="item.post_type === 2" :newsItem="item" :index="index"
							@checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect" @clickMore="clickMoreOthers"></news-item-card>
							<!-- 问答 -->
							<my-question-card v-if="item.post_type === 4" :item="item" :index="index" 
							@toastMsg="toastMsg" @checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
							@clickMoreOthers="clickMoreOthers"></my-question-card>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
		
		<!-- 选项面板:编辑/删除 -->
		<van-action-sheet
			:show="showOptionSheet"
			:actions="actions"
			@close.native="closeOptionSheet"
			@select.native="selectOptionSheet"
			@cancel.native="closeOptionSheet"
			cancel-text="取消"
		/>
		
		<!-- toast提示 -->
		<van-toast id="van-toast" />
		
		<!-- 更多面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" :type="actionType"
		@backRefresh="backRefresh" :author="author"></delete-and-complaint>
	</view>
</template>

<script>
	import { myCollectionList, myProductionList } from '@/network/api_index.js'
	import { article_type_key_value_map } from '@/tools/transform_data.js'
	import myGuideCard from './myGuideCard.vue'
	import { deleteGuide } from '@/network/api_guide.js'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import BbsPostCard from "@/components/bbs/BbsPostCard.vue"
	import myQuestionCard from './myQuestionCard.vue'
	import NewsItemCard from '@/components/news/NewsItemCard.vue'
	import GuideItemCard from '@/components/guide/GuideItemCard.vue'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	export default {
		components: {
			myGuideCard,
			BbsPostCard,
			myQuestionCard,
			NewsItemCard,
			GuideItemCard,
			DeleteAndComplaint
		},
		data() {
			return {
				dataList: [],
				active: 0,
				btnImgList: [{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/iconMyPost.png',
					name: '动态'
				},{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/iconMyGuide.png',
					name: '攻略'
				},{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/iconMyQa.png',
					name: '回答'
				},{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/iconMyCollection.png',
					name: '收藏'
				}],
				postTypeVal: article_type_key_value_map,
				showOptionSheet: false,		//是否展开选项面板（编辑、删除）
				showOptionSheet: false,		//是否展开选项面板（编辑、删除）
				actions: [{
					name: '编辑',
					value: 0
				},
				{
					name: '删除',
					value: 1
				}],
				cardIndex: 0,		//当前长按的card的index
				openGuideId: 0,		//打开选项面板的攻略id，删除攻略用
				curStatus: 0,		//打开选项面板的攻略status,跳转编辑页用，能及时显示按钮（不用等接口返回再切换1个/2个按钮
				contentId: '',		// 传给长按面板的内容id （帖子/评论）
				actionType: 0,		// 长按面板内容类型：0：帖子，1：评论，2：话题
				author: 0,			// 0：自己 1：别人的
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				if(this.active > 2) {
					this.getMyCollectionList(pageNo, pageSize).then(res => {
						this.$refs.paging.complete(res);
					})
				} else {
					this.getMyProductionList(pageNo, pageSize).then(res => {
						this.$refs.paging.complete(res);
					})
				}
				
			},
			// 我的攻略、回答、动态
			getMyProductionList(pageNo, pageSize) {
				//参数：干货1，问答4，动态3
				const type_map = [3, 1, 4]
				return new Promise((resolve, reject) => {
					myProductionList({
						'post_type': type_map[this.active],
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
						console.log('myProductionList: ', err)
					})
				})
			},
			// 我的收藏
			getMyCollectionList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					myCollectionList({
						'post_type': -1,
						'per_page': pageSize,
						'page': pageNo
					}).then(res => {
						//post_type  1:干货-攻略  2: 干货-资讯  3：动态  4：问答  
						if(res.code === 0 && Object.keys(res.data).length) {
							resolve(res.data.items)
						} else {
							resolve([])
						}
					}, err => {
						resolve([])
						console.log('myCollectionList: ', err)
					})
				})
				
			},
			clickTypeBtn(index) {
				this.active = index
				this.$refs.paging.reload()
			},
			// 弹起选项面板, tabIndex为swiper的Index，index为card的index, status：0当前攻略未发布，1已发布
			openOptionSheet(cardIndex, guideId, status) {
				this.cardIndex = cardIndex
				this.showOptionSheet = true
				this.openGuideId = guideId
				this.curStatus = status
			},
			//选择选项面板
			selectOptionSheet(e) {
				if(e.detail.value) {
					// 删除
					deleteGuide(this.openGuideId).then(res => {
						if(res.code === 0) {
							//toast提示：删除成功，从列表里删除
							Toast('删除成功')
							this.dataList.splice(this.cardIndex, 1)
						} else {
							Toast('删除失败，请重试~')
						}
					}, err => {
						Toast('删除失败')
						console.log('deleteRequest: ', err)
					})
				} else {
					// 编辑，去编辑页
					let guideId = this.dataList[this.cardIndex].id
					uni.navigateTo({
						url: `/page_guide/guideEdit/guideEdit?guideId=${guideId}&active=${this.active}$status=${this.curStatus}`
					});
				}
			},
			//关闭选项面板
			closeOptionSheet(e) {
				this.showOptionSheet = false
			},
			// 帖子详情
			toPostDetail(id) {
				uni.navigateTo({
					url: `/page_bbs/bbsPostDetail/bbsPostDetail?id=${id}&from=mine`
				});
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
			//切换collect状态
			checkoutCollect(index, status) {
				this.dataList[index].is_collect = status
				if(status) {
					this.dataList[index].collectors_count++
				} else {
					this.dataList[index].collectors_count--
				}
			},
			toastMsg(type) {
				if(type) {
					Toast('邀请成功！')
				} else {
					Toast('邀请失败')
				}
			},
			// 点更多，弹出面板
			// 参数： id, type: 0：帖子，1：评论，2：话题
			clickMore(id, type) {
				console.log(id, type)
				this.author = 0
				this.contentId = id
				this.actionType = type
				this.$refs.deleteAndComplaint.handleLongpress()
			},
			clickMoreOthers(id, type) {
				this.author = 1
				this.contentId = id
				this.actionType = type
				this.$refs.deleteAndComplaint.handleLongpress()
			},
			// 删除成功，刷新
			backRefresh() {
				this.$refs.paging.reload()
			}
		},
	}
</script>

<style lang="less" scoped>
	.my-production {
		.my-production-btn {
			display: flex;
			justify-content: space-between;
			padding: 0 25rpx;
			.my-production-btn-item {
				display: flex;
				flex-direction: column;
				.my-production-btn-img {
					height: 55rpx;
					width: 55rpx;
				}
				.my-production-btn-name {
					margin-top: 19rpx;
					font-size: 28rpx;
					color: #000000;
					line-height: 40rpx;
				}
				.my-production-btn-name-active {
					font-weight: bold;
				}
			}
		}
		.my-production-list {
			margin-top: 50rpx;
			.my-production-list-count {
				font-size: 28rpx;
				color: rgba(0,0,0,0.6);
				line-height: 40rpx;
			}
			.my-production-list-content {
				margin-top: 5rpx;
				.my-production-list-item {
					margin-top: 25rpx;
					padding: 33rpx 30rpx 28rpx 30rpx;
					background: #FFFFFF;
					box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(81,211,184,0.15);
					border-radius: 20rpx;
					.my-production-list-item-title {
						font-size: 34rpx;
						font-weight: 600;
						color: #000000;
						line-height: 48rpx;
						display: flex;
						.my-production-list-item-label {
							width: 72rpx;
							height: 45rpx;
							margin-right: 10rpx;
						}
						.my-production-list-item-text {
							flex: 1;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							word-break: break-all;
						}
					}
					.my-production-list-item-body {
						font-size: 28rpx;
						color: rgba(0,0,0,0.7);
						line-height: 45rpx;
						height: 135rpx;
						word-break: break-all;
						overflow: hidden;
						display: -webkit-box;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
					}
					.my-production-list-item-time {
						margin-top: 21rpx;
						font-size: 24rpx;
						color: rgba(0,0,0,0.3);
						line-height: 33rpx;
					}
					.my-production-list-item-footer {
						margin-top: 29rpx;
						font-size: 24rpx;
						font-weight: 500;
						color: rgba(0,0,0,0.5);
						line-height: 33rpx;
						display: flex;
						.my-production-list-item-footer-item {
							margin-right: 40rpx;
							&:last-child {
								margin-right: 0;
							}
						}
					}
				}
			}
		}
	}
</style>
