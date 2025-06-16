export interface Message {
  id: string
  sessionId: string
  senderType: 'ai' | 'user'
  originalMessage: string
  correctedMessage?: string | null
  correctionExplanation?: string | null
  audioUrl?: string | null
  hasErrors: boolean
  createdAt: Date
}

export interface ChatSession {
  id: string
  userId: string
  language: string
  status: 'active' | 'inactive' | 'completed'
  createdAt: Date
  updatedAt: Date
}

export interface TopicSuggestion {
  id: string
  text: string
  category: 'fun' | 'interesting' | 'custom'
}

export interface AudioPlaybackState {
  isPlaying: boolean
  messageId: string | null
  duration: number
  currentTime: number
} 