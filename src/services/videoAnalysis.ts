// Enhanced Video Analysis Service - Complete scoring pipeline for Alto MVP

export type CreatorTier = 'small' | 'mid' | 'large';

export interface VideoAnalysisRequest {
  videoId: string;
  url: string;
  creatorId?: string;
  creatorTier?: CreatorTier;
  category?: string;
}

export interface VideoAnalysisResponse {
  videoId: string;
  url: string;
  title: string;
  thumbnail: string;
  duration?: number;
  
  // Raw metrics
  viewCount: string;
  likeCount: string;
  commentCount: string;
  shareCount: string;
  
  // Scoring breakdown
  impactScore: number;
  qualityScore: number;
  fairnessMultiplier: number;
  totalScore: number;
  
  // Final results
  qseScore: number; // Quality Score for Engagement (normalized)
  nanas: number;
  
  // Metadata
  category: string;
  creatorTier: string;
  analysisTimestamp: number;
  ledgerEntryId: string;
}

export interface LedgerEntry {
  id: string;
  videoId: string;
  creatorId: string;
  url: string;
  timestamp: number;
  scoreBreakdown: {
    impactScore: number;
    qualityScore: number;
    fairnessMultiplier: number;
    totalScore: number;
    qseScore: number;
  };
  nanas: number;
  category: string;
  creatorTier: string;
  metadata: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
    shareCount: string;
    title: string;
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
    /tiktok\.com\/t\/(\w+)/,
    /vt\.tiktok\.com\/(\w+)/
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(url);
    if (match) {
      return match[1];
    }
  }

  // Fallback: generate a random ID
  return Math.random().toString(36).substring(2, 15);
};

// Fetch engagement metrics (simulated)
const fetchEngagementMetrics = async (videoId: string): Promise<{
  viewCount: string;
  likeCount: string;
  commentCount: string;
  shareCount: string;
}> => {
  // Simulate API call to get engagement data
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  const baseViews = Math.floor(Math.random() * 1000000) + 1000;
  const viewCount = baseViews.toLocaleString();
  
  // Generate realistic engagement ratios
  const likeRate = Math.random() * 0.15 + 0.02; // 2-17%
  const commentRate = Math.random() * 0.05 + 0.005; // 0.5-5.5%
  const shareRate = Math.random() * 0.03 + 0.002; // 0.2-3.2%
  
  return {
    viewCount,
    likeCount: Math.floor(baseViews * likeRate).toLocaleString(),
    commentCount: Math.floor(baseViews * commentRate).toLocaleString(),
    shareCount: Math.floor(baseViews * shareRate).toLocaleString()
  };
};

// Calculate Impact Score from engagement metrics
const calculateImpactScore = (metrics: {
  viewCount: string;
  likeCount: string;
  commentCount: string;
  shareCount: string;
}): number => {
  const views = parseInt(metrics.viewCount.replace(/,/g, '')) || 0;
  const likes = parseInt(metrics.likeCount.replace(/,/g, '')) || 0;
  const comments = parseInt(metrics.commentCount.replace(/,/g, '')) || 0;
  const shares = parseInt(metrics.shareCount.replace(/,/g, '')) || 0;
  
  // Weighted engagement calculation
  const engagementRate = views > 0 ? (likes + comments * 2 + shares * 3) / views : 0;
  const viewScore = Math.min(100, Math.log10(views + 1) * 20); // Logarithmic scaling
  const engagementScore = Math.min(100, engagementRate * 1000);
  
  // Impact score: 60% views, 40% engagement
  return Math.round((viewScore * 0.6) + (engagementScore * 0.4));
};

// Simulate AI content quality analysis
const analyzeContentQuality = async (videoId: string, title: string): Promise<number> => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
  
  // Simulate various quality factors
  const thumbnailQuality = Math.random() * 0.3 + 0.7; // 70-100%
  const captionQuality = Math.random() * 0.4 + 0.6; // 60-100%
  const safetyScore = Math.random() * 0.2 + 0.8; // 80-100% (most content is safe)
  const contentRelevance = Math.random() * 0.3 + 0.7; // 70-100%
  
  // Weighted quality score
  const qualityScore = Math.round(
    (thumbnailQuality * 25) +
    (captionQuality * 25) +
    (safetyScore * 30) +
    (contentRelevance * 20)
  );
  
  return Math.min(100, Math.max(0, qualityScore));
};

// Calculate fairness multiplier based on creator tier and category
const calculateFairnessMultiplier = (
  creatorTier: CreatorTier = 'small',
  category: string = 'general'
): number => {
  // Tier multipliers (small creators get boost)
  const tierMultipliers = {
    small: 1.2,
    mid: 1.0,
    large: 0.8
  };
  
  // Category multipliers (some categories get boost)
  const categoryMultipliers: Record<string, number> = {
    'education': 1.1,
    'science': 1.1,
    'news': 1.05,
    'comedy': 0.95,
    'dance': 0.9,
    'general': 1.0
  };
  
  const tierMultiplier = tierMultipliers[creatorTier];
  const categoryMultiplier = categoryMultipliers[category.toLowerCase()] || 1.0;
  
  return tierMultiplier * categoryMultiplier;
};

