<template>
	<view class="timeline-swiper">
		<view class="uni-margin-wrap">
			<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration" :current="current" @change="handleChange">
				<swiper-item class="timeline-swiper-item" v-for="(item, index) in yearList" :key="index">
					<timeline-swiper-card :cardIndex="index+1" :year="item" @changeMonth="changeMonth"></timeline-swiper-card>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
const CURRENT_YEAR = new Date().getFullYear()
import TimelineSwiperCard from "@/components/timeline/TimelineSwiperCard.vue"
export default {
	props: {
		start_year: {
			type: Number,
			required: true,
			default: 2020
		},
		graduate_year: {
			type: Number,
			required: true,
			default: 2028
		},
	},
	components: {
		TimelineSwiperCard
	},
    data() {
        return {
            indicatorDots: false,
            autoplay: false,
            interval: 2000,
            duration: 500,
			current: 0,
        }
    },
	watch: {
		start_year(val) {
			this.current = CURRENT_YEAR - val
		}
	},
	computed: {
		yearList() {
			let arr = []
			for(let  i = 0; i < this.graduate_year - this.start_year + 1; i++ ) {
				arr.push(this.start_year + i)
			}
			return arr
		}
	},
    methods: {
        handleChange(e) {
			this.current = e.detail.current
			this.$emit('changeDate', new Date().getMonth()+1, this.start_year + e.detail.current)
		},
		changeMonth(monthIndex, year) {
			// monthIndex:当前选中月份-1
			this.$emit('changeDate', monthIndex + 1, year)
		}
    }
}
</script>


<style lang="less" scoped>
	.timeline-swiper {
		margin-top: 20rpx;
		.uni-margin-wrap {
			// width: 690rpx;
			width: 100%;
			.swiper {
				height: 292rpx;
				.timeline-swiper-item {
					// box-shadow: 2px 2px 2px #ccc inset;
				}
			}
		}
	}
</style>