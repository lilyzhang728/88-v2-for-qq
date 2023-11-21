import { getRequest, postRequest } from '@/network/https.js'

// login
export function login(params) {
	return postRequest({
		path: '/api/tokens'
	})
}
