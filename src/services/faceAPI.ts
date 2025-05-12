import { Emotion } from '../types';

// This would be replaced with actual Face++ API integration
export const analyzeFacialExpression = async (imageData: string): Promise<{
  primaryEmotion: string;
  emotions: Emotion[];
}> => {
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response
  const emotions: Emotion[] = [
    { type: 'happy', confidence: Math.random() * 100 },
    { type: 'sad', confidence: Math.random() * 50 },
    { type: 'angry', confidence: Math.random() * 30 },
    { type: 'surprised', confidence: Math.random() * 20 },
    { type: 'neutral', confidence: Math.random() * 60 },
  ];
  
  // Sort emotions by confidence
  emotions.sort((a, b) => b.confidence - a.confidence);
  
  return {
    primaryEmotion: emotions[0].type,
    emotions,
  };
};

export const captureImage = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        video.play();
        
        video.onloadeddata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          setTimeout(() => {
            if (context) {
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
            
            // Stop all video streams
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            
            // Convert to base64
            const imageData = canvas.toDataURL('image/jpeg');
            resolve(imageData);
          }, 300);
        };
      })
      .catch(error => {
        reject(error);
      });
  });
};