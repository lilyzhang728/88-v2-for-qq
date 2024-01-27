// base64转buffer
export function base64ToArrayBuffer(base64) {
	const binaryString = atob(base64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);

	for (let i = 0; i < len; i++) {
	bytes[i] = binaryString.charCodeAt(i);
	}

	return bytes.buffer;
}

// 获取图片base64
export function getImgBase64(localPath) {
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