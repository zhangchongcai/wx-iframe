// var config = require('./config.js');

const userTrajectory = ()=> {
  var that = this;

  // èŽ·å–ç”¨æˆ·æ“ä½œè½¨è¿¹
  that.getUserTrajectory = function(opType, opEvent, opEventId, opnEventDetail) {
    //userTrajectoryArr = 'ç”¨æˆ·è½¨è¿¹æ•°ç»„',opTime = 'æ“ä½œçš„æ—¶é—´æˆ³', pagePath = 'é¡µé¢è·¯å¾„'
    //opType = 'æ“ä½œç±»åž‹', opEvent = 'æ“ä½œäº‹ä»¶',opEventId = 'æ“ä½œäº‹ä»¶ID',opnEventDetail = 'æ“ä½œäº‹ä»¶è¯¦æƒ…'

    let pagePath = getCurrentPages()[getCurrentPages().length - 1].route;
    let itemObj = {
      opTime: new Date().getTime(),
      pagePath,
      opType,
      opEvent,
      opEventId,
      opnEventDetail
    };
    console.log('itemObj', itemObj)


    // ç”¨æˆ·æ“ä½œè½¨è¿¹æ’å…¥åˆ°ç¼“å­˜
    let userTrajectoryArr = wx.getStorageSync('userTrajectoryArr') ? wx.getStorageSync('userTrajectoryArr') : [];
    userTrajectoryArr.push(itemObj);
    wx.setStorageSync('userTrajectoryArr', userTrajectoryArr);

    if (that.rUTPromise) {
      that.rUTPromise.then(function(resolve) {
        that.funcRUTPromise(); //ç½‘ç»œè¯·æ±‚é˜»å¡ž
      })
    } else {
      that.funcRUTPromise(); //ç½‘ç»œè¯·æ±‚é˜»å¡ž
    }

  };

  //ç½‘ç»œè¯·æ±‚é˜»å¡ž
  that.funcRUTPromise = function() {
    let nowTime = new Date().getTime();
    let userTrajectoryStartTime = wx.getStorageSync('userTrajectoryStartTime');

    return that.rUTPromise = new Promise((resolve) => {

      // ç¼“å­˜é•¿åº¦å¤§äºŽç­‰äºŽ10å°±æäº¤åˆ°åŽç«¯
      if (wx.getStorageSync('userTrajectoryArr').length >= 10) {
        that.requestUserTrajectory(resolve);
        return;
      }

      // åˆ¤æ–­ç¼“å­˜æ—¶é—´ï¼Œè¶…è¿‡ä¸¤åˆ†é’Ÿå°±æäº¤åˆ°åŽç«¯
      if (userTrajectoryStartTime) {
        if (nowTime - userTrajectoryStartTime > 2 * 60 * 1000) {
          console.log('ç”¨æˆ·è½¨è¿¹ç¼“å­˜æ—¶é—´ï¼Œè¶…è¿‡ä¸¤åˆ†é’Ÿ');
          that.requestUserTrajectory(resolve);
        } else {
          resolve(true);
        }
      } else {
        wx.setStorageSync('userTrajectoryStartTime', nowTime);
        resolve(true);
      }
    })
  };
  // æäº¤ç”¨æˆ·æ“ä½œè½¨è¿¹
  that.requestUserTrajectory = function(resolve) {
    // intoId = 'è¿›å…¥å°ç¨‹åºçš„åœºæ™¯å€¼ID', originId = 'æ¥æºID',userToken = 'ç”¨æˆ·æ ‡è¯†',upTime = 'ä¸Šä¼ ä¿¡æ¯çš„æ—¶é—´æˆ³',
    let appOption = wx.getLaunchOptionsSync();
    let intoId = appOption.scene;
    let originId;
    let userToken = wx.getStorageSync('openid');
    let upTime = new Date().getTime();

    // èŽ·å–æ¥æºID
    if (appOption.referrerInfo && appOption.referrerInfo.extraData && appOption.referrerInfo.extraData.originId) {
      originId = appOption.referrerInfo.extraData.originId;
    }

    let data = {
      intoId,
      originId,
      userToken,
      upTime,
      userTrajectoryArr: []
    };
    let utArr = wx.getStorageSync('userTrajectoryArr'); //å½“å‰çš„ç”¨æˆ·è½¨è¿¹ç¼“å­˜æ•°ç»„
    data.userTrajectoryArr = JSON.stringify(utArr);
    // console.log('ç”¨æˆ·è½¨è¿¹:', data);

    wx.request({
      url: 'https://tsapiqa.escase.cn/i',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: data,
      success: function(res) {
        wx.setStorageSync('userTrajectoryArr', that.arrayWeightRemoval(utArr, wx.getStorageSync('userTrajectoryArr')));
        wx.setStorageSync('userTrajectoryStartTime', new Date().getTime());
        console.log('save.do-res', res);
        resolve(res);
      },
      fail: function(err) {
        console.log('save.do-err', err);
        resolve(err);
      }
    })

  };

  // æ•°æ®åŽ»é‡
  that.arrayWeightRemoval = function(array1, array2) {

    //ä¸´æ—¶æ•°ç»„å­˜æ”¾
    var tempArray1 = []; //ä¸´æ—¶æ•°ç»„1
    var tempArray2 = []; //ä¸´æ—¶æ•°ç»„2

    for (var i = 0; i < array2.length; i++) {
      tempArray1[array2[i]] = true; //å°†æ•°array2 ä¸­çš„å…ƒç´ å€¼ä½œä¸ºtempArray1 ä¸­çš„é”®ï¼Œå€¼ä¸ºtrueï¼›
    }

    for (var i = 0; i < array1.length; i++) {
      if (!tempArray1[array1[i]]) {
        tempArray2.push(array1[i]); //è¿‡æ»¤array1 ä¸­ä¸Žarray2 ç›¸åŒçš„å…ƒç´ ï¼›
      }
    }
    return tempArray2;
  }
}
export default userTrajectory
