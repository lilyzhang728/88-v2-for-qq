<!-- 问答页，包括：问答，人脉，2个子tab -->
<template>
	<view class="qa" :style="{backgroundImage: 'url('+backgroundImgUrl+')',backgroundSize: '100% '+backgroundImgHeight,backgroundColor: '#f8f8f8',backgroundRepeat: 'no-repeat'}">
		<z-paging-swiper :swiper-style="{'top': statusBar + 'px'}">
			<template #top>
				<!-- 顶层tab -->
				<van-tabs :active="active" animated @change.native="tabsChange" ref="tabs"
				line-height="8rpx" line-width="60rpx" class="bbs-tabs" :swipeable="true">
					<van-tab title="经验/问答"></van-tab>
					<van-tab title="分享会"></van-tab>
					<!-- <van-tab title="向ta提问"></van-tab> -->
				</van-tabs>
				
				<!-- 搜索 -->
				<view class="bbs-search">
					<top-search-box tabIndex="3" @toSearch="toSearch"></top-search-box>
				</view>
				<!-- <van-search :value="searchVal" placeholder="请输入搜索关键词" background="transparent" @click.native="toSearch" 
				custom-class="bbs-search" class="bbs-search-wrap" placeholder-style="color: rgba(255,255,255,0.6);" /> -->
			
				<!-- 子tab -->
				<van-tabs :active="subActive" animated @change.native="subTabsChange" ref="subTabs"
				line-height="0" line-width="0" class="useful-subTabs" :swipeable="false" v-if="active<1">
					<van-tab :title="item" v-for="(item, index) in subTabList" :key="index"></van-tab>
				</van-tabs>
			</template>
			
			<swiper class="swiper" :current="active" @animationfinish="swiperAnimationfinish">
				<swiper-item class="swiper-item">
					<!-- 问答 -->
					<question-and-answer ref="questionAndAnswer" :active="active" @toastMsg="toastMsg"
					:hasPublished="hasPublished" @resetHasPublished="resetHasPublished" :subActive="subActive" @loaded="handleLoaded"></question-and-answer>	
					<view class="loading-wrapper" v-if="showLoading">
					  <van-loading type="spinner" color="#35C8A7" />
					</view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<!-- 卧谈会 -->
					<activity-infos ref="activityInfos"></activity-infos>	
				</swiper-item>
				<!-- <swiper-item class="swiper-item"> -->
					<!-- 人脉 -->
					<!-- <connections ref="connections" :active="active"></connections>
				</swiper-item> -->
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
	// import Connections from '@/components/qa/Connections.vue'
	import ActivityInfos from '@/components/qa/ActivityInfos.vue'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import SideAddBtn from '@/components/common/SideAddBtn.vue'
	import TopSearchBox from '@/components/common/TopSearchBox.vue'
	export default {
		components: {
			PageTabs,
			QuestionAndAnswer,
			// Connections,
			SideAddBtn,
			TopSearchBox,
			ActivityInfos
		},
		data() {
			return {
				backgroundImgUrl: 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/news/newsBg.png?sign=8d29dfa78445d34a014f34744b633a8b&t=1688955606',
				active: 0,
				slotName: ['questionAndAnswer', 'connections'],
				hasPublished: false,	// true 为刚发完贴，（请求列表传参用，下次请求列表刚发的贴展示在第一位
				subActive: 0,
				showLoading: true
			}
		},
		computed: {
			// 状态栏高度
			statusBar() {
				return uni.getStorageSync('statusBar')
			},
			backgroundImgHeight() {
				//44:父tab， 55:搜索框， 44:子tab
				let height = Number(this.statusBar) + 44 + 55 + 44
				return height + 'px'
			},
			subTabList() {
				return this.active ? ['推荐'] : ['推荐', '考研', '实习工作', '考公/编']
			}
		},
		methods: {
			tabsChange(e) {
				this.active = e.detail.index
				this.subActive = 0
			},
			subTabsChange(e) {
				this.subActive = e.detail.index;
				// 更新list
				this.reloadList()
				this.showLoading = true
			},
			// 更新list
			reloadList() {
				if(this.active) {
					this.$refs.activityInfos.$refs.paging.reload()
				} else {
					this.$refs.questionAndAnswer.$refs.paging.reload()
				}
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
				const searchContentType = 0		// 0:搜索文章  1:搜索徽章  2:搜索话题
				// const tabIndexMap = [5, 7, 6]	
				// let tabIndex = tabIndexMap[this.active]
				uni.navigateTo({
					url: `/page_editPersonalInfo/commonSearch/commonSearch?tabIndex=5&searchVal=${this.searchVal}&searchContentType=${searchContentType}`
				})
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.active = e.detail.current;
			},
			backRefresh() {
				const refList = ['questionAndAnswer', 'activityInfos', 'connections']
				this.$refs[refList[this.active]].$refs.paging.reload()
			},
			resetHasPublished() {
				this.hasPublished = false
			},
			handleLoaded() {
				this.showLoading = false
			}
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
						// background: #fff;
						// bottom: 5px;
						display: none;
					}
				
					.van-tab {
						font-size: 36rpx;
						color: #fff;
						padding: 0;
						padding-left: calc(25rpx + 15px);
						text-align: left;
					}
					.van-tab--active {
						color: #fff;
					}
				}
			} 
		}
		.bbs-search {
			margin: 10px 25rpx;
			// /deep/ .top-search-box {
			// 	box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.35) !important;
			// }
		}
		.useful-subTabs {
			/deep/ .van-tabs__scroll{
				background: transparent;
				.van-tabs__nav {
					background: transparent;
					padding-left: 25rpx;
					.van-tab {
						color:#fff;
						font-size:24rpx; 
						border-radius:28rpx; 
						margin-top:15rpx; 
						flex-basis: auto !important;
						padding: 10rpx 15rpx;
						margin-right: 15rpx;
						.van-ellipsis {
							line-height: 24rpx;
						}
						
					}
					.van-tab--active {
						color: #fff;
						background: rgba(255,255,255,0.3);
						border-radius: 28rpx;
					}
				}
			}
		}
		.swiper {
			height: 100%;
		}
		.loading-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}
	}

</style>
