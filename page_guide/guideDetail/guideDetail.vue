<!-- 攻略详情页 -->
<!-- 待删除？TODO -->
<template>
	<view class="guide-detail" :style="{backgroundImage: 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)',backgroundSize: '100%',backgroundColor: '#fff',backgroundRepeat: 'no-repeat'}">
		<back-topbar title="攻略详情" :isWxShare="isWxShare"></back-topbar>
		<z-paging ref="paging" :paging-style="{'top': (customBar) + 'px', 'bottom': pagingBottom, paddingLeft: '25rpx', paddingRight: '25rpx'}">
			<view @longpress="handleLongpress">
				<!-- 基本信息 -->
				<guide-item-card  hideBorder="true" :guideItem="guideData" :index="cardIndex" :forbiddenClick="true"
				@checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect" :showMoreIcon="from === 'mine'"
				@clickMore="clickMore" :showWholeTitle="true"></guide-item-card>
				
				<!-- 以下为非模板创建的 -->
				<view v-if="isCustomer">
					<view class="guide-detail-customer-body">{{guideData.body.body}}</view>
					<!-- 图片 -->
					<view class="bbs-post-detail-img-box" v-if="guideData.body.urls && guideData.body.urls.length">
						<van-image width="100%" height="100%" fit="contain" :src="pic"
						  class="bbs-post-detail-img-item" v-for="(pic, index) in guideData.body.urls" :key="index"
						  @click.native="previewImg($event, pic)" />
					</view>
				</view>
				
				<!-- 以下为模板创建的 -->
				<view v-else>
					<!-- 教辅材料 -->
					<view class="guide-detail-material" v-if="showReferences">
						<view class="guide-detail-material-title">关键词/教辅</view>
						<view class="guide-detail-material-content">
							<view class="guide-detail-material-item" v-for="(item, index) in referencesList" :key="index">
								<view class="guide-detail-material-item-box" v-if="item">
									<view class="guide-detail-material-item-index">{{index+1}}</view>
									<view class="guide-detail-material-item-text">{{item}}</view>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 步骤 -->
					<view class="guide-detail-step-box">
						<guide-detail-step v-for="(item, index) in guideData.body.steps" :key="index" :index="index" :stepData="item"></guide-detail-step>
					</view>
					
					<!-- 小贴士 -->
					<view class="guide-detail-tip" v-if="guideData.body.tips">
						<view class="guide-detail-tip-title">
							<img class="guide-detail-tip-title-icon" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/tipIcon.png" alt="">
							小贴士</view>
						<view class="guide-detail-tip-content">{{guideData.body.tips}}</view>
					</view>
				</view>
				
			</view>
		</z-paging>
		<!-- 草稿箱里的攻略并排显示2个按钮：发布 | 编辑 -->
		<view class="guide-detail-btn-box" v-if="showEditBtn && inDraft">
			<!-- 发布（只有在草稿箱里的攻略详情才能直接发布） -->
			<!-- <van-button @tap="handleEdit" block icon="edit" class="guide-detail-btn-wrap guide-detail-btn-wrap-plain" custom-class="guide-detail-btn">编辑</van-button> -->
			<van-button @tap="handlePublish" block icon="guide-o" class="guide-detail-btn-wrap" custom-class="guide-detail-btn">发布</van-button>
		</view>
		<!-- 是我创作的，并且不在草稿箱里时，只显示”编辑“（因为已经是发布过的了） -->
		<view class="guide-detail-btn-box guide-detail-btn-box-single" v-if="showEditBtn && !inDraft">
			<!-- <van-button @tap="handleEdit" block icon="edit" class="guide-detail-btn-wrap" custom-class="guide-detail-btn">编辑</van-button> -->
		</view>
		
		<!-- toast -->
		<van-toast id="van-toast" />
		
		<!-- 举报面板 -->
		<delete-and-complaint ref="deleteAndComplaint" :itemId="contentId" type="0"
		@backRefresh="backRefresh" :author="from === 'mine' ? 0 : 1"></delete-and-complaint>
	</view>
</template>

