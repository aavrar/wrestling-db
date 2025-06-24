"use client"

import React from 'react'
import { AlertTriangle, RefreshCw, Bug, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ApiError, NetworkError, ValidationError } from '@/lib/api'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const reset = () => {
        this.setState({ hasError: false, error: null })
      }

      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} reset={reset} />
      }

      return <DefaultErrorFallback error={this.state.error!} reset={reset} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const getErrorInfo = (error: Error) => {
    if (error instanceof NetworkError) {
      return {
        title: 'Connection Problem',
        message: 'Unable to connect to our servers. Please check your internet connection.',
        icon: <AlertTriangle className="h-4 w-4 text-white" />,
        color: 'from-orange-500 to-yellow-600',
        suggestions: [
          'Check your internet connection',
          'Try refreshing the page',
          'The server might be temporarily unavailable'
        ]
      }
    }
    
    if (error instanceof ValidationError) {
      return {
        title: 'Data Error',
        message: 'The data we received doesn\'t match what we expected.',
        icon: <Bug className="h-4 w-4 text-white" />,
        color: 'from-purple-500 to-indigo-600',
        suggestions: [
          'This is likely a temporary issue',
          'Try refreshing the page',
          'Contact support if the problem persists'
        ]
      }
    }
    
    if (error instanceof ApiError) {
      return {
        title: 'Server Error',
        message: error.message || 'The server encountered an error while processing your request.',
        icon: <AlertTriangle className="h-4 w-4 text-white" />,
        color: 'from-red-500 to-rose-600',
        suggestions: [
          'Try again in a few moments',
          'The server might be experiencing high traffic',
          'Contact support if this keeps happening'
        ]
      }
    }
    
    return {
      title: 'Unexpected Error',
      message: 'Something unexpected happened. This has been logged and we\'ll look into it.',
      icon: <HelpCircle className="h-4 w-4 text-white" />,
      color: 'from-slate-500 to-gray-600',
      suggestions: [
        'Try refreshing the page',
        'Clear your browser cache',
        'Contact support with the error details below'
      ]
    }
  }

  const errorInfo = getErrorInfo(error)

  return (
    <Card className="bg-white/60 backdrop-blur-xl border-red-200/50 shadow-lg max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-3">
          <div className={`w-8 h-8 bg-gradient-to-br ${errorInfo.color} rounded-lg flex items-center justify-center shadow-md`}>
            {errorInfo.icon}
          </div>
          {errorInfo.title}
          {error instanceof ApiError && error.status && (
            <Badge variant="secondary" className="ml-auto">
              {error.status}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-slate-700 leading-relaxed">
          {errorInfo.message}
        </p>
        
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900">What you can try:</h4>
          <ul className="text-sm text-slate-600 space-y-1">
            {errorInfo.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
        
        <details className="text-sm text-slate-600">
          <summary className="cursor-pointer font-medium text-slate-700 hover:text-slate-900">
            Technical details
          </summary>
          <div className="mt-3 p-4 bg-slate-50 rounded-lg border">
            <div className="space-y-2">
              <div><strong>Error:</strong> {error.name}</div>
              <div><strong>Message:</strong> {error.message}</div>
              {error instanceof ApiError && error.code && (
                <div><strong>Code:</strong> {error.code}</div>
              )}
              {error instanceof ApiError && error.details && (
                <div>
                  <strong>Details:</strong>
                  <pre className="mt-1 text-xs overflow-auto">
                    {JSON.stringify(error.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </details>
        
        <div className="flex gap-3">
          <Button 
            onClick={reset}
            className={`bg-gradient-to-r ${errorInfo.color} hover:opacity-90 text-white transition-opacity`}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Refresh page
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Hook for using error boundary programmatically
export function useErrorHandler() {
  return (error: Error) => {
    console.error('Error caught:', error)
    // Here you could send to error reporting service
    throw error
  }
}

// Specific error components for different error types
export function NetworkErrorComponent({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="bg-white/60 backdrop-blur-xl border-orange-200/50">
      <CardContent className="p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">Connection Problem</h3>
            <p className="text-slate-600">We're having trouble connecting to our servers.</p>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white hover:from-orange-600 hover:to-yellow-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function ValidationErrorComponent({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <Card className="bg-white/60 backdrop-blur-xl border-purple-200/50">
      <CardContent className="p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
            <Bug className="w-8 h-8 text-purple-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">Data Error</h3>
            <p className="text-slate-600">
              {message || "The data format doesn't match what we expected."}
            </p>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ErrorBoundary