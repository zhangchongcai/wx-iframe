let REQUEST_URL = 'http://localhost:8080/i'
const QA_URL = 'http://localhost:8080/i'
// const QA_URL = 'https://tsapiqa.escase.cn/i'
const PROD_URL = 'https://tsapi.escase.cn/collection/i'
const REQUEST_METHOD = 'POST'
const CONTENT_TYPE = 'application/x-www-form-urlencoded'

const globalVarApp = App // 小程序原App对象
const globalVarPage = Page // 小程序原Page对象

//初始化SDK需要采集的属性 ==================================================================== start
let requestParam = {
  //项目属性 ================================================================================= start
  // project_id: '项目',//项目标识
  app_key: '',
  //项目属性 ================================================================================= end

  //通用预置属性 ================================================================================= start
  sdk_type: 'js',//SDK类型
  sdk_name: 'wx_track',//SDK名称
  sdk_version: '2.0',//SDK版本
  platform: '',//客户端平台微信、支付宝、Android、IOS...
  ip: '', //用户真实IP地址
  network_type: '',//网络链接类型
  custom_id: '',//用户自定义ID
  device_id: '',//设备唯一ID；无论是否授权都会生成一个
  device_system: '',//设备操作系统及版本
  device_brand: '',//设备品牌
  device_model: '',//设备型号
  device_screenWidth: '',//设备屏幕宽度
  device_screenHeight: '',//设备屏幕高度
  authorize: false,//是否授权
  timestamp: 0,//请求发时间
  key: '',//数据类型，保存到哪个日志库的标志
  //通用预置属性 ================================================================================= end
  
  //微信小程序预置属性 ================================================================================= start
  open_id: '',//用户open_id
  union_id: '',//用户union_id
  scene: '',//打开小程序的场景
  //微信小程序预置属性 ================================================================================= end

  //UTM属性 非必须 ================================================================================= start
  // utm_source: '',//广告系列来源
  // utm_medium: '',//广告系列媒介
  // utm_campaign: '',//广告系列内容
  // utm_content: '',//广告系列名称
  // utm_term: '',//广告系列关键字
  //UTM属性 非必须 ================================================================================= end

  //业务属性 ================================================================================= start
  pe_channel: 'default', //PE推送系统属性
  business_channel: 'default', //旧渠道推广属性
  //业务属性 ================================================================================= end

  //会话属性 ================================================================================= start
  session_id: '',//会话ID
  session_type: '',//start OR end
  start_session_time: 0,//会话开始时间
  end_session_time: 0,//会话结束时间
  session_duration: 0,//会话停留时间
  prev_session_id: '',//上一个会话ID
  //会话属性 ================================================================================= end

  //页面属性 ================================================================================= start
  page_id: '',//页面ID，每个页面唯一，自动获取，默认为页面路径
  page_name: '',//页面，每个页面唯一
  page_title: '',//页面标题
  page_url: '',//页面完整URL
  prev_path: '',//上一个页面路径
  current_path: '',//当前页面路径
  // pageview_param: {},//页面参数，非必填
  //页面属性 ================================================================================= end

  //事件属性 ================================================================================= start
  // event_id: '',//事件ID，自定义，驼峰式命名规范
  // event_name: '',//事件名称
  // event_param: {},//事件参数，非必填
  //事件属性 ================================================================================= end
}
//初始化SDK需要采集的属性 ==================================================================== end

//初始化用户属性 ==================================================================== start
let tsUser = {
  app_key: '',//Tracking System提供的 app_key
  device_id: '',//用户本地缓存ID
  open_id: '',//微信用户的open_id
  union_id: '',//微信用户的union_id
  custom_id: '',//用户自己平台的用户唯一标识
  real_name: '',//真实姓名
  nick_name: '',//昵称
  age: '',//年龄
  account: '',//账号
  birthday: '',//生日
  gender: '',//性别
  country: '',//国家
  region: '',//省份
  city: '',//城市
  wx_userInfo: '',//微信用户信息
  ali_userInfo: '',//阿里用户信息
  key: 'user'//数据类型-用户（将数据保存到用户库的判断条件）
}
//初始化用户属性 ==================================================================== end

//重写小程序生命周期 ==================================================================== start
/**
 * 重写小程序生命周期
 */
function newAppLife(target) {
  if (target.onLoad && typeof target.onLoad === 'function') {
    //生命周期重写
    initPageExtension(target)
  }
  return target
}

/**
  * 
  *  @function initPageExtension -重写Page中的生命周期
  */