// Convert total score to nanas using public formula
const calculateNanas = (totalScore: number, viewCount: string): number => {
  const views = parseInt(viewCount.replace(/,/g, '')) || 0;
  
  // Public formula: nanas = (totalScore / 100) * (views / 10000) * 0.1
  // This ensures fair distribution based on both quality and reach
  const baseNanas = (totalScore / 100) * (views / 10000) * 0.1;
  
  // Add small random variation for demo purposes
  const variation = 1 + (Math.random() - 0.5) * 0.2; // ±10%
  
  return Math.max(0.001, baseNanas * variation);
};

// Record ledger entry (simulated)
const recordLedgerEntry = async (entry: Omit<LedgerEntry, 'id'>): Promise<string> => {
  // Simulate database write
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  const ledgerId = `ledger_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  
  // In a real implementation, this would write to a Postgres table
  console.log('Ledger entry recorded:', { ...entry, id: ledgerId });
  
  return ledgerId;
};

// Main enhanced analysis function
export const analyzeVideo = async (request: VideoAnalysisRequest): Promise<VideoAnalysisResponse> => {
  try {
    const videoId = request.videoId || extractVideoIdFromUrl(request.url);
    const creatorId = request.creatorId || `creator_${Math.floor(Math.random() * 1000)}`;
    const creatorTier = request.creatorTier || 'small';
    const category = request.category || 'general';
    
    // Step 1: Fetch video metadata from TikTok
    const oembedData = await fetchTikTokOEmbed(request.url);
    
    // Step 2: Fetch engagement metrics
    const metrics = await fetchEngagementMetrics(videoId);
    
    // Step 3: Calculate Impact Score
    const impactScore = calculateImpactScore(metrics);
    
    // Step 4: Analyze content quality with AI
    const qualityScore = await analyzeContentQuality(videoId, oembedData.title);
    
    // Step 5: Calculate fairness multiplier
    const fairnessMultiplier = calculateFairnessMultiplier(creatorTier, category);
    
    // Step 6: Calculate total score
    const totalScore = Math.round((impactScore * 0.6) + (qualityScore * 0.4));
    
    // Step 7: Apply fairness normalization
    const normalizedScore = Math.min(100, totalScore * fairnessMultiplier);
    
    // Step 8: Calculate nanas
    const nanas = calculateNanas(normalizedScore, metrics.viewCount);
    
    // Step 9: Record ledger entry
    const ledgerEntry: Omit<LedgerEntry, 'id'> = {
      videoId,
      creatorId,
      url: request.url,
      timestamp: Date.now(),
      scoreBreakdown: {
        impactScore,
        qualityScore,
        fairnessMultiplier,
        totalScore,
        qseScore: normalizedScore
      },
      nanas,
      category,
      creatorTier,
      metadata: {
        viewCount: metrics.viewCount,
        likeCount: metrics.likeCount,
        commentCount: metrics.commentCount,
        shareCount: metrics.shareCount,
        title: oembedData.title
      }
    };
    
    const ledgerEntryId = await recordLedgerEntry(ledgerEntry);
    
    // Step 10: Return complete analysis
    return {
      videoId,
      url: request.url,
      title: oembedData.title,
      thumbnail: oembedData.thumbnail_url,
      ...metrics,
      impactScore,
      qualityScore,
      fairnessMultiplier,
      totalScore,
      qseScore: normalizedScore,
      nanas: parseFloat(nanas.toFixed(3)),
      category,
      creatorTier,
      analysisTimestamp: Date.now(),
      ledgerEntryId
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
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    }, 100); // Small delay to simulate API call
  });
};

// Additional utility functions for the dashboard
export const getCreatorTier = (followerCount: number): CreatorTier => {
  if (followerCount < 10000) return 'small';
  if (followerCount < 100000) return 'mid';
  return 'large';
};

export const getCategoryFromTitle = (title: string): string => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('tutorial') || titleLower.includes('how to') || titleLower.includes('learn')) return 'education';
  if (titleLower.includes('comedy') || titleLower.includes('funny') || titleLower.includes('joke')) return 'comedy';
  if (titleLower.includes('dance') || titleLower.includes('choreography')) return 'dance';
  if (titleLower.includes('news') || titleLower.includes('update') || titleLower.includes('breaking')) return 'news';
  if (titleLower.includes('science') || titleLower.includes('experiment') || titleLower.includes('research')) return 'science';
  
  return 'general';
};
