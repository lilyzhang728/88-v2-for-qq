<!-- 写答案 -->
<template>
	<view class="write-answer">
		<z-paging ref="paging" :paging-style="{'top': '0px', 'left': '25rpx', 'right': '25rpx'}">
			<template #top>
				<!-- 顶部发布按钮 -->
				<view class="view-btn-box">
					<van-button icon="guide-o" color="#35C8A7" class="view-btn-wrap" :disabled="!answerVal" custom-class="view-btn" size="small" @click.native="send">发布</van-button>
				</view>
			</template>
			
			<view class="write-answer-title">{{title}}</view>
			
			<view class="add-new-post-edit-title-split"></view>
			
			<view class="write-answer-content">
				<editor id="myEditor" class="editor" placeholder="请输入回答内容" @input="inputAnswer"></editor>
			</view>
			
			
			
			<!-- toast提示 -->
			<van-toast id="van-toast" />
		</z-paging>
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import { postComment } from "@/network/api_bbs.js"
	import { utf16toEntities } from '@/tools/transform_emoji.js'
	export default {
		data() {
			return {
				title: '',
				id: '',
				answerVal: '',
				showKeyboard: true,
				keyboardHeight: '54px',	//键盘上话题height	1行54px，2行85px
			}
		},
		
		onLoad(option) {
			if(option.title && option.id) {
				this.title = option.title
				this.id = option.id
			} else {
				// 返回上一页
				uni.navigateBack({
				    success: () => {
				         let page = getCurrentPages().pop();//跳转页面成功之后
				    }
				})
			}
			
		},
		methods: {
			//编辑输入帖子
			inputAnswer(e) {
				this.answerVal = e.detail.text
			},
			
			send() {
				if(this.answerVal) {
					this.showKeyboard = false
					let params = {
						body: utf16toEntities(this.answerVal),
						post_id: this.id
					}
					postComment(params).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							// 返回上一页并刷新
							uni.navigateBack({
							    success: () => {
							         let page = getCurrentPages().pop();//跳转页面成功之后
							    }
							})
						}
					}, err => {
						console.log('postComment: ', err)
					})
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.write-answer {
		padding: 25rpx;
		.view-btn-box{
			margin-top: 30rpx;
			text-align: right;
			.view-btn-wrap {
				/deep/ .view-btn {
					font-size: 16px;
					border-radius: 14rpx;
				}
			}
		}
		.write-answer-title {
			margin: 0 15px;
			margin-top: 30rpx;
			font-size: 38rpx;
			font-weight: 600;
			color: #000000;
			line-height: 53rpx;
		}
		.add-new-post-edit-title-split {
			height: 1px;
			border-bottom: 1px solid #EAEAEA;
			margin: 25rpx;
		}
		
		.editor {
			width: 100%;
			height: 300px;
			margin-bottom: 30rpx;
			padding: 10px 16px;
		  }
	}

</style>
