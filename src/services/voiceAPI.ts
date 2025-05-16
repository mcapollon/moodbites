import OpenAI from "openai";

const OPEN_AI_API_KEY = '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'
const NLP_CLOUD_API = '54652e7361dc80906bd91a27dd7f8e3a36fb7a4c'

const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY, dangerouslyAllowBrowser: true });

// Removed: getSpeakAccessToken function

export const transcribeAudio = async (audioData: Blob, format: 'wav' | 'mp3' = 'wav'): Promise<string> => {
  // Convert Blob to File for OpenAI API
  const ext = format === 'mp3' ? 'mp3' : 'wav';
  const file = new File([audioData], `audio.${ext}`, { type: format === 'mp3' ? 'audio/mpeg' : 'audio/wav' });
  // OpenAI expects a File or ReadStream
  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
  });
  return transcription.text;
};

export const analyzeSentiment = async (text: string): Promise<any> => {
  const model = 'distilbert-base-uncased-finetuned-sst-2-english'; // or your preferred model
  const res = await fetch(`https://api.nlpcloud.io/v1/${model}/sentiment`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${NLP_CLOUD_API}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('NLP Cloud sentiment error:', errorText);
    throw new Error('Failed to analyze sentiment');
  }
  console.log(res)
  return res.json();
};

export const analyzeVoice = async (audioData: Blob, format: 'wav' | 'mp3' = 'wav') => {
  // Step 1: Transcribe audio
  const text = await transcribeAudio(audioData, format);
  console.log('Transcription:', text);
  // Step 2: Analyze sentiment
  const sentiment = await analyzeSentiment(text);
  console.log('NLP Cloud sentiment response:', sentiment);
  // Step 3: Return in the original format
  // Try to extract label/score from different possible response shapes
  let label = sentiment?.label || sentiment?.sentiment || 'neutral';
  let score = sentiment?.score;
  if (Array.isArray(sentiment) && sentiment.length > 0) {
    label = sentiment[0]?.label || sentiment[0]?.sentiment || label;
    score = sentiment[0]?.score || score;
  }
  // Handle NLP Cloud scored_labels array
  if (sentiment?.scored_labels && Array.isArray(sentiment.scored_labels) && sentiment.scored_labels.length > 0) {
    label = sentiment.scored_labels[0].label || label;
    score = sentiment.scored_labels[0].score || score;
  }
  return {
    primaryEmotion: label,
    emotions: [
      { type: label, confidence: score ? score * 100 : 100 }
    ],
    transcription: text,
  };
};

export const recordAudio = async (seconds = 10): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: BlobPart[] = [];
        
        mediaRecorder.addEventListener('dataavailable', event => {
          audioChunks.push(event.data);
        });
        
        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          
          // Stop all audio streams
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
          
          resolve(audioBlob);
        });
        
        mediaRecorder.start();
        
        setTimeout(() => {
          mediaRecorder.stop();
        }, seconds * 1000);
      })
      .catch(error => {
        reject(error);
      });
  });
};