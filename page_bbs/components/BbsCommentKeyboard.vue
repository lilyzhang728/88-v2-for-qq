<!-- 评论/回复别人评论-键盘弹起 -->
<template>
	<view class="bbs-comment-keyboard" v-if="showReply" :style="{bottom: bottomVal}">
		<!-- 引用别人的评论 -->
		<view class="reply-post" v-if="showReplyPostBox">
			<img :src="curReplyAvatar" alt="" class="reply-post-avatar">
			<text class="reply-post-content">{{curReplyContentText}}</text>
			<!-- <van-icon name="clear" size="20px" color="#d9d9d9" /> -->
		</view>
		
		<!-- 评论输入框 -->
		<textarea :adjust-position="false" v-model="val" :auto-height="true" maxlength="-1"
		confirm-type="发送" placeholder="说点什么吧" :show-confirm-bar="false" :auto-focus="true"
		@confirm="send" :focus="showReply" @focus="inputBindFocus" @blur="inputBindBlur" @keyboardheightchange="inputBindFocus"/>
		
		<!-- 发布按钮 -->
		<view class="view-btn-box">
			<van-button icon="guide-o" color="#35C8A7" class="view-btn-wrap" :disabled="!val" custom-class="view-btn" size="small" @click.native="send">发布</van-button>
		</view>
		
	</view>
</template>

<script>
	import { utf16toEntities, uncodeUtf16 } from '@/tools/transform_emoji.js'
	export default {
		props: {
			showReply: {
				type: Boolean,
				default: false
			},
			showReplyPostBox: {
				type: Boolean,
				default: false
			},
			curReplyContent: {
				type: String,
				default: ''
			},
			curReplyAvatar: {
				type: String,
				default: 'https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/profile_photos/default/001.jpg'
			}
		},
		data() {
			return {
				val: '',
				bottomVal: '0px',
			}
		},
		computed: {
			keyboardHeight() {
				//引用回复的评论高度+margin-bottom=35px
				let height = 150
				return this.showReplyPostBox ? height + 'px' : (height - 35) + 'px' 
			},
			// 引用的内容（支持显示emoji
			curReplyContentText() {
				if(this.curReplyContent) {
					return uncodeUtf16(this.curReplyContent)
				}
			}
		},
		created() {
			uni.onKeyboardHeightChange(res => {
				let keyboardHeight = res.height; //软键盘高度 
				let platform = uni.getStorageSync('platform')	//机型
				if(keyboardHeight) {
					if(platform === 'android') {
						let statusBar = uni.getStorageSync('statusBar')
						this.bottomVal = (keyboardHeight - statusBar)+'px'
					} else {
						this.bottomVal = (keyboardHeight)+'px'
					}
				} else {
					this.bottomVal = 0
				}
			})
		},
		methods: {
			send(){
				if(this.val) {
					this.$emit("submit",this.val)
					this.val = '';
				}
			},
			inputBindFocus(e) {
				// 获取手机键盘的高度，赋值给input 所在盒子的 bottom 值
				// 注意!!! 这里的 px 至关重要!!! 我搜到的很多解决方案都没有说这里要添加 px
				// this.bottomVal = e.detail.height +  'px'
			},
			inputBindBlur() {
				// input 失去焦点，键盘隐藏，设置 input 所在盒子的 bottom 值为0
				// this.bottomVal = 0
			},
		},
	}
</script>

<style lang="less" scoped>
	.bbs-comment-keyboard{
		position: fixed;
		left: 0;
		right: 0;
		box-sizing: border-box;
		padding: 12px;
		border-top: 1px solid rgba(204,204,204,.4);
		background-color: #fff;
		.reply-post {
			display: flex;
			margin-bottom: 10px;
			align-items: center;
			.reply-post-avatar {
				height: 25px;
				width: 25px;
				border-radius: 50%;
				margin-right: 10px;
			}
			.reply-post-content {
				flex: 1;
				width: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 16px;
				color: #ccc;
				white-space: nowrap;
			}
		}
		input{
			border-radius: 10px;
			border: 1px solid #EEEEEE;
			background: rgb(245,245,245);
			padding: 10px;
			flex: 1;
		}
		.view-btn-box{
			margin-top: 10px;
			text-align: end;
			.view-btn-wrap {
				/deep/ .view-btn {
					// color: #ccc;
					// border: none;
					font-size: 16px;
					border-radius: 14rpx;
				}
			}
			.view-btn-wrap-active {
				/deep/ .view-btn {
					// color: #35C8A7;
				}
			}
		}
	}
</style>
