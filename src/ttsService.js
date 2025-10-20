// OpenAI TTS Service for Kopfrechnen Trainer
import OpenAI from "openai";

class TTSService {
  constructor() {
    this.openai = null;
    this.audioCache = new Map(); // Cache for generated audio
    this.isInitialized = false;
    this.initializeOpenAI();
  }

  initializeOpenAI() {
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      console.log(
        "🔑 API Key loaded:",
        apiKey ? `${apiKey.substring(0, 10)}...` : "NOT FOUND"
      );

      if (!apiKey || apiKey.includes("your-real-openai-api-key-here")) {
        console.error("❌ OpenAI API key not configured properly");
        this.isInitialized = false;
        return;
      }

      // Initialize OpenAI client
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Required for client-side usage
      });
      this.isInitialized = true;
      console.log("✅ OpenAI TTS Service initialized");
    } catch (error) {
      console.error("❌ Failed to initialize OpenAI TTS:", error);
      this.isInitialized = false;
    }
  }

  // Generate cache key for text
  getCacheKey(text, voice = "alloy") {
    return `${voice}_${text.toLowerCase().replace(/\s+/g, "_")}`;
  }

  // Check if audio is cached
  getCachedAudio(text, voice = "alloy") {
    const key = this.getCacheKey(text, voice);
    return this.audioCache.get(key);
  }

  // Cache audio data
  setCachedAudio(text, voice, audioBlob) {
    const key = this.getCacheKey(text, voice);
    this.audioCache.set(key, audioBlob);

    // Limit cache size (keep last 100 items)
    if (this.audioCache.size > 100) {
      const firstKey = this.audioCache.keys().next().value;
      this.audioCache.delete(firstKey);
    }
  }

  // Generate speech using OpenAI TTS
  async generateSpeech(text, voice = "alloy") {
    if (!this.isInitialized) {
      throw new Error("TTS Service not initialized");
    }

    // Check cache first
    const cachedAudio = this.getCachedAudio(text, voice);
    if (cachedAudio) {
      console.log("🎵 Using cached audio for:", text);
      return cachedAudio;
    }

    try {
      console.log("🎤 Generating TTS for:", text);

      const response = await this.openai.audio.speech.create({
        model: "tts-1", // Use standard quality (cheaper)
        voice: voice, // alloy, echo, fable, onyx, nova, shimmer
        input: text,
        response_format: "mp3",
      });

      // Convert response to blob
      const audioBlob = new Blob([await response.arrayBuffer()], {
        type: "audio/mpeg",
      });

      // Cache the audio
      this.setCachedAudio(text, voice, audioBlob);

      return audioBlob;
    } catch (error) {
      console.error("❌ TTS generation failed:", error);
      throw error;
    }
  }

  // Play audio from blob
  async playAudio(audioBlob) {
    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          reject(error);
        };
        audio.play();
      });
    } catch (error) {
      console.error("❌ Audio playback failed:", error);
      throw error;
    }
  }

  // Main method to speak text
  async speak(text, voice = "alloy", isCorrect = null) {
    console.log(`🎤 TTS Request: "${text}" with voice: ${voice}`);

    // For German text, use browser's German voices (much better pronunciation)
    console.log("🇩🇪 Using German browser voices for better pronunciation");
    this.useGermanWebSpeech(text, isCorrect);
    return;

    // Keep OpenAI TTS code for future use with English content
    /*
    if (!this.isInitialized) {
      console.warn("⚠️ OpenAI TTS not initialized, using fallback");
      this.fallbackToWebSpeech(text);
      return;
    }

    try {
      const audioBlob = await this.generateSpeech(text, voice);
      console.log("✅ OpenAI TTS audio generated, playing...");
      await this.playAudio(audioBlob);
      console.log("✅ OpenAI TTS playback completed");
    } catch (error) {
      console.error("❌ OpenAI TTS failed:", error);
      console.log("🔄 Falling back to browser TTS");
      // Fallback to browser TTS if OpenAI fails
      this.fallbackToWebSpeech(text);
    }
    */
  }

  // Use browser Web Speech API with best German voice
  useGermanWebSpeech(text, isCorrect = null) {
    console.log("🇩🇪 Using German Web Speech API");
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.rate = 0.9;

      // Try to find the best German voice
      const voices = window.speechSynthesis.getVoices();
      const germanVoices = voices.filter((voice) =>
        voice.lang.startsWith("de")
      );

      // Prefer Google German voices, then any German voice
      const bestVoice =
        germanVoices.find(
          (voice) => voice.name.includes("Google") && voice.lang.includes("DE")
        ) ||
        germanVoices.find(
          (voice) =>
            voice.name.includes("Microsoft") && voice.lang.includes("DE")
        ) ||
        germanVoices[0];

      if (bestVoice) {
        utterance.voice = bestVoice;
        console.log(
          `🎤 Using German voice: ${bestVoice.name} (${bestVoice.lang})`
        );
      }

      // Add emotion through pitch for feedback
      if (isCorrect !== null) {
        utterance.pitch = isCorrect ? 1.2 : 0.9;
      }

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }

  // Fallback to browser Web Speech API
  fallbackToWebSpeech(text) {
    console.log("🔄 Falling back to Web Speech API");
    this.useGermanWebSpeech(text);
  }

  // Preload common phrases for better performance
  async preloadCommonPhrases() {
    const commonPhrases = [
      "Super gemacht!",
      "Richtig!",
      "Sehr gut!",
      "Das ist korrekt!",
      "Weiter zur nächsten Aufgabe!",
      "Versuche es noch einmal!",
      "Kopfrechnen",
      "Gut zuhören!",
    ];

    console.log("🔄 Preloading common phrases...");

    for (const phrase of commonPhrases) {
      try {
        await this.generateSpeech(phrase);
      } catch (error) {
        console.warn(`⚠️ Failed to preload: ${phrase}`, error);
      }
    }

    console.log("✅ Common phrases preloaded");
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.audioCache.size,
      keys: Array.from(this.audioCache.keys()),
    };
  }

  // Clear cache
  clearCache() {
    this.audioCache.clear();
    console.log("🗑️ TTS cache cleared");
  }
}

// Create singleton instance
const ttsService = new TTSService();

export default ttsService;
