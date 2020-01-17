var _ = {};

var QA_URL = 'https://tsapiqa.escase.cn/i',
  PROD_URL = 'https://tsapi.escase.cn/collection/i'

var ests = {};

ests._config = {
  debug: false,
  appVersion: ''
}

ests.pageCustom = {}

var logger = {};

logger.info = function () {
  if (ests._config.debug) {
    if (typeof console === 'object' & console.log) {
      try {
        return console.log.apply(console, arguments);
      } catch (e) {
        console.log(e);
        console.log(arguments[0]);
      }
    }
  }
}

var prev_path = '';
var prev_session_id = '';
var pageQueryString = '';
var currentPath = '';
var startSessionTime;
var peChannel = '';
var scene = '';
// TODO: businiess_channel

var SCENE_MAP = {
  1000: '其他',
  1001: '发现栏小程序主入口，「最近使用」列表（基础库2.2.4版本起包含「我的小程序」列表）',
  1005: '顶部搜索框的搜索结果页',
  1006: '发现栏小程序主入口搜索框的搜索结果页',
  1007: '单人聊天会话中的小程序消息卡片',
  1008: '群聊会话中的小程序消息卡片',
  1011: '扫描二维码',
  1012: '长按图片识别二维码',
  1013: '手机相册选取二维码',
  1014: '小程序模版消息',
  1017: '前往体验版的入口页',
  1019: '微信钱包',
  1020: '公众号 profile 页相关小程序列表',
  1022: '聊天顶部置顶小程序入口',
  1023: '安卓系统桌面图标',
  1024: '小程序 profile 页',
  1025: '扫描一维码',
  1026: '附近小程序列表',
  1027: '顶部搜索框搜索结果页“使用过的小程序”列表',
  1028: '我的卡包',
  1029: '卡券详情页',
  1030: '自动化测试下打开小程序',
  1031: '长按图片识别一维码',
  1032: '手机相册选取一维码',
  1034: '微信支付完成页',
  1035: '公众号自定义菜单',
  1036: 'App 分享消息卡片',
  1037: '小程序打开小程序',
  1038: '从另一个小程序返回',
  1039: '摇电视',
  1042: '添加好友搜索框的搜索结果页',
  1043: '公众号模板消息',
  1044: '带 shareTicket 的小程序消息卡片（详情)',
  1045: '朋友圈广告',
  1046: '朋友圈广告详情页',
  1047: '扫描小程序码',
  1048: '长按图片识别小程序码',
  1049: '手机相册选取小程序码',
  1052: '卡券的适用门店列表',
  1053: '搜一搜的结果页',
  1054: '顶部搜索框小程序快捷入口',
  1056: '音乐播放器菜单',
  1057: '钱包中的银行卡详情页',
  1058: '公众号文章',
  1059: '体验版小程序绑定邀请页',
  1064: '微信连Wi-Fi状态栏',
  1067: '公众号文章广告',
  1068: '附近小程序列表广告',
  1069: '移动应用',
  1071: '钱包中的银行卡列表页',
  1072: '二维码收款页面',
  1073: '客服消息列表下发的小程序消息卡片',
  1074: '公众号会话下发的小程序消息卡片',
  1077: '摇周边',
  1078: '连Wi-Fi成功页',
  1079: '微信游戏中心',
  1081: '客服消息下发的文字链',
  1082: '公众号会话下发的文字链',
  1084: '朋友圈广告原生页',
  1088: '会话中查看系统消息，打开小程序',
  1089: '微信聊天主界面下拉',
  1090: '长按小程序右上角菜单唤出最近使用历史',
  1091: '公众号文章商品卡片',
  1092: '城市服务入口',
  1095: '小程序广告组件',
  1096: '聊天记录',
  1097: '微信支付签约页',
  1099: '页面内嵌插件',
  1102: '公众号 profile 页服务预览',
  1103: '发现栏小程序主入口，“我的小程序”列表',
  1104: '微信聊天主界面下拉，“我的小程序”栏',
  1106: '聊天主界面下拉，从顶部搜索结果页，打开小程序',
  1107: '订阅消息，打开小程序',
  1113: '安卓手机负一屏，打开小程序(三星)',
  1114: '安卓手机侧边栏，打开小程序(三星)',
  1124: '扫“一物一码”打开小程序',
  1125: '长按图片识别“一物一码”',
  1126: '扫描手机相册中选取的“一物一码”',
  1129: '微信爬虫访问',
  1131: '浮窗打开小程序',
  1146: '地理位置信息打开出行类小程序',
  1148: '卡包-交通卡，打开小程序'
};

