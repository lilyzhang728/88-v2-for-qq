import { getRequest, postRequest, putRequest, deleteRequest } from '@/network/https.js'
const userId = uni.getStorageSync('userId')

// 获取攻略列表——发现
export function recArticle(params) {
	return getRequest({
		path: `/api/posts/${userId ? userId : uni.getStorageSync('userId')}/rec`,
		data: params
	})
}

// 攻略详情
export function guideDetail(params) {
	return getRequest({
		path: `/api/posts/${params}`
	})
}

// 添加一篇新文章
export function addGuide(params) {
	return postRequest({
		path: `/api/posts`,
		data: params
	})
}

// 删除一篇新文章
export function deleteGuide(params) {
	return deleteRequest({
		path: `/api/posts/${params}`
	})
}

// 编辑一篇新文章
export function editGuide(params) {
	return putRequest({
		path: `/api/posts/${params.id}`,
		data: params
	})
}

// 点赞
export function likeGuide(params) {
	return postRequest({
		path: `/api/posts/${params}/like`
	})
}

// 取消点赞
export function disLikeGuide(params) {
	return postRequest({
		path: `/api/posts/${params}/unlike`
	})
}

// 收藏
export function collectGuide(params) {
	return postRequest({
		path: `/api/posts/${params}/collect`
	})
}

// 取消收藏
export function unCollectGuide(params) {
	return postRequest({
		path: `/api/posts/${params}/un-collect`
	})
}

// 获取新版资讯卡片列表
export function commonCardNew(params) {
	return postRequest({
		path: `/api/posts/${userId ? userId : uni.getStorageSync('userId')}/rec`,
		data: params
	})
}