function initPageExtension(page) {
  let that = this
  // 返回一个新的 Page 构造器
  const {
    onLoad,
    onHide,
    onShow,
    onUnload,
    onReady
  } = page

  /**
   * @method 重写 onLoad 方法
   */
  page.onLoad = function (options) {
    if (typeof onLoad === 'function') {
      onLoad.call(this, options)
    }
  }

  /**
   * 重写onShow
   */
  page.onShow = function (options) {
    if (typeof onShow === 'function') {
      onShow.call(this)
    }
    pageTracking('onShow')
  }

  /**
   * 重写onUnload
   */
  page.onUnload = function () {
    if (typeof onUnload === 'function') {
      onUnload.call(this)
    }
    pageTracking('onUnload')
  }

  /**
   * 重写onHide
   */
  page.onHide = function () {
    if (typeof onHide === 'function') {
      onHide.call(this)
    }
    pageTracking('onHide')
  }

  //重构page对象，进入页面时可以调用ts下的方法
  page.ts = page.ts || {}

  /**
   * 设置用户open_id
   */
  page.ts.setOpenId = function(openId) {
    service.setOpenId(openId)
  }

  /**
   * 设置用户union_id
   */
  page.ts.setUnionId = function (unionID) {
    service.setUnionId(unionID)
  }

  /**
   * 设置用户union_id
   */
  page.ts.setUnionId = function (unionID) {
    service.setUnionId(unionID)
  }

  /**
   * 设置用户custom_id
   */
  page.ts.setCustomId = function (customId) {
    service.setCustomId(customId)
  }

  

  /**
   * 设置用户信息
   */
  page.ts.setUserInfo = function(userInfo) {
    tsUser.custom_userInfo = JSON.stringify(userInfo)
    requestParam.custom_userInfo = tsUser.custom_userInfo
    service.setUserInfo(userInfo)
  }

  /**
   * 设置页面名称
   */
  page.ts.setPageName = function(pageName) {
    service.setPageName(pageName)
  }

  /**
 * 设置页面参数
 */
  page.ts.setPageviewParam = function (param) {
    service.setPageviewParam(param)
  }

  //事件采集
  page.ts.event = function(param) {
    service.event(param)
  }
}
//重写小程序生命周期 ==================================================================== end

//utils ==================================================================== start
let utils = utils || {}
/**
 * 获取当前页面
 * @returns {Object} 当前页面Page对象
 */
utils.getActivePage = function () {
  const curPages = getCurrentPages()
  if (curPages.length) {
    return curPages[curPages.length - 1]
  }
  return {}
}

/**
 * 获取当前页面title
 */
utils.getPageTitle = function () {
  let pageTitle = ''
  if (__wxConfig) {
    pageTitle = __wxConfig.page[utils.getActivePage().route + ".html"].window.navigationBarTitleText || __wxConfig.global.window.navigationBarTitleText
  }
  return pageTitle
}

/**
 * 生成随机guid
 */
utils.getUUId = function () {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (t) {
    let e = 16 * Math.random() | 0
    return ("x" == t ? e : 3 & e | 8).toString(16)
  })
}

/**
 * 发送Tracking请求
 */
utils.sendRequest = function (data) {
  //请求发起时间
  data.timestamp = new Date().getTime()

  wx.request({
    url: REQUEST_URL,
    header: {
      "Content-Type": CONTENT_TYPE
    },
    method: REQUEST_METHOD,
    data
  })
}

/**
 * 获取当前页面带参URL
 */
utils.getCurrentPageUrlWithArgs = function () {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const url = currentPage.route
  const options = currentPage.options
  let urlWithArgs = `/${url}?`
  for (let key in options) {
    const value = options[key]
    urlWithArgs += `${key}=${value}&`
  }

  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  return urlWithArgs
}

/**
 * 获取UTM参数
 */
utils.getUTMArgs = function () {
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
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const url = currentPage.route
  const options = currentPage.options
  if (options.hasOwnProperty("utm_source") || options.hasOwnProperty("business_channel") || options.hasOwnProperty("channel")) {
    for (let key in options) {
      const value = options[key]
      if (utmArgs.indexOf(key) != -1) {
        requestParam[key] = value
      }
    }
  }

}

/**
 * 检查是否授权
 */
utils.checkAuthorize = function () {
  return new Promise(resolve => {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          requestParam.authorize = true
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({  //用户信息
            lang: 'zh_CN',
            success: (res) => {
              let { userInfo } = res
              //获取到微信用户信息,则发送保存用户信息请求（增量）
              tsUser.wx_userInfo = JSON.stringify(userInfo)
              requestParam.wx_userInfo = tsUser.wx_userInfo
              service.setUserInfo(userInfo)
 
              resolve(userInfo)
            }
          })
        } else { // 未授权的请求
          requestParam.authorize = false
          resolve()
        }
      }
    })
  })

}

