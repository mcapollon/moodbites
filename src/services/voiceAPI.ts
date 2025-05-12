import { Emotion } from '../types';

// This would be replaced with actual Vokaturi API integration
export const analyzeVoice = async (audioData: Blob): Promise<{
  primaryEmotion: string;
  emotions: Emotion[];
}> => {
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response
  const emotions: Emotion[] = [
    { type: 'happy', confidence: Math.random() * 80 },
    { type: 'sad', confidence: Math.random() * 40 },
    { type: 'angry', confidence: Math.random() * 20 },
    { type: 'neutral', confidence: Math.random() * 70 },
    { type: 'fear', confidence: Math.random() * 15 },
  ];
  
  // Sort emotions by confidence
  emotions.sort((a, b) => b.confidence - a.confidence);
  
  return {
    primaryEmotion: emotions[0].type,
    emotions,
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