<!-- 问答页，包括：问答，人脉，2个子tab -->
<template>
	<view class="qa" :style="{backgroundImage: 'url('+backgroundImgUrl+')',backgroundSize: '100% '+backgroundImgHeight,backgroundColor: '#f2f4f8',backgroundRepeat: 'no-repeat'}">
		<z-paging-swiper :swiper-style="{'top': statusBar + 'px'}">
			<template #top>
				<!-- 顶层tab -->
				<van-tabs :active="active" animated @change.native="tabsChange" ref="tabs"
				line-height="8rpx" line-width="60rpx" class="bbs-tabs" :swipeable="true">
					<van-tab title="问答"></van-tab>
					<van-tab title="人脉"></van-tab>
				</van-tabs>
				
				<!-- 搜索 -->
				<view class="bbs-search">
					<top-search-box @toSearch="toSearch"></top-search-box>
				</view>
				<!-- <van-search :value="searchVal" placeholder="请输入搜索关键词" background="transparent" @click.native="toSearch" 
				custom-class="bbs-search" class="bbs-search-wrap" placeholder-style="color: rgba(255,255,255,0.6);" /> -->
			</template>
			<swiper class="swiper" :current="active" @animationfinish="swiperAnimationfinish">
				<swiper-item class="swiper-item">
					<!-- 问答 -->
					<question-and-answer ref="questionAndAnswer" :active="active" @toastMsg="toastMsg"></question-and-answer>	
				</swiper-item>
				<swiper-item class="swiper-item">
					<!-- 人脉 -->
					<connections ref="connections" :active="active"></connections>
				</swiper-item>
			</swiper>
		</z-paging-swiper>
		
		<!-- toast提示 -->
		<van-toast id="van-toast" />
		
		<!-- 新增问答按钮 -->
		<side-add-btn @addNew="addNewQuestion"></side-add-btn>		
	</view>
</template>

<script>
	import PageTabs from '@/components/common/PageTabs.vue'
	import QuestionAndAnswer from '@/components/qa/QuestionAndAnswer.vue'
	import Connections from '@/components/qa/Connections.vue'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import SideAddBtn from '@/components/common/SideAddBtn.vue'
	import TopSearchBox from '@/components/common/TopSearchBox.vue'
	export default {
		components: {
			PageTabs,
			QuestionAndAnswer,
			Connections,
			SideAddBtn,
			TopSearchBox
		},
		data() {
			return {
				backgroundImgUrl: 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/bbs/bbsBg.png?sign=c0f613e91ba42b583649b23d7922d3b2&t=1689556699',
				active: 0,
				titleList: ['问答', '人脉'],
				slotName: ['questionAndAnswer', 'connections'],
			}
		},
		computed: {
			// 状态栏高度
			statusBar() {
				return uni.getStorageSync('statusBar')
			},
			backgroundImgHeight() {
				//44:tab， 58:搜索框，25/2:搜索框margin-bottom, 44:子tab
				let height = Number(this.statusBar) + 44 + (58-25/2)
				// return this.active === 2 ? (height+44) + 'px' : height + 'px'
				return height + 'px'
			}
		},
		methods: {
			tabsChange(e) {
				this.active = e.detail.index
			},
			toastMsg(type) {
				if(type) {
					Toast('发布成功！')
				} else {
					Toast('发布失败！')
				}
			},
			addNewQuestion(e) {
				e.preventDefault();
				uni.navigateTo({
					url: `/page_qa/askQuestion/askQuestion`
				})
			},
			// 搜索帖子
			toSearch() {
				// 0:搜索文章  1:搜索徽章  2:搜索话题
				const searchContentType = 0	
				let tabIndex = this.active ? 6 : 5
				uni.navigateTo({
					url: `/page_editPersonalInfo/commonSearch/commonSearch?tabIndex=${tabIndex}&searchVal=${this.searchVal}&searchContentType=${searchContentType}`
				})
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.active = e.detail.current;
			},
		}
	}
</script>

<style lang="less" scoped>
	.qa {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		.bbs-tabs {
			/deep/ .van-tabs__scroll{
				background: transparent;
				.van-tabs__nav {
					background: transparent;
					width: 70%;
					// margin-left: 25rpx;
					.van-tabs__line {
						background: #fff;
						bottom: 5px;
					}
		
					.van-tab {
						font-size: 36rpx;
						color: #fff;
						padding: 0;
					}
					.van-tab--active {
						color: #fff;
					}
				}
			} 
		}
		.bbs-search {
			margin: 10px 25rpx;
			/deep/ .top-search-box {
				box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.35) !important;
			}
		}
		.swiper {
			height: 100%;
		}
	}

</style>
