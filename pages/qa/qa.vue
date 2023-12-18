<!-- 问答页，包括：问答，人脉，2个子tab -->
<template>
	<view class="qa" style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/qa/qaBg.png?sign=dea87806eae980fcf46c05d496c6f02f&t=1702015391');background-size: 100%;background-color: #F8F8F8;background-repeat: no-repeat;">
		<page-tabs :titleList="titleList" :slotName="slotName" ref="pageTabs">
			<template v-slot:questionAndAnswer> 
				<!-- 问答 -->
				<question-and-answer ref="questionAndAnswer"></question-and-answer>			
			</template>
			<template v-slot:connections>
				<!-- 人脉 -->
				<connections ref="connections"></connections>
			</template>
		</page-tabs>
	</view>
</template>

<script>
	import PageTabs from '@/components/common/PageTabs.vue'
	import QuestionAndAnswer from '@/components/qa/QuestionAndAnswer.vue'
	import Connections from '@/components/qa/Connections.vue'
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
	}

</style>
