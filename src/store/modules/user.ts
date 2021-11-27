import Cookies from 'js-cookie'
import TYPE from '../type/userType'
import { login, getUser } from '@/api/logins'
import { RouteRecordRaw } from 'vue-router'
import { Store } from 'vuex'
import router, { addRouter as asyncRouter, Routers } from '@/router/index'

export type UserInfo = {
  icon: string
  id: number
  roles: string[]
  username: string
}

export type Tags = {
  path: string
  name?: string
  meta?: {
    title: string
    icon?: string
    locale?: string
    breadcrumb?: boolean
    url?: string
    iframeUrl?: string
    iframeData?: any
  }
  remove?: boolean
  query?: {}
  params?: {}
}

export interface UserState {
  vToken: string
  userInfo: UserInfo | {}
  menus: RouteRecordRaw[]
  tags: Tags[]
}

const state: UserState = {
  vToken: Cookies.get('vToken'),
  userInfo: {},
  menus: [],
  tags: [
    {
      path: '/',
      name: 'home',
      meta: {
        locale: 'home',
        title: '首页'
      },
      remove: true
    }
  ]
}

type rolesValueItemType = {
  hidden: number
  icon?: string
  id: number
  level: number
  name: string
  parentId: number
  sort?: number
  title?: string
}

type Meta = {
  id: number
  title: string
  icon: string
}

// 筛选该账号可展示路由
function menusFilter(menus: rolesValueItemType[]) {
  // 所有一级
  let levelOne: rolesValueItemType[] = []
  // 所有子集
  let childs: rolesValueItemType[] = []

  menus.forEach((item: rolesValueItemType) => {
    if (item.level === 0) {
      levelOne.push(item)
    } else {
      childs.push(item)
    }
  })

  let asyncrouter = asyncRouter
    .map((item: Routers) => {
      // asyncrouter一级路由执行格式化操作
      let each = addRouterFun(levelOne, item)
      // 拦截接口数据隐藏的菜单
      if (!each) {
        // console.log('被拦截了',each);
        return false
      }
      // console.log('一级菜单',each.children)
      // 进行深拷贝 以免破坏源数据
      const { ...eachCopy } = each
      // 对asyncrouter所有children递归执行数据格式化操作
      eachCopy.children = recursion(eachCopy, childs)

      // 删除子集
      eachCopy.children.length == 0 && delete eachCopy.children

      return eachCopy
    })
    .filter((item) => item) as Routers[]

  // 按sort值降序排序
  _sort(asyncrouter)

  asyncrouter.map((item: Routers) => router.addRoute(item as RouteRecordRaw))

  // console.log('排序好的一级',asyncrouter);

  // 此处用等于的话 会导致watch监听不到的问题
  // 将asyncrouter合并到routes中，并在state.menu添加所有routes
  router.options.routes
    .concat(asyncrouter as RouteRecordRaw[])
    .forEach((item) => state.menus.push(item))
}
// 排序
function _sort(arr: Routers[]) {
  arr.sort((a: Routers, b: Routers) => {
    return (b as { sort: number }).sort - (a as { sort: number }).sort
  })
}
// 格式数据（将自定义的asyncRouter中的meta和sort相关数据修改成getUser返回的一级menus中同名menu的数据）
function addRouterFun(router: rolesValueItemType[], item: Routers): Routers | undefined {
  let each: rolesValueItemType

  for (each of router) {
    if (item.hidden) {
      item.sort = 0
      return item
    }

    if (item.name == each.name && each.hidden == 1) {
      ;(item.meta as Meta).id = each.id
      if (each.title) {
        ;(item.meta as Meta).title = each.title
      }
      if (each.icon) {
        ;(item.meta as Meta).icon = each.icon
      }

      item.sort = each.sort
      return item
    }
  }
}

// 递归菜单 查询子集（将自定义的asyncRouter中所有children递归执行addRouterFun格式化）
function recursion(each: Routers, childs: rolesValueItemType[]) {
  // 所有子集
  let ids: rolesValueItemType[] = []
  if (!each.children) {
    return []
    // console.log('不进入递归',each);
  } else {
    // console.log('进入递归',each);
    if (each.meta && (each.meta as Meta).id) {
      ids = childs.filter((i: rolesValueItemType) => (each.meta as Meta).id == i.parentId)
      // console.log('接口返回的一级菜单子集', ids)
    }

    if (ids.length > 0) {
      let children: Routers[] = []
      for (let childrenItem of each.children) {
        // 将asyncRouter中每一个路由的children的每一项的meta和sort数据修改成上面匹配到的ids（parentId等于asyncRouter中一级路由的id）中的数据
        let arr = addRouterFun(ids, childrenItem)
        if (arr) {
          children.push(arr)
          // 对children执行递归操作（children中可能还有children）
          recursion(arr, childs)
        }
      }
      // 按照sort值降序排序
      _sort(children)
      // console.log('将添加到一级路由下的子集',children);
      return children
    } else {
      // 没有则删除
      return []
    }
  }
}

const actions = {
  // 登录（仅仅获取token，存到cookie和store）
  loginAction(store: Store<UserState>, user: { username: string; password: number }) {
    return new Promise((resolve, reject) => {
      login(user)
        .then((res: { data: { tokenHead: string; token: string } }) => {
          if (res) {
            store.commit('setToken', res.data.tokenHead + res.data.token)
            Cookies.set('vToken', res.data.tokenHead + res.data.token)
            router.push({ path: '/' })
          }
          resolve(res)
        })
        .catch((err: { data: string }) => {
          reject(err.data)
        })
    })
  },

  // 获取用户信息
  userInfo(store: Store<UserState>) {
    return new Promise((resolve) => {
      getUser({ token: state.vToken }).then(async (res: any) => {
        // 设置state.userInfo
        store.commit(TYPE.LOGIN_THEN, res.data)
        // 筛选可展示menu到state.menu中
        menusFilter(res.data.menus)
        console.log('state.menus', state.menus)
        resolve(state.menus)
      })
    })
  },

  // 退出登录
  outLoging(store: Store<UserState>) {
    store.commit('outLogin', '')
    Cookies.remove('vToken')
  },

  tagsActions(store: Store<UserState>, val: { to: Tags; removeIndex?: number[]; name?: string }) {
    store.commit('tagsCommit', val)
  }
}

const mutations = {
  setToken(state: UserState, val: string) {
    state.vToken = val
  },
  outLogin(state: UserState, val: string) {
    state.vToken = val
    state.userInfo = {}
    state.menus = []
    router.push('/login')
  },
  // 设置用户信息（userInfo和menus）
  [TYPE.LOGIN_THEN](state: { userInfo: UserInfo; menus: [] }, val: UserInfo) {
    // 清空menus
    state.menus.splice(0)
    state.userInfo = val
  },
  // 重置tags
  tagsRefresh(state: UserState) {
    state.tags.splice(1)
  },
  tagsCommit(state: UserState, val: { to: Tags; removeIndex?: number[]; name?: string }) {
    if (val.removeIndex !== undefined || val.name !== undefined) {
      if (val.name) {
        const names = [val.name, 'home']
        state.tags = state.tags.filter((item) => names.indexOf(item.name as string) !== -1)
        return
      }

      val.removeIndex && state.tags.splice(val.removeIndex[0], val.removeIndex[1])
    } else {
      state.tags.push(val.to)
    }
  }
}

export default {
  state,
  actions,
  mutations
}
