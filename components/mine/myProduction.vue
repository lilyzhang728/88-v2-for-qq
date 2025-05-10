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
				<view class="my-production-list-count">{{dataList && dataList.length}}篇内容</view>
				<view class="my-production-list-content">
					<!-- 我的动态 -->
					<view class="bbs" v-if="active === 0">
						<bbs-post-card v-for="(item,index) in dataList" :key="index" :postData="item" :index="index"
						@click.native="toPostDetail(item.id)" @checkoutLike="checkoutLike"
						@clickMore="clickMore"></bbs-post-card>
					</view>
					
					<!-- 我的问答|攻略 -->
					<view class="qa" v-if="active === 1">
						<!-- <my-question-card v-for="(item,index) in dataList" :key="index" :item="item" 
						@toastMsg="toastMsg" @checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
						@clickMore="clickMore" from="mine"></my-question-card> -->
						
						<common-item-card v-for="(item, index) in dataList" :key="index" :index="index"
						:cardItem="item" @clickMore="clickMore"  @checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
						:showStar="true" :showLeft="true" @click.native="toCardDetail(item, index)"></common-item-card>
					</view>
					
					<!-- 我的收藏 -->
					<view class="collect" v-if="active === 2">
						<view class="collect-item" v-for="(item,index) in dataList" :key="index">
							<!-- 资讯 -->
							<!-- <news-item-card v-if="item.post_type === 2" :newsItem="item" :index="index"
							@checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect" @clickMore="clickMoreOthers"></news-item-card> -->
							<!-- 问答 -->
							<!-- <my-question-card v-if="item.post_type === 4" :item="item" :index="index" 
							@toastMsg="toastMsg" @checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
							@clickMoreOthers="clickMoreOthers"></my-question-card> -->
							
							<common-item-card :index="index"
							:cardItem="item" @clickMore="clickMore" @click.native="toCollectDetail(item, index)"
							@checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"
							:showStar="true" :showLeft="true"></common-item-card>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
		
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
	import Toast from '@/wxcomponents/vant/toast/toast'
	import BbsPostCard from "@/components/bbs/BbsPostCard.vue"
	import myQuestionCard from './myQuestionCard.vue'
	import NewsItemCard from '@/components/news/NewsItemCard.vue'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	import CommonItemCard from '@/components/common/CommonItemCard.vue'
	const hostSDKVersion = uni.getStorageSync('hostSDKVersion')
	import { compareVersion } from '@/tools/about_wx.js'
	export default {
		components: {
			BbsPostCard,
			myQuestionCard,
			NewsItemCard,
			DeleteAndComplaint,
			CommonItemCard
		},
		data() {
			return {
				dataList: [],
				active: 0,
				btnImgList: [{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/iconMyPost.png',
					name: '动态'
				},{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/iconMyQa.png',
					name: '提问'
				},{
					url: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/index/iconMyCollection.png',
					name: '收藏'
				}],
				postTypeVal: article_type_key_value_map,
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
				if(this.active > 1) {
					this.getMyCollectionList(pageNo, pageSize).then(res => {
						// this.$refs.paging.complete(res);
						let noMore = !res.length
						this.$refs.paging.completeByNoMore(res, noMore);
					})
				} else {
					this.getMyProductionList(pageNo, pageSize).then(res => {
						// this.$refs.paging.complete(res);
						let noMore = !res.length
						this.$refs.paging.completeByNoMore(res, noMore);
					})
				}
				
			},
			// 我的提问、动态
			getMyProductionList(pageNo, pageSize) {
				//参数：资讯1，提问4，动态3（20250404 现在没有个人发布的资讯了，所以不用查这个类型）
				const type_map = [3, 4]
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
			},
			// 去问答/攻略详情
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
			// 跳我的收藏详情
			toCollectDetail(item, index) {
				if(item.in_house) {
					// 1-内部链接: 问答|攻略
					this.toCardDetail(item)
				} else {
					// 0-外部链接
					this.toWXLink(item)
				}
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
