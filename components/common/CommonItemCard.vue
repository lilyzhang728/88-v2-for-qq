<!-- 新版卡片(适用于资讯页、问答页、社区页混排) -->
<template>
	<view class="common-item-card">
		<view class="common-item-card-title">
			{{cardItem.title}}
		</view>
		
		<view class="common-item-card-content" v-if="cardItem.body.body">
			{{cardItem.body.body}}
		</view>
		
		<view class="common-item-card-point" v-if="cardItem.body.key_info.rec_reason">
			<van-icon name="star" size="32rpx" color="#f7ce46" />
			<text class="common-item-card-point-label">划重点：</text>
			<text class="common-item-card-point-content">{{cardItem.body.key_info.rec_reason}}</text>
		</view>
		
		<!-- 时间|卡片类型 -->
		<view class="common-item-card-time-box">
			<view class="common-item-card-time">{{cardItem.timestamp}}</view>
			<view class="common-item-card-time-split" v-if="cardItem.post_type">|</view>
			<view class="common-item-card-time-type" v-if="cardItem.post_type">{{postTypeMap[cardItem.post_type]}}</view>
		</view>
		
		<!-- 3个进度条 -->
		<view class="common-item-card-progress-bar-box" v-if="cardItem.body.key_info && cardItem.body.key_info.value_assessment && cardItem.body.key_info.value_assessment.length>0">
			<view class="common-item-card-progress-bar-item" v-for="(item,index) in cardItem.body.key_info.value_assessment" :key="index">
				<view class="common-item-card-progress-bar-item-text">{{item.field}}</view>
				<view class="common-item-card-progress-bar-item-progress-bar-box">
					<van-progress :percentage="getPercentage(item.value)" :color="progressColor[index]" :show-pivot="false" class="common-item-card-progress-bar-item-progress-bar" />
				</view>
				<!-- <view class="common-item-card-progress-bar-item-score">{{item.value}}分 / 5.0分</view> -->
			</view>
		</view>
		
		<!-- tag -->
		<view class="common-item-card-tag-box" v-if="cardItem.body.key_info && cardItem.body.key_info.core_analysis && cardItem.body.key_info.core_analysis.length>0">
			<view class="common-item-card-tag-item" v-for="(item,index) in cardItem.body.key_info.core_analysis" :key="index">
				<img class="common-item-card-tag-item-icon" :src="getIconSrc(index)" alt="">
				<view class="common-item-card-tag-item-label">{{item.field}}</view>
				<view class="common-item-card-tag-item-tag-box" v-if="item.value && Array.isArray(item.value)">
					<view class="common-item-card-tag-item-tag" v-for="(tag,subIndex) in item.value.slice(0,3)" :key="subIndex" :style="{'backgroundColor': tagColor[index]}">{{tag}}</view>
				</view>
				<view class="common-item-card-tag-item-tag-box" v-if="item.value && !Array.isArray(item.value)">
					<view class="common-item-card-tag-item-tag" :style="{'backgroundColor': tagColor[index]}">{{item.value}}</view>
				</view>
			</view>
		</view>
		
		<!-- 图片（问答） -->
		<view class="common-item-card-img-box" v-if="cardItem.body.urls && cardItem.body.urls.length">
			<van-image
			  width="100%"
			  height="100%"
			  fit="cover"
			  :src="pic"
			  class="common-item-card-img-item"
			  v-for="(pic, index) in cardItem.body.urls"
			  :key="index"
			  @click.native.stop="previewImg($event, pic)"
			/>
		</view>
		
		<view class="common-item-card-footer">
			<common-item-card-footer :cardData="cardItem" :showComment="showComment" :showStar="showStar" :showLeft="showLeft"
			@checkoutLike="checkoutLike" @checkoutCollect="checkoutCollect" :index="index"></common-item-card-footer>
		</view>
	</view>
</template>

<script>
	import CommonItemCardFooter from '@/components/common/CommonItemCardFooter.vue'
	export default {
		components: {
			CommonItemCardFooter
		},
		props: {
			cardItem: {
				type: Object,
				required: true,
				default: {
					author: {
						avatar: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg',		//默认头像
						name: '',
						id: ''
					},
					body: {
						body: "",
						cover_url: '',
						key_info: {
							core_analysis: [],
							rec_reason: '',
							value_assessment: []
						}
					},
					collectors_count: 0,
					likers_count: 0,
					title: "",
					in_house: 1,	// 是否为外部链接
					views: 0,
					status: 0,		//0:未发布  1：已发布
					id: '',
					is_collect: false,
					is_like: false,
					source: '',
					post_type: 1
				}
			},
			// 是否显示评论图标
			showComment: {
				type: Boolean,
				default: false
			},
			// 是否显示收藏图标
			showStar: {
				type: Boolean,
				default: false
			},
			// 是否显示左侧头像+来源
			showLeft: {
				type: Boolean,
				default: false
			},
			//帖子的index
			index: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				iconSrc: 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/tipIcon.png',
				progressColor: ['#2ca1ae', '#d47b38', '#7047a2'],
				tagColor: ['#f8f2e0', '#e7f9ff', '#dcddfb'],
				postTypeMap: ['', '资讯', '经验', '吐槽墙', '问答', '资料', '活动']
			}
		},
		methods: {
			getPercentage(val) {
				return val ? val/5*100 : 0
			},
			getIconSrc(index) {
				const srcList = [
					'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/iconCardTag0.png',
					'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/iconCardTag1.png',
					'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/iconCardTag2.png'
				]
				return srcList[index]
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
			//切换点赞状态
			checkoutLike(status) {
				this.$emit('checkoutLike', this.index, status)
			},
			checkoutCollect(status) {
				this.$emit('checkoutCollect', this.index, status)
			},
		}
	}
