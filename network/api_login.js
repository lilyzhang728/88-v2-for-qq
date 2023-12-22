import { getRequest, postRequest } from '@/network/https.js'

// login
export function login(params) {
	return postRequest({
		path: '/api/tokens'
	})
}


// 获取性格标签列表（引导页）
export function characterList(params) {
	return getRequest({
		path: '/api/tags/rec',
		data: params
	})
}

// 获取成就标签（徽章库的官方徽章）
export function achievementsList(params) {
	return getRequest({
		path: `/api/recommend/achievements/${params.userId}`,
		data: params
	})
}

// 保存所选性格标签
export function collectCharacterList(params) {
	return postRequest({
		path: `/api/tags/batch-collect`,
		data: params
	})
}
