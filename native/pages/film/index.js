const infoServer = require("../../server/info.js");
const filmServer = require("../../server/film.js");


// pages/index/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [],
        playingFilms: [],
        comingFilms: [],
        test: {
            name: 'zgr'
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getBanner();
        this.getPlayingFilm();
        this.getComingFilm();
        const app = getApp()
    },
    onReady() {
        // console.log('-----onReady-----------')
    },
    onShow() {
      const app = getApp()
      app.ests.initsetPageName('hhhhhhhhhhhhhhhhh')
        // console.log('-----onShow--------')
    },
    /**
     * 分享功能
     */
    onShareAppMessage() {

        return {
    
            title: '弹出分享时显示的分享标题',
    
            desc: '分享页面的内容',
    
            path: '/page/user?id=123' // 路径，传递参数到指定页面。
    
        }
    
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        // console.log('主页的onpull事件------------------')
        this.onLoad();
    },
    // 获取滚动广告
    getBanner() {
        return infoServer.getHomeBanner().then(data => {
            this.setData({ imgUrls: data });
        });
    },
    // 获取正在热映电影列表
    getPlayingFilm() {
        filmServer.getNowPlaying(1, 5).then(data => {
            this.setData({ playingFilms: data.films });
        });
    },
    // 获取即将上映电影列表
    getComingFilm() {
        return filmServer.getComingSoon(1, 5).then(data => {
            data.films.forEach(film => {
                const displayDate = `${new Date(film.premiereAt).getMonth() +
                    1}月${new Date(film.premiereAt).getDate()}日`;
                film.displayDate = displayDate;
            });
            this.setData({ comingFilms: data.films });
        });
    },
    toBannerDetail() {
        wx.showModal({
            title: "提示",
            content: "因打开webview控件需要加入白名单，这里就不做跳转了"
        });
    }
});
