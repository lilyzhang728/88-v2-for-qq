<!-- 我的报告-未来建议 -->
<template>
	<view class="my-report-plan">
		<view class="my-report-plan-list">
			<view class="my-report-plan-list-item">
				<view class="my-report-plan-list-item-content">
					第一个div的内容<br>可以有多行文字
					第一个div的内容<br>可以有多行文字
				</view>
			</view>
			<view class="my-report-plan-list-item">
				<view class="my-report-plan-list-item-content">
					第二个div的内容<br>可以有多行文字
				</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="less" scoped>
	.my-report-plan {
		.my-report-plan-list {
			position: relative;
			padding-left: 24px; /* 留出左侧圆点+连线的空间 */
			.my-report-plan-list-item {
				position: relative;
				width: 100%;
				margin: 10px 0;
				.my-report-plan-list-item-content {
					background: #f9f9f9;
				}
			}
			/* 左侧圆点 */
			.my-report-plan-list-item::before {
			  content: '';
			  position: absolute;
			  left: -18px; /* 根据容器padding调整位置 */
			  top: 0;
			  width: 12px;
			  height: 12px;
			  border-radius: 50%;
			  background: #ddf289;
			  z-index: 2;
			}
		}
		/* 两个圆点之间的连线 */
		.my-report-plan-list::after {
		  content: '';
		  position: absolute;
		  left: 11px; /* 根据圆点大小调整位置 */
		  top: 50%;
		  height: calc(100% - 24px); /* 根据实际间距调整 */
		  width: 2px;
		  background: #ddf289;
		  transform: translateY(-50%);
		  z-index: 1;
		}
	}
</style>