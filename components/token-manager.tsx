"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Eye, EyeOff, Plus, Trash2, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { binaryDollarClient } from "@/lib/api-client"

interface ApiToken {
  id: string
  token: string
  name: string
  createdAt: string
  lastUsed?: string
  isActive: boolean
}

export function TokenManager() {
  const [tokens, setTokens] = useState<ApiToken[]>([])
  const [newTokenName, setNewTokenName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set())
  const [newToken, setNewToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)

  const fetchTokens = async () => {
    try {
      setError(null)
      const data = await binaryDollarClient.getTokens()
      if (data.success) {
        setTokens(data.tokens)
        setIsUsingFallback(data.source === "fallback")
      }
    } catch (error) {
      console.error("Failed to fetch tokens from Binary Dollar:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch tokens")
    }
  }

  const createToken = async () => {
    if (!newTokenName.trim()) return

    setIsCreating(true)
    setError(null)

    try {
      const data = await binaryDollarClient.createToken(newTokenName)

      if (data.success) {
        setNewToken(data.token.token)
        setNewTokenName("")
        setIsUsingFallback(data.source === "fallback")
        fetchTokens()
      }
    } catch (error) {
      console.error("Failed to create token on Binary Dollar:", error)
      setError(error instanceof Error ? error.message : "Failed to create token")
    } finally {
      setIsCreating(false)
    }
  }

  const revokeToken = async (token: string) => {
    try {
      setError(null)
      await binaryDollarClient.revokeToken(token)
      fetchTokens()
    } catch (error) {
      console.error("Failed to revoke token on Binary Dollar:", error)
      setError(error instanceof Error ? error.message : "Failed to revoke token")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const toggleTokenVisibility = (tokenId: string) => {
    setVisibleTokens((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(tokenId)) {
        newSet.delete(tokenId)
      } else {
        newSet.add(tokenId)
      }
      return newSet
    })
  }

  useEffect(() => {
    fetchTokens()
  }, [])

  return (
    <div className="space-y-6">
      {isUsingFallback && (
        <Alert>
          <WifiOff className="h-4 w-4" />
          <AlertDescription>Binary Dollar API is currently unavailable. Using local fallback mode.</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Create New Binary Dollar API Token
            {isUsingFallback ? (
              <WifiOff className="h-4 w-4 text-orange-500" />
            ) : (
              <Wifi className="h-4 w-4 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Token name (e.g., 'Production App')"
              value={newTokenName}
              onChange={(e) => setNewTokenName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createToken()}
            />
            <Button onClick={createToken} disabled={isCreating || !newTokenName.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>

          {newToken && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 mb-2">
                <strong>New Binary Dollar token created!</strong> Copy it now - you won't see it again.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-white border rounded text-sm font-mono">{newToken}</code>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(newToken)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Binary Dollar API Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tokens.map((token) => (
              <div key={token.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{token.name}</span>
                    <Badge variant={token.isActive ? "default" : "secondary"}>
                      {token.isActive ? "Active" : "Revoked"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {visibleTokens.has(token.id) ? token.token : token.token}
                    </code>
                    <Button size="sm" variant="ghost" onClick={() => toggleTokenVisibility(token.id)}>
                      {visibleTokens.has(token.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(token.token)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {new Date(token.createdAt).toLocaleDateString()}
                    {token.lastUsed && ` • Last used: ${new Date(token.lastUsed).toLocaleDateString()}`}
                  </p>
                </div>
                {token.isActive && (
                  <Button size="sm" variant="destructive" onClick={() => revokeToken(token.token)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {tokens.length === 0 && (
              <p className="text-center text-gray-500 py-8">No Binary Dollar API tokens created yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}