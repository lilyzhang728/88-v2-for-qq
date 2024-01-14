<!-- 卡片头部-用户信息 -->
<template>
	<view class="card-user">
		<img class="card-user-avatar" :src="avatar"  @click.native.stop="toHomepage($event)"></img>
		<view class="card-user-right">
			<view class="card-user-name"  @click.native.stop="toHomepage($event)">{{item.author.name}}</view>
			<view class="card-user-infos">
				<text class="card-user-time" v-if="!isDetail">{{timestamp}}</text>
				<text class="card-user-infos-text" :class="{'card-user-infos-text-detail': isDetail}" v-if="item.author.school">{{item.author.school}}</text>
				<text class="card-user-infos-text" v-if="isDetail && item.author.major">{{item.author.major}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	const DEFAULT_AVATAR = 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg'
	import { transformTime } from '@/tools/transform_time.js'
	export default {
		props: {
			item: {
				type: Object,
				default: {
					author: {
						name: '',
						avatar: '',
						id: '',
						school: '',
						major: ''
					},
				}
			},
			parent: {
				type: String,
				default: '',
				required: false
			}
		},
		computed: {
			avatar() {
				return this.item.author.avatar ?  this.item.author.avatar : DEFAULT_AVATAR
			},
			timestamp() {
				return this.item.timestamp ? transformTime(this.item.timestamp) : this.item.timestamp
			},
			// 是否是detail页面
			isDetail() {
				return this.parent === 'detail'
			}
		},
		methods: {
			// 点击头像，去个人主页
			toHomepage(e) {
				//防止冒泡
				e.preventDefault()
				uni.navigateTo({
					url: `/page_infos/homepage/homepage?userId=${this.item.author.id}`
				})
			},
		},
	}
</script>

<style lang="less" scoped>
	.card-user {
		display: flex;
		align-items: center;
		.card-user-avatar {
			width: 70rpx;
			height: 70rpx;
			margin-right:20rpx;
			border-radius: 50%;
		}
		.card-user-right {
			flex: 1;
			overflow: hidden;
			.card-user-name {
				font-size: 30rpx;
				font-weight: 500;
				color: #000;
				line-height: 42rpx;
			}
			.card-user-infos {
				font-size: 22rpx;
				color: rgba(0,0,0,0.6);
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				.card-user-time {
				}
				.card-user-infos-text {
					margin-left: 10rpx;
				}
				.card-user-infos-text-detail {
					margin-left: 0;
				}
			}
		}		
	}
</style>