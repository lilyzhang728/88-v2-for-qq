<!-- 攻略详情页 -->
<template>
	<view class="guide-detail" :style="{backgroundImage: 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)',backgroundSize: '100%',backgroundColor: '#fff',backgroundRepeat: 'no-repeat'}">
		<back-topbar title="攻略详情" functionName="reloadList"></back-topbar>
		<z-paging ref="paging" :paging-style="{'top': (customBar) + 'px', 'bottom': pagingBottom, paddingLeft: '25rpx', paddingRight: '25rpx'}">
			<view @longpress="handleLongpress">
				<!-- 基本信息 -->
				<guide-item-card  hideBorder="true" :guideItem="guideData" :index="cardIndex" :forbiddenClick="true" :tabIndex="tabIndex"
				@checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect"></guide-item-card>
				
				<!-- 材料 -->
				<view class="guide-detail-material" v-if="guideData.body.references.length">
					<view class="guide-detail-material-title">材料</view>
					<view class="guide-detail-material-content">
						<view class="guide-detail-material-item" v-for="(item, index) in guideData.body.references" :key="index">
							<text class="guide-detail-material-item-index">{{index+1}}</text>
							{{item}}</view>
					</view>
				</view>
				
				<!-- 步骤 -->
				<guide-detail-step v-for="(item, index) in guideData.body.steps" :key="index" :index="index" :stepData="item"></guide-detail-step>
				
				<!-- 小贴士 -->
				<view class="guide-detail-tip" v-if="guideData.body.tips">
					<view class="guide-detail-tip-title">
						<img class="guide-detail-tip-title-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/tipIcon.png" alt="">
						小贴士</view>
					<view class="guide-detail-tip-content">{{guideData.body.tips}}</view>
				</view>
			</view>
		</z-paging>
		<!-- 草稿箱里的攻略并排显示2个按钮：发布 | 编辑 -->
		<view class="guide-detail-btn-box" v-if="showEditBtn && inDraft">
			<!-- 发布（只有在草稿箱里的攻略详情才能直接发布） -->
			<van-button @tap="handleEdit" block icon="edit" class="guide-detail-btn-wrap guide-detail-btn-wrap-plain" custom-class="guide-detail-btn">编辑</van-button>
			<van-button @tap="handlePublish" block icon="guide-o" class="guide-detail-btn-wrap" custom-class="guide-detail-btn">发布</van-button>
		</view>
		<!-- 我的创作跳转过来，并且不在草稿箱里时，只显示”编辑“（因为已经是发布过的了） -->
		<view class="guide-detail-btn-box guide-detail-btn-box-single" v-if="showEditBtn && !inDraft">
			<van-button @tap="handleEdit" block icon="edit" class="guide-detail-btn-wrap" custom-class="guide-detail-btn">编辑</van-button>
		</view>
		
		<!-- toast -->
		<van-toast id="van-toast" />
		
		<!-- 举报面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" type="0"
		@backRefresh="backRefresh"></delete-and-complaint>
	</view>
</template>

