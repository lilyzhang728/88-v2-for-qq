<!-- 我的徽章-徽章内容 -->
<template>
	<view class="badge-list-content">
		<view class="badge-content">
			<!-- 添加徽章icon -->
			<view class="badge-item add-badge" @tap="addBadge" v-if="showAddBadge">
				<text class="iconfont icon-004plus02 add-badge-icon"></text>
			</view>
			
			<view class="badge-item" v-for="(item,index) in dataList" :key="index"  @tap="showDetail(item)">
				<img :src="item.image_bg" alt="" class="badge-img-bg">
				<img :src="item.image" alt="" class="badge-img-content">
				<view class="badge-name">{{item.name}}</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		
		props: {
			title: {
				type: String,
				required: false
			},
			badgeType: {
				type: String,
				required: false,
			},
			// 我的徽章list
			myBadgeList: {
				type: Array,
				required: false,
			},
			//徽章库-更多列表
			libBadgeList: {
				type: Array,
				required: false,
			},
			dataList: {
				type: Array,
				required: true,
				default: []
			}
		},
		data() {
			return {
				defaultList: [],
			}
		},
		computed: {
			showAddBadge() {
				return this.title == '制作徽章'
			},
			isMyBadge() {
				// true - 我的徽章， false - 徽章库
				return this.badgeType == undefined || this.badgeType == "" || this.badgeType == null
			}
		},
		watch: {
			myBadgeList(val) {
				if(this.isMyBadge) {
					// 我的徽章
					this.defaultList = this.myBadgeList
				}
			},
			libBadgeList(val) {
				if(!this.isMyBadge) {
					// 徽章库
					this.defaultList = this.libBadgeList
				}
			}
		},
		methods: {
			showDetail(item) {
				if(this.isMyBadge) {
					// 在我的徽章页面弹出徽章详情 (本组件 belongs to MyBadgeAndBadgeLibrary.vue )
					uni.$emit('showMyBadgeDetail', item)
				} else {
					// 徽章库跳转过来(本组件 belongs to MoreBadge.vue )，在moreBadge页面弹出徽章详情
					uni.$emit('showBadgeLibraryDetail', item)
				}
				
			},
			addBadge() {
				// this.$refs.makeBadge.showDetail = true
				uni.$emit('showMakeBadge')
			}
		}
	}
</script>

<style lang="less" scoped>
	.badge-list-content {
		margin: 10rpx 25rpx;
		background-color: #fff;
		padding: 30rpx;
		box-shadow: 0rpx 0rpx 15rpx 0rpx rgba(81,211,184,0.1);
		border-radius: 20rpx;
		.badge-content {
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start; // 替代原先的space-between布局方式
			.add-badge {
				.add-badge-icon {
					font-size: calc((100vw - 150rpx - 60rpx - 50rpx) / 4 * 0.7) ;
					color: #ccc;
				}
			}
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
					position: absolute;
					width: 100%;
					top: 80%;
				}
			}
		
		}
	}
</style>
