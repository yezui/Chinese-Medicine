$(function() {
    var urlData = GetRequest();
    var id = urlData.id;
    var resData;
    var $container = $('.container')
    var totalPrice = 0; + function() {
        var $bodyHeight = $(document).height()
        $container.css('min-height', $bodyHeight - 85.6)
    }()

    $('#userName').val(LS.get('userName')); //LS中读取默认联系人信息
    $('#userTel').val(LS.get('userTel'));

    $("#takeInNumber").on('keyup', function() {
        this.value = this.value.replace(/\D/g, '')
        var singelPrice = resData.obj.price.toFixed(2)
        var nowNumber = Number($(this).val())
        totalPrice = (nowNumber * singelPrice).toFixed(2)
        if (resData.obj.type == 1) {
            return false
        }
        $container.find('.sure .left span').text('￥' + totalPrice)
    })
    $.ajax({
        url: Constants.hostIp + 'weixin/activity/' + id,
        type: 'get',
        timeout: 5000,
        success: function(data, status) {
            console.log(data);
            resData = data;
            $container.find('.detail-content .right .p1').text(data.obj.goodsName).next('.p2').text(data.obj.title)
                .next('.p3').find('span').text(data.obj.price)
            $container.find('.detail-content .left').css('background-image', 'url(' + data.obj.icon + ')')
            console.log(data.obj.icon)
            $("#takeInNumber").val(urlData.goodsNumber)
            var oldNumber = Number(urlData.goodsNumber); //初始数量
            var temp = parseFloat(data.obj.price)
            var singelPrice = temp.toFixed(2)
            totalPrice = oldNumber * singelPrice;
            if (data.obj.type == 1) {
                return false;
            }
            $container.find('.sure .left span').text('￥' + totalPrice)
        },
        error: function(err) {
            console.log(err)
        }
    })
    //获取ip
    $.post('http://synsunny.parsec.com.cn/Dorado/ip/address',function(data,status){
        document.querySelector("#keleyivisitorip").innerHTML= data.host
    })
    $('.sure .sure-btn').on('click', function() {
        var userName = $('#userName').val()
        var userTel = $('#userTel').val()
        var goodsNumber = $('#takeInNumber').val();

        //判断是否注册，base封装方法
        islogin(function() {
            //数量验证
            if (Number(goodsNumber) == 0) {
                $.alerts({
                    title: "提示",
                    contentText: "数量必须大于0",
                    submitText: "确认",
                    submitClass: "btn-submit",
                    cancleText: "取消",
                    cancleClass: "btn-cancle",
                    callback: function(index, item) {
                        setTimeout(function() {
                            item.remove()
                        }, 1200)
                    },
                })
                return false;
            } else if (Number(goodsNumber) > (resData.obj.maxLimit - resData.obj.saleQuantity)) {
                $.alerts({
                    title: "提示",
                    contentText: "数量不得超过上限",
                    submitText: "确认",
                    submitClass: "btn-submit",
                    cancleText: "取消",
                    cancleClass: "btn-cancle",
                    callback: function(index, item) {
                        setTimeout(function() {
                            item.remove()
                        }, 1200)
                    },
                })
                return false;
            }
            //用户名验证
            if (userName.length < 2) {
                $.alerts({
                    title: "提示",
                    contentText: "用户名必须大于2位",
                    submitText: "确认",
                    submitClass: "btn-submit",
                    cancleText: "取消",
                    cancleClass: "btn-cancle",
                    callback: function(index, item) {
                        setTimeout(function() {
                            item.remove()
                        }, 1200)
                    },
                })
                return false;
            } else if (userName.length > 10) {
                $.alerts({
                    title: "提示",
                    contentText: "用户名不得大于10位",
                    submitText: "确认",
                    submitClass: "btn-submit",
                    cancleText: "取消",
                    cancleClass: "btn-cancle",
                    callback: function(index, item) {
                        setTimeout(function() {
                            item.remove()
                        }, 1200)
                    },
                })
                return false;
            }
            //电话验证
            var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            if (!myreg.test(userTel)) {
                $.alerts({
                    title: "提示",
                    contentText: "请输入有效的手机号码！",
                    submitText: "确认",
                    submitClass: "btn-submit",
                    cancleText: "取消",
                    cancleClass: "btn-cancle",
                    callback: function(index, item) {
                        setTimeout(function() {
                            item.remove()
                        }, 1200)
                    },
                })
                return false;
            }
            $('.sure .sure-btn').attr('disabled', 'disabled').text('提交中...').css('background-color', '#ccc')
            if (resData.obj.type == 3) {
                return false;
            }
            var takeData = {
                activityId: resData.obj.id,
                customerId: LS.get('custormid'),
                name: userName,
                number: $("#takeInNumber").val(),
                ip: document.querySelector('#keleyivisitorip').innerHTML,
                openid: LS.get(Constants.openid),
                telphone: userTel,
                type: resData.obj.type
            }
            $.ajax({
                url: Constants.hostIp + 'weixin/plus/activityMan',
                type: 'post',
                data: takeData,
                timeout: 5000,

                success: function(data, status) {
                    console.log(data);
                    if (data.status !== 0) {
                        // alert(data.msg)
                    } else {
                        if (resData.obj.type != 1) {
                            js_params = data;
                            paybill(function() { //支付成功回掉

                                location.href = 'my-activeList.html'

                            }, function() { //没有支付成功回掉
                                $('.sure .sure-btn').removeAttr('disabled').text('确认参加').css('background-color', '#40b952')
                            });
                        } else {
                            $.alerts({
                                title: "提示",
                                contentText: "报名成功",
                                submitText: "确认",
                                submitClass: "btn-submit",
                                cancleText: "取消",
                                cancleClass: "btn-cancle",
                                callback: function() {
                                    setTimeout(function() {
                                        location.href = 'my-activeList.html'
                                    }, 1500)
                                },
                            })
                        }
                    }
                },
                error: function() {

                }
            })
        })
    })

})