</script>

<style lang="less" scoped>
	.common-item-card {
		margin-top: 20rpx;
		padding: 30rpx;
		background-color: #ffffff;
		border-radius: 16px;
		border: 1px solid #ffffff;
		box-sizing: border-box;
		box-shadow: 0px 0px 8px rgba(0,0,0,0.12);
		.common-item-card-title{
			color: #303030;
			font-size: 36rpx;
			font-weight: 500;
			line-height: 48rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.common-item-card-content {
			margin-top: 10rpx;
			color: #616161;
			font-size: 32rpx;
			line-height: 40rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.common-item-card-point {
			margin-top: 14rpx;
			color: #000;
			font-size: 28rpx;
			line-height: 34rpx;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			white-space: pre-line;
			text-overflow: ellipsis;
			.common-item-card-point-label {
				width: 114rpx;
				margin-left: 8rpx;
				font-weight: bold;
			}
			.common-item-card-point-content {
				color: #616161;
			}
		}
		.common-item-card-time-box {
			margin-top: 14rpx;
			font-size: 24rpx;
			line-height: 32rpx;
			display: flex;
			.common-item-card-time{
				color: #292d3a;
			}
			.common-item-card-time-split {
				height: 24rpx;
				color: #292d3a;
				margin: 0 12rpx;
			}
			.common-item-card-time-type {
				color: #0dae8c;
				font-weight: 500;
			}
		}
		.common-item-card-progress-bar-box {
			margin-top: 20rpx;
			display: flex;
			justify-content: space-around;
			.common-item-card-progress-bar-item {
				display: flex;
				flex-direction: column;
				.common-item-card-progress-bar-item-text {
					color: #292d3a;
					font-size: 26rpx;
					line-height: 34rpx;
				}
				.common-item-card-progress-bar-item-progress-bar-box {
					margin-top: 10rpx;
					width: 100%;
					.common-item-card-progress-bar-item-progress-bar {
						/deep/ .van-progress {
							height: 14rpx !important;
							background: #f8f4f0 !important;
							border-radius: 7rpx !important;
						}
					}
				}
				.common-item-card-progress-bar-item-score {
					margin-top: 10rpx;
					color: #292d3a;
					font-size: 24rpx;
					line-height: 32rpx;
				}
			}
		}
		.common-item-card-tag-box {
			margin-top: 20rpx;
			.common-item-card-tag-item {
				margin-top: 10rpx;
				display: flex;
				align-items: center;
				.common-item-card-tag-item-icon {
					width: 40rpx;
					height: 40rpx;
				}
				.common-item-card-tag-item-label {
					margin-left: 18rpx;
					width: 130rpx;
					color: #424242;
					font-size: 28rpx;
					font-weight: 500;
					line-height: 36rpx;
				}
				.common-item-card-tag-item-tag-box {
					margin-left: 14rpx;
					flex: 1;
					overflow: hidden;
					display: flex;
					flex-wrap: nowrap;
					.common-item-card-tag-item-tag {
						font-size: 24rpx;
						font-weight: 500;
						line-height: 32rpx;
						padding: 6rpx 20rpx;
						color: #231c16;
						background-color: #f8f2e0;
						border-radius: 22rpx;
						margin-right: 8rpx;
						white-space: nowrap;
					}
				}
			}
			.common-item-card-tag-item1{
				.common-item-card-tag-item-tag {
					background-color: #e7f9ff !important;
				}
			}
			.common-item-card-tag-item2{
				.common-item-card-tag-item-tag {
					background-color: #dcddfb !important;
				}
			}
		}
		.common-item-card-img-box {
			margin-top: 20rpx;
			display: flex;
			height: 200rpx;
			.common-item-card-img-item {
				width: calc((100vw - 110rpx) / 3);
				margin-right: 20rpx;
				&:last-child {
					margin-right: 0;
				}
			}
		}
	}
	
</style>