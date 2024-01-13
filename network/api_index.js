import { getRequest, postRequest, putRequest, deleteRequest } from '@/network/https.js'
const userId = uni.getStorageSync('userId')

// 雷达图数据
export function rating(params) {
	return getRequest({
		path: `/api/user/${params}/rating`
	})
}

// 查询个人信息
export function profile(params) {
	return getRequest({
		path: `/api/user/${params}/profile`
	})
}

// 更新个人信息
export function updateProfile(params) {
	return putRequest({
		path: `/api/user/${userId}/profile`,
		data: params
	})
}

// 查询用户徽章列表
export function getBadgeList(params) {
	return getRequest({
		path: `/api/user/${params.userId}/collected-achievements`,
		data: params
	})
}

// 查徽章详情
export function badgeDetail(params) {
	return getRequest({
		path: `/api/achievements/${params}`
	})
}

//获取用户为徽章评分
export function badgeDetailRating(params) {
	return getRequest({
		path: `/api/achievements/${params}/rating`
	})
}

// 用户为徽章评分
export function badgeDetailRatingPost(params) {
	return postRequest({
		path: `/api/achievements/${params.badgeId}/rating`,
		data: {
			'rating': params.rating
		}
	})
}

// 获取徽章库列表
export function badgeLibraryList(params) {
	return getRequest({
		path: '/api/skills/achievements/list',
		data: params
	})
}

// 修改自定义徽章的相关信息(修改基础信息，进行评分)
export function editBadgeInfo(params) {
	return postRequest({
		path: '/api/skills/achievements/achievement_info',
		data: params
	})
}

// 获取大事年表-收藏事件
export function eventListStar(params) {
	return getRequest({
		path: `/api/user/${params.userId}/collected-events`,
		data: params
	})
}

// 获取大事年表-公共事件
export function eventListPublic(params) {
	return getRequest({
		path: `/api/recommend/events/${params.userId}`,
		data: params
	})
}

// 用户创建日历事件
export function createEvent(params) {
	return postRequest({
		path: `/api/events`,
		data: params
	})
}

//获取日历事件详情
export function eventDetail(params) {
	return getRequest({
		path: `api/events/${params}`
	})
}

//修改日历事件
export function editEvent(params) {
	return putRequest({
		path: `api/events/${params.id}`,
		data: params
	})
}

//删除日历事件
export function deleteEvent(params) {
	return deleteRequest({
		path: `api/events/${params}`
	})
}

//收藏日历事件
export function starEvent(params) {
	return postRequest({
		path: `api/events/${params}/collect`
	})
}

//取消收藏日历事件
export function unStarEvent(params) {
	return deleteRequest({
		path: `api/events/${params}/un-collect`
	})
}


//一键添加至大事年表,新建事件，同步至后台
export function eventRecord(params) {
	return postRequest({
		path: `api/posts/${params}/record`
	})
}


//搜索-文章（tab2,3,4的文章）
export function searchArticle(params) {
	return getRequest({
		path: `/api/posts/${userId}/search`,
		data: params
	})
}

//搜索-徽章
export function searchBadge(params) {
	return getRequest({
		path: `/api/achievements/${userId}/search`,
		data: params
	})
}

//搜索-话题
export function searchTopic(params) {
	return getRequest({
		path: `/api/topics/${userId}/search`,
		data: params
	})
}

//搜索-人脉
export function searchUser(params) {
	return getRequest({
		path: `/api/users/${userId}/search`,
		data: params
	})
}

//获取标签列表
export function tagsList(params) {
	return getRequest({
		path: `/api/user/${userId}/collected-tags`,
		data: params
	})
}

// 我的-收藏
export function myCollectionList(params) {
	return getRequest({
		path: `/api/user/${userId}/collected-posts`,
		data: params
	})
}

// 我的-干货，问答，动态  参数：干货1，问答4，动态3
export function myProductionList(params) {
	return getRequest({
		path: `/api/user/${userId}/posts`,
		data: params
	})
}

