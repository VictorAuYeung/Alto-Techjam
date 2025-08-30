// Wallet Service - Handles credits, cash-out, and KYC for Alto MVP

export interface WalletBalance {
  nanas: number;
  pendingNanas: number;
  totalEarned: number;
  lastUpdated: number;
}

export interface CashOutRequest {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: number;
  processedAt?: number;
  reason?: string;
  paymentMethod: 'bank_transfer' | 'paypal' | 'gift_card';
  paymentDetails: {
    accountName?: string;
    accountNumber?: string;
    paypalEmail?: string;
    giftCardType?: string;
  };
}

export interface KYCStatus {
  isVerified: boolean;
  verificationLevel: 'none' | 'basic' | 'full';
  documentsSubmitted: string[];
  lastUpdated: number;
  nextReviewDate?: number;
}

export interface Transaction {
  id: string;
  type: 'nana' | 'debit' | 'cash_out' | 'refund';
  amount: number;
  description: string;
  timestamp: number;
  relatedVideoId?: string;
  ledgerEntryId?: string;
  cashOutRequestId?: string;
}

export interface BalanceHistoryPoint {
  nanas: number;
  timestamp: number;
}

// Simulated wallet data store
let walletData: WalletBalance = {
  nanas: 15.23,
  pendingNanas: 0,
  totalEarned: 15.23,
  lastUpdated: Date.now()
};

let cashOutRequests: CashOutRequest[] = [];
let transactions: Transaction[] = [
  {
    id: 'txn_001',
    type: 'nana',
    amount: 10.23,
    description: 'Video earnings: How to Make Perfect Coffee',
    timestamp: Date.now() - 86400000 * 1, // 1 days ago
    relatedVideoId: '1',
    ledgerEntryId: 'ledger_001'
  },
  {
    id: 'txn_001',
    type: 'nana',
    amount: 5.23,
    description: 'Video earnings: How to Make Perfect Coffee',
    timestamp: Date.now() - 86400000 * 30, // 30 days ago
    relatedVideoId: '1',
    ledgerEntryId: 'ledger_001'
  },
];

let kycStatus: KYCStatus = {
  isVerified: false,
  verificationLevel: 'none',
  documentsSubmitted: [],
  lastUpdated: Date.now()
};

// KYC threshold for cash-out
const KYC_THRESHOLD = 50.0; // $50 minimum for KYC requirement

// Get current wallet balance
export const getWalletBalance = async (): Promise<WalletBalance> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  return { ...walletData };
};

// Add nanas to wallet
export const addNanas = async (amount: number, videoId: string, ledgerEntryId: string): Promise<WalletBalance> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  
  // Update wallet
  walletData.nanas += amount;
  walletData.totalEarned += amount;
  walletData.lastUpdated = Date.now();
  
  // Record transaction
  const transaction: Transaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    type: 'nana',
    amount,
    description: `Video earnings: ${videoId}`,
    timestamp: Date.now(),
    relatedVideoId: videoId,
    ledgerEntryId
  };
  
  transactions.unshift(transaction);
  
  return { ...walletData };
};

