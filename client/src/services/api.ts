import axios, { AxiosRequestConfig } from "axios"
import type { SubmitScorePayload, SubmitScoreResponse } from "../store/slices/gameSlice"
import type { LeaderboardResponse } from "../store/slices/leaderboardSlice"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Generic Axios helper function
const apiRequest = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axios({
      url,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Optional CORS headers if you need them manually (usually not necessary with axios)
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        ...config?.headers,
      },
      ...config,
    })

    return response.data
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.response.statusText
      throw new Error(`HTTP ${status}: ${message}`)
    } else if (error.request) {
      throw new Error("Network error: No response received from server. Please check your connection.")
    } else {
      throw new Error(`Unexpected error: ${error.message}`)
    }
  }
}

// POST /api/submit-score
export const submitScore = async (payload: SubmitScorePayload): Promise<SubmitScoreResponse> => {
  return apiRequest<SubmitScoreResponse>(`${API_BASE_URL}/api/submit-score`, {
    method: "POST",
    data: payload,
  })
}

// GET /api/leaderboard
export const fetchLeaderboard = async (): Promise<LeaderboardResponse> => {
  return apiRequest<LeaderboardResponse>(`${API_BASE_URL}/api/leaderboard`, {
    method: "GET",
  })
}

// GET /api/health
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health`)
    return response.status === 200
  } catch {
    return false
  }
}
