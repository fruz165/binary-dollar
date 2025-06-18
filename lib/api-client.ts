const API_BASE_URL = "/api/binary-dollar"

export class BinaryDollarClient {
  private baseUrl: string
  private apiToken: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  setApiToken(token: string) {
    this.apiToken = token
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.apiToken) {
      headers.Authorization = `Bearer ${this.apiToken}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `API request failed: ${response.status} ${response.statusText}`)
      }

      return data
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error: Unable to connect to Binary Dollar API")
      }
      throw error
    }
  }

  async connect() {
    return this.makeRequest("/connect")
  }

  async getStatus() {
    return this.makeRequest("/status")
  }

  async createToken(name: string) {
    return this.makeRequest("/tokens", {
      method: "POST",
      body: JSON.stringify({ name }),
    })
  }

  async getTokens() {
    return this.makeRequest("/tokens")
  }

  async revokeToken(token: string) {
    return this.makeRequest("/tokens/revoke", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
  }
}

export const binaryDollarClient = new BinaryDollarClient()