_.getMPScene = function (key) {
  if (typeof key === "number" || (typeof key === "string" && key !== "")) {
    key = String(key);
    return SCENE_MAP[key] || key;
  } else {
    return "未取到值";
  }
};

var breaker = {};

_.each = function (obj, iterator, context) {
  if (obj == null) {
    return false;
  }
  if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0,
      l = obj.length; i < l; i++) {
      if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
        return false;
      }
    }
  } else {
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === breaker) {
          return false;
        }
      }
    }
  }
};

_.extend = function (obj) {
  _.each(Array.prototype.slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

_.isObject = function (obj) {
  if (obj === undefined || obj === null) {
    return false;
  } else {
    return (toString.call(obj) == '[object Object]');
  }
};

_.isEmptyObject = function (obj) {
  if (_.isObject(obj)) {
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }
  return false;
};

_.getUUID = function () {
  return "" + Date.now() + '-' + Math.floor(1e7 * Math.random()) + '-' + Math.random().toString(16).replace('.', '') + '-' + String(Math.random() * 31242).replace('.', '').slice(0, 8);
}
_.getCurrentPage = function () {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

_.getCurrentPath = function () {
  var url = '未取到';
  try {
    var currentPage = _.getCurrentPage()
    url = currentPage.route;
  } catch (e) {
    logger.info(e);
  };
  return url;
};

_.getPath = function (path) {
  if (typeof path === 'string') {
    path = path.replace(/^\//, '');
  } else {
    path = '取值异常';
  }
  return path;
};

_.getSystemInfo = function () {
  if (!ests.systemInfo) {
    ests.systemInfo = wx.getSystemInfoSync();
  }

  return ests.systemInfo;
}

_.getNet = function (callback) {
  wx.getNetworkType({
    complete: function (r) {
      callback({ network_type: r['networkType'] })
    }
  })
}
_.formatSystem = function (system) {
  var _system = system.split(/\s/)[0].toLowerCase();
  if (_system === 'ios') {
    return 'iOS';
  } else if (_system === 'android') {
    return 'Android';
  } else {
    return system;
  }
}

_.getSystemProps = function () {
  var info = _.getSystemInfo();
  return {
    platform: info['platform'],
    device_system: _.formatSystem(info['system']),
    device_brand: info['brand'],
    device_model: info['model'],
    device_screenWidth: info['screenWidth'],
    device_screenHeight: info['screenHeight']
  }
}

var stardard_utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
_.getUtmFromQuery = function (query) {
  var result = {};
  for (var u in stardard_utm) {
    if (query.hasOwnProperty(u)) {
      result[u] = JSON.parse(decodeURIComponent(query[u]))
    }
  }
  return result
}


_.setPEChannelFromQuery = function (query) {
  if (query.hasOwnProperty('pe_channel')) {
    peChannel = query['pe_channel']
  } else {
    peChannel = ''
  }
}

_.getQueryString = function (query) {
  var queryString = '';
  if (query && _.isObject(query) && !_.isEmptyObject(query)) {
    var arr = [];
    _.each(query, function (value, key) {
      if (key !== 'scene') {
        arr.push(key + '=' + value);
      }
    })
    return arr.join('&');
  } else {
    return queryString;
  }
}

_.getPageUrl = function () {
  var pageUrl = currentPath;
  if (pageQueryString && pageQueryString !== '') {
    pageUrl = currentPath + '?' + pageQueryString;
  }
  return pageUrl;
}
_.getUtm = function () {
  const utmArgs = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'business_channel',
    'channel',
    'pe_channel'
  ]
  let result = {}
  try {
    const currentPage = _.getCurrentPage()
    const options = currentPage.options
    if (options.hasOwnProperty("utm_source") || options.hasOwnProperty("business_channel") || options.hasOwnProperty("channel")) {
      for (let key in options) {
        const value = options[key]
        if (utmArgs.indexOf(key) != -1) {
          result[key] = decodeURIComponent(value)
        }
      }
    }
  } catch(err) {
    console.log('err:', err)
  }
  return result
}


_.getPageTitle = function () {
  let pageTitle = ''
  if (__wxConfig) {
    pageTitle = __wxConfig.page[_.getCurrentPath() + ".html"].window.navigationBarTitleText || __wxConfig.global.window.navigationBarTitleText
  }
  return pageTitle
}

_.sendRequest = function (data) {
  data.current_path = currentPath; // 当前路径
  data.scene = scene // 场景
  data.page_id = data.page_id || currentPath;
  data.page_url = _.getPageUrl()

  data.device_id = 'TS_' + ests.store.getDeviceId();
  data.app_key = ests._config.appKey;
  data.sdk_type = 'js',
    data.sdk_name = 'wx_track',
    data.sdk_version = '2.0'
  data.open_id = 'defaultOpen_id'
  data.union_id = 'defaultUnion_id'
  data.custom_id = 'defaultCustom_id'
  data.custom_userInfo = ''
  data.pe_channel = 'default'
  data.business_channel = 'default'
  data.timestamp = new Date().getTime();
  data = _.extend(data, _.getSystemProps());
  if (ests._config.debug) {
    console.log(data);
  }
  wx.getSetting({
    success: function (res) {
      if (res.authSetting['scope.userInfo']) {
        data.authorize = true
      } else {
        data.authorize = false
      }
      wx.request({
        url: ests._config.serverUrl,
        method: 'POST',
        data: data,
        success: function (r) {
          if (ests._config.debug) {
            console.log('send request success: ', r.code)
          }
        }
      })
    }
  })
}

_.trackingPageView = function (data) {
  _.getNet(function (d) {
    data.key = 'pageview';
    if (peChannel !== '') {
      data.pe_channel = peChannel;
    }
    var _data = {
      page_name: ests.pageCustom.page_name || _.getPageTitle(),
      start_session_time: startSessionTime,
      prev_session_id: prev_session_id
    }
    if (ests.pageCustom.pageview_param) {
      data.pageview_param = ests.pageCustom.pageview_param
    }
    data = _.extend(data, _data)
    data = _.extend(data, _.getSystemProps());
    data = _.extend(data, d);
    data = _.extend(data, _.getUtm())
    _.sendRequest(data);
  })
}

_.trackingEvent = function (data) {
  _.getNet(function (d) {
    if (peChannel !== '') {
      data.pe_channel = peChannel;
    }
    data = _.extend(data, _.getSystemProps());
    data = _.extend(data, d);
    data = _.extend(data, _.getUtm())
    _.sendRequest(data);
  })
}

ests._ = _;

ests.store = {
  setStorageSync: function (key, val, flag) {
    try {
      wx.setStorageSync(key, val);
    } catch (e) {
      !1 !== i && (console.log(e), this.setStorageSync(key, val, !1));
    }
  },
  getStorageSync: function (key) {
    var val = '';
    try {
      val = wx.getStorageSync(key);
    } catch (e) {
      try {
        val = wx.getStorageSync(key);
      } catch (ee) {
        console.log('getStorage fail');
      }
    }
    return val;
  },
  setDeviceId() {
    this.setStorageSync("ts_device_id", _.getUUID())
  },
  getDeviceId() {
    return this.getStorageSync("ts_device_id")
  },
  setSessionId() {
    this.setStorageSync("ts_session_id", _.getUUID())
  },
  getSessionId() {
    return this.getStorageSync("ts_session_id")
  }
}

ests.autoTrackCustom = {
  appLaunch: function (para) {
    if (typeof this === 'object') {
      this['ests'] = ests
    }
    var data = {};
    if (para && para.path) {
      data.page_id = data.current_path = _.getPath(para.path);
      data.page_url = data.current_path + _.getQueryString(para.query);
    }
    scene = _.getMPScene(para.scene)
    data.key = 'event'
    data.event_id = 'firstLaunch',
      data.event_name = '首次启动'
    _.trackingEvent(data)
    // 获取用户信息
    var locallUserInfo = ests.store.getStorageSync('$userInfo')
    if (locallUserInfo) {
      locallUserInfo = JSON.parse(locallUserInfo)
      ests.setUserInfo(locallUserInfo, true)
    } else {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({  //用户信息
              lang: 'zh_CN',
              success: (res) => {
                let { userInfo } = res
                for (const key in userInfo) {
                  data[key] = userInfo[key]
                }
                //获取到微信用户信息,则发送保存用户信息请求（增量）
                var _userInfo = JSON.stringify(userInfo)
                ests.store.setStorageSync('$userInfo', _userInfo)
                ests.setUserInfo(userInfo, true)
              },
              fail: (err) => {
                console.log('错误', err)
              }
            })
          }
        }
      })
    }

  },
  appShow: function (para) {
    var data = {};
    if (para && para.path) {
      data.page_url = data.page_id = data.current_path = _.getPath(para.path);
      data.page_query = _.getQueryString(para.query)
      if (data.page_query !== '') {
        data.page_url = data.current_path + '?' + _.getQueryString(para.query);
      }
    }

    data.scene = _.getMPScene(para.scene)
    data.key = 'event'
    data.event_id = 'start'
    data.event_name = '启动'
    var utms = _.getUtmFromQuery(para.query);
    _.setPEChannelFromQuery(para.query);

    _.trackingEvent(data)
  },
  appHide: function (para) {
    // ests._sessionEnd()
    if (typeof this === 'object') {
      this['ests'] = ests
    }
    var data = {};
    if (para && para.path) {
      data.page_id = data.current_path = _.getPath(para.path);
      data.page_url = data.current_path + _.getQueryString(para.query);
    }
    data.key = 'event'
    data.event_id = 'backstage'
    data.event_name = '进入后台'

    _.trackingEvent(data)
  },
  pageLoad: function (query) {
    ests.pageCustom = {}
    currentPath = this.__route__
    pageQueryString = _.getQueryString(query)
  },
  pageShow: function () {
    currentPath = _.getCurrentPage().route
    ests._sessionStart()
    var data = {};
    data.prev_path = prev_path;
    data.page_title = _.getPageTitle();
    data.page_name = ests.pageCustom.page_name || data.page_title;
    if (_.isObject(ests.pageCustom.pageview_param) && !_.isEmptyObject(ests.pageCustom.pageview_param)) {
      data.pageview_param = JSON.stringify(ests.pageCustom.pageview_param)
    }
    _.trackingPageView(data);
  },
  pageUnload: function () {
    ests._sessionEnd();
  },
  pageHide: function (para) {
    ests._sessionEnd();
  },
  // TODO: 页面分享机制
  pageShare: function (option, not_use_auto_track) {
  }
};

