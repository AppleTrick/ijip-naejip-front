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
  
  // If width is 0, retry.
  if (rect.width === 0) {
    setTimeout(drawChart, 100)
    return
  }

  const width = rect.width
  const height = props.height || rect.height || 100

  // Clear previous chart
  d3.select(container).selectAll('*').remove()

  const margin = { top: 10, right: 10, bottom: 20, left: 35 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%') // Use 100% to fill container
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'none')
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // X Axis
  const x = d3.scalePoint()
    .domain(props.data.map(d => d.date))
    .range([0, innerWidth])

  svg.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
    .select('.domain').remove()
  
  svg.selectAll('.tick text')
    .style('font-size', '10px')
    .style('fill', '#9ca3af')

  // Y Axis
  const minPrice = d3.min(props.data, d => d.price) || 0
  const maxPrice = d3.max(props.data, d => d.price) || 0
  const padding = (maxPrice - minPrice) * 0.1

  const y = d3.scaleLinear()
    .domain([minPrice - padding, maxPrice + padding])
    .range([innerHeight, 0])

  svg.append('g')
    .call(d3.axisLeft(y).ticks(3).tickFormat(d => `${d.valueOf() / 10000}억`).tickSize(0))
    .select('.domain').remove()

  svg.selectAll('.tick text')
    .style('font-size', '10px')
    .style('fill', '#9ca3af')

  // Line
  const line = d3.line<PriceTrend>()
    .x(d => x(d.date) || 0)
    .y(d => y(d.price))
    .curve(d3.curveMonotoneX)

  svg.append('path')
    .datum(props.data)
    .attr('fill', 'none')
    .attr('stroke', props.color || '#E84545')
    .attr('stroke-width', 2)
    .attr('d', line)

  // Area (Gradient)
  const area = d3.area<PriceTrend>()
    .x(d => x(d.date) || 0)
    .y0(innerHeight)
    .y1(d => y(d.price))
    .curve(d3.curveMonotoneX)

  const defs = svg.append('defs')
  const gradient = defs.append('linearGradient')
    .attr('id', `area-gradient-${Math.random().toString(36).substr(2, 9)}`)
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%')

  const gradientId = gradient.attr('id')

  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', props.color || '#E84545')
    .attr('stop-opacity', 0.2)

  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', props.color || '#E84545')
    .attr('stop-opacity', 0)

  svg.append('path')
    .datum(props.data)
    .attr('fill', `url(#${gradientId})`)
    .attr('d', area)

  // Dots
  svg.selectAll('.dot')
    .data(props.data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d => x(d.date) || 0)
    .attr('cy', d => y(d.price))
    .attr('r', 3)
    .attr('fill', '#fff')
    .attr('stroke', props.color || '#E84545')
    .attr('stroke-width', 2)
}

onMounted(() => {
  setTimeout(drawChart, 50)
  
  if (chartRef.value) {
    resizeObserver.value = new ResizeObserver(() => {
      // Debounce slightly to avoid thrashing
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
  <div ref="chartRef" class="trend-chart"></div>
</template>

<style scoped>
.trend-chart {
  width: 100%;
  height: 100%;
  min-height: 100px; /* Ensure it has height */
}
</style>
