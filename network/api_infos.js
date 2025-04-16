import { getRequest, postRequest, putRequest, deleteRequest } from '@/network/https.js'
const userId = uni.getStorageSync('userId')

//返回收到的赞列表
export function likeList(params) {
	return getRequest({
		path: `/api/user/${userId ? userId : uni.getStorageSync('userId')}/recived-comments_n_posts-likes`,
		data: params
	})
}

//返回收到的收藏列表
export function collectList(params) {
	return getRequest({
		path: `/api/user/${userId ? userId : uni.getStorageSync('userId')}/recived-posts-collects`,
		data: params
	})
}

//返回收到的评论列表
export function commentList(params) {
	return getRequest({
		path: `/api/user/${userId ? userId : uni.getStorageSync('userId')}/recived-comments`,
		data: params
	})
}


//返回收到的邀请列表
export function mentionList(params) {
	return getRequest({
		path: `/api/user/${userId ? userId : uni.getStorageSync('userId')}/recived-posts-mentions`,
		data: params
	})
}

//返回该用户的新通知(角标)
export function newNotificationNum(params) {
	return getRequest({
		path: `/api/user/${userId ? userId : uni.getStorageSync('userId')}/notifications`,
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

// 获取新通知
export function getNotifications(params) {
	return getRequest({
		path: `/api/user/${userId ? userId : uni.getStorageSync('userId')}/notifications`,
		data: params
	})
}


// 指定用户的帖子
export function getUserPosts(params) {
	return getRequest({
		path: `/api/user/${params.userId}/posts`,
		data: params
	})
}

// 获取测评问卷
export function getQuestionnaires(params) {
	return getRequest({
		path: `/api/questionnaires/rec`,
		data: params
	})
}

// 提交测评问卷
export function submitQuestionnaires(params) {
	return postRequest({
		path: `/api/user/${userId ? userId : uni.getStorageSync('userId')}/questionnaires`,
		data: params
	})
}

// 获取个人档案信息（新接口）
export function getConclusion() {
	return getRequest({
		path: `/api/user/${userId ? userId : uni.getStorageSync('userId')}/questionnaires`
	})
}