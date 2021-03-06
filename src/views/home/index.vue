<template>
  <div class="grid">
    <div class="eachDiv eachDiv1">
      <panel-group :count="count" :height="90" />
      <el-card :shadow="defaultData.cardShadow">
        <HomeEcharts
          :isSlot="true"
          echartsId="chart"
          :height="400"
          :colors="colors"
          :information="chart.value"
          :title="t('user.login.line')"
          types="line"
        >
          <template #default>
            <!-- 版块切换 -->
            <div class="typeSwitch">
              <div
                v-for="(item, index) in count"
                :key="'switch' + index"
                :style="{
                  background: current == index ? 'var(--color-primary)' : '',
                  transition: 'all .2s',
                  cursor: 'pointer'
                }"
                :class="{ 's-active': current == index }"
                @click="typeSwitch(index)"
              >
                {{ t(item.locale) }}
              </div>
            </div>
          </template>
          <template #lineColor>
            <!-- 线段颜色 -->
            <div class="lineColor">
              <div v-for="item in userLineColor.value" :key="item.color">
                <i :style="{ background: item.color }"></i>
                <span>{{ item.name }}</span>
              </div>
            </div>
          </template>
          <template #timeSwiper>
            <!-- 时间段切换 -->
            <div class="timeDropdown">
              <el-dropdown @command="command">
                <span
                  class="el-dropdown-link"
                  style="display: flex; align-items: center; cursor: pointer"
                >
                  <span>{{ findTime }}</span
                  ><el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="Month">Month</el-dropdown-item>
                    <el-dropdown-item command="Fifteen">Fifteen</el-dropdown-item>
                    <el-dropdown-item command="Seven">Seven</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </HomeEcharts>
      </el-card>
    </div>

    <div class="eachDiv eachDiv2">
      <div class="moneyGrid">
        <el-card :shadow="defaultData.cardShadow" class="eachDiv">
          <!-- icon -->
          <div class="viteIconBg">
            <i :class="[defaultData.iconfont, 'vitehome-daymoney']"></i>
          </div>
          <!-- text -->
          <div class="text">
            <div class="money">￥{{ earnings.value.dayMoney }}</div>
            <span class="title">{{ t('day.income') }}</span>
          </div>
          <!-- 上升 -->
          <div class="increase">
            <i class="el-icon-top" style="color: var(--color-primary)"
              >{{ earnings.value.dayPercentage }}%</i
            >
          </div>
        </el-card>

        <el-card :shadow="defaultData.cardShadow" class="eachDiv">
          <!-- icon -->
          <div class="viteIconBg yellow">
            <i :class="[defaultData.iconfont, 'vitehome-zongshouyi']"></i>
          </div>
          <!-- text -->
          <div class="text">
            <div class="money">￥{{ earnings.value.totalMoney }}</div>
            <span class="title">{{ t('total.income') }}</span>
          </div>
          <!-- 上升 -->
          <div class="increase">
            <i class="el-icon-top" style="color: var(--color-primary)"
              >{{ earnings.value.totalPercentage }}%</i
            >
          </div>
        </el-card>

        <el-card
          :shadow="defaultData.cardShadow"
          :body-style="{ padding: '20px' }"
          class="eachDiv eachDiv-3"
        >
          <HomeEcharts
            echartsId="earnings"
            :height="320"
            :colors="colors"
            :information="earnings.chart"
            types="line"
            :title="t('income.line')"
          ></HomeEcharts>
        </el-card>
      </div>
    </div>

    <div class="eachDiv eachDiv3">
      <el-card :shadow="defaultData.cardShadow">
        <div class="echartsBox">
          <div class="un-handle-layout">
            <HomeEcharts
              echartsId="pageviewData"
              :height="310 - 40"
              :colors="colors"
              :information="pageviewData.value"
              types="homeCake"
              :title="t('page.view.pillar')"
            ></HomeEcharts>
          </div>
        </div>
      </el-card>
    </div>

    <div class="eachDiv eachDiv4">
      <el-card :shadow="defaultData.cardShadow">
        <h3 style="margin: 0 0 10px 0; display: flex; justify-content: space-between">
          <span>{{ t('commit.list') }}</span>

          <!-- <router-link
              :to="{ name: 'submitList' }"
              :style="{
                color: themeColor,
                fontSize: '14px',
                textDecoration: 'none',
              }"
              >查看全部</router-link
            > -->
        </h3>
        <el-scrollbar style="height: calc(100% - 40px); width: 100%; box-sizing: border-box">
          <powerful-table
            :isSelect="false"
            :isPagination="false"
            :list="list.value"
            :header="tbConfig"
          ></powerful-table>
        </el-scrollbar>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
  import HomeEcharts from '@/components/easy-echart/index.vue'
  import PanelGroup from './components/PanelGroup.vue'
  import { useStore } from 'vuex'
  import { reactive, ref } from 'vue'
  import * as echarts from 'echarts'
  import { ArrowDown } from '@element-plus/icons'

  import { pageviewChart, countFun, earningsFun, chartFun, tableFun } from '@/api/home'

  import { header } from './indexData'
  export default {
    name: 'home',
    components: {
      HomeEcharts,
      PanelGroup,
      ArrowDown
    },
    setup() {
      // 曲线图颜色
      type ChartColor = {
        opacity: number
        color: any
      }
      const chartColor: ChartColor[] = [
        {
          opacity: 0.4,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: useStore().state.settings.themeColor.primary
            },
            {
              offset: 1,
              color: 'rgba(255, 255, 255,0)'
            }
          ])
        },
        {
          opacity: 0.4,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#55bcff'
            },
            {
              offset: 1,
              color: 'rgba(255, 255, 255,0)'
            }
          ])
        }
      ]

      // 曲线图线段颜色
      const colors: string[] = [
        useStore().state.settings.themeColor.primary,
        '#55bcff',
        '#F6A829',
        '#646cff'
      ]

      // 自定义线段颜色
      type UserLineColor = { value: { name: string; color: string }[] }
      let userLineColor: UserLineColor = reactive({ value: [] })

      // 初始统计数据（value为空）（用户、浏览量、文章、提交）
      type Count = {
        icon: string
        title: string
        value: string
        locale: string
        key: string
        color: any
      }
      let count = reactive<Count[]>([
        {
          icon: 'vitehome-user',
          title: '用户',
          value: '',
          locale: 'user',
          key: 'users',
          color: useStore().state.settings.themeColor.primary
        },
        {
          icon: 'vitehome-wengzhang',
          title: '文章',
          value: '',
          locale: 'article',
          key: 'shoppings',
          color: '#55bcff'
        },
        {
          icon: 'vitehome-liulanliang',
          title: '浏览量',
          value: '',
          locale: 'page.view',
          key: 'pageview',
          color: '#646cff '
        },
        {
          icon: 'vitehome-done',
          title: '已提交',
          value: '',
          key: 'done',
          locale: 'commit',
          color: '#F6A829 '
        }
      ])

      // 浏览量
      let pageviewData = reactive({ value: {} })

      // 收益
      interface Earnings {
        value: {
          dayMoney: number | string
          dayPercentage: number | string
          totalMoney: number | string
          totalPercentage: number | string
        }
        chart: {}
      }
      let earnings = reactive<Earnings>({
        value: {
          dayMoney: '',
          dayPercentage: '',
          totalMoney: '',
          totalPercentage: ''
        },
        chart: {}
      })

      // 表格相关
      let listQuery = reactive({
        pageSize: 3,
        pageNum: 1
      })
      let list = reactive({ value: [] })
      let tbConfig = reactive(header)

      /**
       * 曲线图相关：
       * chart：图表数据
       * current：曲线图type的索引
       * typeSwitch：切换type
       * findTime：显示在页面的当前时间段
       * command：切换时间段
       * handleChart：根据 type值及时间段 获取曲线图数据
       */
      const chart = reactive({ value: {} })
      let current = ref(0)
      function typeSwitch(i: number) {
        current.value = i
        handleChart(i)
      }
      let findTime = ref('Seven')
      function command(e: string) {
        handleChart(current.value, e)
      }
      function handleChart(status: number | string, period: string = 'Seven') {
        findTime.value = period
        userLineColor.value = []
        chartFun({ status, period }).then((res) => {
          res.data.homeDateInfoResult.forEach((item: any, index: number) => {
            item.areaStyle = chartColor[index]

            userLineColor.value.push({
              name: item.name,
              color: colors[index]
            })
          })
          chart.value = res.data
        })
      }

      /**
       * 请求接口，获取统计数据，对count中的value进行赋值
       */
      function handleCount() {
        countFun().then((res) => {
          count.forEach((i: Count) => {
            i.value = res.data[i.key]
          })
        })
      }

      /**
       * 获取收益相关的数据
       */
      function handleEarnings() {
        earningsFun().then((res) => {
          earnings.value = res.data.money

          res.data.chart.homeDateInfoResult.forEach((item: any, index: number) => {
            item.areaStyle = chartColor[index]
          })
          earnings.chart = res.data.chart
          // console.log(earnings);
        })
      }

      /**
       * 获取浏览量
       */
      function handlePageview() {
        pageviewChart().then((res) => {
          pageviewData.value = res.data
        })
      }

      /**
       * 获取表格信息
       */
      function handleGetTable(e?: { pageNum: number | string; pageSize: number | string }) {
        Object.assign(listQuery, e ? e : {})
        tableFun(listQuery).then((res) => {
          list.value = res.data.list
        })
      }

      handleGetTable()
      handleCount()
      handleChart(0)
      handlePageview()
      handleEarnings()

      return {
        count,
        chart,
        pageviewData,
        earnings,
        colors,
        list,
        tbConfig,
        current,
        userLineColor,
        findTime,

        handleGetTable,
        typeSwitch,
        command
      }
    }
  }
