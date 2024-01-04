<!-- 评论键盘上面的部分 -->
<!-- 此组件被问答详情、资讯详情页复用 -->
<!-- 评论/回复别人评论-键盘弹起 -->
<template>
	<view class="bbs-comment-keyboard" v-if="showReply" :style="{bottom: bottomVal, height: keyboardHeight}">
		
		<!-- 评论输入框 -->
		<input :adjust-position="false" type="text" v-model="val" confirm-type="发送" placeholder="说点什么吧" 
		@confirm="send" :focus="showReply" @focus="inputBindFocus" @blur="inputBindBlur"/>
		
		<!-- 发布按钮 -->
		<view class="view-btn-box">
			<van-icon name="photo-o" size="30px" color="#6d6d6d" />
			<van-button class="view-btn-wrap" :class="{'view-btn-wrap-active': val}" custom-class="view-btn" size="small" @click.native="send">发送</van-button>
		</view>
		
	</view>
</template>

<script>
	export default {
		props: {
			showReply: {
				type: Boolean,
				default: false
			},
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
				return (height - 35) + 'px' 
			}
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
				this.$emit('changeBottomVal' ,  e.detail.height)
				// console.log(e)
				this.bottomVal = e.detail.height +  'px'
			},
			inputBindBlur() {
				// input 失去焦点，键盘隐藏，设置 input 所在盒子的 bottom 值为0
				this.$emit('changeBottomVal', 0)
				this.bottomVal = 0
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
			display: flex;
			justify-content: space-between;
			.view-btn-wrap {
				/deep/ .view-btn {
					color: #ccc;
					border: none;
					font-size: 16px;
				}
			}
			.view-btn-wrap-active {
				/deep/ .view-btn {
					color: #35C8A7;
				}
			}
		}
	}
</style>
