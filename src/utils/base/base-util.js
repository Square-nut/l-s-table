/**
 * 获取顶部地址栏地址
 */
export const getTopUrl = () => {
    return unescape(decodeURI(window.location.href.split("/#/")[0]));
}

/**
 * 获取url参数
 * @param name 参数名
 */
export const getQueryString = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(decodeURI(r[2]));
    return null;
}