<!-- 我发布的-攻略item -->
<!-- 此组件被myProduction.vue引用 -->
<template>
	<view class="guide-item-card" @click.native="toGuideDetail" @longpress="handleLongpress">
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
				<view class="guide-item-card-right-title">{{guideItem.title}}</view>
				<van-icon size="24rpx" color="#808080" name="arrow-down" @click.native.stop="clickMore($event)" />
			</view>
			
			<view class="guide-item-card-right-description" v-if="guideItem.body.summary">{{guideItem.body.summary}}</view>
			<view class="guide-item-card-right-books">
				<view class="guide-item-card-right-books-left">
					<img src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/matetialIcon.png" v-if="guideItem.body.references" alt="" class="guide-item-card-right-book-item-icon">
					<text class="guide-item-card-right-book-item" v-if="guideItem.body.references">教辅*{{guideItem.body.references && guideItem.body.references.length}}</text>
					<img src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/stepIcon.png" v-if="guideItem.body.steps" alt="" class="guide-item-card-right-book-item-icon">
					<text class="guide-item-card-right-book-item" v-if="guideItem.body.steps">步骤*{{guideItem.body.steps && guideItem.body.steps.length}}</text>
				</view>
				<view class="guide-item-card-right-books-right">
					<text class="guide-item-card-right-books-right-status" v-if="guideItem.status === 0 || guideItem.status === 1">{{guideItem.status ? '已发布' : '未发布'}}</text>
				</view>
				
			</view>
			<!-- 发现、我的收藏显示信息区，我的创作显示但不能点击 -->
			<view class="guide-item-card-infos">
				<view class="guide-item-card-infos-left"  @click.native.stop="toHomepage($event)">
					<img :src="guideItem.author.avatar" class="guide-item-card-user-img" alt="">
					<text class="guide-item-card-user-name">{{guideItem.author.name}}</text>
				</view>
				<view class="guide-item-card-right-icons">
					<img src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/likeIcon.png" class="guide-item-card-right-icon-img" alt="">
					<view class="guide-item-card-right-icon-num">{{handleTransform(guideItem.likers_count)}}</view>
					<img  src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/starIcon.png" class="guide-item-card-right-icon-img" alt="">
					<view class="guide-item-card-right-icon-num guide-item-card-right-icon-num-last">{{handleTransform(guideItem.collectors_count)}}</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import { transformMaxNum, transformTime } from '@/tools/transform_time.js'
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
					views: 0,
					status: 0,		//0:未发布  1：已发布
					id: '',
					is_collect: false,
					is_like: false
				}
			},
		},
		computed: {
			
			// 是否是草稿/未发布状态：跳转详情页后，是否显示底部“发布”按钮：未发布显示；已发布不显示
			inDraft() {
				return !this.guideItem.status
			},
			bookname() {
				return this.guideItem.title.substr(0, 3) + '···'
			},
			timestamp() {
				return this.guideItem.timestamp ? transformTime(this.guideItem.timestamp) : this.guideItem.timestamp
			}
		},
		methods: {
			// 点赞、评论 大数单位转化
			handleTransform(val) {
				return transformMaxNum(val)
			},
			//点击事件，跳转攻略详情
			toGuideDetail() {
				uni.navigateTo({
					url: `/page_guide/guideDetail/guideDetail?showEditBtn=${true}&inDraft=${this.inDraft}&id=${this.guideItem.id}&cardIndex=${this.index}&tabIndex=2&from=mine`
				});
			},
			//长按事件，弹起选项面板，只有“我的创作” 能操作 编辑/删除
			handleLongpress() {
				this.$emit('openOptionSheet', this.index, this.guideItem.id, this.guideItem.status)
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
					font-size: 30rpx;
					margin-bottom: 10rpx;
					color: #000;
					line-height: 42rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
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
			.guide-item-card-right-books {
				color: rgba(255, 145, 58, 1);
				font-size: 24rpx;
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
				.guide-item-card-right-books-right {
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
						font-size: 20rpx;
						color: #000;
						flex: 1;
						height: 40rpx;
						overflow: hidden;
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
	
</style>
