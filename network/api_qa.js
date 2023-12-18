import { getRequest, postRequest, putRequest, deleteRequest } from '@/network/https.js'
const userId = uni.getStorageSync('userId')

// 人脉
export function connections(params) {
	return getRequest({
		path: `/api/users/${userId}/rec`,
		data: params
	})
}

// 邀请回答
export function invideUserAnswer(params) {
	return postRequest({
		path: `/api/posts/${params.id}/mention`,
		data: params
	})
}