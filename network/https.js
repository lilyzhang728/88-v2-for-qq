export const getRequest = (options) => {
	return new Promise((resolve, reject) => {
		// wx.cloud.callContainer({
		// 	"config": {
		// 		"env": "prod-4gkvfp8b0382845d"
		// 	},
		// 	"path": options.path,
		qq.request({
			"url":"https://keypointss.com/"+options.path,
			"header": {
				"X-WX-SERVICE": "flask-opfo",
				"content-type": "application/json",
				"Authorization": "Bearer " + uni.getStorageSync('token'),
				"X-QQ-CODE": uni.getStorageSync('qqCode')
			},
			"data": options.data || {},
			"method": "GET",
			"success": function(res) {
				if(res.statusCode === 200) {
					resolve(res.data)
				} else {
					reject('statusCode' + res.statusCode)
				}
			},
			"fail": function(err) {
				console.log(err)
				reject(err)
			}
		})
	})
}

export const postRequest = (options) => {
	return new Promise((resolve, reject) => {
		// wx.cloud.callContainer({
		// 	"config": {
		// 		"env": "prod-4gkvfp8b0382845d"
		// 	},
		// 	"path": options.path,
		qq.request({
			"url":"https://keypointss.com/"+options.path,
			"header": {
				"X-WX-SERVICE": "flask-opfo",
				"content-type": "application/json",
				"Authorization": "Bearer " + uni.getStorageSync('token'),
				"X-QQ-CODE": uni.getStorageSync('qqCode')
			},
			"data": options.data || {},
			"method": "POST",
			"success": function(res) {
				if(res.statusCode === 200) {
					if(res.data.code === 1) {
						uni.showModal({
							title: '提示',
							content: '您输入的信息可能包含敏感词',
							success: function(res) {
								if (res.confirm) {
									// 执行确认后的操作
								} 
								else {
									// 执行取消后的操作
								}
							}
						})
						reject('敏感词校验失败')
					} else {
						resolve(res.data)
					}
				} else {
					reject('statusCode' + res.statusCode)
				}
			},
			"fail": function(err) {
				console.log(err)
				reject(err)
			}
		})
	})
}

export const putRequest = (options) => {
	return new Promise((resolve, reject) => {
		// wx.cloud.callContainer({
			// "config": {
			// 	"env": "prod-4gkvfp8b0382845d"
			// },
			// "path": options.path,
		qq.request({
			"url":"https://keypointss.com/"+options.path,
			"header": {
				"X-WX-SERVICE": "flask-opfo",
				"content-type": "application/json",
				"Authorization": "Bearer " + uni.getStorageSync('token'),
				"X-QQ-CODE": uni.getStorageSync('qqCode')
			},
			"data": options.data || {},
			"method": "put",
			"success": function(res) {
				if(res.statusCode === 200) {
					if(res.data.code === 1) {
						uni.showModal({
							title: '提示',
							content: '您输入的信息可能包含敏感词',
							success: function(res) {
								if (res.confirm) {
									// 执行确认后的操作
								} 
								else {
									// 执行取消后的操作
								}
							}
						})
						reject('敏感词校验失败')
					} else {
						resolve(res.data)
					}
				} else {
					reject('statusCode' + res.statusCode)
				}
			},
			"fail": function(err) {
				console.log(err)
				reject(err)
			}
		})
	})
}


export const deleteRequest = (options) => {
	return new Promise((resolve, reject) => {
		// wx.cloud.callContainer({
		// 	"config": {
		// 		"env": "prod-4gkvfp8b0382845d"
		// 	},
		// 	"path": options.path,
		qq.request({
			"url":"https://keypointss.com/"+options.path,
			"header": {
				"X-WX-SERVICE": "flask-opfo",
				"content-type": "application/json",
				"Authorization": "Bearer " + uni.getStorageSync('token'),
				"X-QQ-CODE": uni.getStorageSync('qqCode')
			},
			"data": options.data || {},
			"method": "delete",
			"success": function(res) {
				if(res.statusCode === 200) {
					resolve(res.data)
				} else {
					reject('statusCode' + res.statusCode)
				}
			},
			"fail": function(err) {
				console.log(err)
				reject(err)
			}
		})
	})
}
