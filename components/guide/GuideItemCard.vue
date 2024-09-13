<!-- 攻略列表一项（左边带图片） -->
<!-- 此组件被攻略列表页、攻略详情页、我的页面、攻略搜索结果页 复用 -->
<template>
	<view class="guide-item-card" :class="{'guide-item-card-noBorder': hideBorder, 'guide-item-card-mine': from==='mine'}" 
	@click.native="toGuideDetail" @longpress="handleLongpress" v-if="guideItem.status">
		<view class="guide-item-card-left">
			<view class="guide-item-card-left-img-box">
				<van-image width="183rpx"
				  height="243rpx"
				  fit="contain"
				  :src="guideItem.body.cover_url"
				/>
				<view class="guide-item-card-left-bookname">
					<view class="guide-item-card-left-bookname-text">{{bookname}}</view>
				</view>
			</view>
		</view>
		<view class="guide-item-card-right">
			<view class="guide-item-card-right-title-box">
				<view class="guide-item-card-right-title" :class="{'guide-item-card-right-title-whole': showWholeTitle}">{{guideItem.title}}</view>
				<van-icon size="24rpx" color="#808080" name="arrow-down" @click.native.stop="clickMore($event)" />
			</view>
			<view class="guide-item-card-right-description" :class="{'guide-item-card-right-description-whole': showWholeTitle}" v-if="!ifOfficialAccountLink && guideItem.body.summary">{{guideItem.body.summary}}</view>
			<view class="guide-item-card-right-books">
				<view class="guide-item-card-right-books-left">
					<img src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/matetialIcon.png" alt="" class="guide-item-card-right-book-item-icon" v-if="!ifOfficialAccountLink && guideItem.body.references">
					<text class="guide-item-card-right-book-item" v-if="!ifOfficialAccountLink && guideItem.body.references">教辅*{{guideItem.body.references.length}}</text>
					<img src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/stepIcon.png" alt="" class="guide-item-card-right-book-item-icon" v-if="!ifOfficialAccountLink && guideItem.body.steps">
					<text class="guide-item-card-right-book-item" v-if="!ifOfficialAccountLink && guideItem.body.steps">章节*{{guideItem.body.steps.length}}</text>
				</view>
				<view class="guide-item-card-right-books-right">
					<!-- <text class="guide-item-card-right-books-right-time" v-if="!isMine && guideItem.timestamp">{{timestamp}}</text> -->
					<text class="guide-item-card-right-books-right-status" v-if="isMine && (guideItem.status === 0 || guideItem.status === 1)">{{guideItem.status ? '' : '未发布'}}</text>
				</view>
				
			</view>
			<!-- 发现、我的收藏显示信息区，我的创作显示但不能点击 -->
			<view class="guide-item-card-infos" v-if="!hideAuthorLine">
				<view class="guide-item-card-infos-left"  @click.native.stop="toHomepage($event)">
					<img :src="guideItem.author.avatar" class="guide-item-card-user-img" alt="" >
					<text class="guide-item-card-user-name">{{ifOfficialAccountLink ? guideItem.source : guideItem.author.name}}</text>
				</view>
				<view class="guide-item-card-right-icons">
					<img v-show="showEditBtn || guideItem.is_like" @click.native.stop="clickLike($event, false)"  src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/likeIcon.png" class="guide-item-card-right-icon-img" alt="">
					<!-- <van-icon v-else name="like-o" color="#7F7F7F" @click.native.stop="clickLike($event, true)" /> -->
					<img v-show="!showEditBtn && !guideItem.is_like" @click.native.stop="clickLike($event, true)"  src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/unLike.png" class="guide-item-card-right-icon-img" alt="">
					<view class="guide-item-card-right-icon-num">{{handleTransform(guideItem.likers_count)}}</view>
					<img v-show="showEditBtn || guideItem.is_collect" @click.native.stop="clickStar($event, false)" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/starIcon.png" class="guide-item-card-right-icon-img" alt="">
					<!-- <van-icon v-else name="star-o" color="#7F7F7F" @click.native.stop="clickStar($event, true)" /> -->
					<img v-show="!showEditBtn && !guideItem.is_collect"  @click.native.stop="clickStar($event, true)" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/unStar.png" class="guide-item-card-right-icon-img" alt="">
					<view class="guide-item-card-right-icon-num guide-item-card-right-icon-num-last">{{handleTransform(guideItem.collectors_count)}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { likeGuide, disLikeGuide, collectGuide, unCollectGuide } from '@/network/api_guide.js'
	import { transformMaxNum, transformTime } from '@/tools/transform_time.js'
	const hostSDKVersion = uni.getStorageSync('hostSDKVersion')
	import { compareVersion } from '@/tools/about_wx.js'
	export default {
		props: {
			//card的index
			index: {
				type: Number,
				required: true,
				default: 0
			},
			guideItem: {
				type: Object,
				required: true,
				default: {
					author: {
						avatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',		//默认头像
						name: '',
						id: ''
					},
					body: {
						cover_url: '',
						references: [],
						steps: []
					},
					collectors_count: 0,
					likers_count: 0,
					title: "",
					in_house: 1,	// 是否为外部链接
					views: 0,
					status: 0,		//0:未发布  1：已发布
					id: '',
					is_collect: false,
					is_like: false
				}
			},
			// 是否隐藏border和背景色
			hideBorder: {
				type: Boolean,
				required: false,
				default: false
			},
			//是否禁止点击（详情页禁止点击）
			forbiddenClick: {
				type: Boolean,
				required: false,
				default: false
			},
			// 是哪个页面引用的，目前只有个人主页传了这个参数：from=homepage
			from: {
				type: String,
				required: false,
				default: ''
			},
			// 是否显示完整标题（详情页显示完整标题）
			showWholeTitle: {
				type: Boolean,
				required: false,
				default: false
			}
		},
		computed: {
			// 跳转详情页后，是否显示底部btn（编辑|发布）：只有我创作的才显示
			showEditBtn() {
				return this.isMine
			},
			bookname() {
				return this.guideItem.title.substr(0, 3) + '···'
			},
			//是否隐藏 作者/点赞/收藏 行， （个人主页需要隐藏）
			hideAuthorLine() {
				return this.from === 'homepage'
			},
			timestamp() {
				return this.guideItem.timestamp ? transformTime(this.guideItem.timestamp) : this.guideItem.timestamp
			},
			// 是否为外部公众号链接
			ifOfficialAccountLink() {
				return parseInt(this.guideItem.in_house) === 0
			},
			// 是否是我创作的帖子
			isMine() {
				const userId = uni.getStorageSync('userId')
				return userId === this.guideItem.author.id
			}
		},
		methods: {
			// 点赞、评论 大数单位转化
			handleTransform(val) {
				return transformMaxNum(val)
			},
			clickLike(e, status) {
				//防止冒泡
				e.preventDefault()
				//我的创作页，点击不调接口（纯回显）
				if(this.showEditBtn) {
					return
				}
				if(status) {
					//unlike ——> like
					//改变icon状态
					this.$emit('checkoutLike', this.index, status)
					likeGuide(this.guideItem.id).then(res => {
						if(res.code === 0) {
							//点赞成功
						}
					}, err => {
						console.log('likeGuide: ', err)
					})
				} else {
					//like ——> unlike
					//改变icon状态
					this.$emit('checkoutLike', this.index, status)
					disLikeGuide(this.guideItem.id).then(res => {
						if(res.code === 0) {
							//取消点赞成功
						}
					}, err => {
						console.log('disLikeGuide: ', err)
					})
				}
			},
			// 收藏/取消收藏
			clickStar(e, status) {
				//防止冒泡
				e.preventDefault()
				//我的创作页，点击不调接口（纯回显）
				if(this.showEditBtn) {
					return
				}
				if(status) {
					//unstar ——> star
					//改变icon状态
					this.$emit('checkoutCollect', this.index, status)
					collectGuide(this.guideItem.id).then(res => {
						if(res.code === 0) {
							//收藏成功
						}
					}, err => {
						console.log('collectGuide: ', err)
					})
				} else {
					//star ——> unstar
					//改变icon状态
					this.$emit('checkoutCollect', this.index, status)
					unCollectGuide(this.guideItem.id).then(res => {
						if(res.code === 0) {
							//取消收藏成功
						}
					}, err => {
						console.log('unCollectGuide: ', err)
					})
				}
				
			},
			//点击事件，跳转攻略详情
			toGuideDetail() {
				if(compareVersion(hostSDKVersion, '3.4.8') < 0) {
					// 基础库低于3.4.8，无法打开外链公众号
					wx.showModal({
						title: '提示',
						content: '当前微信版本过低，请升级到最新微信版本后重试。如在QQ遇到该问题，请使用微信打开。',
						complete(res) {
							// 退出小程序
							if(wx.exitMiniProgram) {
								wx.exitMiniProgram()
							}
						} 
					})
				} else {
					if(!this.forbiddenClick) {
						if(this.ifOfficialAccountLink) {
							// 跳外部公众号文章链接
							if(wx.openOfficialAccountArticle) {
								wx.openOfficialAccountArticle({
									url: this.guideItem.source_link, // 此处填写公众号文章连接
								})
							}
						} else {
							// 跳小程序内部文章
							uni.navigateTo({
								url: `/page_guide/guideDetail/guideDetail?showEditBtn=${this.showEditBtn}&id=${this.guideItem.id}&cardIndex=${this.index}`
							});
						}
					}
				}
			},
			//长按事件，弹起选项面板，只有“我的创作” 能操作 编辑/删除
			handleLongpress() {
				if(!this.forbiddenClick && this.isMine) {
					this.$emit('openOptionSheet', this.index, this.guideItem.id, this.guideItem.status)
				}
			},
			// 点击头像，去个人主页
			toHomepage(e) {
				//防止冒泡
				e.preventDefault()
				uni.navigateTo({
					url: `/page_infos/homepage/homepage?userId=${this.guideItem.author.id}`
				})
			},
			clickMore(e) {
				//防止冒泡
				e.preventDefault()
				this.$emit('clickMore', this.guideItem.id, 0)
			}
		}
	}
</script>

<style lang="less" scoped>
	.guide-item-card {
		display: flex;
		background-color: #fff;
		padding-right: 30rpx;
		box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
		border-radius: 20rpx;
		margin: 20rpx 0 0 0;
		.guide-item-card-left {
			width: 32%;
			padding: 0 24rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			.guide-item-card-left-img-box {
				width: 183rpx;
				height: 243rpx;
				position: relative;
				.guide-item-card-left-bookname {
					width: 38rpx;
					height: 110rpx;
					background: #F1D8B4;
					position: absolute;
					right: 40rpx;
					top: 40rpx;
					writing-mode:vertical-rl;
					font-size: 22rpx;
					padding: 8rpx;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: center;
					.guide-item-card-left-bookname-text {
						overflow: hidden;
						white-space: nowrap;
						text-align: center;
						display: flex;
						flex-direction: column;
						justify-content: center;
						color: rgba(0,0,0,0.5);
						font-weight: bold;
					}
				}
			}
		}
		.guide-item-card-right {
			flex: 1;
			padding-top: 28rpx;
			padding-bottom: 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.guide-item-card-right-title-box {
				display: flex;
				justify-content: space-between;
				align-items: start;
				.guide-item-card-right-title {
					word-break: break-all;
					font-size: 34rpx;
					margin-bottom: 10rpx;
					color: #000;
					line-height: 42rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.guide-item-card-right-title-whole {
					display: block;
				}
			}
			
			.guide-item-card-right-description {
				color: rgba(0,0,0,0.4);
				font-size: 22rpx;
				line-height: 30rpx;
				margin-bottom: 10rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.guide-item-card-right-description-whole {
				display: block;
			}
			.guide-item-card-right-books {
				color: rgba(255, 145, 58, 1);
				font-size: 26rpx;
				line-height: 33rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.guide-item-card-right-book-item-icon {
					height: 24rpx;
					width: 24rpx;
					margin-right: 7rpx;
				}
				.guide-item-card-right-book-item {
					margin-right: 30rpx;
					&:last-child {
						margin-right: 0;
					}
				}
				.guide-item-card-right-books-left {
					flex: 1;
				}
				.guide-item-card-right-books-right {
					width: 150rpx;
					text-align: right;
					.guide-item-card-right-books-right-time {
						color: rgba(0,0,0,0.4);
					}
					.guide-item-card-right-books-right-status {
						color: #000;
					}
				}
			}
			.guide-item-card-infos {
				margin-top: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				line-height: 46rpx;
				.guide-item-card-infos-left {
					display: flex;
					align-items: center;
					.guide-item-card-user-img {
						height: 40rpx;
						width: 40rpx;
						margin-right: 10rpx;
						border-radius: 50%;
					}
					.guide-item-card-user-name {
						font-size: 22rpx;
						color: #000;
						flex: 1;
						height: 40rpx;
						width: 190rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
				.guide-item-card-right-icons {
					display: flex;
					align-items: center;
					.guide-item-card-right-icon-img {
						height: 46rpx;
						width: 46rpx;
					}
					.guide-item-card-right-icon-num {
						width: 40rpx;
						color: #000;
						font-size: 20rpx;
						margin: 0 20rpx 0 10rpx;
					}
					.guide-item-card-right-icon-num-last {
						margin-right: 0;
					}
				}
			}
			
		}
	}
	.guide-item-card-noBorder {
		background-color: transparent;
		box-shadow: none;
	}
	.guide-item-card-mine {
		margin-bottom: 20rpx;
	}
</style>