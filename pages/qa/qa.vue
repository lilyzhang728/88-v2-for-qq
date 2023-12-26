<!-- 问答页，包括：问答，人脉，2个子tab -->
<template>
	<view class="qa" style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/qa/qaBg.png?sign=dea87806eae980fcf46c05d496c6f02f&t=1702015391');background-size: 100%;background-color: #F8F8F8;background-repeat: no-repeat;">
		<page-tabs :titleList="titleList" :slotName="slotName" ref="pageTabs" @changeTab="changeTab">
			<template v-slot:questionAndAnswer> 
				<!-- 问答 -->
				<question-and-answer ref="questionAndAnswer" :active="active" @toastMsg="toastMsg"></question-and-answer>			
			</template>
			<template v-slot:connections>
				<!-- 人脉 -->
				<connections ref="connections" :active="active"></connections>
			</template>
		</page-tabs>
		
		<!-- toast提示 -->
		<van-toast id="van-toast" />
		
		<!-- 新增问答按钮 -->
		<img class="guide-add-btn" src="cloud://prod-4gkvfp8b0382845d.7072-prod-4gkvfp8b0382845d-1314114854/static/guide/editBtn.png" alt="" @click.stop="addNewQuestion($event)">
		
	</view>
</template>

<script>
	import PageTabs from '@/components/common/PageTabs.vue'
	import QuestionAndAnswer from '@/components/qa/QuestionAndAnswer.vue'
	import Connections from '@/components/qa/Connections.vue'
	import Toast from '@/wxcomponents/vant/toast/toast'
	export default {
		components: {
			PageTabs,
			QuestionAndAnswer,
			Connections
		},
		data() {
			return {
				active: 0,
				titleList: ['问答', '人脉'],
				slotName: ['questionAndAnswer', 'connections'],
			}
		},
		methods: {
			changeTab(index) {
				this.active = index
			},
			toastMsg(type) {
				if(type) {
					Toast('邀请成功！')
				} else {
					Toast('邀请失败')
				}
			},
			addNewQuestion(e) {
				e.preventDefault();
				uni.navigateTo({
					url: `/page_qa/askQuestion/askQuestion`
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.qa {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		
		.guide-add-btn {
			width: 128rpx;
			height: 80rpx;
			position: fixed;
			right: 0;
			bottom: 270rpx;
		}
	}

</style>
