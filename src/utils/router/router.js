import { constantMenuMap } from '@sys/router/router.config'
import store from '@sys/store'
/**
 * 获取所有权限菜单(后端返回的权限菜单 + 前端配置的静态菜单)
 * @param data
 * @returns {*[]}
 */
export function generateAllRouter(menuRouters, singleRouters,defaultPageRouter) {
  let indexPage={
        path: '/main/welcome',
        name: 'welcome',
        component: () => import(/* webpackChunkName: "user" */ '@sys/views/main/welcome'),
        meta: {
          title: '首页'
        }
      }
  if(defaultPageRouter&&defaultPageRouter[0]&&defaultPageRouter[0].path) {
    indexPage.component=defaultPageRouter[0].component;
  }
    let customData=[];
  // if(!store.getters.menuList||store.getters.menuList.length==0){
  //     customData=[{
  //         path: '/change-role',
  //         name: 'change-role',
  //         component: () => import(/* webpackChunkName: "fail" */ '@sys/views/sys/user/change-role/index'),
  //         meta: {
  //           title: '角色切换'
  //         }
  //     },{
  //         path: '/modify-password',
  //         name: 'modify-password',
  //         component: () => import(/* webpackChunkName: "fail" */ '@sys/views/sys/user/modify-password/index'),
  //         meta: {
  //             title: '修改密码'
  //         }
  //     }]
  // }
  let indexRouter = [{
    path: '/',
    name: 'dashboard',
    component: resolve => require(['@components/layouts/TabLayout'], resolve),
    redirect: '/main/welcome',
    children: [
        indexPage,
        ...customData,
      ...menuRouters,
    ]
  }, {
    "path": "*", "redirect": "/404", "hidden": true
  },
    ...singleRouters
  ]
  return indexRouter;
}

/**
 * 根据权限获取所有菜单列表
 * @param data
 * @param singleRouterList
 */
export function getMenusAndRouter(data, routers, singleRouterList,dropDownMenus,defaultPageRouter) {
  let menus = [];
  routers.push(...constantMenuMap);
  handleMenus(data, menus, routers, singleRouterList,dropDownMenus,defaultPageRouter);
  ////带单数据为空的话，将切换角色的菜单加上
  // if(dropDownMenus.length==0){
  //     dropDownMenus.push({
  //         path: '/change-role',
  //         name: 'role',
  //         meta: {
  //             title: '角色切换'
  //         }
  //     });
  //     dropDownMenus.push({
  //         path: '/modify-password',
  //         name: 'password',
  //         meta: {
  //             title: '修改密码'
  //         }
  //     });
  // }
  const allMenus = constantMenuMap.concat(menus);

  return allMenus
}

/**
 * 后端菜单转为前端菜单格式,生成路由列表
 * @param data 后端返回菜单权限数据
 * @param menus 菜单列表
 * @param routers 路由列表
 * @param singleRouterList 单独路由
 * @param dropDownMenus 下拉菜单列表
 */
