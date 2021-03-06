/**
 * 微信共用JS
 */
var jsticket = {
    // appId : 'wxe10a7e4508c33c4e',//承启堂
    appId:'wxd95e49edf23f4c43',//suik
    timestamp : '',
    nonceStr : '',
    signature : ''
};
var jsApiList = [ 'checkJsApi', 'onMenuShareTimeline',
    'onMenuShareAppMessage', 'onMenuShareQQ',
    'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems',
    'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem',
    'getNetworkType', 'hideOptionMenu', 'showOptionMenu',
    'closeWindow', 'chooseImage','previewImage', 'uploadImage', 'downloadImage','scanQRCode' ];


$(function() {
    if(LS.get(Constants.openid) == null){
        LS.set(Constants.sourceURL, location.href);
        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+jsticket.appId+"&redirect_uri=http://synsunny.parsec.com.cn/Taurus/weixin/redirect_uri&response_type=code&scope=snsapi_base&state=getopenid#wechat_redirect";
    }else{
        canUseWXJS();
    }
});

/**
 * 清空所有的缓存
 */
function wxlogout() {
    localStorage.clear();
    sessionStorage.clear();
    LS.set(Constants.sourceURL, location.href);
    location.reload();
}

/**
 * 最好有统一的异常处理页面
 */
//$.ajaxSetup({
//    error: function(jqXHR, textStatus, errorThrown){
//        alert("服务器暂时无法访问，代码:"+jqXHR.status);
//    }
//});

//能否使用微信js
function canUseWXJS(){
    $.get(Constants.hostIp+"/weixin/getJSTicket?url="+location.href, function(data, status) {
        if ('success' == status) {
            jsticket.timestamp = data.timestamp;
            jsticket.nonceStr = data.nonceStr;
            jsticket.signature = data.signature;
            jsticket.appId = data.appId;
            
            wx.config({
                debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId : jsticket.appId, // 必填，公众号的唯一标识
                timestamp : jsticket.timestamp, // 必填，生成签名的时间戳
                nonceStr : jsticket.nonceStr, // 必填，生成签名的随机串
                signature : jsticket.signature, // 必填，签名，见附录1

                // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                jsApiList : jsApiList
            });

            // 需要检测的JS接口列表，所有JS接口列表见附录2,
            /*
             wx.checkJsApi({
             jsApiList : jsApiList,
             success : function(res) {
             // 以键值对的形式返回，可用的api值true，不可用为false
             // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
             //alert(JSON.stringify(res));
             }
             });
             */
        } else {
            // 取不到初始参数，无法调用jsapi,做点出错处理吧
            SS.set(Constants.errorInfo, "无法调用微信JS，请稍后重试");
            location.href = Constants.errorPage;

        }
    });
}

wx.ready(
  function(){

      /**
      shareObject.link += ("?" + Constants.inviteCode + "=" + LS.get(Constants.inviteCode));

      var currentUrl = location.href;
      if(currentUrl.search(/order-/) < 0){
          wx.hideOptionMenu();
      }else{
          wx.showOptionMenu();
      }


      //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
      wx.onMenuShareTimeline({
          title: shareObject.title, // 分享标题
          link: shareObject.link, // 分享链接
          imgUrl: shareObject.icon, // 分享图标
          success: function () {
              // 用户确认分享后执行的回调函数
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
      });

      //获取“分享给朋友”按钮点击状态及自定义分享内容接口
      wx.onMenuShareAppMessage({
          title: shareObject.title, // 分享标题
          link: shareObject.link, // 分享链接
          imgUrl: shareObject.icon, // 分享图标
          success: function () {
              // 用户确认分享后执行的回调函数
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
      });

      //获取“分享到QQ”按钮点击状态及自定义分享内容接口
      wx.onMenuShareQQ({
          title: shareObject.title, // 分享标题
          link: shareObject.link, // 分享链接
          imgUrl: shareObject.icon, // 分享图标
          success: function () {
              // 用户确认分享后执行的回调函数
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
      });

      //获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
      wx.onMenuShareWeibo({
          title: shareObject.title, // 分享标题
          link: shareObject.link, // 分享链接
          imgUrl: shareObject.icon, // 分享图标
          success: function () {
              // 用户确认分享后执行的回调函数
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
      });


      //获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
      wx.onMenuShareQZone({
          title: shareObject.title, // 分享标题
          link: shareObject.link, // 分享链接
          imgUrl: shareObject.icon, // 分享图标
          success: function () {
              // 用户确认分享后执行的回调函数
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
      });

      **/
  }
);