function mp_proxy(option, method, identifier) {
  var newFunc = ests.autoTrackCustom[identifier];
  if (option[method]) {
    var oldFunc = option[method];
    option[method] = function () {
      oldFunc.apply(this, arguments);
      newFunc.apply(this, arguments);
    };
  } else {
    option[method] = function () {
      newFunc.apply(this, arguments);
    };
  }
}

ests._registerDeviceIdAndSessionId = function () {
  if (!this.store.getDeviceId()) {
    this.store.setDeviceId();
  }
}

ests._sessionStart = function () {
  this.store.setSessionId()
  var data = {
    session_id: this.store.getSessionId(),
    key: 'session',
    session_type: 'start',
    start_session_time: new Date().getTime(),
    page_name: _.getPageTitle(),
    page_title: _.getPageTitle(),
  }
  data.prev_session_id = prev_session_id
  data.prev_path = prev_path;
  startSessionTime = data.start_session_time;
  prev_path = currentPath;
  _.getNet(function (d) {
    data = _.extend(data, d);
    _.sendRequest(data)
  })
}
ests._sessionEnd = function () {
  var data = {
    session_id: this.store.getSessionId(),
    key: 'session',
    session_type: 'end',
    start_session_time: startSessionTime,
    page_name: _.getPageTitle(),
    page_title: _.getPageTitle(),
    end_session_time: new Date().getTime()
  }
  data.prev_path = prev_path;
  data.prev_session_id = prev_session_id;
  prev_path = currentPath;
  prev_session_id = this.store.getSessionId()
  ests.pageCustom.page_name = '' // 清空用户定义参数
  ests.pageCustom.pageview_param = ''
  data.session_duration = ((data.end_session_time - startSessionTime) / 1000).toFixed(2)
  _.getNet(function (d) {
    data = _.extend(data, d);
    _.sendRequest(data)
  })
}

