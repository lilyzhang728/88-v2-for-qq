<!-- 写答案 -->
<template>
	<view class="write-answer">
		<z-paging ref="paging" :paging-style="pagingStyle">
			<view class="write-answer-title">{{title}}</view>
			
			<view class="add-new-post-edit-title-split"></view>
			
			<view class="write-answer-content">
				<van-field
					class="add-new-post-edit-textarea-wrap field-input-custom"
					input-class="add-new-post-edit-textarea"
					:value="answerVal"
					type="textarea"
					:show-confirm-bar="false"
					placeholder="请输入回答内容"
					autosize
					:border="false"
					@change.native="inputAnswer($event)"
					@focus.native="inputBindFocus"
					@blur.native="inputBindBlur"
					clearable
					:adjust-position="platform !== 'android'"
				  />
			</view>
			
			<!-- 弹起键盘 -->
			<view class="add-new-post-keyboard" v-if="showKeyboard" :style="{bottom: bottomVal, height: keyboardHeight}">
				<!-- 发布按钮 -->
				<view class="view-btn-box">
					<van-button icon="guide-o" color="#35C8A7" class="view-btn-wrap" :disabled="!answerVal" custom-class="view-btn" size="small" @click.native="send">发布</van-button>
				</view>
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
				bottomVal: '0px',	//键盘上话题bottom
				showKeyboard: true,
				keyboardHeight: '54px',	//键盘上话题height	1行54px，2行85px
				keyboardHeightVal: 0,
				platform: uni.getStorageSync('platform')
			}
		},
		computed: {
			pagingStyle() {
				if(this.platform === 'android') {
					let pagingBottom = (this.keyboardHeightVal + 54) + 'px'
					return {'top': '0px', 'left': '25rpx', 'right': '25rpx', 'bottom': pagingBottom}
				} else {
					return {'top': '0px', 'left': '25rpx', 'right': '25rpx'}
				}
			}
		},
		watch: {
			platform(val) {
				if(val === 'android') {
					uni.onKeyboardHeightChange(res => {
						this.keyboardHeightVal = res.height; //软键盘高度 
					})
				}
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
			if(this.platform === 'android') {
				uni.onKeyboardHeightChange(res => {
					this.keyboardHeightVal = res.height; //软键盘高度 
				})
			}
		},
		methods: {
			//编辑输入帖子
			inputAnswer(e) {
				this.answerVal = e.detail
			},
			inputBindFocus(e) {
				// 获取手机键盘的高度，赋值给input 所在盒子的 bottom 值
				this.bottomVal = e.detail.height +  'px'
			},
			inputBindBlur() {
				this.bottomVal = 0
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
		.write-answer-title {
			margin: 0 15px;
			margin-top: 15px;
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
		.write-answer-content {
			.add-new-post-edit-textarea-wrap {
				/deep/ .add-new-post-edit-textarea{
					min-height: 100px;
				}
			}
		}
		
		.add-new-post-keyboard {
			position: fixed;
			left: 0;
			right: 0;
			box-sizing: border-box;
			padding: 12px;
			background-color: #fff;
			.add-new-post-keyboard-topic {
				height: 25px;
				display: flex;
				margin-bottom: 10px;
				align-items: center;
				.add-new-post-keyboard-topic-icon {
					height: 20px;
					width: 20px;
				}
				.add-new-post-keyboard-topic-text {
					margin-left: 10px;
					flex: 1;
					width: 0;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 16px;
					color: #000;
					white-space: nowrap;
				}
			}
			.view-btn-box{
				margin-top: 10px;
				text-align: right;
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
	}

</style>
