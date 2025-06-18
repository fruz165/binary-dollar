"use client"

import { motion } from "framer-motion"
import { useServerConnection } from "@/hooks/use-server-connection"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, RefreshCw, Key } from "lucide-react"
import { TokenManager } from "@/components/token-manager"
import { useState } from "react"

export default function BinaryDollarLoadingScreen() {
  const { isConnecting, isConnected, error, retryCount, retry, connect, setApiToken, apiToken } = useServerConnection()
  const [showTokenManager, setShowTokenManager] = useState(false)
  const [tokenInput, setTokenInput] = useState("")

  const handleConnect = () => {
    if (tokenInput) {
      setApiToken(tokenInput)
      connect(tokenInput)
    }
  }

  if (showTokenManager) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Binary Dollar - API Token Manager</h1>
            <Button onClick={() => setShowTokenManager(false)} variant="outline">
              Back to Connection
            </Button>
          </div>
          <TokenManager />
        </div>
      </div>
    )
  }

  if (isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
          <p className="text-gray-600 text-sm font-medium mb-2">Connected to Binary Dollar successfully!</p>
          <p className="text-gray-500 text-xs mb-4">API endpoint: https://binarydollar.com</p>
          <Button onClick={() => setShowTokenManager(true)} variant="outline">
            <Key className="w-4 h-4 mr-2" />
            Manage API Tokens
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 text-sm font-medium mb-2">Connection to Binary Dollar failed</p>
          <p className="text-red-600 text-xs mb-2">{error}</p>
          <p className="text-gray-500 text-xs mb-4">Retry attempt: {retryCount}</p>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Binary Dollar API token"
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              />
              <Button onClick={handleConnect} disabled={!tokenInput}>
                Connect
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={retry} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button onClick={() => setShowTokenManager(true)} variant="outline" size="sm">
                <Key className="w-4 h-4 mr-2" />
                Manage Tokens
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="flex justify-center space-x-2 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.2,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <p className="text-gray-600 text-sm font-medium mb-2">Enter your Binary Dollar API token to connect</p>
        <p className="text-gray-500 text-xs mb-6">Connecting to https://binarydollar.com</p>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Binary Dollar API token"
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            />
            <Button onClick={handleConnect} disabled={!tokenInput}>
              Connect
            </Button>
          </div>

          <Button onClick={() => setShowTokenManager(true)} variant="outline" size="sm">
            <Key className="w-4 h-4 mr-2" />
            Manage API Tokens
          </Button>
        </div>
      </div>
    </div>
  )
}