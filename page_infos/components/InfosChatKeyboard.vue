<!-- 私信-输入框（键盘上） -->
<template>
	<view class="infos-chat-keyboard">
		<!-- 评论输入框 -->
		<!-- <input :adjust-position="false" type="text" v-model="val" confirm-type="send"  
		@confirm="send" :focus="showReply" @focus="inputBindFocus" @blur="inputBindBlur"/> -->
		
		<view class="chat-input-container">
			<input class="chat-input" v-model="msg" :cursor-spacing="20" confirm-type="send" type="text" placeholder="请输入内容" @confirm="sendClick">
		</view>
		<view class="chat-input-send" @click="sendClick">
			<text class="chat-input-send-text">发送</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msg: ''
			}
		},
		methods: {
			// send(){
			// 	if(this.val) {
			// 		this.$emit("submit",this.val)
			// 		this.val = '';
			// 	}
			// },
			sendClick() {
				if (!this.msg.length) return;
				this.$emit('submit', this.msg);
				this.msg = '';
			}
			// inputBindFocus(e) {
			// 	this.bottomVal = e.detail.height +  'px'
			// },
			// inputBindBlur() {
			// 	this.bottomVal = '0px'
			// },
		},
	}
</script>

<style lang="less" scoped>
	.infos-chat-keyboard {
		// display: flex;
		// box-sizing: border-box;
		// padding: 12px;
		// border-top: 1px solid rgba(204,204,204,.4);
		// background-color: #fff;
		// input{
		// 	border-radius: 10px;
		// 	border: 1px solid #EEEEEE;
		// 	background: rgb(245,245,245);
		// 	padding: 10px;
		// 	flex: 1;
		// 	font-size: 28rpx;
		// }
		display: flex;
		flex-direction: row;
		align-items: center;
		border-top: solid 1px #f5f5f5;
		background-color: #f8f8f8;
		
		padding: 10rpx 15rpx;
		.chat-input-container{
			flex: 1;
			display: flex;
			/* #ifndef APP-NVUE */
			padding: 15rpx;
			/* #endif */
			/* #ifdef APP-NVUE */
			padding: 10rpx;
			/* #endif */
			background-color: white;
			border-radius: 10rpx;
		}
		.chat-input{
			flex: 1;
			font-size: 28rpx;
		}
		.chat-input-send{
			background-color: #007AFF;
			margin: 10rpx 10rpx 10rpx 20rpx;
			border-radius: 10rpx;
			padding: 10rpx 30rpx;
			
		}
		.chat-input-send-text{
			color: white;
			font-size: 26rpx;
		}
	}
</style>