ests.event = function (eventParams) {
  if (eventParams.event_name && eventParams.event_id) {
    eventParams.key = 'event';
    eventParams.start_session_time = startSessionTime;
    eventParams.prev_path = prev_session_id;
    eventParams.prev_path = prev_path;
    eventParams.page_title = _.getPageTitle();
    eventParams.page_name = ests.pageCustom.page_name || _.getPageTitle();
    eventParams.session_duration = ((new Date().getTime() - startSessionTime) / 1000).toFixed(2)
    _.trackingEvent(eventParams);
  }
}
/**
 * 设置用户信息
*/
ests.setUserInfo = function (userInfo, isWxUserInfo) {
  var data = {}
  let locallUserInfo = ests.store.getStorageSync('$userInfo')
  let needUpdate = false

  if (!_.isEmptyObject(userInfo) && isWxUserInfo) { // 微信用户新
    for (const key in userInfo) {
      data[key] = userInfo[key]
    }
    if (data.gender == 1) {
      data.gender = '男'
    } else {
      data.gender = '女'
    }
    needUpdate = true
  } else if (!_.isEmptyObject(userInfo)) { // 自定义信息
    if (locallUserInfo) {
      locallUserInfo = JSON.parse(locallUserInfo)
      for (const key in userInfo) {
        if (locallUserInfo[key] != userInfo[key]) {
          data.custom_userInfo = userInfo
          needUpdate = true
        }
      }
    } else {
      data.custom_userInfo = userInfo
      needUpdate = true
    }
  }
  //判断获取到的用户信息，与本地缓存用户信息是否一致，如果不一致，则更新缓存，重新保存用户
  if (needUpdate) {
    data.key = 'user',
      data.device_id = 'TS_' + ests.store.getDeviceId();
    data.app_key = ests._config.appKey;
    data.timestamp = new Date().getTime();
    wx.request({
      url: ests._config.serverUrl,
      method: 'POST',
      data
    })
    ests.store.setStorageSync('$userInfo', JSON.stringify(userInfo))
  }
}
ests.initsetPageName = function (name) {
  ests.pageCustom.page_name = name
}
ests.setPageviewParam = function (params) {
  if (!_.isEmptyObject(params)) {
    ests.pageCustom.pageview_param = params
  }
}
ests.prepareing = function () {
  this._.getSystemInfo();
  this._registerDeviceIdAndSessionId();
}

