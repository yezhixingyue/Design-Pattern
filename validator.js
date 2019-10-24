function Validator() { //创建一个校验构造函数
    this.cache = []; //缓存数组
    this.warnDom = [] //警告元素数组
}
Validator.prototype.strategies = { //在校验函数原型链上添加设置校验策略对象
    isNonEmpty: function (value, errorMsg) { //非空策略
        if (value == '') {
            return errorMsg;
        }
        return true
    },
    maxLength: function (value, length, errorMsg) { //最大长度策略
        if (value != '' && value.length > length) {
            return errorMsg
        }
        return true
    },
    minLength: function (value, length, errorMsg) { //最小长度策略
        if (value != '' && value.length < length) {
            return errorMsg
        }
        return true
    }
}
Validator.prototype.add = function (dom, showDom, strategyArr) { //在校验函数原型链中创建策略添加方法
    var self = this;
    this.warnDom.push(showDom); //在警告数组中添加元素
    strategyArr.forEach(function (ele, index) {
        self.cache.push(function () {
            // arr => ['isNonEmpty'] ['maxLength', '4'];
            var arr = ele.strategy.split(':');
            //arr => []  ['4']
            // type => isNonEmpty    maxLength
            var type = arr.shift();
            // [dom.value] [dom.value, '4']
            arr.unshift(dom.value);
            // [dom.value, errorMsg] [dom.value, '4', errorMsg]
            arr.push(ele.errorMsg);
            var msg = self.strategies[type].apply(self, arr);
            if (msg != true) {
                showDom.innerText = msg;
            }
            return msg;
        })
    })
}

Validator.prototype.start = function () {
    //标记最后是否能符合规则
    var flag = true;
    this.warnDom.forEach(function (ele) {
        ele.innerText = ''
    })
    this.cache.forEach(function (ele) {
        if (ele() !== true) {
            flag = false
        }
    })
    return flag
}

Validator.prototype.extend = function (config) {
    for (var prop in config) {
        Validator.prototype.strategies[prop] = config[prop]
    }
}