import { getRequest, postRequest, putRequest, deleteRequest } from '@/network/https.js'

export async function imgSecCheck(param) {
	return new Promise((resolve, reject) => {
		requestCheck({
			source: param
		}).then(res => {
			if(res.code === 0) {
				//鉴黄通过
				resolve()
			} else {
				reject()
			}
		}, err => {
			reject()
		})
	})
}

function requestCheck(params) {
	return postRequest({
		path: '/api/util/img_sec_check',		//后台接口地址
		data: params
	})
}

async function getImgBase64(localPath) {
	console.log('localPath', localPath)
	return new Promise((resolve, reject) => {
		uni.getFileSystemManager().readFile({
			filePath: localPath,
			encoding: 'base64',
			success: res => {
				let datas = res.data
				// console.log('datas', datas)
				// const base64 = uni.arrayBufferToBase64(datas)
				resolve({
					code: 200,
					result: datas
				})
			},
			fail: (e) => {
				console.error('getImgBase64 fail', e)
				reject({
					message: 'base64转换出错'
				})
			}
		})
	})
}