/**
 * 获取进入小程序场景
 */
utils.sceneData = function (s) {
  let scene = []
  switch (s) {
    case 1001:
      scene.push(s, "发现栏小程序主入口")
      break
    case 1005:
      scene.push(s, "顶部搜索框的搜索结果页")
      break
    case 1006:
      scene.push(s, "发现栏小程序主入口搜索框的搜索结果页")
      break
    case 1007:
      scene.push(s, "单人聊天会话中的小程序消息卡片")
      break
    case 1008:
      scene.push(s, "群聊会话中的小程序消息卡片")
      break
    case 1011:
      scene.push(s, "扫描二维码")
      break
    case 1012:
      scene.push(s, "长按图片识别二维码")
      break
    case 1014:
      scene.push(s, "手机相册选取二维码")
      break
    case 1017:
      scene.push(s, "前往体验版的入口页")
      break
    case 1019:
      scene.push(s, "微信钱包")
      break
    case 1020:
      scene.push(s, "公众号profile页相关小程序列表")
      break
    case 1022:
      scene.push(s, "聊天顶部置顶小程序入口")
      break
    case 1023:
      scene.push(s, "安卓系统桌面图标")
      break
    case 1024:
      scene.push(s, "小程序profile页")
      break
    case 1025:
      scene.push(s, "扫描一维码")
      break
    case 1026:
      scene.push(s, "附近小程序列表")
      break
    case 1027:
      scene.push(s, "顶部搜索框搜索结果页“使用过的小程序”列表")
      break
    case 1028:
      scene.push(s, "我的卡包")
      break
    case 1029:
      scene.push(s, "卡券详情页")
      break
    case 1031:
      scene.push(s, "长按图片识别一维码")
      break
    case 1032:
      scene.push(s, "手机相册选取一维码")
      break
    case 1034:
      scene.push(s, "微信支付完成页")
      break
    case 1035:
      scene.push(s, "公众号自定义菜单")
      break
    case 1036:
      scene.push(s, "App分享消息卡片")
      break
    case 1037:
      scene.push(s, "小程序打开小程序")
      break
    case 1038:
      scene.push(s, "从另一个小程序返回")
      break
    case 1039:
      scene.push(s, "摇电视")
      break
    case 1042:
      scene.push(s, "添加好友搜索框的搜索结果页")
      break
    case 1044:
      scene.push(s, "带shareTicket的小程序消息卡片")
      break
    case 1047:
      scene.push(s, "扫描小程序码")
      break
    case 1048:
      scene.push(s, "长按图片识别小程序码")
      break
    case 1049:
      scene.push(s, "手机相册选取小程序码")
      break
    case 1052:
      scene.push(s, "卡券的适用门店列表")
      break
    case 1053:
      scene.push(s, "搜一搜的结果页")
      break
    case 1054:
      scene.push(s, "顶部搜索框小程序快捷入口")
      break
    case 1056:
      scene.push(s, "音乐播放器菜单")
      break
    case 1058:
      scene.push(s, "公众号文章")
      break
    case 1059:
      scene.push(s, "体验版小程序绑定邀请页")
      break
    case 1064:
      scene.push(s, "微信连Wifi状态栏")
      break
    case 1067:
      scene.push(s, "公众号文章广告")
      break
    case 1068:
      scene.push(s, "附近小程序列表广告")
      break
    case 1072:
      scene.push(s, "二维码收款页面")
      break
    case 1073:
      scene.push(s, "客服消息列表下发的小程序消息卡片")
      break
    case 1074:
      scene.push(s, "公众号会话下发的小程序消息卡片")
      break
    case 1089:
      scene.push(s, "微信聊天主界面下拉")
      break
    case 1090:
      scene.push(s, "长按小程序右上角菜单唤出最近使用历史")
      break
    case 1092:
      scene.push(s, "城市服务入口")
      break
    default:
      scene.push("未知入口")
      break
  }
  return scene
}

/**
 * 校验是否是空的对象
 */
utils.isEmptyObject = function (obj) {
  for (var item in obj) {
    return false
  }
  return true
}

/**
 * 获取上一页
 */
utils.getPrevPage = function () {
  const curPages = getCurrentPages()
  if (curPages.length > 1) {
    return curPages[curPages.length - 2]
  }
  return {}
}

//获取连接网络方式
utils.getNetword = function () {
  return new Promise(res => {
    wx.getNetworkType({
      success: e => res(e),
      fail: err => res('err')
    })
  })
}