</script>

<style lang="scss" scoped>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr 0.1fr 1fr;
    grid-template-rows: 550px 310px;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    .eachDiv1 {
      grid-column-start: 1;
      grid-column-end: 4;

      .typeSwitch {
        display: flex;
        border-radius: 12.5px;
        width: 350px;
        height: 25px;
        line-height: 25px;
        font-size: 14px;
        overflow: hidden;
        background: #eff1f4;

        > div {
          flex: 1;
          text-align: center;
        }

        .s-active {
          color: #fff !important;
        }
      }

      .lineColor {
        display: flex;
        align-items: center;

        > div {
          margin-right: 10px;
          display: flex;
          align-items: center;
        }

        > div:last-child {
          margin: 0;
        }

        i {
          width: 15px;
          height: 15px;
          border-radius: 2px;
          margin-right: 5px;
          display: inline-block;
        }
      }

      .timeDropdown {
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 25px;
        height: 25px;
        font-size: 14px;
        background: #eff1f4;
      }
    }

    .eachDiv2 {
      grid-column-start: 4;
      grid-column-end: 5;
    }

    .eachDiv4 {
      grid-column-start: 2;
      grid-column-end: 5;

      :deep(.el-card) {
        height: 310px;

        > .el-card__body {
          height: 100%;
          box-sizing: border-box;
        }
      }
    }
    > .eachDiv {
      width: 100%;
      // background: #fff;

      .moneyGrid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 170px auto;
        grid-column-gap: 20px;
        grid-row-gap: 20px;
        // height: 450px;

        .eachDiv-3 {
          grid-row-start: 2;
          grid-column-start: 1;
          grid-column-end: 3;
        }

        .eachDiv {
          width: 100%;

          :deep() .el-card {
            height: 100%;
            display: flex;
            align-content: center;
            box-sizing: border-box;

            .el-card__body {
              width: 100%;
              padding: 10px 0;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
          }

          .viteIconBg,
          .text,
          .increase {
            margin: 0 auto 6px;
            text-align: center;

            .money {
              color: rgb(49, 53, 129);
              font-size: 22px;
              font-weight: bold;
            }

            .title {
              color: #aaa;
            }
          }

          .increase,
          .increase i {
            font-weight: bold;
          }

          .viteIconBg {
            width: 60px;
            height: 60px;
            background: linear-gradient(to top, rgba(100, 108, 255), rgb(167, 170, 255));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .yellow {
            background: linear-gradient(to top, #ffa30e, #ffdf76);
          }

          .viteIcon {
            color: #fff;
            font-size: 24px;
          }
        }
      }
    }
  }
</style>

<style scoped>
  .app-container {
    margin-top: 40px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #dcdfe6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409eff;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #f2f6fc;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #ebeef5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #dcdfe6;
  }

  .statistics-layout {
    border: 1px solid #dcdfe6;
  }

  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }

  .address-content {
    padding: 20px;
    font-size: 18px;
  }

  .chart-wrapper {
    height: 280px;
    background: #fff;
    box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.05);
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
