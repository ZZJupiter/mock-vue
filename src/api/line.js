import {post} from "utils/fetch";

/** 查询线路列表 **/
export function queryLine(data, callBack) {
    return post("/line/list", data, callBack);
}

export function getJson(data, callBack) {
    return post("/line/json", data, callBack);
}

/** 保存线路 **/
export function saveLine(data, callBack) {
    return post("/line/save", data, callBack);
};

/** 删除线路 **/
export function deleteLine(data, callBack) {
    return post("/line/delete", data, callBack);
}

/** 保存线路路由 **/
export function saveRoute(data, callBack) {
    return post("/lineRoute/save", data, callBack);
}

/** 获取线路路由 **/
export function getLineRoute(data, callBack) {
    return post("/lineRoute/get", data, callBack);
}

export function deletePoint(data, callBack) {
    return post("/lineRoute/delete", data, callBack);
}