/**
 * 获取IP地址
 */
utils.getIp = function () {
  return new Promise(res => {
    wx.request({
      url: 'https://checkip.map.qq.com',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: e => res(e.data)
    })
  })
}

/**
 * 返回去掉空格去掉的字符串
 */
utils.trimString = function (str) {
  return str.replace(/[\r\n]/g, "").replace(/\ +/g, "")
}
//util ==================================================================== end

function test() {
  console.log('test')
}

//service ==================================================================== start
let service = service || {}

/**
 * 设置设备信息
 */
service.setDeviceInfo = function () {
  //设置设备ID 放置于缓存中，除非用户主动删除或因存储空间原因被系统清理，否则数据都一直可用
  if (!requestParam.device_id) {
    let device_id = wx.getStorageSync('$ts_device_id')
    if (device_id) {
      requestParam.device_id = device_id
    } else {
      requestParam.device_id = utils.getUUId()
      wx.setStorage({
        key: '$ts_device_id',
        data: "TS_" + requestParam.device_id
      })
    }
  }
  //设置设备系统信息
  let systemInfo = wx.getSystemInfoSync()
  //设置客户端平台
  requestParam.platform = systemInfo.platform
  //设置设备操作系统及版本
  requestParam.device_system = systemInfo.system
  //设置设备品牌
  requestParam.device_brand = systemInfo.brand
  //设置设备型号
  requestParam.device_model = systemInfo.model
  //设置设备屏幕宽度
  requestParam.device_screenWidth = systemInfo.screenWidth
  //设置设备屏幕高度
  requestParam.device_screenHeight = systemInfo.screenHeight
}

/**
 * 设置页面信息
 */
service.setPageInfo = function () {
  //设置新的页面ID
  requestParam.page_id = utils.getActivePage().route
  //设置页面名称
  requestParam.page_name = requestParam.page_name || utils.getPageTitle()
  //设置当前页面标题
  requestParam.page_title = utils.getPageTitle()
  //设置页面带参URL
  requestParam.page_url = utils.getCurrentPageUrlWithArgs()
  //设置当前页面路径
  if (!utils.isEmptyObject(utils.getActivePage())) {
    requestParam.current_path = utils.getActivePage().route
  }
  //设置UTM参数
  utils.getUTMArgs()
}

/**
 * 初始化请求参数
 */
service.initRequestParam = function (param) {
  //设置打开小程序的场景
  requestParam.scene = utils.sceneData(wx.getLaunchOptionsSync().scene).join(':')
  //设置IP地址
  if (!requestParam.ip) {
    utils.getIp().then(data => {
      requestParam.ip = utils.trimString(data)
    })
  }
  //设置是否授权
  if (!requestParam.authorize) {
    utils.checkAuthorize()
  }
  //设置网络链接方式
  if (!requestParam.network_type) {
    utils.getNetword().then(data => {
      requestParam.network_type = data.networkType
    })
  }

  //设置设备信息
  service.setDeviceInfo()

  //设置app_key
  requestParam.app_key = param.app_key || ""
  //设置用户//open_id
  requestParam.open_id = param.open_id || "defaultOpenId"
  //设置用户//union_id
  requestParam.union_id = param.union_id || "defaultUnionId"
  //设置用户自定义ID
  requestParam.custom_id = param.custom_id || "defaultCustom_id"
  if(param.for_test == true) {
    REQUEST_URL = QA_URL
  }else if (param.app_key.indexOf('qa') == 0) {
    REQUEST_URL = QA_URL
  }else {
    REQUEST_URL = PROD_URL
  }
}

/**
 * 采集startSession数据
 */
service.startSession = function() {
  //删除会话结束时间，因为会话才开始
  delete requestParam.end_session_time
  //删除会话停留时间，因为会话才开始
  delete requestParam.session_duration
  //获取新的会话ID
  requestParam.session_id = utils.getUUId()
  //设置日志数据类型 - session
  requestParam.key = 'session'
  //设置会话类型为开始-start
  requestParam.session_type = 'start'
  //设置会话开始时间
  requestParam.start_session_time = new Date().getTime()
  //发送会话开始请求！！！
  utils.sendRequest(requestParam)
}

/**
 * 采集endSession数据
 */
