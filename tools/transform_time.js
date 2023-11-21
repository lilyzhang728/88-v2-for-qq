// 转换时间
export function transformTime(val) {
	let date = val.split(' ')[0],
		year = date.split('-')[0],
		month = date.split('-')[1],
		day = date.split('-')[2],
		time = val.split(' ')[1],
		hour = time.split(':')[0],
		minute = time.split(':')[1],
		second = time.split(':')[2]
	let now = new Date(),
		cur_year = now.getFullYear(),
		cur_month = now.getMonth() + 1,
		cur_day = now.getDate(),
		cur_hour = now.getHours(),
		cur_minute = now.getMinutes(),
		cur_second = now.getSeconds()
	if(cur_year > year) {
		return (cur_year - year) + '年前'
	}
	if(cur_month > month) {
		return year + '-' + month
	}
	if(cur_day - day > 1) {
		return year + '-' + month
	}
	if(cur_day - day == 1) {
		return '昨天' + hour + ':' + minute
	}
	if(cur_hour > hour) {
		return (cur_hour - hour) + '小时前'
	}
	if(cur_minute > minute) {
		return (cur_minute - minute) + '分钟前'
	}
	return (cur_second - second) + '秒钟前'
}



//点赞、评论数转化
export function transformMaxNum(val) {
	if(!val) {
		return 0
	}
	let val_str = val.toString()
	if(val_str.length < 5) {
		return val
	}
	return (val_str.slice(0, val_str.length - 4)) + 'w+'
}