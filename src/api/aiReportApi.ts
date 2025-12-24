import http from '@/api/http'
import type { CommonResponse } from '@/api/http'
import type { AIReportResponse } from '@/api/types'

export const getReports = async (): Promise<AIReportResponse[]> => {
    const response = await http.get<CommonResponse<AIReportResponse[]>>('/api/v1/ai/reports')
    return response.data.data
}

export const getReport = async (id: number): Promise<AIReportResponse> => {
    const response = await http.get<CommonResponse<AIReportResponse>>(`/api/v1/ai/reports/${id}`)
    return response.data.data
}

export const deleteReport = async (id: number): Promise<void> => {
    await http.delete<CommonResponse<void>>(`/api/v1/ai/reports/${id}`)
}
