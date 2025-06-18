"use client"

import { useState, useEffect } from "react"
import { binaryDollarClient } from "@/lib/api-client"

interface ConnectionState {
  isConnecting: boolean
  isConnected: boolean
  error: string | null
  retryCount: number
  apiToken: string
}

export function useServerConnection() {
  const [state, setState] = useState<ConnectionState>({
    isConnecting: true,
    isConnected: false,
    error: null,
    retryCount: 0,
    apiToken: "",
  })

  const connect = async (token?: string) => {
    const currentToken = token || state.apiToken
    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      if (currentToken) {
        binaryDollarClient.setApiToken(currentToken)
      }

      const data = await binaryDollarClient.connect()

      if (data.success) {
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          isConnected: true,
          error: null,
          apiToken: currentToken,
        }))
      } else {
        throw new Error(data.error || data.message)
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        isConnected: false,
        error: error instanceof Error ? error.message : "Binary Dollar connection failed",
        retryCount: prev.retryCount + 1,
      }))
    }
  }

  const setApiToken = (token: string) => {
    setState((prev) => ({ ...prev, apiToken: token }))
    binaryDollarClient.setApiToken(token)
  }

  const retry = () => {
    connect()
  }

  useEffect(() => {
    // Don't auto-connect without token
    if (state.apiToken) {
      connect()
    } else {
      setState((prev) => ({ ...prev, isConnecting: false }))
    }
  }, [])

  return { ...state, retry, connect, setApiToken }
}