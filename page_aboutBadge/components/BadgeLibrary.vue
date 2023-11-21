<!-- 徽章库 -->
<template>
	<view class="badge-library">
		<white-box index="0" v-if="officialList.length > 0">
			<view class="badge-content">
				<view class="badge-item" v-for="(item,index) in officialList" :key="index" @tap="showDetail(item)">
					<img :src="item.image_bg" alt="" class="badge-img-bg">
					<img :src="item.image" alt="" class="badge-img-content">
					<view class="badge-name">{{item.name}}</view>
				</view>
				<view class="show-more" v-if="officialListTotal > 8" @tap="moreBadge('官方徽章', 'admin')">查看更多徽章 > </view>
			</view>
		</white-box>
		
		<white-box index="1" v-if="recList.length > 0">
			<view class="badge-content">
				<view class="badge-item" v-for="(item,index) in recList" :key="index" @tap="showDetail(item)">
					<img :src="item.image_bg" alt="" class="badge-img-bg">
					<img :src="item.image" alt="" class="badge-img-content">
					<view class="badge-name">{{item.name}}</view>
				</view>
				<view class="show-more" v-if="recListTotal > 8" @tap="moreBadge('推荐徽章', 'rec')">查看更多徽章 > </view>
			</view>
		</white-box>
		
		<white-box index="2">
			<view class="badge-content">
				<view class="badge-item add-badge" @tap="addBadge">
					<text class="iconfont icon-004plus02 add-badge-icon"></text>
				</view>
				
				<view class="badge-item" v-for="(item,index) in ownList.slice(0, 7)" :key="index" @tap="showDetail(item)">
					<img :src="item.image_bg" alt="" class="badge-img-bg">
					<img :src="item.image" alt="" class="badge-img-content">
					<view class="badge-name">{{item.name}}</view>
				</view>
				<view class="show-more" v-if="ownListTotal > 7" @tap="moreBadge('制作徽章', 'own')">查看/添加更多徽章 > </view>
			</view>
		</white-box>
		
		<badge-detail ref="badgeDetail" @toast="handleToast"></badge-detail>
		
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import WhiteBox from "@/page_aboutBadge/components/WhiteBox.vue"
	import BadgeDetail from "@/components/index/BadgeDetail.vue"
	import { libraryAchievements } from "@/network/api_badge.js"
	import Toast from '@/wxcomponents/vant/toast/toast'
	
	export default {
		components: {
			WhiteBox,
			BadgeDetail
		},
		data() {
			return {
				officialList: [],	//官方徽章
				officialListTotal: 0,	//官方徽章总数
				recList: [],	//推荐徽章
				recListTotal: 0, 	//推荐徽章总数
				ownList: [],	//制作徽章
				ownListTotal: 0,	//制作徽章总数
				
			}
		},
		methods: {
			// 获取官方徽章
			getOfficialList() {
				libraryAchievements({
					'source': 'admin',		//官方徽章
					'per_page': 8,
					'page': 1
				}).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.officialList = res.data.items
						this.officialListTotal = res.data._meta.total_items
					}
				}, err => {
					console.log()
				})
			},
			// 获取推荐徽章
			getRecList() {
				libraryAchievements({
					'source': 'rec',		//推荐徽章
					'per_page': 8,
					'page': 1
				}).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.recList = res.data.items
						this.recListTotal = res.data._meta.total_items
					}
				}, err => {
					console.log('推荐徽章: ' + err)
				})
			},
			// 获取制作徽章
			getOwnList() {
				libraryAchievements({
					'source': 'own',		//制作徽章
					'per_page': 8,
					'page': 1
				}).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						this.ownList = res.data.items
						this.ownListTotal = res.data._meta.total_items
					}
				}, err => {
					console.log('制作徽章: ' + err)
				})
			},
			moreBadge(title, source) {
				uni.navigateTo({
					url: `/page_aboutBadge/moreBadge/moreBadge?title=${title}&source=${source}`
				});
			},
			// 弹出徽章详情
			showDetail(item) {
				// this.$refs.badgeDetail.showDetail = true
				this.$refs.badgeDetail.getBadgeDetail(item, 2)
			},
			addBadge() {
				// uni.$emit('showMakeBadge')
				uni.navigateTo({
					url: '/page_aboutBadge/makeBadge/makeBadge'
				})
			},
			// showBadgeDetail(item) {
			// 	uni.$emit('showLibraryDetail', item)
			// }
			handleToast(msg) {
				console.log(msg)
				Toast({message: msg, context: this, type: 'success'})
			}
		}
	}
</script>

<style scoped lang="less">
	.badge-library {
		padding: 0 25rpx;
		.badge-content {
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start; // 替代原先的space-between布局方式
		
			.badge-item {
				flex: 1;
				margin: 0 50rpx 40rpx 0; // 间隙为50rpx
				width: calc((100vw - 150rpx - 60rpx - 50rpx) / 4); // 这里的150rpx = (分布个数4-1)*间隙50rpx, 可以根据实际的分布个数和间隙区调整
				min-width: calc((100vw - 150rpx - 60rpx - 50rpx) / 4); // 加入这两个后每个item的宽度就生效了
				max-width: calc((100vw - 150rpx - 60rpx - 50rpx) / 4); // 加入这两个后每个item的宽度就生效了
				height: calc((100vw - 150rpx - 60rpx - 50rpx) / 4);
				text-align: center;
				position: relative;
				&:nth-child(4n) {
					// 去除第4n个的margin-right
					margin-right: 0;
				}
		
				.badge-img-content {
					width: 70%;
					height: 70%;
					position: absolute;
					left: 15%;
					top: 0;
				}
				.badge-img-bg {
					width: 70%;
					height: 70%;
					position: absolute;
					left: 15%;
					top: 0;
				}
		
				.badge-name {
					font-size: 24rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					text-align: center;
					width: 100%;
					position: absolute;
					top: 80%;
				}
			}
			
			.add-badge {
				.add-badge-icon {
					font-size: calc((100vw - 150rpx - 60rpx - 50rpx) / 4 * 0.7) ;
					color: #ccc;
				}
			}
		
			.show-more {
				text-align: center;
				color: rgba(0,0,0,0.4);
				width: 100%;
				margin-top: 12rpx;
				font-size: 24rpx;
				line-height: 33rpx;
			}
		}
		
	}
</style>
