// Video Analysis Service - Simulates backend API for TikTok video analysis

export interface VideoAnalysisRequest {
  videoId: string;
  url: string;
}

export interface VideoAnalysisResponse {
  qseScore: number;
  credits: number;
  viewCount: string;
  title?: string;
  thumbnail?: string;
  duration?: number;
  engagement?: {
    likes: string;
    comments: string;
    shares: string;
  };
}

// Simulate TikTok oEmbed API call
const fetchTikTokOEmbed = async (url: string): Promise<any> => {
  try {
    // In a real implementation, this would call TikTok's oEmbed API
    // https://www.tiktok.com/oembed?url={url}
    
    // For demo purposes, we'll simulate the response
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000)); // Simulate network delay
    
    const videoId = extractVideoIdFromUrl(url);
    
    return {
      title: `TikTok Video ${videoId}`,
      thumbnail_url: `https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/${videoId}/image.jpg`,
      author_name: `@user_${Math.floor(Math.random() * 1000)}`,
      provider_name: 'TikTok'
    };
  } catch (error) {
    console.error('Error fetching TikTok oEmbed:', error);
    throw new Error('Failed to fetch video metadata');
  }
};

// Extract video ID from various TikTok URL formats
const extractVideoIdFromUrl = (url: string): string => {
  const patterns = [
    /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
    /vm\.tiktok\.com\/(\w+)/,
    /tiktok\.com\/t\/(\w+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  // Fallback: generate a random ID
  return Math.random().toString(36).substring(2, 15);
};

// Simulate video analysis and scoring
const analyzeVideoContent = async (videoId: string, url: string): Promise<VideoAnalysisResponse> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
  
  // Generate realistic analysis data
  const baseViews = Math.floor(Math.random() * 1000000) + 1000;
  const viewCount = baseViews.toLocaleString();
  
  // QSE Score calculation (Quality Score for Engagement)
  // Factors: view duration, engagement rate, content quality, etc.
  const engagementRate = Math.random() * 0.15 + 0.05; // 5-20%
  const watchTime = Math.random() * 0.8 + 0.2; // 20-100%
  const contentQuality = Math.random() * 0.3 + 0.7; // 70-100%
  
  const qseScore = Math.floor(
    (engagementRate * 30) + 
    (watchTime * 40) + 
    (contentQuality * 30)
  );
  
  // Credits calculation based on QSE score and views
  const baseCredits = (baseViews / 1000) * (qseScore / 100) * 0.1;
  const credits = Math.max(0.001, baseCredits + (Math.random() - 0.5) * 2);
  
  return {
    qseScore: Math.min(100, Math.max(0, qseScore)),
    credits: parseFloat(credits.toFixed(3)),
    viewCount,
    engagement: {
      likes: Math.floor(baseViews * (Math.random() * 0.1 + 0.02)).toLocaleString(),
      comments: Math.floor(baseViews * (Math.random() * 0.05 + 0.005)).toLocaleString(),
      shares: Math.floor(baseViews * (Math.random() * 0.03 + 0.002)).toLocaleString()
    }
  };
};

// Main API function
export const analyzeVideo = async (request: VideoAnalysisRequest): Promise<VideoAnalysisResponse> => {
  try {
    // Step 1: Fetch video metadata from TikTok
    const oembedData = await fetchTikTokOEmbed(request.url);
    
    // Step 2: Analyze video content and generate scores
    const analysisData = await analyzeVideoContent(request.videoId, request.url);
    
    // Step 3: Return combined results
    return {
      ...analysisData,
      title: oembedData.title,
      thumbnail: oembedData.thumbnail_url
    };
  } catch (error) {
    console.error('Video analysis failed:', error);
    throw new Error('Video analysis failed. Please try again.');
  }
};

// Mock API endpoint for frontend testing
export const mockAnalyzeVideoAPI = async (request: VideoAnalysisRequest): Promise<VideoAnalysisResponse> => {
  // Simulate API endpoint
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const result = await analyzeVideo(request);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, 100); // Small delay to simulate API call
  });
};
