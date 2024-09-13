export default {
    data() {
        return {
            share: {
                // 转发的标题 （默认标题）
                title: '默认标题--分享标题',
                // 默认是当前页面，必须是以‘/’开头的完整路径
                path: '/pages/launch/launch',
                //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，
                //支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
                imageUrl: ''
            }
        }
    },
    // 发送给朋友
    onShareAppMessage(res) {
         return {
          title: '来勾重点，帮你快速攻略大学生活～',
          path: '/pages/launch/launch',
        }
    },
    //分享到朋友圈
    // onShareTimeline(res) {
    //      return {
    //       title: '来勾重点，帮你快速攻略大学生活～',
    //       path: '/pages/launch/launch',
    //     }
    // }
}
