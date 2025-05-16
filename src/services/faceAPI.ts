import { Emotion } from '../types';

// Replace with your actual Face++ API credentials
const FACEPP_API_KEY = '8nzOXTRzwNzumGGF2m2I0iu19jEH99it';
const FACEPP_API_SECRET = 'NyblZehyZ6InTnJAOPSMOKBSonSVN200';
const FACEPP_API_URL = 'https://api-us.faceplusplus.com/facepp/v3/detect';

export const analyzeFacialExpression = async (imageData: string): Promise<{
  primaryEmotion: string;
  emotions: Emotion[];
}> => {
  // Remove the data URL prefix to get the base64 string
  const base64Data = imageData.replace(/^data:image\/(png|jpeg);base64,/, '');

  const formData = new FormData();
  formData.append('api_key', FACEPP_API_KEY);
  formData.append('api_secret', FACEPP_API_SECRET);
  formData.append('image_base64', base64Data);
  formData.append('return_attributes', 'emotion');

  const response = await fetch(FACEPP_API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Face++ API request failed');
  }

  const data = await response.json();
  if (!data.faces || !data.faces[0] || !data.faces[0].attributes || !data.faces[0].attributes.emotion) {
    throw new Error('No face or emotion data detected');
  }

  const emotionData = data.faces[0].attributes.emotion;
  // Map Face++ emotions to your Emotion type
  const emotions: Emotion[] = Object.entries(emotionData).map(([type, confidence]) => ({
    type,
    confidence: Number(confidence),
  }));
  // Sort by confidence
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