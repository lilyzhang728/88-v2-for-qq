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
		// return (cur_year - year) + '年前'
		return year + '-' + month + '-' + day
	}
	if(cur_month > month) {
		return month + '-' + day
	}
	if(cur_day - day > 1) {
		return month + '-' + day
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
	if(cur_second > second) {
		return (cur_second - second) + '秒钟前'
	}
	return '刚刚'
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

// 将日期格式从 YYYY-MM-DD HH:mm:ss 转换为 M/D HH:mm:ss
export function convertDateFormat(dateString) {
	const date = new Date(dateString);

	const month = date.getMonth() + 1; // getMonth() 返回的月份是从0开始的
	const day = date.getDate();

	// 将单个数字格式化为两位数（例如，'1' 变为 '01'）
	// const formattedMonth = month < 10 ? `0${month}` : month;
	// const formattedDay = day < 10 ? `0${day}` : day;

	// 获取时间部分
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	// 格式化时间部分
	const formattedHours = hours < 10 ? `0${hours}` : hours;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
	const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

	// 组合新的日期格式
	return `${month}/${day} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

