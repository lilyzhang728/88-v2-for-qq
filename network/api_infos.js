import { getRequest, postRequest, putRequest, deleteRequest } from '@/network/https.js'
const userId = uni.getStorageSync('userId')

//返回收到的赞列表
export function likeList(params) {
	return getRequest({
		path: `/api/user/${userId}/recived-posts-likes`,
		data: params
	})
}

//返回收到的收藏列表
export function collectList(params) {
	return getRequest({
		path: `/api/user/${userId}/recived-posts-collects`,
		data: params
	})
}

//返回收到的评论列表
export function commentList(params) {
	return getRequest({
		path: `/api/user/${userId}/recived-comments`,
		data: params
	})
}

//返回收到的关注列表
export function followerList(params) {
	return getRequest({
		path: `/api/user/${userId}/followers`,
		data: params
	})
}

//返回该用户的新通知(角标)
export function newNotificationNum(params) {
	return getRequest({
		path: `/api/user/${userId}/notifications`,
		data: params
	})
}

//私信消息list
export function messagesList(params) {
	return getRequest({
		path: `/api/user/${userId}/messages`,
		data: params
	})
}

//返回我与某个用户(由查询参数 from 获取)之间的所有私信记录
export function historyChat(params) {
	return getRequest({
		path: `/api/user/${userId}/history-messages`,
		data: params
	})
}

//给其它用户发送私信
export function sendMessage(params) {
	return postRequest({
		path: `/api/messages`,
		data: params
	})
}

// 个人主页-查询个人信息
export function profile(id) {
	return getRequest({
		path: `/api/user/${id}/profile`
	})
}

// 个人主页-查询雷达图数据
export function rating(id) {
	return getRequest({
		path: `/api/user/${id}/rating`
	})
}

// 个人主页-查询用户徽章列表
export function getBadgeList(params) {
	return getRequest({
		path: `/api/user/${params.id}/collected-achievements`,
		data: params
	})
}

// 个人主页-查询攻略列表
export function ownArticle(params) {
	return getRequest({
		path: `/api/user/${params.id}/posts`,
		data: params
	})
}

// 个人主页-关注一个用户
export function follow(params) {
	return postRequest({
		path: `/api/user/follow/${params}`
	})
}

// 个人主页-取消关注一个用户
export function unfollow(params) {
	return postRequest({
		path: `/api/user/unfollow/${params}`
	})
}