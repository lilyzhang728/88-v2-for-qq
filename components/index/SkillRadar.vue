<template>
	<view class="radar-wrap" v-if="showRadar">
		<mpvue-echarts @onInit="initChart" ref="mpecharts" />
	</view>
</template>

<script>
	import * as echarts from "@/common/echarts.min.js"
	import mpvueEcharts from "@/components/index/mpvue-echarts/src/echarts.vue"
	import { rating } from '@/network/api_index.js'
	let chart = null;
	// const userId = uni.getStorageSync('userId')

	export default {
		components: {
			mpvueEcharts
		},
		props: {
			userId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				radarKeys: [],
				option: {
					animation: false,
					// color: ['#1F3EFF', '#FF951F'],
					color: 'rgba(31, 62, 255, 0.7)',
					radar: {
						// shape: 'circle',
						indicator: [
							{
								name: '成绩',
								max: 5
							},
							{
								name: '学术',
								max: 5
							},
							{
								name: '通识',
								max: 5
							},
							{
								name: '专业',
								max: 5
							},
							{
								name: '兴趣',
								max: 5
							},
							{
								name: '声望',
								max: 5
							}
						],
						nameGap: 5, //指示器名称和指示器轴的距离
						axisName: {
							color: '#fff',
							fontSize: 12
						},
						shape: 'circle'
					},
					series: [{
						// name: 'Budget vs spending',
						type: 'radar',
						data: [{
								value: [],
								// name: 'Allocated Budget',
								lineStyle: {
									type: 'solid',
									width: 1
								},
								areaStyle: {
									// 填充颜色
									color: 'rgba(31, 62, 255, 0.1)'
								}
							},
							// {
							// 	value: [5000, 14000, 28000, 26000, 42000, 21000],
							// 	name: 'Actual Spending',

							// }
						],
						symbolSize: 4
					}]
				},
				showRadarImg: false,
				radarImg: '',
				moveLeft: false,
				showRadar: this.userId
			}
		},
		watch: {
			userId(val) {
				if(val) {
					this.showRadar = true
				}
			}
		},
		methods: {
			// initChart 比 onReady先执行
			initChart(e) {
				let {
					canvas,
					width,
					height
				} = e;
				echarts.setCanvasCreator(() => canvas);
				chart = echarts.init(canvas, null, {
					width: width,
					height: height,
				});
				canvas.setChart(chart);
				chart.setOption(this.option);
				this.getChartData()
				//雷达图渲染完成
				chart.on('finished',_=>{
					setTimeout(() => {
					  this.$refs.mpecharts.canvasToImg({
					  		width: width,
					  		height: height,
					  	  })
					}, 500); 
				})
			},
			// 获取用户雷达图
			getChartData() {
				rating(this.userId).then(res => {
					if (res.code == 0 && Object.keys(res.data).length) {
						this.transformValue(res.data)
					} else {
						this.option.series[0].data[0].value = []
					}
					chart.setOption(this.option);
				})
			},
			//转换数据
			transformValue(data) {
				let value = []
				value.push(data.grade, data.academic, data.skill, data.practice, data.interest, data.reputation)
				
				this.option.series[0].data[0].value = value // 改变数据echarts自动重绘
			}
		}
	}
</script>

<style scoped lang="less">
	.radar-wrap {
		height: 100%;
		width: 100%;
	}
</style>
