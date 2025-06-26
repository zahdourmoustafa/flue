export interface SentenceUnit {
  id: string;
  title: string;
  description: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
  lessons?: SentenceLesson[];
  progress?: UserSentenceUnitProgress;
}

export interface SentenceLesson {
  id: string;
  unitId: string;
  title: string;
  description: string | null;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
  sentences?: Sentence[];
  unit?: SentenceUnit;
  progress?: UserSentenceLessonProgress;
}

export interface Sentence {
  id: string;
  lessonId: string;
  text: string;
  translation: string;
  difficulty: number;
  audioUrl: string | null;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
  lesson?: SentenceLesson;
  userProgress?: UserSentenceProgress;
}

export interface UserSentenceProgress {
  id: string;
  userId: string;
  unitId: string;
  lessonId: string;
  sentenceId: string;
  completed: boolean;
  pronunciationScore: number | null;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSentenceUnitProgress {
  unitId: string;
  totalLessons: number;
  completedLessons: number;
  totalSentences: number;
  completedSentences: number;
  averageScore: number | null;
  isCompleted: boolean;
}

export interface UserSentenceLessonProgress {
  lessonId: string;
  totalSentences: number;
  completedSentences: number;
  averageScore: number | null;
  isCompleted: boolean;
}

export interface PronunciationFeedback {
  overallScore: number;
  wordScores: WordScore[];
  feedback: string;
  strengths?: string[];
  improvements?: string[];
}

export interface WordScore {
  word: string;
  score: number;
  correct: boolean;
  suggestion?: string;
}

export interface SentencePracticeSession {
  lessonId: string;
  currentSentenceIndex: number;
  sentences: Sentence[];
  progress: UserSentenceProgress[];
}

export interface AudioRecordingState {
  isRecording: boolean;
  audioBlob: Blob | null;
  duration: number;
  error: string | null;
}

export interface TtsRequest {
  text: string;
  language: string;
}

export interface TtsResponse {
  audioUrl: string;
  duration: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  pronunciationScore?: number;
  wordScores?: WordScore[];
}