// Request cash-out
export const requestCashOut = async (
  amount: number,
  paymentMethod: 'bank_transfer' | 'paypal' | 'gift_card',
  paymentDetails: any
): Promise<CashOutRequest> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Validate amount
  if (amount <= 0) {
    throw new Error('Invalid cash-out amount');
  }
  
  if (amount > walletData.nanas) {
    throw new Error('Insufficient nanas');
  }
  
  // Check KYC requirements
  if (amount >= KYC_THRESHOLD && !kycStatus.isVerified) {
    throw new Error(`KYC verification required for amounts over $${KYC_THRESHOLD}`);
  }
  
  // Create cash-out request
  const request: CashOutRequest = {
    id: `cashout_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    amount,
    status: 'pending',
    requestedAt: Date.now(),
    paymentMethod,
    paymentDetails
  };
  
  cashOutRequests.unshift(request);
  
  // Deduct from wallet immediately (pending)
  walletData.nanas -= amount;
  walletData.pendingNanas += amount;
  walletData.lastUpdated = Date.now();
  
  // Record transaction
  const transaction: Transaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    type: 'cash_out',
    amount: -amount,
    description: `Cash-out request: $${amount.toFixed(2)}`,
    timestamp: Date.now(),
    cashOutRequestId: request.id
  };
  
  transactions.unshift(transaction);
  
  return request;
};

// Get cash-out requests
export const getCashOutRequests = async (): Promise<CashOutRequest[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  return [...cashOutRequests];
};

// Get transaction history
export const getTransactionHistory = async (limit: number = 50): Promise<Transaction[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  return transactions.slice(0, limit);
};

// Get KYC status
export const getKYCStatus = async (): Promise<KYCStatus> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  return { ...kycStatus };
};

// Submit KYC documents
export const submitKYCDocuments = async (documents: string[]): Promise<KYCStatus> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Update KYC status
  kycStatus.documentsSubmitted = documents;
  kycStatus.verificationLevel = 'basic';
  kycStatus.lastUpdated = Date.now();
  kycStatus.nextReviewDate = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days from now
  
  // In a real implementation, this would trigger manual review
  // For demo, we'll auto-approve after a delay
  setTimeout(() => {
    kycStatus.isVerified = true;
    kycStatus.verificationLevel = 'full';
    kycStatus.lastUpdated = Date.now();
  }, 5000); // Auto-approve after 5 seconds for demo
  
  return { ...kycStatus };
};

// Simulate admin approval of cash-out requests
export const approveCashOutRequest = async (requestId: string): Promise<CashOutRequest> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  const request = cashOutRequests.find(r => r.id === requestId);
  if (!request) {
    throw new Error('Cash-out request not found');
  }
  
  if (request.status !== 'pending') {
    throw new Error('Request is not pending');
  }
  
  // Update request status
  request.status = 'approved';
  request.processedAt = Date.now();
  
  // Move from pending to completed
  walletData.pendingNanas -= request.amount;
  walletData.lastUpdated = Date.now();
  
  // Record completion transaction
  const transaction: Transaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    type: 'debit',
    amount: -request.amount,
    description: `Cash-out completed: $${request.amount.toFixed(2)}`,
    timestamp: Date.now(),
    cashOutRequestId: request.id
  };
  
  transactions.unshift(transaction);
  
  return request;
};

// Get cash-out eligibility
export const getCashOutEligibility = async (amount: number): Promise<{
  eligible: boolean;
  reason?: string;
  kycRequired: boolean;
  minAmount: number;
  maxAmount: number;
}> => {
  const minAmount = 5.0; // Minimum $5
  const maxAmount = walletData.nanas;
  
  if (amount < minAmount) {
    return {
      eligible: false,
      reason: `Minimum cash-out amount is $${minAmount}`,
      kycRequired: false,
      minAmount,
      maxAmount
    };
  }
  
  if (amount > maxAmount) {
    return {
      eligible: false,
      reason: 'Insufficient nanas',
      kycRequired: false,
      minAmount,
      maxAmount
    };
  }
  
  const kycRequired = amount >= KYC_THRESHOLD && !kycStatus.isVerified;
  
  return {
    eligible: !kycRequired,
    reason: kycRequired ? `KYC verification required for amounts over $${KYC_THRESHOLD}` : undefined,
    kycRequired,
    minAmount,
    maxAmount
  };
};

// Get earnings analytics
export const getEarningsAnalytics = async (): Promise<{
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  totalViews: number;
  avgQseScore: number;
}> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  
  // Calculate analytics from transactions
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;
  const oneMonth = 30 * oneDay;
  
  const todayTransactions = transactions.filter(t => 
    t.type === 'nana' && (now - t.timestamp) < oneDay
  );
  
  const weekTransactions = transactions.filter(t => 
    t.type === 'nana' && (now - t.timestamp) < oneWeek
  );
  
  const monthTransactions = transactions.filter(t => 
    t.type === 'nana' && (now - t.timestamp) < oneMonth
  );
  
  const todayEarnings = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
  const weekEarnings = weekTransactions.reduce((sum, t) => sum + t.amount, 0);
  const monthEarnings = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  return {
    todayEarnings: parseFloat(todayEarnings.toFixed(2)),
    weekEarnings: parseFloat(weekEarnings.toFixed(2)),
    monthEarnings: parseFloat(monthEarnings.toFixed(2)),
    totalViews: 36680, // Mock data
    avgQseScore: 87 // Mock data
  };
};

// Get balance history for charting
export const getBalanceHistory = async (days: number = 30): Promise<BalanceHistoryPoint[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

  // Create historical balance points from transactions
  const now = Date.now();
  const startTime = now - (days * 24 * 60 * 60 * 1000);

  // Filter transactions within the time range
  const relevantTransactions = transactions
    .filter(t => t.timestamp >= startTime)
    .sort((a, b) => a.timestamp - b.timestamp);

  // Start with initial balance (before the time range)
  let currentBalance = walletData.totalEarned - walletData.nanas - walletData.pendingNanas;
  const history: BalanceHistoryPoint[] = [];

  // Add starting point
  history.push({
    nanas: currentBalance,
    timestamp: startTime
  });

  // Add points for each transaction
  for (const transaction of relevantTransactions) {
    // Apply transaction amount to balance (negative for cash-outs/debits)
    currentBalance += transaction.amount;

    history.push({
      nanas: currentBalance,
      timestamp: transaction.timestamp
    });
  }

  // Add current balance point
  history.push({
    nanas: walletData.nanas,
    timestamp: now
  });

  return history;
};
