/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'js-cookie'
declare module 'el-plus-powerful-table'
declare module 'nprogress'
declare module 'mockjs'
declare module 'screenfull'
declare module 'vue3-number-roll-plus'
declare module 'file-saver'
declare module 'exceljs/dist/exceljs'
