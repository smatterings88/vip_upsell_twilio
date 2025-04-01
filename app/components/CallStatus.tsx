import React, { ReactNode } from 'react';
import DiscountOffer from './DiscountOffer';

interface CallStatusProps {
  status: string;
  children?: ReactNode;
}

const CallStatus: React.FC<CallStatusProps> = ({ status, children }) => {
  return (
    <div className="flex flex-col bg-[#121212] border border-[#2A2A2A] rounded-r-[1px] p-4 w-full lg:w-1/3">
      <div className="mt-2">
        <h2 className="text-xl font-semibold mb-2">Call Status</h2>
        <p className="text-lg font-mono text-gray-400">Status: <span className="text-white text-base">{status}</span></p>
      </div>
      <DiscountOffer />
      {children}
    </div>
  );
};

export default CallStatus;