<script>
	import GuideItemCard from '@/components/guide/GuideItemCard.vue'
	import GuideDetailStep from '@/page_guide/components/GuideDetailStep.vue'
	import BackTopbar from '@/components/common/BackTopbar.vue'
	import { guideDetail, editGuide, likeGuide, disLikeGuide, collectGuide, unCollectGuide } from '@/network/api_guide.js'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import DeleteAndComplaint from '@/components/common/DeleteAndComplaint.vue'
	import aboutLogin from '@/mixins/aboutLogin.js'
	export default {
		components: {
			GuideItemCard,
			GuideDetailStep,
			BackTopbar,
			DeleteAndComplaint
		},
		mixins: [aboutLogin],
		data() {
			return {
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
						tips: '',
						type: 0
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
				contentId: '',		// 传给长按面板的内容id （帖子/评论）
				from: '',			// from==='mine',表示从我的页面跳转过来，需要加more-icon
				isWxShare: false,	// 是否在微信分享里打开的，左上角返回替换为首页按钮
			}
		},
		computed: {
			pagingBottom() {
				return this.showEditBtn ? '66px' : '0px'
			},
			showReferences() {
				if(this.guideData && this.guideData.body && this.guideData.body.references && this.guideData.body.references.length) {
					// 正则表达式，匹配非空字符串
					const nonEmptyStringRegex = /\S+/;
								
					// 使用every方法检查数组中的每一项是否都是空字符串
					// 如果数组为空或者所有项都是空字符串，every方法将返回true
					// 否则，只要有一个非空字符串，every方法将返回false
					return !this.guideData.body.references.every(item => !nonEmptyStringRegex.test(item));
				} else {
					return false;
				}
			},
			referencesList() {
				if(this.guideData && this.guideData.body && this.guideData.body.references && this.guideData.body.references.length) {
					return this.guideData.body.references.filter(item => item.trim() !== '')
				} else {
					return [];
				}
			},
			// 是否显示编辑按钮(只有我创作的才会显示)
			showEditBtn() {
				const userId = uni.getStorageSync('userId')
				return userId == this.guideData.author.id
			},
			//是否是草稿（未发布） 是否显示底部“发布”按钮：未发布显示；已发布不显示
			inDraft() {
				return !this.guideData.status
			},
			// 是否为非模板创建的  body.type区分（0-自定义，1-模板）
			isCustomer() {
				return this.guideData.body.type === 0
			}
		},
		onLoad(option) {
			this.customBar = uni.getStorageSync('customBar')
			this.id = option.id
			this.cardIndex = Number(option.cardIndex)
			if(option.from) {
				this.from = option.from
			}
			if(option.scene === 'wxShare') {
				// 是在微信分享里打开的，左上角返回替换为首页按钮
				this.isWxShare = true
				// 获取token信息
				this.login()
			}
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
						         	page.$vm.backRefresh('guide')
						         } 
						    },
						})
					}
				}, err => {
					console.log('guideDetail: ', err)
				})
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
									 // 4个入口：1./userful 2./mine 3./infosCollectList 4./infosLikeList
						         	page.$vm.backRefresh('guide')
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
							 page.$vm.backRefresh('guide')
						 } 
					},
				})
			},
 			clickMore() {
				// 参数： id, type: 0：帖子，1：评论，2：话题
				this.contentId = this.id
				this.$refs.deleteAndComplaint.handleLongpress()
			},
			// 预览图片
			previewImg(e, url) {
				//防止冒泡
				e.preventDefault()
				uni.previewImage({
					current: 0,
					urls: [url]
				});
			},
			onShareAppMessage() {
				// 返回该页面的分享内容
				return {
				  title: `${this.guideData.title}`,
				  path: `/page_guide/guideDetail/guideDetail?id=${this.id}&cardIndex=${this.cardIndex}&scene=wxShare`,
				};
			},
			// onShareTimeline() {
			// 	// 返回该页面的分享到朋友圈的内容
			// 	return {
			// 	  title: `${this.guideData.title}`,
			// 	  path: `/page_guide/guideDetail/guideDetail?id=${this.id}&cardIndex=${this.cardIndex}&scene=wxShare`,
			// 	};
			// },
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
		.guide-detail-customer-body {
			margin-top: 40rpx;
			color: rgba(0, 0, 0, 0.8);
			line-height: 56rpx;
			font-size: 34rpx;
			white-space: pre-line;
		}
		.bbs-post-detail-img-box {
			margin-top: 40rpx;
			display: flex;
			flex-wrap: wrap;
			.bbs-post-detail-img-item {
				flex: 1;
				width: calc((100vw - 40rpx - 50rpx) / 3); 
				min-width: calc((100vw - 40rpx - 50rpx) / 3);
				max-width: calc((100vw - 40rpx - 50rpx) / 3);
				height: calc((100vw - 40rpx - 50rpx) / 3);
				margin-right: 20rpx;
				&:nth-child(3n) {
					margin-right: 0;
				}
			}
		}
		.guide-detail-material {
			padding: 20rpx 0 30rpx 0;
			margin-top: 33rpx;
			border-radius: 8rpx;
			border: 1rpx solid #E2E2E2;
			.guide-detail-material-title {
				display: inline-block;
				font-weight: bold;
				font-size: 32rpx;
				color: #FFFFFF;
				line-height: 40rpx;
				padding: 7rpx 30rpx;
				background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
				border-top-right-radius: 30%;  
			}
			.guide-detail-material-content {
				margin: 0 30rpx;
				margin-top: 20rpx;
				.guide-detail-material-item {
					// margin-top: 20rpx;
					font-size: 34rpx;
					color: #000;
					line-height: 56rpx;
					
					.guide-detail-material-item-box {
						display: flex;
						align-items: top;
						.guide-detail-material-item-index {
							font-size: 28rpx;
							color: rgba(0,0,0,0.3);
							margin-right: 12rpx;
							width: 32rpx;
							vertical-align: top;
						}
						.guide-detail-material-item-text {
							flex: 1;
						}
					}
					
				}
			}
		}
		.guide-detail-step-box {
			margin-bottom: 40rpx;
		}
		.guide-detail-tip {
			margin-bottom: 40rpx;
			.guide-detail-tip-title {
				font-weight: 600;
				color: rgba(0,0,0,0.8);
				line-height: 41rpx;
				font-size: 32rpx;
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
				line-height: 46rpx;
				font-size: 32rpx;
				margin-top: 14rpx;
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
