import {post} from "utils/fetch";

export function queryLine(userId, currentPage, pageSize, callBack) {
    const data = {
        userId: userId,
        currentPage: currentPage,
        pageSize: pageSize
    }
    return post("/line/list", data, callBack);
}

export function getJson(data, callBack) {
    return post("/line/json", data, callBack);
}