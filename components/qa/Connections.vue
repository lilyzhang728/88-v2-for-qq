<!-- 人脉页 -->
<template>
	<view class="connections">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'left': '25rpx', 'right': '25rpx'}">
			<!-- connections列表 -->
			<view class="connections-list" v-if="dataList.length">
				<connection-card v-for="(item, index) in dataList" :item="item" :key="index" 
				@click.native.stop="toHomepage($event, item.id)" parent="connection"></connection-card>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import TopSearchBox from '@/components/common/TopSearchBox.vue'
	import ConnectionCard from './ConnectionCard.vue'
	import { connections } from '@/network/api_qa.js'
	export default {
		options: {
			styleIsolation: 'shared'
		},
		components: {
			TopSearchBox,
			ConnectionCard
		},
		props: {
			active: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				dataList: [],
				
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.getConnections(pageNo, pageSize).then(res => {
					this.$refs.paging.complete(res);
				})
			},
			getConnections(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					connections({
						'per_page': pageSize,
						'page': pageNo
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							resolve(res.data.items)
						} else {
							resolve([])
						}
					}, err => {
						resolve([])
						console.log('connections: ', err)
					})
				})
				
			},
			
			// 去个人主页
			toHomepage(e, id) {
				//防止冒泡
				// e.preventDefault()
				// uni.navigateTo({
				// 	url: `/page_infos/homepage/homepage?userId=${id}`
				// })
			},
		},
	}
</script>

<style lang="less" scoped>
	.connections {
		.connections-subTabs {
			margin-top: 25rpx;
			/deep/ .van-tabs__scroll{
				background: transparent;
				.van-tabs__nav {
					background: transparent;
					padding-left: 25rpx;
					.van-tab {
						color:#000;
						font-size:24rpx; 
						border-radius:28rpx; 
						margin-top:25rpx; 
						flex-basis: 15% !important;
						padding: 12rpx 30rpx !important;
						margin-right: 20rpx;
						background-color: #fff;
						box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(81,211,184,0.15);
						border-radius: 28rpx;
						.van-ellipsis {
							line-height: 33rpx;
						}
						
					}
					.van-tab--active {
						color: #fff;
						background: linear-gradient(135deg, #2FC2C5 0%, #37C9A3 100%);
						border-radius: 28rpx;
					}
				}
			}
		}
		.connections-list {
			padding: 10rpx 25rpx;
			background: #FFFFFF;
			border-radius: 30rpx 30rpx 0rpx 0rpx;
			
		}
	}
</style>
