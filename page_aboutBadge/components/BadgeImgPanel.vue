<!-- 点击上传徽章头像-弹出面板 -->
<template>
	<view class="badge-img-panel">
		<van-popup :show="showPanel" round closeable position="bottom" custom-style="height: auto"
			@close.native="onClose" get-container="#app">
			<view class="badge-img-panel-wrap">
				<view class="badge-img-panel-item" @click="uploadImg('camera')">拍照</view>
				<view class="badge-img-panel-item" @click="uploadImg('album')">从相册选择头像</view>
				<view class="badge-img-panel-item" @click="selectDefaultImg">选择默认头像</view>
			</view>
		</van-popup>
		
		<van-popup :show="showDefaulImg" round closeable position="bottom" custom-style="height: auto"
			@close.native="closeDefaultImg" get-container="#app">
			<view class="badge-img-panel-wrap">
				默认图库
			</view>
		</van-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPanel: false,		// 选择面板是否显示
				showDefaulImg: false	// 默认图库是否显示
			}
		},
		methods: {
			onClose() {
				this.showPanel = false
			},
			uploadImg(type) {
				uni.chooseImage({ // 从本地相册选择图片或使用相机拍照。
					count: 1, //默认选择1张图片
					sizeType: ['original', 'compressed'], //original 原图，compressed 压缩图，默认二者都有
					sourceType: [type],
					success: (res) => {
						console.log(res.tempFilePaths[0])
						this.portraitUrl = res.tempFilePaths[0] //更新本低浏览头像图片
						this.updatePortrait(res.tempFilePaths[0]) //上传图片
					}
				});
			},
			// 从默认图片中选择
			selectDefaultImg() {
				this.showPanel = false
				this.showDefaulImg = true
			},
			closeDefaultImg() {
				this.showDefaulImg = false
			}
		}
	}
</script>

<style lang="less" scoped>
	.badge-img-panel {
		.badge-img-panel-wrap {
			text-align: center;
			padding-top: 30px;
		}
	}
</style>