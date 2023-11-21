import { getRequest, postRequest } from '@/network/https.js'
const userId = uni.getStorageSync('userId')

// 获取我的徽章
export function collectedAchievements(params) {
	return getRequest({
		path: `/api/user/${userId}/collected-achievements`,
		data: params
	})
}

// 获取徽章库徽章
export function libraryAchievements(params) {
	return getRequest({
		path: `/api/recommend/achievements/${userId}`,
		data: params
	})
}

// 创建用户自定义徽章
export function createAchievements(params) {
	return postRequest({
		path: '/api/achievements',
		data: params
	})
}

// 点亮徽章
export function addToMyBadge(params) {
	return postRequest({
		path: '/api/achievements/batch-collect',
		data: params
	})
}

// 批量获取徽章官方图库图片
export function defaultBadgeImgList() {
	return getRequest({
		path: '/api/achievements/image_list'
	})
}