'use client';

import React, { useState, useEffect } from 'react';
import { OrderDetailsData, OrderItem } from '@/lib/types';

function prepOrderDetails(orderDetailsData: string): OrderDetailsData {
  try {
    console.debug("Raw order details data:", orderDetailsData);

    if (!orderDetailsData) {
      console.warn("No order details data provided");
      return { items: [], totalAmount: 0 };
    }

    let parsedItems: OrderItem[];
    try {
      parsedItems = typeof orderDetailsData === 'string' 
        ? JSON.parse(orderDetailsData)
        : orderDetailsData;
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return { items: [], totalAmount: 0 };
    }

    if (!Array.isArray(parsedItems)) {
      console.error("Parsed data is not an array:", parsedItems);
      return { items: [], totalAmount: 0 };
    }

    const validItems = parsedItems.filter(item => {
      return item && 
        typeof item === 'object' && 
        'name' in item && 
        'quantity' in item && 
        'price' in item;
    });

    const totalAmount = validItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const orderDetails: OrderDetailsData = {
      items: validItems,
      totalAmount: Number(totalAmount.toFixed(2))
    };

    console.debug("Processed order details:", orderDetails);
    return orderDetails;
  } catch (error) {
    console.error("Failed to process order details:", error);
    return { items: [], totalAmount: 0 };
  }
}

const OrderDetails: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetailsData>({
    items: [],
    totalAmount: 0
  });

  useEffect(() => {
    const handleOrderUpdate = (event: CustomEvent<string>) => {
      console.debug("Order update event received:", event.detail);
      const formattedData: OrderDetailsData = prepOrderDetails(event.detail);
      setOrderDetails(formattedData);
    };

    const handleCallEnded = () => {
      setOrderDetails({
        items: [],
        totalAmount: 0
      });
    };

    window.addEventListener('orderDetailsUpdated', handleOrderUpdate as EventListener);
    window.addEventListener('callEnded', handleCallEnded as EventListener);

    return () => {
      window.removeEventListener('orderDetailsUpdated', handleOrderUpdate as EventListener);
      window.removeEventListener('callEnded', handleCallEnded as EventListener);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatOrderItem = (item: OrderItem, index: number) => (
    <div key={index} className="mb-4 pl-4 border-l-2 border-gray-200">
      <div className="flex justify-between items-center">
        <span className="font-medium text-lg">{item.quantity}x {item.name}</span>
        <span className="text-gray-200 text-lg">{formatCurrency(item.price * item.quantity)}</span>
      </div>
      {item.specialInstructions && (
        <div className="text-sm text-gray-400 italic mt-2">
          Special Requirements: {item.specialInstructions}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-10">
      <h1 className="text-xl font-bold mb-4">VIP Package Details</h1>
      <div className="shadow-md rounded p-4">
        <div className="mb-4">
          <span className="text-gray-400 font-mono mb-2 block">Selected Packages & Add-ons:</span>
          {orderDetails.items.length > 0 ? (
            orderDetails.items.map((item, index) => formatOrderItem(item, index))
          ) : (
            <span className="text-gray-500 text-base font-mono">No packages selected</span>
          )}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-mono text-lg">Total Investment:</span>
            <span className="text-2xl font-bold">{formatCurrency(orderDetails.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;