
var Constants = {
  openid: "openid", //localstorage里面
  sourceURL: "sourceURL",
  errorInfo: "errorInfo",
  errorPage: "error.html",
  attendPage: "scancode.html",
  hostIp: "http://wx.chengqi2012.com/Taurus/",
  host:'http://wx.chengqi2012.com/'
};

//时间格式化函数
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};


//模态框插件
$.alert = function(option) {
  option = $.extend({
    title: "提示",
    contentText: "这是一个提示框,点击去小关闭",
    submitText: "提交",
    submitClass: "btn-submit",
    cancleText: "取消",
    cancleClass: "btn-cancle",
    callback: function() {},
  }, option);
  var htmlString = '<div class="alert-mask">' +
    '<div class="alert-modal">' +
    '<div class="alert-title">' + option.title + '</div>' +
    '<div class="alert-body">' +
    '<div class="contet">' + option.contentText + '</div>' +
    '</div>' +
    '<div class="alert-footer">' +
    '<div class="alert-btn ' + option.cancleClass + '">' + option.cancleText + '</div>' +
    '<div class="alert-btn ' + option.submitClass + '">' + option.submitText + '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
  var $modal = $(htmlString);
  $modal.find(".alert-btn").on("click", function() {
    var event = {
      index: $(this).index(),
    }
    $modal.remove();
    option.callback.call(this, event);
  })
  $("body").append($modal);
};
$.alerts = function(option) {
  option = $.extend({
    title: "提示",
    contentText: "这是一个提示框,点击去小关闭",
    submitText: "提交",
    submitClass: "btn-submit",
    cancleText: "取消",
    cancleClass: "btn-cancle",
    callback: function() {},
  }, option);
  var htmlString = '<div class="alert-mask">' +
    '<div class="alert-modal">' +
    '<div class="alert-title">' + option.title + '</div>' +
    '<div class="alert-body">' +
    '<div class="contet">' + option.contentText + '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
  var $modal = $(htmlString);
    $("body").append($modal);
     option.callback.call(this, event,$modal);

};

//获取地址栏参数
function GetRequest() {
  var url = location.search;
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
    }
  }
  return theRequest;
}


/**
 * 获取URL请求参数
 * @param name
 * @returns
 */
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
//判断进来的url
function seturl() {
  var url = window.location.href;
  SS.set('targeturl', url)
}
//判断用户是否注册

function islogin(cb) {
  //已经登陆的情况
  if (LS.get('custormid')) {
    cb&&cb()
    return true;
  }else{
    //获取个人信息
    $.ajax({
        url: Constants.hostIp + '/weixin/plus/customer/get',
        type: 'get',
        timeout: 5000,
        data: {
            openid: LS.get(Constants.openid)
        },
        success: function(data, status) {
            if (data.status == 0) {
                LS.set('custormid', data.customer.id)
                LS.set('userName', data.customer.name);
                LS.set('userTel', data.customer.phone);
                cb&&cb()
                return true;
            } else {
                seturl()              
                window.location.href = 'personal_information.html';  
                return false;               
            }
        }.bind(this),
        error: function(err) {

        }
    })
  }
}
//获取运费信息并且缓存
$.ajax({
        url: Constants.hostIp + 'weixin/index/imgs',
        type: 'get',
        timeout: 5000,
        success: function(data) {
            if (data.status == 0) {
                var ssyunfei= data.delivery;
                var smyufei = data.freeDelivery;
                SS.set('ssyunfei',ssyunfei);
                SS.set('smyufei',smyufei);
           }

        },
        error: function(err) {}
    })