function handleMenus(data, menus, routers, singleRouterList,dropDownMenus,defaultPageRouter) {
  ///判断默认首页是否存在
  let defaultPageCode="";
  let defaultPageData=store.getters.defaultPageData;
  if(defaultPageData&&defaultPageData.code&&defaultPageRouter.length==0){
    defaultPageCode=defaultPageData.code;
  }
  for (let item of data) {
    let menu = {
      path: '/' + item.code,
      name: item.code,
      hidden: !item.visible,
      meta: {
        title: item.name,
        icon: item.icon,
        keepAlive: item.cache,
        oneMenu: item.oneMenu,
        isDialog: item.openType === '3',
        hasPagePreset:item.hasPagePreset,
        resourceId:item.id
      }
    }
    // 为路由菜单
    if (item.type === 'M') {

      menu.meta.componentPath = item.router.indexOf('?') == -1 ? item.router : item.router.substring(0, item.router.lastIndexOf('?'))
      let route = JSON.parse(JSON.stringify(menu));
      route.meta.advancedJs = item.advancedJs;

      // 判断打开方式
      switch (item.openType) {
        case '0':
          //  打开方式为tab页签
          if (item.frame) {
            console.error('---------router 配置错误---------', item);
          }
          //解析参数,配置路由参数
          setRouterParams(route,item.router)
          if(item.router.indexOf("?") !== -1){
            item.router = item.router.substring(0, item.router.lastIndexOf("?"));
          }
          route.component = lazyLoadingView("view",item.router, item.category);
          break;
        case '1':
          route.meta.url = item.router;
          if (!item.frame) { // 独立打开内部系统路由
            // 解析参数,配置路由参数
            route.meta.url = getLocalhostPath() + '/single/' + item.code;
            // 如果是内部页面独立打开，需要独立的路由，路由地址加入/single前缀
            generateSingleRouter(item, singleRouterList);
          }
          // 打开方式为新开标签页
          route.component = lazyLoadingView('blank');
          route.meta.pageProperties = item.pageProperties;
          break;
        case '2':
          route.meta.url = item.router;
          if (!item.frame) { // 独立打开内部系统路由
            // 解析参数,配置路由参数
            route.meta.url = getLocalhostPath() + '/single/' + item.code;
            // 如果是内部页面独立打开，需要独立的路由，路由地址加入/single前缀
            generateSingleRouter(item, singleRouterList);
          }
          // 打开方式为iFrame
          route.component = lazyLoadingView('iframe');
          break;
        case '3':
          // 打开方式为弹窗
          if(item.frame){ // 弹窗打开一个iframe
            let query = {
              'url': item.router,
              'id': route.path
            };
            menu.props = query
          }else{
            setRouterParams(menu,item.router)
          }
          menu.meta.isFrame = item.frame;
      }
      if(item.openType !== '3'){
        routers.push(route);
        if(defaultPageCode===item.code){
          defaultPageRouter.push(route);
        }
      }
      if(item.categoryLocation == 'right-top'){
        dropDownMenus.push(menu);
        continue
      }
    }
    if (item.children && item.children.length > 0) {
      let children = [];
      menu.children = children
      handleMenus(item.children, menu.children, routers, singleRouterList,dropDownMenus,defaultPageRouter);
    }
    if(item.categoryLocation !== 'right-top'){
      menus.push(menu);
      if(defaultPageCode===item.code){
        defaultPageRouter=menu;
      }
    }
  }
}

/**
 * 生成单个路由
 * @param item
 * @param singleMenuList
 */
function generateSingleRouter(item,singleMenuList){
  // 如果是内部页面独立打开，需要独立的路由，路由地址加入/single前缀
  let single = {
    path: "/single/" + item.code,
    component: lazyLoadingView("view",item.router),
    name: "single_"+ item.code,//没啥意义
    hidden: true,
    meta: {
      title: item.name + "1",
      icon: item.icon
    }
  };
  setRouterParams(single,item.router)
  singleMenuList.push(single)
}

/**
 * 懒加载相关模板页
 * @param type
 * @param path
 * @returns {function(*=): any}
 */
function lazyLoadingView(type,path, category){
  switch (type){
    case "iframe":
      return resolve => require(['@components/layouts/IframePageView'], resolve);
    case "blank":
      return resolve => require(['@components/layouts/BlankLayout'], resolve);
    case "route":
      return resolve => require(['@components/layouts/RouteView'], resolve)
    case "view":
      if(category != '1'){
        return resolve => require([`@/views${path}`], resolve);
      }else{
        return resolve => require([`@sys/views${path}`], resolve);
      }

  }
}

/**
 * 设置路由参数
 * @param route
 * @param link
 */
function setRouterParams(route,link){
  let path = link;
  if (!path || path.indexOf("?") == -1) {
    return ;
  }
  //包含参数
  let objStr = path.substring(path.lastIndexOf("?") + 1);
  let paramArray = objStr.split("&");
  let query = {};
  for (let i = 0; i < paramArray.length; i++) {
    let oneArray = paramArray[i].split("=");
    query[oneArray[0]] = oneArray[1];
  }
  route.props = query;
  // route.path = path.substring(0, path.lastIndexOf("?"));
}

function getLocalhostPath(){
  let curWwwPath = window.document.location.href;
  let projectName = process.env.BASE_URL;
  let nameIndex = curWwwPath.indexOf(projectName);
  if(projectName == '/'){
    nameIndex = curWwwPath.indexOf(window.document.location.pathname);
  }
  let url = curWwwPath.substring(0, nameIndex + projectName.length - 1);
  return url;
}
