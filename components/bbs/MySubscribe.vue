<!-- 订阅 -->
<template>
	<view class="my-subscribe">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'left': '25rpx', 'right': '25rpx'}" default-page-size="50" loading-more-no-more-text="设置关键词，推送内容更精准">
		
			<view class="my-subscribe-list">
				<view class="my-subscribe-list-item" v-for="(item,index) in dataList" :key="index">
					<van-icon class="my-subscribe-list-item-icon-left" name="bookmark" size="40rpx" color="#52c1ac" />
					<text class="my-subscribe-list-item-label">订阅关键词：</text>
					<van-field :value="item.body" placeholder="请输入" :border="false" @change.native="onChange($event)" />
					<van-icon v-if="item.is_top" class="my-subscribe-list-item-icon-right" name="clear" size="40rpx" color="#7b7b7b" />
					<van-icon v-else class="my-subscribe-list-item-icon-right" name="clear" size="40rpx" color="#ffcc00" @click.native="handleDeleteSubscribe(item.id)" />
				</view>
				<!-- 新增 -->
				<view class="my-subscribe-list-item" v-if="dataList.length < 22">
					<van-icon class="my-subscribe-list-item-icon-left" name="bookmark" size="40rpx" color="#52c1ac" />
					<text class="my-subscribe-list-item-label">订阅关键词：</text>
					<van-field :value="addKeyword" placeholder="请输入关键词" :border="false" @change.native="onChange" />
					<van-icon class="my-subscribe-list-item-icon-right" name="guide-o" size="40rpx" color="#00B429" @click.native="handleAddSubscribe" />
				</view>
				
			</view>
		</z-paging>
	</view>
</template>

<script>
	import { subscribeList, addSubscribe, deleteSubscribe }  from '@/network/api_guide.js'
	export default {
		data() {
			return {
				dataList: [],
				addKeyword: ''
			}
		},
		methods: {
			onChange(e) {
				this.addKeyword = e.detail
			},
			queryList(pageNo, pageSize) {
				this.getSubscribeList(pageNo, pageSize).then(res => {
					this.$refs.paging.complete(res);
				})
			},
			getSubscribeList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					subscribeList().then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							resolve(res.data.items)
						} else {
							resolve([])
						}
					}, err => {
						resolve([])
						console.log('subscribeList: ', err)
					})
				})
			},
			handleAddSubscribe() {
				if(this.addKeyword) {
					addSubscribe({
						body: this.addKeyword
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							// 添加成功
							this.addKeyword = ''
							// 刷新列表
							this.$refs.paging.reload()
						}
					}, err => {
						console.log('addSubscribe: ', err)
					})
				}
			},
			handleDeleteSubscribe(id) {
				deleteSubscribe(id).then(res => {
					if(res.code === 0) {
						// 删除成功 刷新列表
						this.$refs.paging.reload()
					}
				}, err => {
					console.log('deleteSubscribe: ', err)
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.my-subscribe {
		margin: 0 25rpx;
		.my-subscribe-list {
			margin: 0 14rpx;
			margin-top: 20rpx;
			.my-subscribe-list-item {
				margin-top: 30rpx;
				padding: 0 26rpx;
				display: flex;
				align-items: center;
				background-color: #ffffff;
				border-radius: 16px;
				border: 1px solid #ffffff;
				box-sizing: border-box;
				box-shadow: 0px 0px 8px rgba(0,0,0,0.12);

				.my-subscribe-list-item-icon-left {
					width: 40rpx;
					margin-right: 4rpx;
				}
				.my-subscribe-list-item-label {
					color: #292d3a;
					font-size: 32rpx;
					font-weight: 500;
					line-height: 42rpx;
					width: 220rpx;
				}
				.my-subscribe-list-item-icon-right {
					width: 40rpx;
				}
			}
			
		}
	}
</style>