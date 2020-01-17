* [标准版]
  * <a href="#native">原生使用</a>
* [<a href="#iframe">各框架下使用</a>]
  * <a href="#mpvue"> mpVue 小程序框架集成 SDK</a>
  * <a href="#WePy"> WePy 小程序框架集成 SDK</a>
  * <a href="#Taro"> Taro 小程序框架集成 SDK</a>
  
  > <h1 id="native">标准版</h1>
  ### 1、在app.js文件顶部引入SDK资源
  ```javascript
    import ests from "./SDK/yh_wx_sdk2.0.min.js"
  ```
  ### 2、初始化属性并执行init()方法
  ```javascript
    let param = {
      app_key: "qa1576468657154" // app_key，由Tracking System提供（测试/生产）
    }
    ests.init(param)
  ```
  至此已完成对页面的自动化采集
  ### 3、事件埋码
  3.1 在页面需要进行事件埋码的位置，初始化事件属性，并调用ests.event()方法

  ```javascript
    var app = getApp();
    var param = {
      event_id: 'clickAvatar', // 事件唯一ID，自定义，驼峰命名规则
      event_name: "点击头像", // 事件名称，用作展示
      event_param: { // 选填自定义参数
        name: "张三",
        age: 25
      }
    }
    app.ests.event(param);
  ```

  3.2 设置用户的用户信息
  ```javascript
    var app = getApp();
    app.ests.setUserInfo({name: '逸风', age: 18})
  ```
  3.3 设置当前页面PageName
  index.js
  ```javascript
    var app = getApp()
    app.ests.initSetPageName() 
  ```
  3.4 设置当前页面参数
  index.js
  ```javascript
    var app = getApp()
    var pageview_param = {
      something: 'a',
      shomething: 'b'
    }
    app.ests.setPageviewParam(pageview_param)
  ```
  > <h1 id="iframe">各框架下的接入</h1>
  ## <a id="mpvue"> 1. mpVue 小程序框架集成 SDK </a>
  ### 1.1 集成与初始化
  #### 第一步：在项目的 main.js 中通过 import 引入 SDK, yh_wx_sdk2.0.min必须在 vue 之前引入
  #### 第二部：调用 init() 方法完成初始化
  main.js
  ```javascript
    import ests from '../SDK/yh_wx_sdk2.0.min'
    import Vue from 'vue'
    import App from './App'

    let param = {
      app_key: "qa1576468657154" // app_key，由Tracking System提供（测试/生产）
    }
    ests.init(param)
  ```
  ### 1.2. 事件埋码
  #### 1.2.1 Page 事件埋码
  index.js
  ```javascript
    const app = getApp()
    export default {
      data () {
        return {}
      },
      methods: {
        touchEvent() {
          var app = getApp();
          var param = {
            event_id: 'clickAvatar', // 事件唯一ID，自定义，驼峰命名规则
            event_name: "点击头像", // 事件名称，用作展示
            event_param: { // 选填自定义参数
              name: "张三",
              age: 25
            }
          }
          app.ests.event(param);
        }
      }
    }
  ```
  #### 1.2.2 设置用户的用户信息
  ```javascript
    var app = getApp();
    app.ests.setUserInfo({name: '逸风', age: 18})
  ```
  ## <a id="WePy"> 2. WePY 小程序框架集成 SDK </a>
  ### 2.1. 集成与初始化
  #### 第一步：在项目的 app.wpy 中通过 import 引入 SDK
  #### 第二部：调用 init() 方法完成初始化
  app.wpy
  ```javascript
    import ests from '../SDK/yh_wx_sdk2.0.min'
    import wepy from 'wepy'

    let param = {
      app_key: "qa1576468657154" // app_key，由Tracking System提供（测试/生产）
    }
    ests.init(param)
  ```
  #### 2.2. 事件埋码
  #### 2.2.1 Page 事件埋码
  page.wpy
  ```javascript
    export default {
      data () {
        return {}
      },
      methods: {
        touchEvent() {
          var app = getApp();
          var param = {
            event_id: 'clickAvatar', // 事件唯一ID，自定义，驼峰命名规则
            event_name: "点击头像", // 事件名称，用作展示
            event_param: { // 选填自定义参数
              name: "张三",
              age: 25
            }
          }
          app.ests.event(param);
        }
      }
    }
  ```
  #### 1.2.3 预设置页面page_name、 pageview_param, 在对应 onShow 生命周期
  index.vue
  ```javascript
    onShow () { 
      const app = getApp()
      app.ests.initSetPageName('设置页面名称') // 设置页面名称
      
      app.ests.setPageviewParam({ // 设置页面参数
        param1: 'param1',
        param2: 'param2'
      })
    }
  ```
  #### 2.2.2 设置用户的用户信息
  page.wpy
  ```javascript
    var app = getApp();
    app.ests.setUserInfo({name: '逸风', age: 18})
  ```
  #### 2.2.3 预设置页面page_name、 pageview_param, 在对应 onShow 生命周期
  home.wpy
  ```javascript
    onShow () { 
      const app = getApp()
      app.ests.initSetPageName('设置页面名称') // 设置页面名称

      app.ests.setPageviewParam({ // 设置页面参数
        param1: 'param1',
        param2: 'param2'
      })
    }
  ```
  ## <a id="Taro"> 3. Taro 小程序框架集成 SDK </a>
  ### 3.1 集成与初始化
  #### 第一步：在项目的 app.js 中通过 import 引入 SDK
  #### 第二部：调用 init() 方法完成初始化
  app.js
  ```javascript
    import Taro, { Component, Config } from '@tarojs/taro'
    import ests from '../SDK/yh_wx_sdk2.0.min'
    
    let param = {
      app_key: "qa1576468657154" // app_key，由Tracking System提供（测试/生产）
    }
    ests.init(param)
  ```
  ### 3.2. 事件埋码
  #### 3.2.1 Page 事件埋码
  index.js
  ```javascript
  import Taro, {Component, Config} from '@tarojs/taro'
  const app = Taro.getApp();
  export default class About extends Component {
    touchEvent: function() {
      const app = getApp()
      app.ests.event({
        event_id: 998,
        event_name: '点击事件',
        event_param: { something: 'dosomething' }
      })
    },
  }
  ```
  #### 3.2.2 设置用户的用户信息
  index.js
  ```javascript
    var app = getApp();
    app.ests.setUserInfo({name: '逸风', age: 18})
  ```
  #### 3.2.2 预设置页面page_name、 pageview_param, 在对应 componentDidMount 生命周期
  index.js 
  ```javascript
    componentDidMount () { 
      const app = getApp()
      app.ests.initSetPageName('设置页面名称') // 设置页面名称

      app.ests.setPageviewParam({ // 设置页面参数
        param1: 'param1',
        param2: 'param2'
      })
    }
  ```