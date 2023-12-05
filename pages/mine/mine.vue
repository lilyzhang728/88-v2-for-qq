<!-- 档案页：包含：档案，我的 2个子tab -->
<template>
	<view class="mine" style="background-image: url('https://7072-prod-4gkvfp8b0382845d-1314114854.tcb.qcloud.la/static/guide/guideBg.png?sign=71e600a50a8b225db7fbee09ef45653e&t=1687920580');background-size: 100%;background-color: #F8F8F8;background-repeat: no-repeat;">
		<page-tabs :titleList="titleList" :slotName="slotName">
			<template v-slot:index> 
				<index></index>
			</template>
			<template v-slot:guide>
				<guide></guide>
			</template>
		</page-tabs>
		
	</view>
</template>

<script>
	import PageTabs from '@/components/common/PageTabs.vue'
	import index from '@/pages/index/index.vue'
	import guide from '@/pages/guide/guide.vue'
	export default {
		components: {
			PageTabs,
			index,
			guide
		},
		data() {
			return {
				active: 0,
				titleList: ['档案', '我的'],
				slotName: ['index', 'guide']
			}	
		},
		methods: {
			
		}
	}
</script>

<style lang="less" scoped>
	.mine {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		
		
		
	}

</style>
