import Vue from "vue";
import Router from "vue-router";
import Full from "@/containers/Full"
// Views - Pages
import Page404 from "@/views/errorPages/Page404"
import Page500 from "@/views/errorPages/Page500"

const _import = require("./_import_" + process.env.NODE_ENV);

/* login */
const Login = _import("login/index");
Vue.use(Router);

export const constantRouterMap = [
    {path: "/login", component: Login, hidden: true},
    {
        path: "/pages", redirect: "/pages/p404", name: "Pages",
        component: {
            render(c) {
                return c("router-view")
            }
            // Full,
        },
        children: [{path: "404", name: "Page404", component: _import("errorPages/Page404")},
            {path: "500", name: "Page500", component: _import("errorPages/Page404")},
        ]
    }


]

export default new Router({
    mode: "hash",
    linkActiveClass: "open active",
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
});

export const asyncRouterMap = [

    {
        path: "/",
        redirect: "/line",
        name: "首页",
        component: Full,
        hidden: false,
        children: [
            //自定义页面
            {
                path: "/line", name: "线路", icon: "social-html5", redirect: "/line/list",
                component: {
                    render(c) {
                        return c("router-view")
                    }
                },
                children: [
                    {
                        path: "list",
                        name: "线路列表",
                        icon: "social-html5",
                        component: _import("components/Line")
                    },
                    {
                        path: "map",
                        name: "线路图",
                        icon: "ios-list-outline",
                        component: _import("components/GdMap"),
                        hidden: true,
                    },
                    {
                        path: "route",
                        name: "线路规划",
                        icon: "ios-list-outline",
                        component: _import("components/Position"),
                        hidden: true,
                    },
                ]
            },
            // {path: "/form", name: "Form表单", icon: "ios-list-outline", component: _import("components/Form")},
            // {path: "/modal", name: "弹窗", icon: "ios-list-outline", component: _import("components/Modal")},
            // {path: "/transfer", name: "穿越", icon: "ios-list-outline", component: _import("components/Transfer")},
            // {path: "/jsontree", name: "JSON视图", icon: "merge", component: _import("components/JsonTree")},
            // {path: "/position", name: "地图定位", icon: "merge", component: _import("components/Position")},            {path: "/position", name: "地图定位", icon: "merge", component: _import("components/Position")},



        ]
    },
    {path: "*", redirect: "/pages/404", hidden: true}

];
