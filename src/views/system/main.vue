<template>
  <div class="echarts-wrapper">
    <!-- 日期查询区域 -->
    <div class="date-picker-container">
      <el-form :inline="true" class="date-form">
        <el-form-item label="开始日期">
          <el-date-picker
              v-model="startDate"
              type="date"
              placeholder="请选择开始日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
              v-model="endDate"
              type="date"
              placeholder="请选择结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :disabled-date="disabledEndDate"
          />
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              @click="handleQuery"
              :loading="isLoading"
          >
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 图表容器 -->
    <div class="echarts-container">
      <div
          ref="chartRef"
          class="chart-main"
          :class="{ 'is-loading': isLoading }"
      ></div>

      <!-- 空数据状态 -->
      <div v-if="showEmptyState" class="chart-empty">
        <el-empty description="暂无数据" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import { Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {myGet, myPost} from '@/myaxios'

// 响应式状态
const chartRef = ref(null)
const chartInstance = ref(null)
const isLoading = ref(false)
const chartData = ref([])

// 设置默认日期（一个月前到当天）
const defaultStartDate = new Date()
defaultStartDate.setMonth(defaultStartDate.getMonth() - 1)
const defaultEndDate = new Date()

const startDate = ref(formatDate(defaultStartDate))
const endDate = ref(formatDate(defaultEndDate))

// 工具函数：格式化日期为YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 工具函数：解析日期字符串为Date对象
function parseDate(dateStr) {
  const parts = dateStr.split('-')
  return new Date(parts[0], parts[1] - 1, parts[2])
}

// 工具函数：比较两个日期（YYYY-MM-DD格式）
function compareDates(dateStr1, dateStr2) {
  return parseDate(dateStr1).getTime() - parseDate(dateStr2).getTime()
}

// 计算属性：是否显示空状态
const showEmptyState = computed(() => {
  return !isLoading.value && chartData.value.length === 0
})

// 图表配置
const getChartOption = () => ({
  //标题
  title: {
    text: '游戏订单统计表',
    subtext: `${startDate.value} 至 ${endDate.value}`,
  },
  //鼠标浮动指向表格体
  tooltip: {
    trigger: 'item',
    formatter: params => {
      return `
        <div style="font-weight:bold">${params.data.name}</div>
        <div>订单数: ${params.data.value}</div>
        <div>占比: ${params.percent}%</div>
      `
    }
  },
  //图表小字
  legend: {
    top: '21%',
    left: '25%',
    orient: 'vertical',
    textStyle: { color: '#333' }
  },
  //饼图
  series: [{
    name: '游戏订单分布',
    type: 'pie',
    radius: ['40%', '70%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderRadius: 10,
      borderColor: '#fff',
      borderWidth: 2
    },
    //饼图内的图框数据
    label: {
      show: true,
      formatter: '{b}: {c} ({d}%)',
      fontSize: 12
    },
    //饼图内自带的数字修改
    emphasis: {
      label: {
        show: true,
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#a93e3e'
      }
    },
    labelLine: {
      show: false
    },
    //传入数据处
    data: chartData.value.map(item => ({
      value: item.orderTotal,
      name: item.gameName
    }))
  }]
})

// 禁用结束日期（不能早于开始日期）
const disabledEndDate = (time) => {
  return startDate.value && compareDates(formatDate(time), startDate.value) < 0
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  nextTick(() => {
    const container = chartRef.value
    if (container && container.clientWidth > 0) {
      chartInstance.value = echarts.init(container)
      updateChart()
    } else {
      setTimeout(initChart, 100)
    }
  })
}

// 更新图表
const updateChart = () => {
  if (chartInstance.value) {
    chartInstance.value.setOption(getChartOption())
  }
}

// 获取图表数据
const fetchChartData = async () => {
  try {
    const resp = await myPost("/order/orderTotal", {
      startDate: startDate.value,
      endDate: endDate.value
    });
    console.log(resp)
    if ( resp.data.code === 20000 ) {
      chartData.value = resp.data.returnData;
      if (chartData.value.length === 0) {
        ElMessage.warning('当前日期范围内没有数据');
      }
    } else {
      throw new Error(resp.msg || '数据格式错误');
    }

    return resp;

  } catch (error) {
    console.error('获取数据失败:', error);
    ElMessage.error('获取数据失败: ' + error.message);
    throw error;
  }
};

// 处理查询操作
const handleQuery = async () => {
  if (!startDate.value || !endDate.value) {
    ElMessage.warning('请选择完整日期范围')
    return
  }

  // 保留结束日期不能早于开始日期的验证
  if (compareDates(endDate.value, startDate.value) < 0) {
    ElMessage.error('结束日期不能早于开始日期')
    return
  }

  isLoading.value = true
  chartData.value = []

  try {
    await fetchChartData()
    updateChart()
  } catch (error) {
    ElMessage.error('数据加载失败')
  } finally {
    isLoading.value = false
  }
}

// 处理窗口大小变化
const handleResize = () => {
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}

// 生命周期钩子
onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
})
</script>

<style scoped>
/* 样式保持不变 */
.echarts-wrapper {
  display: flex;
  flex-direction: column;
  height: 85vh;
  padding: 20px;
  box-sizing: border-box;
  margin-top: -45px;
}

.date-picker-container {
  padding-top: 25px;
  background-color: var(--el-bg-color);
  border-radius: 4px;
  margin-bottom: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.date-form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.echarts-container {
  position: relative;
  flex: 1;
  min-height: 400px;
  background-color: var(--el-bg-color);
  border-radius: 4px;
  overflow: hidden;
}

.chart-main {
  width: 100%;
  height: 80%;
  min-height: 250px;
  transition: opacity 0.3s ease;
}

.chart-main.is-loading {
  opacity: 0.5;
}

.chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--el-color-primary);
  z-index: 10;
}

.loading-icon {
  animation: rotate 2s linear infinite;
}

.chart-empty {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80%;
  display: grid;
  place-items: center;
  background-color: var(--el-bg-color);
  z-index: 5;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .date-form {
    flex-direction: column;
    align-items: stretch;
  }

  .echarts-container {
    height: 200px;
  }

  .echarts-wrapper {
    padding: 10px;
  }
}
</style>