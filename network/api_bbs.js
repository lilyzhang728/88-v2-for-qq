import { getRequest, postRequest, putRequest, deleteRequest } from '@/network/https.js'
const userId = uni.getStorageSync('userId')

//返回话题列表
export function topicList(params) {
	return getRequest({
		path: `/api/topics/${userId ? userId : uni.getStorageSync('userId')}/rec`,
		data: params
	})
}

//返回关注的话题列表
export function focusedTopic(params) {
	return getRequest({
		path: `/api/user/${userId ? userId : uni.getStorageSync('userId')}/collected-topics`,
		data: params
	})
}

//返回单个评论的全部子评论
export function allReply(params) {
	return getRequest({
		path: `/api/comments/${params}`
	})
}

//点赞评论
export function likeComment(params) {
	return postRequest({
		path: `/api/comments/${params}/like`
	})
}

//取消点赞评论
export function disLikeComment(params) {
	return postRequest({
		path: `/api/comments/${params}/unlike`
	})
}

//发表新评论
export function postComment(params) {
	return postRequest({
		path: `/api/comments`,
		data: params
	})
}

//返回话题详情
export function topicDetail(params) {
	return getRequest({
		path: `/api/topics/${params.id}/posts`,
		data: params
	})
}

//关注话题
export function focusTopic(params) {
	return postRequest({
		path: `/api/topics/${params}/collect`
	})
}

//取消关注话题
export function unFocusTopic(params) {
	return postRequest({
		path: `/api/topics/${params}/un-collect`
	})
}


//发布新话题
export function addNewTopic(params) {
	return postRequest({
		path: `/api/topics`,
		data: params
	})
}

// 删除评论
export function deleteComments(params) {
	return deleteRequest({
		path: `/api/comments/${params}`
	})
}

// 删除帖子
export function deletePosts(params) {
	return deleteRequest({
		path: `/api/posts/${params}`
	})
}

// 删除话题
export function deleteTopics(params) {
	return deleteRequest({
		path: `/api/topics/${params}`
	})
}

// 举报帖子
export function complaintPosts(params) {
	return postRequest({
		path: `/api/posts/${params}/complaint`
	})
}

// 举报话题
export function complaintTopics(params) {
	return postRequest({
		path: `/api/topics/${params}/complaint`
	})
}

// 举报评论
export function complaintComments(params) {
	return postRequest({
		path: `/api/comments/${params}/complaint`
	})
}