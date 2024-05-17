<template>

  <a-spin :spinning="showSpin">
    <div class="main">

      <!-- <a-card title="最近一周访问量">
        <div style="height: 300px;" ref="visitChartDiv"></div>
      </a-card> -->
      <a-card title="视频上传统计" style="flex:1;">
            <div style="height: 300px;" ref="barChartDiv"></div>
      </a-card>

      <a-row :gutter="[20,20]">
        <!-- <a-col :sm="24" :md="24" :lg="12">
          <a-card title="热门视频排名" >
            <div style="height: 300px;" ref="barChartDiv"></div>
          </a-card>
        </a-col> -->
        <a-col :sm="24" :md="24" :lg="12">
          <a-card title="综合数据统计" >
            <div style="height: 300px;" ref="pieChartDiv"></div>
          </a-card>
        </a-col>
      </a-row>

    </div>
  </a-spin>

</template>

<script setup lang="ts">
import {ref} from 'vue';

import { InteractionOutlined, StarFilled, StarTwoTone } from '@ant-design/icons-vue';
import {listApi} from '/@/api/admin/overview'
import { useUserStore } from '/@/store';
// 声明变量和引用
const userStore = useUserStore();
let showSpin = ref(true)
const barChartDiv = ref()
const pieChartDiv = ref()

let barChart, pieChart;

let tdata = reactive({
  data: {}
})
// 页面加载
onMounted(() => {
  list()
  //窗口大小改变时，重置图表大小
  // window.onresize = function () { // resize
  //   visitChart.resize()
  //   barChart.resize()
  //   pieChart.resize()
  // }
})
// 获取数据列表函数与初始化图表
const list = () => {
  listApi({keyword:userStore.user_name}).then(res => {
    console.log(res.data)
    tdata.data = res.data
    console.log(tdata.data)

    //initCharts()
    initBarChart()
    initPieChart()

    showSpin.value = false
  }).catch(err => {
    showSpin.value = false
  })
}

  // 初始化柱状图
const initBarChart = () => {
  let xData = []
  let yData = []
  tdata.data.order_rank_data.forEach((item, index) => {
    xData.push(item.title)
    yData.push(item.count)
  })
  // const xData = ['遥远的救世主', '平凡的世界', '测试书籍12', '测试书籍13', '测试书籍14', '测试书籍15', '测试书籍16', '测试书籍17']
  // const yData = [220, 200, 180, 150, 130, 110, 100, 80]
  // 创建图表
  barChart = echarts.init(barChartDiv.value)
  let option = {
    grid: {
      // 让图表占满容器
      top: '40px',
      left: '40px',
      right: '40px',
      bottom: '40px'
    },
    title: {
      text: '视频上传统计',
      textStyle: {
        color: '#aaa',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 18
      },
      x: 'center',
      y: 'top'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      data: xData,
      type: 'category',
      axisLabel: {
        //rotate: 30, // 倾斜30度,
        textStyle: {
          color: '#2F4F4F'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#2F4F4F'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {show: false},
      axisTick: {show: false},
      splitLine: {
        show: true, // 网格线
        lineStyle: {
          color: 'rgba(10, 10, 10, 0.1)',
          width: 1,
          type: 'solid'
        }
      }
    },
    series: [
      {
        data: yData,
        type: 'bar',
        itemStyle: {
          normal: {
            color: function (params) {
              // 柱图颜色
              return '#70B0EA'
            }
          }
        }
      }
    ]
  }
  // 设置图表配置
  barChart.setOption(option)
}
// 初始化饼图
const initPieChart = () => {
  let pieData = []
  let c_like=0
  let c_watch=0
  let c_comment=0
  let c_collect=0
  tdata.data.classification_rank_data.forEach((item, index) => {
    console.log(tdata.data.classification_rank_data.length)
    c_like+=item.c_like
    c_watch+=item.c_watch
    c_comment+=item.c_comment
    c_collect+=item.c_collect
    // pieData.push({name: item.title, value: item.count})
  })
  // pieData.push({name: '观看', value: c_watch})
  pieData.push({name: '喜欢', value: c_like})
  pieData.push({name: '收藏', value: c_collect})
  pieData.push({name: '评论', value: c_comment})
  console.log(c_like)
  console.log(c_watch)
  console.log(c_comment)
  console.log(c_collect)
  // 创建图表
  pieChart = echarts.init(pieChartDiv.value)
  const option = {
    grid: {
      // 让图表占满容器
      top: '40px',
      left: '40px',
      right: '40px',
      bottom: '40px'
    },
    title: {
      text: '综合数据统计',
      textStyle: {
        color: '#aaa',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 18
      },
      x: 'center',
      y: 'top'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '90%',
      left: 'center'
    },
    series: [
      {
        name: '分类',
        type: 'pie',
        itemStyle: {
          normal: {
            color: function (params) {
              // const colorList = ['#70B0EA', '#B3A3DA', '#88DEE2', '#62C4C8', '#58A3A1']
              const colorList = ['#70B0EA', '#B3A3DA', '#88DEE2']
              let index = params.dataIndex
              if (params.dataIndex >= colorList.length) {
                index = params.dataIndex - colorList.length
              }
              return colorList[index]
            }
          }
        },
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: pieData
      }
    ]
  }
  pieChart.setOption(option)
}


</script>

<style lang="less" scoped>

.main {
  height: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;

  .box {
    padding: 12px;
    display: flex;
    flex-direction: column;

    .box-top {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .box-value {
      color: #000000;
      font-size: 32px;
      margin-right: 12px;

      .v-e {
        font-size: 14px;
      }
    }

    .box-bottom {
      margin-top: 24px;
      color: #000000d9;
    }
  }
}

</style>
