'use client';

import React, { useState, useEffect } from 'react';
import { addMinutes, format, differenceInSeconds } from 'date-fns';

interface DiscountInfo {
  code: string;
  packageName: string;
  originalPrice: number;
  discountedPrice: number;
  expiresAt: string;
}

const DiscountOffer: React.FC = () => {
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const handleDiscount = (event: CustomEvent<string>) => {
      const info: DiscountInfo = JSON.parse(event.detail);
      setDiscountInfo(info);
    };

    const handleCallEnded = () => {
      setDiscountInfo(null);
      setTimeLeft('');
    };

    window.addEventListener('discountGenerated', handleDiscount as EventListener);
    window.addEventListener('callEnded', handleCallEnded as EventListener);

    return () => {
      window.removeEventListener('discountGenerated', handleDiscount as EventListener);
      window.removeEventListener('callEnded', handleCallEnded as EventListener);
    };
  }, []);

  useEffect(() => {
    if (discountInfo) {
      const timer = setInterval(() => {
        const expirationTime = new Date(discountInfo.expiresAt);
        const now = new Date();
        const diff = differenceInSeconds(expirationTime, now);
        
        if (diff <= 0) {
          setTimeLeft('Expired');
          clearInterval(timer);
        } else {
          const minutes = Math.floor(diff / 60);
          const seconds = diff % 60;
          setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [discountInfo]);

  if (!discountInfo) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg border border-purple-500">
      <h2 className="text-xl font-bold mb-2">Exclusive VIP Offer</h2>
      <div className="space-y-2">
        <p className="text-purple-200">Package: {discountInfo.packageName}</p>
        <p className="text-purple-200">
          Original Price: <span className="line-through">{formatCurrency(discountInfo.originalPrice)}</span>
        </p>
        <p className="text-2xl font-bold text-white">
          Special Price: {formatCurrency(discountInfo.discountedPrice)}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="bg-purple-800 px-3 py-1 rounded">
            <span className="font-mono text-white">Code: {discountInfo.code}</span>
          </div>
          <div className="text-right">
            <p className="text-purple-200 text-sm">Offer expires in:</p>
            <p className="font-mono text-xl text-white">{timeLeft}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountOffer;