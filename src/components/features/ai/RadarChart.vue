<script setup lang="ts">
import { computed } from 'vue'

interface ScoreEntry {
  name: string
  transportation: number
  education: number
  convenience: number
  environment: number
  futureValue: number
}

const props = defineProps<{
  data: ScoreEntry[]
}>()

const categories = [
  { key: 'transportation', label: '교통' },
  { key: 'education', label: '학군' },
  { key: 'convenience', label: '생활편의' },
  { key: 'environment', label: '주거환경' },
  { key: 'futureValue', label: '미래가치' }
]

const size = 300
const center = size / 2
const radius = size * 0.35

// 각도 계산 (5개 항목이므로 72도씩)
const getAngle = (index: number) => {
  return (Math.PI * 2 * index) / categories.length - Math.PI / 2
}

// 점 정보 계산
const getPoint = (score: number, index: number) => {
  const r = (radius * score) / 10
  const angle = getAngle(index)
  return {
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle)
  }
}

// 배경 가이드 라인 (오각형들)
const guideLines = computed(() => {
  const lines = []
  for (let level = 1; level <= 5; level++) {
    const points = categories.map((_, i) => {
      const p = getPoint(level * 2, i)
      return `${p.x},${p.y}`
    }).join(' ')
    lines.push(points)
  }
  return lines
})

// 축 라인
const axisLines = computed(() => {
  return categories.map((_, i) => {
    const p = getPoint(10, i)
    return { x1: center, y1: center, x2: p.x, y2: p.y }
  })
})

// 라벨 위치
const labels = computed(() => {
  return categories.map((cat, i) => {
    const p = getPoint(11.5, i)
    return { x: p.x, y: p.y, label: cat.label }
  })
})

// 아파트 데이터 폴리곤
const apartmentPolygons = computed(() => {
  const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']
  return props.data.map((item, idx) => {
    const points = categories.map((cat, i) => {
      const score = (item as any)[cat.key] || 0
      const p = getPoint(score, i)
      return `${p.x},${p.y}`
    }).join(' ')
    return {
      points,
      color: colors[idx % colors.length],
      name: item.name
    }
  })
})
</script>

<template>
  <div class="radar-chart-container">
    <svg :viewBox="`0 0 ${size} ${size}`" class="radar-chart">
      <!-- 배경 가이드 -->
      <polygon 
        v-for="(points, i) in guideLines" 
        :key="`guide-${i}`"
        :points="points"
        class="guide-line"
      />
      
      <!-- 축 -->
      <line 
        v-for="(line, i) in axisLines" 
        :key="`axis-${i}`"
        :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2"
        class="axis-line"
      />

      <!-- 데이터 폴리곤 -->
      <g v-for="(poly, i) in apartmentPolygons" :key="`poly-${i}`" class="data-group">
        <polygon 
          :points="poly.points"
          :stroke="poly.color"
          :fill="poly.color"
          class="data-polygon"
          fill-opacity="0.2"
        />
        <!-- 점 강조 -->
        <circle 
          v-for="(p, pi) in poly.points.split(' ')" 
          :key="`point-${i}-${pi}`"
          :cx="p.split(',')[0]" 
          :cy="p.split(',')[1]"
          r="3"
          :fill="poly.color"
        />
      </g>

      <!-- 라벨 -->
      <text 
        v-for="(label, i) in labels" 
        :key="`label-${i}`"
        :x="label.x" :y="label.y"
        text-anchor="middle"
        dominant-baseline="middle"
        class="chart-label"
      >
        {{ label.label }}
      </text>
    </svg>

    <!-- 범례 -->
    <div class="chart-legend">
      <div v-for="(poly, i) in apartmentPolygons" :key="`legend-${i}`" class="legend-item">
        <span class="legend-color" :style="{ backgroundColor: poly.color }"></span>
        <span class="legend-name">{{ poly.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.radar-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
}

.radar-chart {
  width: 100%;
  max-width: 400px;
}

.guide-line {
  fill: none;
  stroke: var(--color-gray-200);
  stroke-width: 1;
}

.axis-line {
  stroke: var(--color-gray-200);
  stroke-width: 1;
  stroke-dasharray: 4;
}

.data-polygon {
  stroke-width: 2.5;
  transition: all 0.5s ease;
}

.data-group:hover .data-polygon {
  fill-opacity: 0.5;
  stroke-width: 3.5;
}

.chart-label {
  font-size: 11px;
  font-weight: 700;
  fill: var(--color-gray-500);
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-gray-600);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
