$(function() {
    + function() {
        var $tabs = $('.content .nav-bar');
        var $tabsDetail = $('.content .detail-tab')
        var $offsetTop;
        setTimeout(function(){
            $offsetTop = $tabs.offset().top;
        })
        var isfiexd = false;
        var $storeName = $('.box .nav-bar');
        var $address1 = $('.store1 .address')
        var $address2 = $('.store2 .address')
        var geoPosition = {
            "gaoxindian": {
                "dx": 0,
                "dy": 0
            },
            "shuhandian": {
                "dx": 0,
                "dy": 0
            }
        }
        var resData;
        ajaxGet({
            url: Constants.hostIp + 'weixin/drugstore/list',
            type: "get",
            data: {},
            callback: function(data, status) {
                console.log(data);
                if (data.status == 0) {
                    resData=data;
                    data.lst.forEach(function(item,index){
                        if(item.id=="b01000"){
                            $('#cengqi').find('.address-box').html(item.introduction)//首页文本
                        }else if(item.id=="b01001"){
                            geoPosition.shuhandian.dy = item.latitude
                            geoPosition.shuhandian.dx = item.longitude
                            geoPosition.shuhandian.name = item.name
                            $address1.find('p').eq(0).find('span').eq(1).text(item.address)
                            $('#telPhone1').html(data.lst[1].phone)
                            $('.store1 .address-box').html(item.introduction)
                        }else if(item.id=="b01004"){
                            geoPosition.gaoxindian.name = item.name
                            geoPosition.gaoxindian.dy = item.latitude
                            geoPosition.gaoxindian.dx = item.longitude
                            $address2.find('p').eq(0).find('span').eq(1).text(item.address)
                            $('.store2 .address-box').html(item.introduction)
                            $('#telPhone2').html(item.phone)
                        }
                    })
                }
            }
        })        
        ajaxGet({
            url: Constants.hostIp + 'weixin/index/imgs',
            type: "get",
            data: {},
            callback: function(data, status) {
                console.log(data);
                if (data.status == 0) {
                    if(data.homeImgs!=undefined){
                        var imgs=data.homeImgs.split(',')
                        var str='';
                        imgs.forEach(function(item){
                            str+=                    
                            "<div class=\"swiper-slide\">"+
                                "<img src=\""+item+"\">"+
                            "</div>" 
                        })
                        $('.container .swiper-container .swiper-wrapper').html(str);
                        if(imgs.length>1){
                            var mySwiper = new Swiper('.swiper-container', {
                                autoplay: 3000,//可选选项，自动滑动
                                loop : true,
                                pagination : '.swiper-pagination'
                            })
                        }
                    }
                }
            }
        })
        $tabs.on('click', '.nav-bar-detail', function(e) {
            if (e.target == this) {
                var $index = $(this).index()
                $(this).addClass('active').siblings().removeClass('active')
                $tabsDetail.eq($index).addClass('active').siblings('.detail-tab').removeClass('active');
                if (document.body.scrollTop > $offsetTop) {
                    // scrollInfo[navIndex].y=document.body.scrollTop;
                    // navIndex=$index;
                    window.scrollTo(0,$offsetTop);

                }
            }
        })
        window.onscroll = function(e) {
            if (document.body.scrollTop > $offsetTop) {
                if (!isfiexd) {
                    $tabs.addClass('fixed')
                    isfiexd = true;
                }

            } else {
                if (isfiexd) {
                    $tabs.removeClass('fixed');
                    isfiexd = false;
                }
            }
        }

        function ajaxGet(options) {
            $.ajax({
                url: options.url,
                type: options.type,
                data: options.data,
                success: function(data, status) {
                    options.callback(data, status)
                },
                error: function() {
                    console.log('err')
                }
            })
        }
        var $storeName = $('.box .nav-bar');
        var jsticket = {
            appId: 'wx1ef0fb04148419c2', //parsec
            timestamp: '',
            nonceStr: '',
            signature: ''
        };
        //要用的接口一定要先注册，
        var jsApiList = ['checkJsApi', 'onMenuShareTimeline',
            'onMenuShareAppMessage', 'onMenuShareQQ', 'getLocation',
            'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems',
            'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem',
            'getNetworkType', 'hideOptionMenu', 'showOptionMenu',
            'closeWindow', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'scanQRCode', 'openLocation'
        ];

        function getWinxinLocation(dx, dy, name, address) {
            $.get("http://wx.chengqi2012.com/Taurus/weixin/getJSTicket?url=" + location.href, function(data, status) {
                console.log(data)
                jsticket.timestamp = data.timestamp;
                jsticket.nonceStr = data.nonceStr;
                jsticket.signature = data.signature;
                jsticket.appId = data.appId;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: jsticket.appId, // 必填，公众号的唯一标识
                    timestamp: jsticket.timestamp, // 必填，生成签名的时间戳
                    nonceStr: jsticket.nonceStr, // 必填，生成签名的随机串
                    signature: jsticket.signature, // 必填，签名，见附录1
                    // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    jsApiList: jsApiList
                });
                wx.ready(function() {
                    wx.openLocation({
                        latitude: dy, // 纬度，浮点数，范围为90 ~ -90
                        longitude: dx, // 经度，浮点数，范围为180 ~ -180。
                        name: name, // 位置名
                        address: address, // 地址详情说明
                        scale: 17, // 地图缩放级别,整形值,范围从1~28。默认为最大
                        infoUrl: 'www.baidu.com' // 在查看位置界面底部显示的超链接,可点击跳转
                    });
                });
                wx.error(function(err) {
                    console.log('err')
                })
            })
        }
        //蜀汉店一键导航
        $('#direction1').on('click', function(e) {
                // var dx = 104.023910; //精度longitude
                // var dy = 30.688230; //纬度latitude               
                var dx = geoPosition.shuhandian.dx; //精度longitude
                var dy = geoPosition.shuhandian.dy; //纬度latitude
                var name = geoPosition.shuhandian.name;
                var address = $address1.find('p').eq(0).find('span').eq(1).text()
                getWinxinLocation(dx, dy, name, address)

            })
            //高新店一键导航
        $('#direction2').on('click', function(e) {
            // var dx = 104.072977;
            // var dy = 30.592964;
            var dx = geoPosition.gaoxindian.dx; //精度longitude
            var dy = geoPosition.gaoxindian.dy; //纬度latitude
            var name = geoPosition.gaoxindian.name;
            var address = $address2.find('p').eq(0).find('span').eq(1).text()

            getWinxinLocation(dx, dy, name, address)
        })
        function wxlogout() {
            localStorage.clear();
            sessionStorage.clear();
            location.reload();
        }
        $('#button').on('click',function(e){
            wxlogout()
        })

    }()
})
