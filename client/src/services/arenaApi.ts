const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface JoinArenaPayload {
  wallet: string
  txSignature: string
}

export interface JoinArenaResponse {
  status: "success"
  message: "Joined arena"
  seasonId: string
  data?: {
    playerCount: number
    totalPool: number
  }
}

export interface SubmitArenaScorePayload {
  wallet: string
  score: number
  seasonId: string
}

export interface SubmitArenaScoreResponse {
  status: "success"
  message: "Score submitted"
  txSignature?: string // Add optional transaction signature
}

export interface ArenaLeaderboardResponse {
  status: "success"
  data: Array<{
    _id: string // wallet address
    score: number
  }>
}

export interface ArenaStatusResponse {
  status: "success"
  data: {
    currentSeason:
      | string
      | {
          id: string
          startTime: string
          endTime: string
          isActive: boolean
        }
      | null
    hasJoined: boolean
    playerCount: number
    totalPool: number
  }
}

const apiRequest = async (url: string, options?: RequestInit): Promise<any> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch {
        // If response is not JSON, use status text
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server. Please check if the backend is running.")
    }
    throw error
  }
}

export const joinArena = async (payload: JoinArenaPayload): Promise<JoinArenaResponse> => {
  return apiRequest(`${API_BASE_URL}/api/arena/join`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export const submitArenaScore = async (payload: SubmitArenaScorePayload): Promise<SubmitArenaScoreResponse> => {
  return apiRequest(`${API_BASE_URL}/api/arena/submit-score`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export const fetchArenaLeaderboard = async (seasonId: string): Promise<ArenaLeaderboardResponse> => {
  return apiRequest(`${API_BASE_URL}/api/arena/leaderboard/${seasonId}`, {
    method: "GET",
  })
}

export const getArenaStatus = async (wallet?: string): Promise<ArenaStatusResponse> => {
  const url = wallet ? `${API_BASE_URL}/api/arena/status?wallet=${wallet}` : `${API_BASE_URL}/api/arena/status`
  return apiRequest(url, {
    method: "GET",
  })
}
