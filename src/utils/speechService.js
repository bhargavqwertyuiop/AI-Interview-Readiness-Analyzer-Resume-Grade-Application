/**
 * Speech Service
 * Handles Text-to-Speech and Speech-to-Text using Web Speech API
 */

/**
 * Check if Text-to-Speech is available
 * @returns {boolean}
 */
export function isTTSAvailable() {
  return 'speechSynthesis' in window
}

/**
 * Check if Speech-to-Text is available
 * @returns {boolean}
 */
export function isSTTAvailable() {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
}

/**
 * Speak text using Text-to-Speech
 * @param {string} text - Text to speak
 * @param {Object} options - Speech options
 * @returns {Promise<void>}
 */
export function speakText(text, options = {}) {
  return new Promise((resolve, reject) => {
    if (!isTTSAvailable()) {
      reject(new Error('Text-to-Speech is not available in this browser'))
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Set options
    utterance.rate = options.rate || 1.0
    utterance.pitch = options.pitch || 1.0
    utterance.volume = options.volume || 1.0
    utterance.lang = options.lang || 'en-US'

    utterance.onend = () => resolve()
    utterance.onerror = (error) => reject(error)

    window.speechSynthesis.speak(utterance)
  })
}

/**
 * Stop any ongoing speech
 */
export function stopSpeech() {
  if (isTTSAvailable()) {
    window.speechSynthesis.cancel()
  }
}

/**
 * Speech Recognition class
 * Wraps Web Speech API for easier use
 */
export class SpeechRecognitionService {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      throw new Error('Speech Recognition is not available in this browser')
    }

    this.recognition = new SpeechRecognition()
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'en-US'

    this.isListening = false
    this.transcript = ''
    this.onTranscriptUpdate = null
    this.onFinalTranscript = null
    this.onError = null

    this.setupEventHandlers()
  }

  setupEventHandlers() {
    this.recognition.onstart = () => {
      this.isListening = true
    }

    this.recognition.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      this.transcript = finalTranscript + interimTranscript

      if (this.onTranscriptUpdate) {
        this.onTranscriptUpdate(this.transcript)
      }
    }

    this.recognition.onend = () => {
      this.isListening = false
      if (this.onFinalTranscript && this.transcript) {
        this.onFinalTranscript(this.transcript.trim())
      }
    }

    this.recognition.onerror = (event) => {
      this.isListening = false
      if (this.onError) {
        this.onError(event.error)
      }
    }
  }

  start() {
    if (!this.isListening) {
      this.transcript = ''
      this.recognition.start()
    }
  }

  stop() {
    if (this.isListening) {
      this.recognition.stop()
    }
  }

  abort() {
    if (this.isListening) {
      this.recognition.abort()
    }
  }
}

