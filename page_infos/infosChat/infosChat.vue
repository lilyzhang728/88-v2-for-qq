<!-- 聊天页面 -->
<template>
	<view class="infos-chat">
		<z-paging ref="paging" v-model="dataList" use-page-scroll use-chat-record-mode @query="queryList">
			<!-- 一条聊天记录  -->
			<view :id="`z-paging-${index}`" class="chat-item" v-for="(item,index) in dataList" :key="index">
				<infos-chat-item :item="item"></infos-chat-item>
			</view>

			<!-- 底部聊天输入框 -->
			<template #bottom>
				<infos-chat-keyboard @submit="doSend" @changeBottomVal="changeBottomVal"></infos-chat-keyboard>
			</template>
		</z-paging>
	</view>
</template>

<script>
	import BackTopbar from '@/components/common/BackTopbar.vue'
	import InfosChatItem from '@/page_infos/components/InfosChatItem.vue'
	import InfosChatKeyboard from '@/page_infos/components/InfosChatKeyboard.vue'
	import { historyChat, sendMessage } from '@/network/api_infos.js'
	const DEFAULT_AVATAR = 'cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/profile_photos/default/001.jpg'
	export default {
		components: {
			BackTopbar,
			InfosChatItem,
			InfosChatKeyboard
		},
		data() {
			return {
				customBar: 0,
				recipient_id: '',	//私信对方id
				uid: uni.getStorageSync('userId'),	//3955b2a8f692fa7fdfb0c80eca3188f6
				dataList: [],
			}
		},
		onLoad(option) {
			this.recipient_id = option.id
			// 动态设置页面标题
			uni.setNavigationBarTitle({
				title: option.name
			});
		},
		
		onPageScroll(e) {
			//如果滚动到顶部，触发加载更多聊天记录
			if (e.scrollTop < 10) {
				this.$refs.paging.doChatRecordLoadMore();
			}
		},
		methods: {
			//todo:时间待处理
			handleTime(time) {
				return time
			},
			queryList(pageNo, pageSize) {
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				historyChat({
					'from': this.recipient_id,
					'perpage': pageSize,
					'page': pageNo
				}).then(res => {
					//将请求的结果数组传递给z-paging
					if(res.code === 0 && Object.keys(res.data).length) {
						this.$refs.paging.complete(res.data.items);
					} else {
						this.$refs.paging.complete([])
					}
				}, err => {
					//如果请求失败写this.$refs.paging.complete(false);
					//注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
					//在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
					// this.$refs.paging.complete(false);
					this.$refs.paging.complete([])
					console.log('historyChat: ', err)
				})
			},
			doSend(msg){
				uni.showLoading({
					title: '发送中...'
				})
				let params = {
					body: msg,
					recipient_id: this.recipient_id
				}
				sendMessage(params).then(res => {
					if(res.code === 0) {
						//发送成功
						
					}
				}, err => {
					console.log('sendMessage: ', err)
				})
				setTimeout(()=>{
					uni.hideLoading();
					this.$refs.paging.addChatRecordData({'id': '878bc24ae65c11ed96e7525400b720b7',
					'body': msg,
					'timestamp': '2023-04-29 15:07:40',
					isShowTime: true,
					'sender': {'id': '3955b2a8f692fa7fdfb0c80eca3188f6',
					 'username': '59b0ddbe0dc3b2cac396b783c9d9f238',
					 'avatar': 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/profile_photos/default/001.jpg',
					 'name': 'wx_UuYY1e'},
					'recipient': {'id': 'demo',
					 'username': 'demo',
					 'avatar': 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/profile_photos/default/001.jpg',
					 'name': 'demo'},
					'_links': {'self': '/api/messages/878bc24ae65c11ed96e7525400b720b7',
					 'sender_url': '/api/user/59b0ddbe0dc3b2cac396b783c9d9f238/profile',
					 'recipient_url': '/api/user/demo/profile'}});
				},500)
			},
			
			//发送消息
			submit(val) {
				let params = {
					body: val,
					recipient_id: this.recipient_id
				}
				sendMessage(params).then(res => {
					if(res.code === 0 && Object.keys(res.data).length) {
						//评论成功，1级回显到第1条，2级回显到回复的评论下面
						// this.showReplyComment(res.data)
					}
				}, err => {
					console.log('sendMessage: ', err)
				})
			},
		},
		
		
		
	}
</script>

<style lang="less" scoped>
	.infos-chat {
		
	}

</style>