ests.init = function (appKey, config) {
  if (!_.isEmptyObject(config)) {
    this._config = _.extend(this._config, config);
  }
  this._config.appKey = appKey;
  if (appKey.indexOf('qa') === -1) {
    this._config.serverUrl = PROD_URL;
  } else {
    this._config.serverUrl = QA_URL;
  }
}

var oldApp = App;
App = function (option) {
  mp_proxy(option, "onLaunch", 'appLaunch');
  mp_proxy(option, "onShow", 'appShow');
  mp_proxy(option, "onHide", 'appHide');
  oldApp.apply(this, arguments);
};

var oldPage = Page;
Page = function (option) {
  mp_proxy(option, "onLoad", 'pageLoad');
  mp_proxy(option, "onShow", 'pageShow');
  mp_proxy(option, "onUnload", 'pageUnload');
  mp_proxy(option, "onHide", 'pageHide');
  if (typeof option.onShareAppMessage === 'function') {
    ests.autoTrackCustom.pageShare(option);
  }
  oldPage.apply(this, arguments);
};
var oldComponent = Component;
Component = function (option) {
  try {
    option.methods = option.methods || {};
    mp_proxy(option.methods, 'onLoad', 'pageLoad');
    mp_proxy(option.methods, 'onShow', 'pageShow');
    mp_proxy(option.methods, 'onUnload', 'pageUnload');
    mp_proxy(option.methods, 'onHide', 'pageHide');
    if (typeof option.methods.onShareAppMessage === 'function') {
      sa.autoTrackCustom.pageShare(option.methods);
    }
    oldComponent.apply(this, arguments);
  } catch (e) {
    oldComponent.apply(this, arguments);
  }
};
ests.prepareing();

module.exports = ests;