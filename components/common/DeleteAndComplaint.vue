<!-- 删除和举报面板 -->
<template>
	<view class="delete-and-complaint">
		<van-action-sheet
		  :show="showActionSheet"
		  :actions="actions"
		  @close.native="closeSheet"
		  @select.native="selectSheet"
		/>
	</view>
</template>

<script>
	import { deletePosts, deleteComments, deleteTopics, complaintComments, complaintPosts, complaintTopics } from "@/network/api_bbs.js"
	export default {
		props: {
			itemId: {
				type: String,
				default: ''
			},
			// 内容类型：0：帖子，1：评论，2：话题
			type: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				showActionSheet: false,
				actions: [{
					name: '举报该内容',
					value: 0
				}]
			}
		},
		created() {
			if(uni.getStorageSync('role') == 1 && this.actions.length === 1) {
				this.actions.push({
					name: '删除该内容',
					value: 1
				})
			}
		},
		methods: {
			// 长按，弹起面板
			handleLongpress() {
				this.showActionSheet = true
			},
			closeSheet() {
				this.showActionSheet = false
			},
			// 选择面板选项
			selectSheet(e) {
				if(e.detail.value == 0) {
					// 举报
					switch (this.type){
						case 0:
							// 举报帖子
							this.handleComplaintPosts()
							break;
						case 1:
							// 举报评论
							this.handleComplaintComments()
							break;
						case 2:
							// 举报话题
							this.handleComplaintTopics()
							break;
						default:
							break;
					}
				} else {
					// 删除
					switch (this.type){
						case 0:
							// 删除帖子 
							this.handleDeletePosts()
							break;
						case 1:
							// 删除评论
							this.handleDeleteComments()
							break;
						case 2:
							// 删除话题
							this.handleDeleteTopics()
							break;
						default:
							break;
					}
					
				}
				
			},
			// 举报帖子
			handleComplaintPosts() {
				complaintPosts(this.itemId).then(res => {
					if(res.code === 0) {
						// 举报成功
						this.successToast('举报')
					} else {
						this.failToast('举报')
					}
				})
			},
			// 举报评论
			handleComplaintComments() {
				complaintComments(this.itemId).then(res => {
					if(res.code === 0) {
						// 举报成功
						this.successToast('举报')
					} else {
						this.failToast('举报')
					}
				})
			},
			// 举报话题
			handleComplaintTopics() {
				complaintTopics(this.itemId).then(res => {
					if(res.code === 0) {
						// 举报成功
						this.successToast('举报')
					} else {
						this.failToast('举报')
					}
				})
			},
			successToast(msg) {
				uni.showToast({
					title: msg + '成功',
					icon: 'success'
				});
			},
			failToast(msg) {
				uni.showToast({
					title: msg + '失败',
					icon: 'error'
				});
			},
			// 删除帖子
			handleDeletePosts() {
				deletePosts(this.itemId).then(res => {
					if(res.code === 0) {
						// 删除成功
						this.$emit('backRefresh')
					} else {
						this.failToast('删除')
					}
				})
			},
			// 删除评论
			handleDeleteComments() {
				deleteComments(this.itemId).then(res => {
					if(res.code === 0) {
						// 删除成功
						this.$emit('backRefresh')
					} else {
						this.failToast('删除')
					}
				})
			},
			// 删除话题
			handleDeleteTopics() {
				deleteTopics(this.itemId).then(res => {
					if(res.code === 0) {
						// 删除成功
						this.$emit('backRefresh')
					} else {
						this.failToast('删除')
					}
				})
			}
			
		},
	}
</script>

<style lang="less" scoped>
	.delete-and-complaint {
		
	}
</style>