service.endSession = function () {
  //设置日志数据类型 - session
  requestParam.key = 'session'
  //设置结束会话类型
  requestParam.session_type = 'end'
  //设置会话结束时间
  requestParam.end_session_time = new Date().getTime()
  //设置会话停留时间
  requestParam.session_duration = ((requestParam.end_session_time - requestParam.start_session_time) / 1000).toFixed(2)
  //发送会话结束请求！！！
  utils.sendRequest(requestParam)

  //设置下一个页面的上一页页面路径为当前页
  requestParam.prev_path = requestParam.current_path
  //设置下一个页面会话的上一个会话ID为当前会话ID
  requestParam.prev_session_id = requestParam.session_id
  //清除页面名称
  requestParam.page_name = ''
}

/**
 * 采集pageview数据
 */
service.pageview = function() {
  //pageview浏览事件不需要会话的类型与结束时间
  delete requestParam.session_type
  //设置日志数据类型 - pageview
  requestParam.key = 'pageview'
  //发送页面浏览请求！！！
  utils.sendRequest(requestParam)
}

/**
 * 采集事件数据
 */
service.event = function(param) {
  requestParam.key = 'event'
  Object.keys(param).forEach(function (key) {
    if(key == 'event_id'|| key == 'event_name' || key == 'event_param') {
      requestParam[key] = param[key]
    }
  })
  if (requestParam.event_id || requestParam.event_name) {
    if(requestParam.event_param) {
      requestParam.event_param = JSON.stringify(requestParam.event_param)
    }
    //发送采集事件请求
    utils.sendRequest(requestParam)
    //请求完成后删除事件信息，因为下一个访问/结束页面不需要事件
    delete requestParam.event_id 
    delete requestParam.event_name
    delete requestParam.event_param
  }
}

/**
 * 设置用户信息
 */
service.setUserInfo = function(userInfo) {      
  if (userInfo) {
    if (userInfo.gender == 1) {
      userInfo.gender = '男'
    } else {
      userInfo.gender = '女'
    }
    tsUser.app_key = requestParam.app_key
    tsUser.device_id = requestParam.device_id
    tsUser.open_id = requestParam.open_id
    tsUser.union_id = requestParam.union_id
    tsUser.custom_id = requestParam.custom_id
    tsUser.country = userInfo.country
    tsUser.province = userInfo.province
    tsUser.city = userInfo.city
    tsUser.nick_name = userInfo.nickName
  
    //判断获取到的用户信息，与本地缓存用户信息是否一致，如果不一致，则更新缓存，重新保存用户
    let wxUser = wx.getStorageSync('$wx_userInfo')
    let customUserInfo = wx.getStorageSync('$custom_userInfo')
    
    let needUpdate = false
    if (wxUser != tsUser.wx_userInfo) {
      wx.setStorage({
        key: '$wx_userInfo',
        data: tsUser.wx_userInfo
      })
      needUpdate = true
    }
    if (tsUser.custom_userInfo && customUserInfo != tsUser.custom_userInfo) {
      wx.setStorage({
        key: '$custom_userInfo',
        data: tsUser.custom_userInfo
      })
      needUpdate = true
    }
    if (needUpdate) {
      console.log('保存用户数据')
      //更新用户信息
      utils.sendRequest(tsUser)
    }

  }   
        
}

/**
 * 设置页面名称
 */
service.setPageName = function (pageName) {
  if (pageName) {
    requestParam.page_name = pageName
  }
}

/**
 * 设置页面参数
 */
service.setPageviewParam = function (param) {
  if (param) {
    requestParam.pageview_param = JSON.stringify(param)
  }
}

/**
 * 设置用户open_id
 */
service.setOpenId = function(openId) {
  if(openId) {
    requestParam.open_id = openId
  }
}

/**
 * 设置用户union_id
 */
service.setUnionId = function (unionId) {
  if (unionId) {
    requestParam.union_id = unionId
  }
}

/**
 * 设置用户custom_id
 */
service.setCustomId = function (customId) {
  if (customId) {
    requestParam.custom_id = customId
  }
}

//service ==================================================================== end


/**
 * 采集页面信息
 */
function pageTracking(type) {
  //设置页面信息
  service.setPageInfo()

  //进入新页面OR刷新页面
  if (type == 'onShow') {
    service.startSession()
    service.pageview()
  }
  //跳出页面
  if (type === 'onUnload' || type === 'onHide') {
    service.endSession()
  }

}

/**
 * 提供外部调用SDK功能的接口
 */
const yhWxSDK = yhWxSDK || {}

/**
 * 开始采集数据
 */
yhWxSDK.tracking = function(param) {
  //初始化请求参数
  service.initRequestParam(param)
  App = (app) => globalVarApp(newAppLife(app))
  Page = (page) => globalVarPage(newAppLife(page))
}

/**
 * 采集事件数据
 */
yhWxSDK.event = function(param) {
  service.event(param)
}

module.exports = yhWxSDK