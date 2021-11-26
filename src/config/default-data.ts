import {
  themeColor as themeColorInterface,
  drawerSetting,
  menuColors,
  waterMarkType
} from '@/utils/interface'
import { toHump } from '@/utils/str-convert'

let themeColor: themeColorInterface = {
  primary: '#AD49FF',
  success: '#67c23a',
  info: '#909399',
  warning: '#e6a23c',
  danger: '#f56c6c'
}

let Tcolors: { [s: string]: string } = JSON.parse(
  window.localStorage.getItem('themeColors') || '{}'
)
let Lcolors: { [s: string]: string } = JSON.parse(
  window.localStorage.getItem('themeLightColors') || '{}'
)
Object.keys(Tcolors).forEach((item: string) => {
  document.documentElement.style.setProperty(item, Tcolors[item])
  let last = item.lastIndexOf('-')
  themeColor[item.substring(last + 1)] = Tcolors[item]

  if (item.substring(last + 1) === 'primary') {
    import('@/store/index').then(({ default: store }) => {
      store.commit('setThemeColor', { key: 'primary', val: themeColor.primary })
    })
  }
})

Object.keys(Lcolors).forEach((item: string) => {
  document.documentElement.style.setProperty(item, Lcolors[item])
})

const locale: string = window.localStorage.getItem('locale') || 'zh-CN'
const settings: drawerSetting = JSON.parse(window.localStorage.getItem('settings') || '{}')
const waterMark: waterMarkType = JSON.parse(window.localStorage.getItem('waterMark') || '{}')

const menuColorStore: menuColors = JSON.parse(
  window.localStorage.getItem('menuColors')?.replace(/\-\-\w*\-/g, '') || '{}'
)
let menuColor: menuColors | { [s: string]: string } = {}

for (let i in menuColorStore) {
  document.documentElement.style.setProperty('--menu-' + i, menuColorStore[i])
  menuColor[toHump(i)] = menuColorStore[i]
}

export type defaultDataType = {
  name: string
  themeColor: themeColorInterface
  iconfont: string
  tabsName: string
  cardShadow: string
  locale: string
  localeSelect: { value: string; label: string }[]
  menuColors: menuColors
  waterMark: waterMarkType
  settings: drawerSetting
}

export default {
  name: 'Vite-TSX-Vue-Admin',
  themeColor,
  // icon图标
  iconfont: 'viteIcon',
  // tagView显示的属性值 [name,title]
  tabsName: 'title',
  // 卡片阴影
  cardShadow: 'hover',
  // 默认语言
  locale,
  // 语言选择栏
  localeSelect: [
    {
      value: 'zh-CN',
      label: '中文（简）'
    },
    {
      value: 'zg-TW',
      label: '中文（繁）'
    },
    {
      value: 'en-US',
      label: 'English'
    }
  ],
  // 菜单颜色配置
  menuColors: Object.assign(
    {
      menuBackground: '#fff',
      itemHoverBackground: 'rgb(228, 230, 255)',
      itemHoverColor: '#AD49FF',
      childrenBackground: 'rgb(244, 244, 252)',
      childrenHoverBackground: 'rgb(220, 223, 255)',
      submenuTitleColor: '#fff',
      logoColor: '#AD49FF',
      logoBackground: '#fff'
    },
    menuColor
  ),
  // 全局水印
  waterMark: Object.assign(
    {
      switch: 0,
      text: '驺虞',
      ratio: 0,
      color: '#ddd',
      deg: -20,
      size: 25
    },
    waterMark
  ),
  // layout 配置
  settings: Object.assign(
    {
      fixed: 0,
      isLogo: 1,
      isTagsView: 1,
      defaultMenu: 1,
      leftMargin: 240,
      grayMode: 0
    },
    settings
  )
}
