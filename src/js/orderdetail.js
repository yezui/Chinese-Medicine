
 var urlData = GetRequest();
 var state;
//判断订单状态
$.ajax({
        url: Constants.hostIp + 'weixin/plus/order/' + urlData.id,
        type: 'get',
        data: {
            customerId:LS.get('custormid')
        },
        timeout: 5000,
        success: function(data) {

            if (data.status != 0) {
                return
            }
            var result = data.obj;
            console.log(result);
            var instr = '';
            state = result.state;
            switch (result.state) {
                case 1:
                    instr = '待付款';
                     break;
                case 2:
                    instr = '待发货';
                    break
                case 3:
                    instr = '待收货 ';
                    break;
                case 4:
                    instr = '已完成 ';
                    break;
                case 5:
                    instr = '已退单 ';
                    break; 
                 case 6:
                    instr = '已失效';
                    break;
            }         
            $('.stausone').append(
                '<p class="p1" style="border-bottom:1px solid #dcdcdc;margin-left:0.5rem;padding-bottom:0.2rem" >订单状态：' + instr + '</p>' +
                '<p class="p1" style="margin-left:0.8rem">订单编号：' + result.code + '</p>' +
                '<p class="time" style="margin-left:0.8rem">下单时间：' + result.showCreateTime + '</p>' +
                '<a href="#" class="pay" style="top:0.1rem;display:none" >付款</a>'
            );

            //判断付款按钮是否显示
            if (state ==1) {
                $('.pay').show()
            }

            console.log(result.cusAddress)
             if (result.cusAddress) {
                $('.staustwo').append(
                    '<p class="p1" style="border-bottom:1px solid #dcdcdc;margin-left:0.5rem;padding-bottom:0.2rem"><span class="cusAddress">总金额：</span ><a >￥'+ result.totalFee +'</a></p>' +
                    '<p class="p1" style="margin-left:0.8rem"><span class="cusAddress">收货地址：</span>' + result.cusAddress.content + '</p>' +
                    '<p class="time" style="margin-left:0.8rem"><span class="cusAddress">收货人：</span>' + result.cusAddress.linkman + '</p>'+
                    '<p class="time" style="margin-left:0.8rem"><span class="cusAddress">联系方式：</span>' + result.cusAddress.linkphone + '</p>');
            } else {
                $('.two').hide();
            }

            var shoplists = result.goodslists;


            function shopstr(shoplist) {
                var shopstr =
                    '<div class="goods">' +
                    '<div class="gimg"><img src="' + shoplist.goodsIcon + '" alt=""></div>' +
                    '<div class="gtext" style="width:6rem;margin-top:0">' +
                    '<p class="title" style="margin-left: 0.1rem">' + shoplist.goodsName + '</p>' +
                    '<p>' +
                    '<span class="timetext">' + shoplist.number + '件</span>' +
                    '<span class="timetext">单价</span>' +
                    '<span class="timetext">¥' + shoplist.dealPrice + '</span>' +
                    '</p>' +
                    '</div>' +
                    '</div>';
                return shopstr
            }
            var shopstri = '';
            for (var i = 0; i < shoplists.length; i++) {
                var shoplist = shoplists[i];
                var temp = shopstr(shoplist);
                shopstri += temp;
               
            }
            var numleng = shoplists.length;
            $('.goodlist').append(shopstri);
            $('.bartext p').html('共' + numleng + '件商品')
            result.remark? $('.warn-word').html('' + result.remark + '') : $('.warn-word').css('display', 'none');

        },
        error: function(err) {
            console.log(err);

        }
    })
    //获取ip
    $.post('http://synsunny.parsec.com.cn/Dorado/ip/address',function(data,status){
        document.querySelector("#keleyivisitorip").innerHTML= data.host
    })
    //未支付成功的订单,重新支付
    var payflag = false;
$('.stausone').on('click', '.pay', function(event) {
    event.preventDefault();
    event.stopPropagation();

    var id = $(this).parents('.list').attr('data-id');
    var data = {
        id: urlData.id,
        ip:document.querySelector('#keleyivisitorip').innerHTML,
        openid: LS.get(Constants.openid),
        customerId: LS.get('custormid')
    }
    if (payflag) {
        return;
    }
    payflag = true;
    $.ajax({
        url: Constants.hostIp + 'weixin/plus/order/pay',
        type: 'post',
        data: data,
        timeout: 5000,
        success: function(data, status) {
            if (data.status != 0) {
                $.alerts({
                    title: "提示",
                    contentText: data.msg,
                    callback: function() {
                        var timer = setTimeout(function() {
                            $('.alert-mask').hide();
                        }, 1500)
                    },
                });
            } else {
               var data = data;
                var orderId = data.id;
                js_params = data;

                paybill(function() {
                    location.reload();
                }, function() {
                    payflag =false;
                });
            }
        },
        error: function(err) {
            console.log(err);
        }
    })
});

