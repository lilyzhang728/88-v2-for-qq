<!-- 为新发的帖子添加话题 -->
<template>
	<view class="add-post-topic" :style="{backgroundImage: 'url(https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/index/formBg.png?sign=d0afe929ec7678f0a5c5f6e3eeb88dd5&t=1687659923)',backgroundSize: '100%',backgroundColor: '#fff',backgroundRepeat: 'no-repeat'}">
		<back-topbar ></back-topbar>
		<z-paging ref="paging" v-model="dataList" @query="queryList" :paging-style="{'top': (customBar+20) + 'px', 'bottom': '64px', paddingLeft: '25rpx', paddingRight: '25rpx'}">
			<view class="add-post-topic-tip">你可能想写</view>
			<bbs-topic-card @click.native="addTopic(item)" v-for="(item,index) in dataList" :key="index" :topicData="item"></bbs-topic-card>
			
			<!-- 添加新话题 -->
			<view class="add-post-topic-new" @click="openPopup"><van-icon color="#35C8A6" class="add-post-topic-new-icon" name="edit" />发起话题</view>
		</z-paging>
		
		<!-- 添加话题弹窗 -->
		<view class="add-post-topic-new-popup">
			<van-action-sheet :show="showAddPopup" title="添加话题" @close.native="onClose">
				<view class="add-post-topic-new-topic-wrap" :style="{height: (windowHeight/1.5)+'px'}">
					<van-field
					    :value="newTopicVal"
					    placeholder="请输入话题"
					    :border="true"
					    @change.native="onChange($event)"
						maxlength=20
						clearable
						class="field-input-custom"
					  />
					  
					<van-button class="add-post-topic-new-topic-btn" color="#35C8A6" block :disabled="!newTopicVal" @click.native="handleAddNewTopic">添加</van-button>
				</view>
			</van-action-sheet>
		</view>
	</view>
</template>

<script>
	import BbsTopicCard from "@/components/bbs/BbsTopicCard.vue"
	import BackTopbar from "@/components/common/BackTopbar.vue"
	import { topicList, addNewTopic } from '@/network/api_bbs.js'
	export default {
		components: {
			BbsTopicCard,
			BackTopbar
		},
		data() {
			return {
				windowHeight: 0,
				customBar: 0,
				dataList: [],
				showEdit: 0,	//1为从入口点击“试试添加话题”进来的
				showAddPopup: false,
				newTopicVal: ''
			}
		},
		onLoad(option) {
			if(option.showEdit) {
				this.showEdit = Number(option.showEdit)
			}
		},
		onShow() {
			uni.getSystemInfo({
				success: (e) => {
					// #ifdef MP-WEIXIN
					this.statusBar = e.statusBarHeight
					this.windowHeight = e.windowHeight
					// @ts-ignore
					const custom = wx.getMenuButtonBoundingClientRect()
					this.customBar = custom.bottom + custom.top - e.statusBarHeight
					// #endif
				}
			})
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.getTopicList(pageNo, pageSize).then(res => {
					this.$refs.paging.complete(res);
				})
			},
			//获取话题列表
			getTopicList(pageNo, pageSize) {
				return new Promise((resolve, reject) => {
					topicList({
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
						console.log('topicList: ', err)
					})
				})
			},
			addTopic(item) {
				let pages = getCurrentPages()
				//上一页面 
				let prevPage = pages[pages.length - 2]
				prevPage.$vm.selectedTopic = true
				prevPage.$vm.active = 0
				prevPage.$vm.addedTopicContent = item
				if(this.showEdit > 0) {
					 //从入口点击“试试添加话题”进来的，返回时切换为编辑页面
					 prevPage.$vm.showEdit = true
					 prevPage.$vm.showKeyboard = true
				}
				uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
				    delta: 1
				});
			},
			onClose() {
				this.showAddPopup = false
			},
			onChange(e) {
				this.newTopicVal = e.detail
			},
			openPopup() {
				this.showAddPopup = true
			},
			//发起话题
			handleAddNewTopic() {
				if(this.newTopicVal) {
					addNewTopic({
						'body': this.newTopicVal
					}).then(res => {
						if(res.code === 0 && Object.keys(res.data).length) {
							this.showAddPopup = false
							uni.navigateBack({
								success: () => {
								     let page = getCurrentPages().pop();//跳转页面成功之后
								     if (page) {
										 //返回上一页(都是从addNewPost.vue跳转来的，2个触发点：1.试试添加话题  2.发帖的时候点话题icon添加话题)
										 page.$vm.selectedTopic = true	// 回显话题开关
										 page.$vm.addedTopicContent = res.data	// 回显话题内容
										 if(this.showEdit > 0) {
											 //从入口点击“试试添加话题”进来的，返回时切换为编辑页面
											 page.$vm.showEdit = true
											 page.$vm.showKeyboard = true
										 }
								     }
								}
							})
						} else {
							//toast添加失败todo:
							
						}
					}, err => {
						console.log('addNewTopic: ', err)
					})
				}
			}
			
		}
	}
</script>

<style lang="less" scoped>
.add-post-topic {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	padding: 0 25rpx;
	.add-post-topic-tip {
		font-size: 30rpx;
		font-weight: 600;
		color: rgba(0,0,0,0.3);
		line-height: 42rpx;
		margin-top: 25rpx;
	}
	.add-post-topic-new {
		display: flex;
		justify-content: center;
		color: #35C8A6;
		margin: 40rpx 0;
	}
	.add-post-topic-new-popup {
		.add-post-topic-new-topic-wrap {
			padding: 0 25rpx;
			/deep/ .van-cell {
				margin-bottom: 50rpx;
			}
		}
	}
}
</style>
