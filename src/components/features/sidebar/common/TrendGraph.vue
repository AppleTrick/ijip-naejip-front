<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import * as d3 from 'd3'
import type { PriceTrend } from '@/api/statsApi'

const props = defineProps<{
  data: PriceTrend[]
  height?: number
  color?: string
}>()

const chartRef = ref<HTMLElement | null>(null)
const resizeObserver = ref<ResizeObserver | null>(null)

const drawChart = async () => {
  await nextTick()
  if (!chartRef.value || !props.data.length) return

  const container = chartRef.value
  const rect = container.getBoundingClientRect()
  
  if (rect.width === 0) {
    setTimeout(drawChart, 100)
    return
  }

  const width = rect.width
  const height = props.height || rect.height || 180

  d3.select(container).selectAll('*').remove()

  const margin = { top: 30, right: 25, bottom: 25, left: 40 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  
  // 가격 차트 영역 (75%), 거래량 차트 영역 (20%), 간격 (5%)
  const priceHeight = innerHeight * 0.75
  const volumeHeight = innerHeight * 0.20
  const spacing = innerHeight * 0.05

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // X Scale
  const x = d3.scalePoint()
    .domain(props.data.map(d => d.date))
    .range([0, innerWidth])

  // X Axis (Bottom)
  const xAxis = d3.axisBottom(x)
    .tickValues(x.domain().filter((_, i) => {
      const total = x.domain().length
      if (total > 12) return i % 12 === 0 || i === total - 1
      if (total > 6) return i % 3 === 0 || i === total - 1
      return true
    }))
    .tickSize(0)
    .tickPadding(10)
    .tickFormat(d => d.replace('-', '.'))

  svg.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis)
    .select('.domain').remove()
  
  svg.selectAll('.tick text')
    .style('font-size', '10px')
    .style('fill', '#9ca3af')

  // --- Price Line Chart ---
  const minPrice = d3.min(props.data, d => d.price) || 0
  const maxPrice = d3.max(props.data, d => d.price) || 0
  const pricePadding = (maxPrice - minPrice) * 0.2 || 10000

  const yPrice = d3.scaleLinear()
    .domain([minPrice - pricePadding, maxPrice + pricePadding])
    .range([priceHeight, 0])

  // Price Y Axis
  const yPriceAxis = d3.axisLeft(yPrice)
    .ticks(4)
    .tickFormat(d => {
      const val = d.valueOf()
      if (val >= 10000) return `${Math.floor(val / 10000)}억`
      return `${val.toLocaleString()}`
    })
    .tickSize(-innerWidth)

  const yAxisG = svg.append('g')
    .call(yPriceAxis)
  
  yAxisG.select('.domain').remove()
  yAxisG.selectAll('.tick line')
    .attr('stroke', '#f3f4f6')
    .attr('stroke-dasharray', '2,2')
  
  yAxisG.selectAll('.tick text')
    .style('font-size', '10px')
    .style('fill', '#9ca3af')

  // Price Line
  const line = d3.line<PriceTrend>()
    .x(d => x(d.date) || 0)
    .y(d => yPrice(d.price))
    .curve(d3.curveMonotoneX)

  svg.append('path')
    .datum(props.data)
    .attr('fill', 'none')
    .attr('stroke', props.color || '#4F46E5')
    .attr('stroke-width', 3)
    .attr('d', line)

  // --- Volume Bar Chart ---
  const maxVolume = d3.max(props.data, d => d.volume || 0) || 1
  const yVolume = d3.scaleLinear()
    .domain([0, maxVolume])
    .range([volumeHeight, 0])

  const volumeG = svg.append('g')
    .attr('transform', `translate(0, ${priceHeight + spacing})`)

  volumeG.selectAll('.bar')
    .data(props.data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => (x(d.date) || 0) - 4)
    .attr('y', d => yVolume(d.volume || 0))
    .attr('width', 8)
    .attr('height', d => volumeHeight - yVolume(d.volume || 0))
    .attr('fill', '#e5e7eb')
    .attr('rx', 2)

  // --- High/Low Markers ---
  const highPoint = props.data.reduce((prev, curr) => (curr.price > prev.price ? curr : prev), props.data[0])
  const lowPoint = props.data.reduce((prev, curr) => (curr.price < prev.price ? curr : prev), props.data[0])

  const addMarker = (d: PriceTrend, label: string, color: string) => {
    const markerG = svg.append('g')
      .attr('transform', `translate(${x(d.date)}, ${yPrice(d.price)})`)
    
    markerG.append('circle')
      .attr('r', 4)
      .attr('fill', color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
    
    markerG.append('text')
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', color)
      .style('font-size', '11px')
      .style('font-weight', '700')
      .text(label)
  }

  if (props.data.length > 2) {
    addMarker(highPoint, '최고', '#ef4444')
    addMarker(lowPoint, '최저', '#3b82f6')
  }

  // --- Interactivity (Scrubber & Tooltip) ---
  const focus = svg.append('g')
    .attr('class', 'focus')
    .style('display', 'none')

  focus.append('line')
    .attr('class', 'x-hover-line hover-line')
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#9ca3af')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')

  focus.append('circle')
    .attr('r', 6)
    .attr('fill', props.color || '#4F46E5')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)

  // Tooltip
  const tooltip = d3.select(container)
    .append('div')
    .attr('class', 'chart-tooltip')
    .style('opacity', 0)

  svg.append('rect')
    .attr('class', 'overlay')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('fill', 'transparent')
    .on('mouseover', () => {
      focus.style('display', null)
      tooltip.style('opacity', 1)
    })
    .on('mouseout', () => {
      focus.style('display', 'none')
      tooltip.style('opacity', 0)
    })
    .on('mousemove', function(event) {
      const mouseX = d3.pointer(event)[0]
      const domain = x.domain()
      const coords = domain.map(d => x(d) || 0)
      
      let index = 0
      let minDiff = Infinity
      
      coords.forEach((val, i) => {
        const diff = Math.abs(val - mouseX)
        if (diff < minDiff) {
          minDiff = diff
          index = i
        }
      })

      const d = props.data[index]
      if (!d) return

      focus.attr('transform', `translate(${x(d.date)}, 0)`)
      focus.select('circle').attr('cy', yPrice(d.price))

      const priceStr = d.price >= 10000 
        ? `${Math.floor(d.price / 10000)}억 ${ (d.price % 10000).toLocaleString()}`
        : `${d.price.toLocaleString()}`

      tooltip
        .html(`
          <div class="tooltip-date">${d.date.replace('-', '.')}</div>
          <div class="tooltip-val">평균 <strong>${priceStr}</strong>만원</div>
          <div class="tooltip-count">거래 <strong>${d.volume || 0}건</strong></div>
        `)
        .style('left', `${x(d.date)! + margin.left}px`)
        .style('top', `${yPrice(d.price) - 10}px`)
    })
}

onMounted(() => {
  setTimeout(drawChart, 50)
  
  if (chartRef.value) {
    resizeObserver.value = new ResizeObserver(() => {
      requestAnimationFrame(drawChart)
    })
    resizeObserver.value.observe(chartRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  }
})

watch(() => props.data, () => {
  drawChart()
}, { deep: true })
</script>

<template>
  <div class="chart-container">
    <div v-if="!data || data.length === 0" class="no-data">
      <p>데이터 준비중입니다.</p>
    </div>
    <div v-else ref="chartRef" class="trend-chart"></div>
  </div>
</template>

<style>
.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.trend-chart {
  width: 100%;
  height: 100%;
}

.chart-tooltip {
  position: absolute;
  pointer-events: none;
  background-color: #4F46E5;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 11px;
  transform: translate(-50%, -100%);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
  white-space: nowrap;
}

.chart-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #4F46E5 transparent transparent transparent;
}

.tooltip-date {
  opacity: 0.8;
  margin-bottom: 2px;
}

.tooltip-val {
  font-size: 13px;
}

.tooltip-count {
  margin-top: 2px;
  opacity: 0.9;
}

.no-data {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-500);
  font-size: 0.875rem;
}
</style>
