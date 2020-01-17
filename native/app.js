// import Tracker from './SDK/SDK/index' ; 
// import trackConfig from './tracks/index';
import tracking_sdk from './tracks/yh_wx_sdk';
// import lh_sdk from './tracks/lh_sdk';

let param = {
  //app_key，由Tracking System提供（测试/生产）
  app_key: "qa1576468657154"
}
// lh_sdk.tracking(param)
tracking_sdk.init(param)

App({
  baseUrl: 'https://m.maizuo.com/',
  onLaunch: function(options) {
   
  }
});
