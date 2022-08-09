import {Collapse} from "hosui";

export default {
    common: {
        code: "编码",
        name: "名称",
        type: "类型",
        weight: "排序",
        remark: "备注",
        module:"模块",
        yes:"是",
        no:"否",
        createTime: "创建时间",
        inexpireTime:"生效日期",
        invalidTime:"失效日期",
        isActived: "是否启用",
        operation: "操作",
        index:"序号",
        is:"是",
        deny:"否",
        dateZhi:"至",
        startDate:"开始时间",
        endDate:"结束时间",
        isChooseAll:"全选/全不选",
        expandOrCollapse:"展开/折叠",
        FatherOrSonLinkage:"父子联动",
        timeLine:"数据生命周期",
        placeholder: {
            code: "请输入编码",
            name: "请输入名称",
            key: "请输入检索内容",
            remark:"请输入备注",
            permCode:"请输入权限编码",
            parent:"请选择上级元素",
            pleaseInexpireTime:"请选择生效日期",
            pleaseInvalidTime:"请选择失效日期",
            defaultData: "请输入默认值",
            dateFormat: "请输入日期格式",
            tenantPackage: "请选择版本",
            router: "请输入路由",
            icon: "请选择图标",
            defaultPwd: "请输入默认密码",
            lockTime: "请输入锁定时长",
            driverClass: "请输入驱动类",
            username: "请输入用户名",
            password: "请输入密码",
            url: "请输入链接地址",
            linkman: "请输入联系人姓名",
            address: "请输入联系人地址",
            contactNumber: "请输入联系人电话",
            domain: "请输入域名",
            title: "请输入对象描述",
            operator: "请输入操作人",
            datasource: "请选择数据源"
        },
        actived: {
            true: "启用",
            false: "停用",
            activedTrue: "是",
            activedFalse: "否"
        },
        confirm: {
            actived: "确定要{0}【{1}】吗？",
            delete: "是否删除【{0}】的数据？",
            deleteAll: "是否删除已选中的数据？",
            unLock:"是否解锁【{0}】用户",
            data: "请最少选择一条数据",
            reset:"是否重置用户【{0}】的密码?",
            menu: "请选择菜单",
            parentId: "新增时最多只能选中一个上级资源",
            once:"请选择一条数据",
            init: "确定要初始化数据吗？",
            dataNull: "未选中数据，请先选中需要删除的数据",
            dataExamineNull:"未选中数据，请先选中需要审核的数据",
            dataNullClear:"未选中数据，请先选中需要清空的数据"
        },
        rule: {
            code: {
                required: "编码不能为空",
                validate: "编码已存在，请重新输入",
                noZh: "编码不能带中文",
                length: "编码的最大长度为37",
                notInputChinese:"编码不能输入中文",
            },
            name: {
                required: '名称不能为空',
                length: "名称的最大长度为37"
            },
            router: {
                validate: "路由已重复，请重新输入",
                required: "路由不能为空",
                length: "名称的最大长度为250"
            },
            icon: {
                length: "图标的最大长度为37"
            },
            length:{
                noLength:"{0}不能超过40个字符",
                lengthValue:"{0}不能超过100个字符",
            },
            remark: {
                length:"备注不能超过1000个字符",
            },
            Integer: "请输入正整数",
            pwd: {
                noZh: "密码不能带中文",
                required: "默认密码不能为空",
                length: "默认密码最大长度为40"
            },
            checkbox: {
                required: "请输入该验证规则的值"
            }
        },
        tab: {
            baseMessage: "基本信息"
        },
        tipMessage:{
            A0001:"对象不能为空！",
            A0002:"编码不能为空！",
            A0003:"编码已存在！",
            A0004:"未找到对象！",
            A0005:"id不可为空！",
            A0006:"存在子节点,不可删除!",
            A0007:"路由地址已被使用！",
            A0008:"节点内容不为空，不可删除！",
            A0009:"子内容更新失败！",
            A0010:"路由地址不可为空！",
            A0011:"角色不为空！",
            A0012:"租户不为空！",
            A0013:"权限编码不允许与预置页编码重复！",
            A0014:"权限编码不允许重复！",
            A0015:"预置页面id不可为空！",
            A0016:"实体id不可为空！",
            A0017:"字典编码不可为空！",
            A0018:"找不到字典对象！",
            A0019:"登录名不能为空！",
            A0020:"登录名已存在！",
            A0021:"图像太大,请不要超过100kb！",
            A0022:"权限编码不能为空！",
            A0023:"传入文件不能为空！",
            A0025:"导入方式不能为空！",
            A0026:"文件转换错误！",
            A0027:"域名不可为空！",
            A0028:"域名已存在！",
            A0030:"存在子内容,不可删除！",
            A0031:"主键已存在！",
            A0032:"子项编码不能为空！",
            A0033:"状态不能为空！",
            A0034:"数据源不能为空！",
            passwordPolicyIsNULL: "密码策略对象找不到",
            JYP001: "密码长度不够",
            JYP002: "密码复杂度不够",
            JYP003: "密码长度和复杂度不够",
            M0003001: "两次输入的密码不一致",
            M0003002: "旧密码不正确",
            M0003003: "验证码不正确",
            M0003004: "新密码不能与上次密码一致",
            99001001: "分页参数不能小于1",
            99001005: "文件未找到异常",
            99001006: "请求路径未匹配异常",
            99001007: "空指针异常",
            99001008: "参数校验异常",
            99001009: "未知错误，请联系管理员处理",
            99001010: "重刷异常",
            99001011: "签名错误",
            99001012: "解密错误",
            200: "成功",
            400: "失败",
            500: "错误",
            A0029: "{0}【{1}】已被租户【{2}】使用，不可删除！",
            A0035: "租户已经使用该版本,不允许停用或删除!",
            A0036: "部门不能为空!",
            A0037: "用户的主部门角色不能删除！"
        }
    },

    operation: {
        success: "操作成功！",
        error: "操作失败！",
        query: "查询",
        reset: "重置",
        expand: "展开",
        collapse: "收起",
        confirm:"确定",
        cancel: "取消",
        close:"关闭",
        save: "保存",
        fastSave: "快速新增",
        relationPerson: "关联人员",
        relation:"关联",
        notRelationPerson:"未关联人员",
        relationPage: "关联页面",
        design: "设计",
        add: "新增",
        edit: "编辑",
        view: "查看",
        export: "导出",
        import: "导入",
        resetPassword: "重置密码",
        check: "审核",
        delete: "删除",
        detetion: "清空",
        unlock: "解锁",
        element: "页面元素",
        initData: "初始化数据",
        authorization: "授权",
        authorize: {
            page: "页面元素授权",
            menu: "功能授权",
            package: "版本授权"
        },
        bizLog: "数据日志",
        timeline: "数据生命周期",
        bind: "绑定"
    },
    page: {
        title: "页面预置",
        perm:"元素授权",
        meta: "页面元素",
        status: "状态",
        permCode:"权限标识",
        type:"字段类型",
        parent:"上级元素",
        id:"主键id",
        permName:"元素名称",
        permType:"元素类型",
        parentId:"父级主键",
        pageCode:"预置页面编码",
        pageName:"预置页面名称",
        pageId:"预置页面id",
        tenantId:"租户id",
        weight:"排序",
        upload:"导入预置元素",
        export:"导出预置元素"

    },
    resource: {
        resourceManage: "菜单管理",
        title: "菜单",
        router: "路由",
        icon: "图标",
        openType: "打开方式",
        parentId: "上级目录",
        resourceType: "菜单类型",
        catalogPosition: "目录位置",
        pageAttr: "页面属性",
        frame: "是否外链",
        visible: "是否可见",
        cached: "是否缓存",
        attrName: "属性名",
        attrValue: "属性值",
        attrRemark: "说明",
        tab: {
            highJS: "高级JS"
        },
        rule: {
            type: "资源类型不能为空",
            parentId: "父级资源不能为空",
            router: "路由不能为空"
        },
        placeholder: {
            icon: "请选择图标",
            JS: "请输入JS代码",
            catalog: "请选择目录位置"
        },
        checkTip: "只能选择目录类型的资源作为上级资源！",
        tipMessage: {
            row: "请将每一行信息补充完整"
        },

    },
    //系统配置
    sysConfig: {
        keyValue: "键值",
        title: "配置",
        sysConfig:"系统配置",
        placeholder: {
            keyValue: "请输入键值",
        },
        rule: {
            keyValue: {
                required: "键值不能为空",
            },
        },
    },
    //数据字典
    dict: {
        title: "字典",
        optionDesc:"选项信息",
        dictCategory:"字典分类",
        notEmpty:"节点内容不为空，不可删除！",
        dictKey:"字典key",
        dictName:"字典名称",
        defaulted:"是否默认值",
        confirm: {
            module:"请选择模块",
        },
        placeholder: {
            dictCategory: "请选择字典分类",
            validateKey:"字典key验证不通过不可以新增!",
        },
        rule: {
            module:{
                required:"字典key不能和字典编码相同",
                validate: '字典key已存在,请重新输入',               
            }
        }
    },
    tenant: {
        choosedPackage: "所选版本",
        packageManage: "版本管理",
        tenantManage: "租户管理",
        title: "租户",
        expand: "展开/折叠",
        package: "版本",
        linkman: "联系人姓名",
        contactNumber: "联系人电话",
        expireTime: "过期时间",
        domain: "域名",
        linkmanEmail: "联系人邮箱",
        address: "联系人地址",
        chooseAll: "全选/全不选",
        auth: "授权",
        parentSonLink: "父子联动",
        dataConfig: "数据源配置",
        weight: "顺序",
        Id: "租户ID",
        placeholder: {
            time: "请选择过期时间",
            packageId: "请选择租户包"
        },
        rules: {
            domain: "租户域名不能为空",
            name: "租户名是必填项",
            packageId: "租户包是必选项",
            code: "租户包编码不能为空",
            doubleCode: "租户包编码重复",
            packageName: "租户包名是必填项",
            linkman: {
                length: "联系人姓名长度不能超过20位",
                required: "联系人姓名是必填项",
                noSpace: "联系人姓名不能带空格"
            },
            address: "联系人地址长度不能超过60位",
        },
        tipMessage: {
            nullData: "未选中数据",
            getPackageField: "获取租户包失败",
            chooceTenant: "请先选中租户",
            dataSourceSuccess: "数据源配置成功",
            dataSourceField: "数据源配置失败",
            doubleDomain: "域名重复",
            domain: "请输入合法域名",
            doublePhone: "联系人电话不可重复",
            phone: "请输入正确的电话号码",
            nullPhone: "联系人电话不能为空",
            package: "获取租户包失败",
            packageIsUse: "该租户包已被使用，禁止停用",
            initSuccess: "初始化数据成功",
            initError: "初始化数据失败",
            initDeactivate: "该租户已被停用，请先启用再初始化数据",
            packageStop: "该版本已停用，无法授权"
        }

    },
        
    //角色管理
    role: {
        title: "角色",
        roleTitle:"角色管理",
        logo:"选择头像",
        logouploud:"头像大小不能超过10KB！",
        selectRole:"请选择角色",
        userTitle:"用户",
        roleAttr:"角色属性",
        editUserRole:"编辑用户角色",
        addUser:"添加用户",
        assignUser:"分配用户",
        loginName:"登录名",
        isMain:"是否主部门",
        orgId:"部门",
        mainOrgId:"主部门",
        superiorRole:"上级角色",
        min:"分",
        defaultPage:"默认首页",
        tokenTime:"token有效时长",
        menuPermissions:"菜单权限",
        dataPermissions:"数据权限",
        pageElementPermissions:"页面元素权限",
        uploadno:"上传头像格式不正确.",
        uploadnoIcon:"( 图片格式为.gif, .jpg, .jpeg, .png, .bmp, .webp,且大小不超过10kb ! )",
        placeholder: {
            placePerson : "请选择人员",
            placeRole:"请选择角色",
            placeOrg:"请选择部门",
            placeType:"请选择类型",
            placeLoginName:"请输入登录名",
            placeTokenTime:"请输入token有效时长",
            placeParentId:"只能选择一个角色进行新增",
            authPrompt:"第一次授权菜单权限后,才可设置数据和页面元素权限。",
            authsubAdmin:"次级管理员只能对菜单进行授权。"
        },
        rule: {
            type: {
                required: "类型不能为空",
            },
            parentId: {
                required: "模块不能为空",
            },
            role: {
                noRole:"角色不能为空",
            },
            org: {
                noOrg:"部门不能为空",
                orgEqual:"不能选择相同的部门和角色",
                orgEquals:"不能选择相同的部门",
                orgNull:"部门不为空,角色不能为空",
                roleNull:"角色不为空,部门不能为空"
            }
        },
        import: "导入角色",
        export: "导出角色"
    },
    //用户管理
    user: {
        user:"用户管理",
        title: "用户",
        name:"姓名",
        recover:"恢复用户",
        userList:"用户列表",
        userTreeList:"部门用户列表",
        effectTime:"生效时间",
        lockedUser:"已锁定用户",
        deleteUser:"已删除用户",
        userType:"用户类型",
        unlockDate:"解锁时间",
        employeeCode:"工号",
        updataPassword:"下次登录强制修改密码",
        selectPerson:"选择人员",
        JobInformation:"职责信息",
        associatedPerson:"关联人员",
        basicInformation :"基础信息",
        selectDate:"选择日期",
        phoneNumber:"手机号",
        isMainOrgId:"主部门",
        import: "导入用户",
        export: "导出用户",
        locked: {
            true:"解锁",
            false:"未解锁",
        },
        confirm: {
            recover: "确定要恢复已选择的数据吗？",
            relationPerson:"该用户已经关联人员,确定继续关联么?"
        },
        rule: {
            loginName: {
                required: "登录名不能为空!",
                noChinese:"登录名不能输入中文",
                validate: "登录名已存在，请重新输入!",
                loginNameLength:"{0}不能超过12个字符!",
                specialCharacterl:"不能含有特殊字符！",
            },
            logo: {
                required: '校验不通过,请按照要求选择的图片!'
            },
            name: {
                required: '姓名不能为空'
            },
            userType: {
                required: '类型不能为空',
                msgAdd:"校验不通过不可以进行新增!"
            },
        },
        placeholder: {
            placeUserName:"请输入姓名",
            placeUserOrg:"请输入用户所在部门",
            multipleChoice:"人员不能多选",
            isMainOrgNall:"主部门不能为空,请先设置主部门!"
        },
    },
    expand: {
        title: "字段",
        type: "显示类型",
        fieldType: "字段类型",
        defaultData: "默认值",
        dataSource: "数据集合",
        permCode: "权限编码",
        status: "状态",
        dateFormat: "日期格式",
        name: "元素",
        pageShowType: "页面显示类型",
        group: "组",
        reback: "关闭",
        expand: "自定义字段",
        design: "自定义字段设计",
        link: "关联用户/页面",
        input: "输入框",
        inputNumber: "计数器",
        textarea: '文本域',
        DatePicker: '日期选择器',
        select: "下拉单选",
        switch: "开关",
        menu: {
            required: "必填",
            validateUpperCase: "包含大写",
            validateLowerCase: "包含小写",
            numRange: "数值范围",
            isPassword: "必须包含大小写、数字和特殊字符",
            validatePhone: "手机号",
            validateTelphone: "固定电话",
            validatePhoneTwo: "手机号或固定电话",
            len: "长度",
            max: "最大长度",
            min: "最小长度",
            validateIdNo: "身份证",
            validateEMail: "邮箱",
            validateIP: "ip地址",
            validateURL: 'url地址',
        },
        tab: {
            validator: "验证规则"
        },
        message: {
            name: "名称不能为空",
            type: "显示类型必须选择",
            tab: "请先新建一个tab页签分组",
            tabName: "请输入分组名称",
            linkPage: "确定关联该预置页面？"
        },
        placeholder: {
            placeholder: "请选择",
        }
    },

    //数据源管理
    datasource: {
        datasourceManage: "数据源管理",
        driverClass: "驱动类", 
        username: "用户名", 
        url: "链接地址", 
        title:"数据源",
        dName:"数据源名称",
        password: "密码", 
        rules: {
            name: "数据源名称是必填项",
            driverClass: "驱动类名称是必填项",
            url: {
                required: "链接地址名称是必填项",
                length: "链接地址长度不能超过256位"
            },
            username: "用户名名称是必填项",
            password: "密码是必填项",
            tipMessage: {
                driverClass: "驱动类名称最大长度为50",
                username: "用户名名称最大长度为50",
                password: "密码名称最大长度为50"
            },
            leftBrackets: {
                leftOnly: "该括号只能是左括号",
                doubleBracket: "括号必须成对出现"
            },
            value:  "权限字段是必填项",
            type: "类型是必选项",
            operate: "条件是必选项",
            rightBrackets: {
                rightOnly: "该括号只能选择右括号",
                doubleBracket: "括号必须成对出现"
            }
        },
        nodeChooseNoll: "请先选中需要删除的数据"
    },
    //登录日志
    loginLog: {
        info: "日志详情", 
        title: "标题", 
        loginName: "登录名", 
        loginWay: "登录方式", 
        browser:"浏览器",
        os: "操作系统", 
        loginLocation: "实际地址", 
        ip: "客户端ip", 
        serverIP: "服务器ip", 
        visitSource:"访问来源",
        mac: "MAC地址",
        msg: "提示消息", 
        createTime: "创建时间", 
        examineState: "审核状态",
        examineOpinion: "审核意见", 
        examineUserName: "审核人",  
        examineDate: "审核时间", 
        loginDate:"登录日期",
        examine:"审核",
        unExamine:"未审核",
        emptyLog:"清空日志",
        role:"角色",
        org:"部门",
        examineTip:"确定要审核选中的记录么?",
        emptyLogTip:"确认要清空所有查询到的所有日志数据?",
        placeholder: {
            pleaseLoginType: "请输入登录方式",
            pleaseIp: "请输入客户端ip",
            pleaseServerIP: "请输入服务器ip",
            pleaseLoginLocation:"请输入实际地址"
        }
    },
     //在线用户
     onLine: {
        name: "用户姓名", 
        Offline: "强制下线", 
        loginName: "登录名",
        orgName: "部门名称",
        positionName: "职务名称",
        host: "登录ip地址",
        browser: "浏览器类型",
        os: "操作系统",
        startTime: "创建时间",
        loginTime:"登录时间",
        OfflineTip:"确定要将选中的用户强制下线?",
        placeholder: {
            pleaseName: "请输入用户姓名",
        }
    }, 
    //缓存
    cache: {
       code: "缓存编码", 
       name: "名称", 
       time: "过期时间(秒)",
       desc: "缓存描述",
       clear: "清空",
       clearTip:"确定要清空选中的缓存?",
       clearTip2:"清空该缓存可能导致系统出错,确定清空?",
       host: "登录ip地址",
       browser: "浏览器类型",
       os: "操作系统",
       startTime: "创建时间",
       OfflineTip:"确定要将选中的用户强制下线?",
       placeholder: {
        pleaseCode: "请输入缓存编码",
    }
   },
   //数据权限
   datascope:{
    visibleField:"可见字段",
    header:"数据权限",
    router:"接口地址",
    remark:"备注",
    compare:"比较符",
    dict:"字典",
    dictIetm:"字典项",
    dataValue:"数据值",
    ins:"机构",
    org:"部门",
    user:"用户",
    title:"请选择内容",
    notDict:"不允许选择字典分类",
    columnNotNull:"操作失败权限字段不能为空",
    typeNotNull:"操作失败权限类型不能为空",
    ruleNot:"操作失败规则条件不正确",
    operateNot:"操作失败规则条件不正确",
    khaoNot:"操作失败规则括号不正确",
    scopeEdit:"作用域维护",
    scopeNull:"操作失败,数据权限规则不能为空",
    kuohao:"括号",
    column:"权限字段",
    type:"类型",
    scope:"作用域",
    operate:"条件",
    dateTypeNot:"请选择正确的数据",
    placeholder:{
        router:"请输入接口地址",
        visibleField:"请输入可见字段",
        column:"请输入权限字段",
        type:"请选择类型"
    },
    rule:{
        router:{
            required :"接口地址不为空"
        }
    }
   },
    // 上传
    upload: {
        text: "将文件拖到此处，或点击上传",
        excelTip: "提示：仅允许导入“xls”或“xlsx”格式文件",
        add: "添加新数据（只做新增操作，按模板中标记的唯一标识导入表中不存在的数据）",
        update: "更新已有数据（只做更新操作，按模板中标记的唯一标识更新表中已存在的数据）",
        addAndUpdate: "更新已有数据并添加新数据（以上两种情况同时执行）",
        msg: "导入结果",
        please: "请上传文件",
        downloadTip: "上传文件需要使用最新模板，点击此处",
        downloadTemplate: "立即下载",
        operateType: "操作类型",
        fileUpload: "文件上传",
        pleaseSelect : "请选择操作类型",
        prev: "上一步",
        next: "下一步",
        total: "执行条数：",
        success: "，成功条数："
    },
    // 导出
    export: {
        pleaseSelect: "请选择导出列（默认勾选列与导入模板列一致）",
        checkAll: "全选",
        submit: "确认"
    },
      //操作日志
      operlog: {
        info: "日志详情",
        title: "标题",
        userId: "用户主键",
        userName: "操作人",
        browser:"浏览器",
        type: "类型",
        content: "内容",
        method: "方法名称",
        serverIP: "服务id",
        requestMethod: "请求方式",
        requestUrl: "请求url",
        ip:"实际地址",
        clientIp: "客户端ip",
        serverIp: "服务器ip",
        clientMac: "客户端mac",
        ipLocation: "ip位置",
        requestParam: "请求参数",
        responseResult: "请求结果",
        errorMsg: "错误信息",
        operTime: "操作时间",
        takeTime: "操作耗时(毫秒)",
        maxTime:"最长耗时",
        minTime:"最短耗时",
        createTime: "创建时间",
        examineState: "审核状态",
        examineOpinion: "审核意见",
        examineUserName: "审核人",
        examineDate: "审核时间",
        examine:"审核",
        unExamine:"未审核",
        emptyLog:"清空日志",
        examineTip:"确定要审核选中的记录么?",
        emptyLogTip:"确认要清空所有查询到的所有日志数据?",
        placeholder: {
            pleaseUserName: "请输入操作人",
            pleaseTitle: "请输入标题",
        }
    },
    // 多及授权
    permRoleScope: {
        resource:"资源",
        role:"角色",
        leftNotCheckTip: "左侧管理员角色未选择,请选择要授权的管理员角色!",
        secondAdminTree: "次级管理员角色树",
        nodata:"当前未开启分级授权,请在系统参数中开启后使用此功能",
        noPermissionTemporarily :"暂无权限!"
    },
    // 生命周期
    timeline: {
        tableName: "表：",
        className: "类描述：",
        content: "内容：",
        title: "数据生命周期 / ",
        warning: "不可选中多条！",
        please: "请选择表格数据"
    },
    // 业务日志
    businessLog: {
        title: "对象描述",
        operateTime: "操作日期",
        type: "操作类型",
        pleaseSelectType: "请选择类型",
        table: "表",
        className: "类描述",
        operatorIp: "操作人ip",
        operator: "操作人",
        serverIP: "服务器ip",
        time: "执行时间",
        field: "字段",
        fieldName: "名称",
        before: "旧值",
        after: "新值",
        total: "执行条数",
        success: "成功条数",
        add: "新增部分",
        delete: "删除部分"
    },
    // 密码策略
    passwordPolicy: {
        useLastPwd: "延用密码",
        inputNumber: "输错次数",
        default: "默认密码",
        loseUseLast: "失效显示延用按钮",
        firstLoginChange: "首次登录强制修改",
        neewPassEqualLast: "新密码与上次密码一致",
        isUseLastPass: "是否允许延用上次密码",
        passRule: "密码规则",
        passExpiration: "密码有效期(天)",
        leastPass: "密码最小长度",
        passComplexity: "密码复杂度",
        safeControl: "安全控制",
        loginValid: "登录校验验证码",
        changePassValid: "修改密码校验验证码",
        loginValidRule: "登陆时校验密码规则",
        passFind: "密码找回",
        openGraphics: "密码输错开启图形验证",
        lockPwd: "密码输错时锁定账号",
        inputPassSum: "当输入错误次数达到(次)",
        dealWay: "处理方式",
        lockTime: "锁定时长(时)",
        oldPassword: "原密码",
        newPassword: "新密码",
        confirmPassword: "确认密码",
        strength: "密码强度",
        numChar: "数字+字母",
        numLowerUpChar: "数字+小写字母+大写字母",
        numCharSpecial: "数字+字母+特殊字符",
        numLowerUpSpecial: "数字+小写字母+大写字母+特殊字符",
        menu: {
            fiexdPass: "固定密码",
            IDcard: "身份证",
            noLimit: "不限制",
            numberLetter: "数字、字母",
            numberUpLower: "数字、小写字母、大写字母",
            numberLetterChar: "数字、字母、特殊字符组合",
            numberUpLowerChar: "数字、小写字母、大写字母、特殊字符组合"
        },
        rule: {
            newPwdLength: "新密码长度不符合密码策略要求",
            number: {
                Integer: "锁定时长必须是数值",
                length: "次数长度请控制在20位以内",
                valueOver: "开启图形验证码的输入次数不能比锁定账号次数多"
            }
        },
        message: {
            inputNumber: "当输入次数达到{0}次开启图形验证码",
            inputNumberLock: "当输入次数达到{0}次锁定账号，时长为{1}小时",
            success: "已保存密码策略的最新修改",
            default: "新增/新导入的用户的默认密码来自固定密码,固定密码为",
            defaultIdCard: "新增/新导入的用户的默认密码来自用户身份证号,使用身份证后六位作为密码",
            defaultPhone: "新增/新导入的用户的默认密码来自用户手机号,使用手机号后六位作为密码",
            lapseShowContinueOpen: "密码失效时,更改密码界面显示延用密码",
            lapseShowContinueClose: "密码失效时,更改密码界面不显示延用密码",
            firstLoginOpen: "用户首次登录强制修改密码",
            firstLoginClose: "用户首次登录不强制修改密码",
            newEqualLastOpen: "新密码允许与原密码相同",
            newEqualLastClose: "新密码不允许与原密码相同",
            passExpirationOpen: "新修改的密码一直有效",
            passExpirationClose: "新修改的密码有效期为{0}天",
            leastPasswordOpen: "密码最小长度没有限制",
            leastPasswordClose: "密码最小长度为{0}位",
            passComplexityNull: "不做限制",
            passComplexity: "密码中至少包含{0}",
            loginValidOpen: "登录时需要校验验证码",
            loginValidClose: "登录时不需要校验验证码",
            changePassValidOpen: "修改密码需要校验验证码",
            changePassValidClose: "修改密码不需要校验验证码",
            loginValidRuleOpen: "登陆时校验密码规则,如不符合需要修改密码",
            loginValidRuleClose: "登陆时不校验密码规则",
            passFindOpen: "登录界面显示密码找回按钮",
            passFindClose: "登录界面不显示密码找回按钮",
            oldPasswordNull: "请输入原密码",
            oldPasswordError: "请输入正确的原密码",
            confirmPasswordNull: "请再次输入新密码",
            confirmPasswordError: "两次输入的密码不一致",
            passwordError: "新密码不符合密码策略",
            passwordNull: "请输入新密码",
            changeSuccess: "修改密码成功",
            changeError: "修改密码失败",
            useLastPwdFaild: "延用上次密码失败",
            useLastPwdSuccess: "延用上次密码成功"
        }
    },
    // 日志审核
    logExamine: {
        title: "日志审核",
        type: "审核类型",
        opinion: "审核意见" ,
        RequiredTip:"请选择审核类型",
        haveETip:"已经审核,不能重复审核!",
        rule:{
            type:{
                required :"请选择审核类型"
            }
        }
    },

    login:{
        passwordRule:{
            firstLoginMidify:"第一次登录需要修改密码！",
            forceModify:"本次登录必须修改密码！",
            outDate:"密码过期，请修改密码！",
            lengthNotEnough:"密码长度不够，请修改密码！",
            complexityNotEnough:"密码复杂度不够，请修改密码！",
            LCNotEnough:"密码复杂度不够，请修改密码！"
        },
        social:{
            notBindUserError:"没有绑定本系统用户，请联系管理员！",
            bindUserError:"与本系统的用户绑定信息有误，请联系管理员！",
            notBindUserConfirmDesc:"未绑定或者绑定的本系统账号有误，需要通过账户登录去绑定吗？",
            authError:"第三方平台认证失败，请重新再试！",
            userContractSuccess:"用户对照成功！",
            userContractFail:"用户对照失败，请重新再试！"
        },
        otp:{
            authFailed:"口令登录失败，请重新再试！",
            codeInvalid:"口令有误，请重新获取后再登录！",
            userNotFond:"手机号或者邮箱未注册，请重新登录！",
            codeSendError:"口令发送失败，请重新再试！"
        },
        common:{
            captchaNeedOpen:"本次登录需要验证码信息，请重新登录！",
            passwordError:"账号或者密码错误，请重新登录！",
            notNull:"账号或者密码不能为空，请重新输入！",
            roleNotFond:"用户没有分配角色或者分配的角色有误，请联系管理员！",
            userNotMatch:"两次认证的账号不匹配，请重新登录！",
            firstAuthInfo:"第一次认证通过，请进行第二次认证！",
            twoAuthFailed:"二次认证失败，请重新登录！",
            userLockRemind:"您的账户已被锁定，解锁时间：${0}",
            userDisable:"您的账户已被禁用，请联系管理员！",
            userLockError:"您的帐户已被锁定,请${0}分钟后再试！",
            userOutDate:"您的账户已过期，请联系管理员！",
            tenantError:"您所属的租户无效，请联系管理员！",
            grantTypeNotFond:"不支持此${0}授权模式！",
            grantTypeNotNull:"grantType授权模式字段不能为空！",
            captchaInValid:"验证码无效，请重新再试！",
            captchaGetFail:"获取验证码失败，请重新再试！",
            captchaNotCorrect:"验证码不正确，请重新输入！",
            userLoginFail:"账号登录失败，请重新再试！",
           socialLoginFail:"第三方平台登录失败，请重新再试",
        },
        label:{
            title:"欢迎登录，",
            info:"提示",
            authType:{
                user:"账号登录",
                otp:"口令登录",
                ca:"CA登录",
                qr:"扫码登录",
                social:{
                    name:"第三方登录方式",
                    source:{
                        qq:"QQ",
                        wechat_open:"微信",
                        hos:"统一认证平台"
                    }
                }
            },
            forgetPassword:"忘记密码？",
            button:{
                sendOTPBtn:"发送口令",
                sendOTPInfo:"s后重新获取",
                loginBtn:"登录",
            },
            placeholder:{
                loginName:"请输入账号",
                password:"请输入密码",
                captchaCode:"请输入图形验证码",
                otpCode:"请输入口令",
                otpName:"请输入手机号",
                tenantId: "请选择租户"
            },
            rule:{
                loginName:"账号不能为空",
                password:"密码不能为空",
                captchaCode:"图形验证码不能为空",
                otpCode:"口令不能为空",
                otpName:"请输入有效的手机号",
                tenantId: "租户不能为空"
            }
        }
    }
};