<script>
	import GuideItemCard from '@/components/guide/GuideItemCard.vue'
	import GuideDetailStep from '@/page_guide/components/GuideDetailStep.vue'
	import BackTopbar from '@/components/common/BackTopbar.vue'
	import { guideDetail, editGuide, likeGuide, disLikeGuide, collectGuide, unCollectGuide } from '@/network/api_guide.js'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	export default {
		components: {
			GuideItemCard,
			GuideDetailStep,
			BackTopbar,
			DeleteAndComplaint
		},
		data() {
			return {
				showEditBtn: true,			//是否显示编辑按钮（发现、我的收藏：不显示btn；我的创作：显示btn）
				inDraft: false,				//是否是草稿（未发布）
				customBar: 0,
				id: '',
				guideData: {
					author: {
						avatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',		//默认头像
						name: ''
					},
					body: {
						references: [],
						steps: [],
						tips: ''
					},
					collectors_count: 0,
					likers_count: 0,
					title: "",
					views: 0,
					status: 0,		//0:未发布  1：已发布
					id: '',			//guideId
					cardIndex: 0,	//用于回显封面
					is_like: false,
					is_collect: false
				},
				tabIndex: 0,	//跳转前card所在的tab:0-发现，1-我的收藏，2-我的创作
				contentId: '',		// 传给长按面板的内容id （帖子/评论）
			}
		},
		computed: {
			pagingBottom() {
				return this.showEditBtn ? '66px' : '0px'
			}
		},
		onLoad(option) {
			this.showEditBtn = JSON.parse(option.showEditBtn)
			this.inDraft = JSON.parse(option.inDraft)
			this.id = option.id
			this.cardIndex = Number(option.cardIndex)
			this.tabIndex = Number(option.tabIndex)
		},
		onShow() {
			let that = this
			uni.getSystemInfo({
				success: (e) => {
					// #ifdef MP-WEIXIN
					this.statusBar = e.statusBarHeight
					this.windowHeight = e.windowHeight
					// @ts-ignore
					const custom = wx.getMenuButtonBoundingClientRect()
					this.customBar = custom.bottom + custom.top - e.statusBarHeight
					// #endif
				}
			})
			this.getGuideDetail()
		},
		methods: {
			//获取攻略详情
			getGuideDetail() {
				guideDetail(this.id).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.guideData = res.data
					} else {
						//接口返回失败，返回上一页
						uni.navigateBack({
						    success: () => {
						         let page = getCurrentPages().pop();//跳转页面成功之后
						         if (page) {
									 page.$vm.active = 2
						             page.$vm.$refs.swiperItem[2].$refs.paging.reload()
						         } 
						    },
						})
					}
				}, err => {
					console.log('guideDetail: ', err)
				})
			},
			handleEdit() {
				// 跳转编辑页面，guideId为当前攻略id，用于在编辑页回显数据
				uni.navigateTo({
					url: `/page_guide/guideEdit/guideEdit?guideId=${this.guideData.id}&active=${this.tabIndex}$status=${this.guideData.status}`
				});
			},
			//发布
			handlePublish() {
				editGuide({
					'title': this.guideData.title,
					'body': this.guideData.body,
					'post_type': 1,
					'id': this.guideData.id,
					'status': 1
				}).then(res => {
					if(res.code === 0) {
						//发布成功，回到列表页，并刷新列表
						Toast('发布成功！')
						uni.navigateBack({
						    success: () => {
						         let page = getCurrentPages().pop();//跳转页面成功之后
						         if (page) {
									 page.$vm.active = 2
						             page.$vm.$refs.swiperItem[2].$refs.paging.reload()
						         } 
						    },
						})
					} else {
						Toast('发布失败')
					}
				}, err => {
					Toast('发布失败')
					console.log('addGuide: ', err)
				})
			},
			//切换like状态
			checkoutLike(index, status) {
				this.guideData.is_like = status
				if(status) {
					this.guideData.likers_count++
				} else {
					this.guideData.likers_count--
				}
			},
			//切换collect状态
			checkoutCollect(index, status) {
				this.guideData.is_collect = status
				if(status) {
					this.guideData.collectors_count++
				} else {
					this.guideData.collectors_count--
				}
			},
			// （帖子）长按，弹起面板
			handleLongpress() {
				this.contentId = this.id
				this.$refs.deleteAndComplaint.handleLongpress()
			},
			// 删除成功，返回上一页并刷新
			backRefresh() {
				uni.navigateBack({
				    success: () => {
				         let page = getCurrentPages().pop();//跳转页面成功之后
				         if (page) {
							 page.$vm.active = 1
				             page.$vm.$refs.guide.$refs.paging.reload()
				         } 
				    },
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.guide-detail {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		padding: 0 25rpx;
		.guide-detail-material {
			padding: 20rpx 0 30rpx 0;
			margin-top: 33rpx;
			border-radius: 8rpx;
			border: 1rpx solid #E2E2E2;
			.guide-detail-material-title {
				display: inline-block;
				font-weight: bold;
				font-size: 28rpx;
				color: #FFFFFF;
				line-height: 40rpx;
				padding: 7rpx 30rpx;
				background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
				border-top-right-radius: 30%;  
			}
			.guide-detail-material-content {
				margin: 0 30rpx;
				.guide-detail-material-item {
					margin-top: 20rpx;
					font-size: 28rpx;
					color: #000;
					line-height: 40rpx;
					display: flex;
					align-items: center;
					.guide-detail-material-item-index {	
						font-size: 28rpx;
						color: rgba(0,0,0,0.3);
						line-height: 32rpx;
						margin-right: 12rpx;
						width: 32rpx;
					}
				}
			}
		}
		.guide-detail-tip {
			margin: 40rpx 0;
			.guide-detail-tip-title {
				font-weight: 600;
				color: rgba(0,0,0,0.8);
				line-height: 41rpx;
				font-size: 28rpx;
				display: flex;
				align-items: center;
				margin-bottom: 10rpx;
				.guide-detail-tip-title-icon {
					height: 28rpx;
					width: 28rpx;
					margin-right: 10rpx;
				}
			}
			.guide-detail-tip-content {
				color: rgba(0,0,0,0.4);
				line-height: 41rpx;
				font-size: 26rpx;
			}
		}
		.guide-detail-btn-box {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			box-shadow: 0rpx -1rpx 13rpx 0rpx rgba(0,0,0,0.1);
			padding: 11px 14px;   //因为z-paging只能设置px,所以这里都换算成px， button的height固定44px
			display: flex;
			.guide-detail-btn-wrap {
				width: 50%;
				margin-right: 20rpx;
				&:last-child {
					margin-right: 0;
				}
				/deep/ .guide-detail-btn {		
					font-size: 32rpx;
					font-weight: 600;
					color: #FFFFFF;
					line-height: 45rpx;
					padding: 18rpx 0;
					background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
					border-radius: 10rpx;
				}
			}
			.guide-detail-btn-wrap-plain {
				/deep/ .guide-detail-btn {
					background: #fff;
					border: 2rpx solid #50D2B7;
					color: #35C8A7;
				}
			}
		}
		.guide-detail-btn-box-single {
			.guide-detail-btn-wrap {
				width: 100%;
			}
		}
	}
</style>
