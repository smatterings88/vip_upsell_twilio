import { ClientToolImplementation } from 'ultravox-client';
import { nanoid } from 'nanoid';
import { addMinutes, format } from 'date-fns';

// Client-implemented tool for Order Details
export const updateOrderTool: ClientToolImplementation = (parameters) => {
  const { orderDetailsData } = parameters;
  
  try {
    console.debug("Raw order details data:", orderDetailsData);

    const orderItems = typeof orderDetailsData === 'string' 
      ? orderDetailsData 
      : JSON.stringify(orderDetailsData);

    console.debug("Processed order details data:", orderItems);

    if (typeof window !== "undefined") {
      const event = new CustomEvent("orderDetailsUpdated", {
        detail: orderItems
      });
      window.dispatchEvent(event);
    }

    return "Updated the order details.";
  } catch (error) {
    console.error("Error in updateOrderTool:", error);
    return "Failed to update order details.";
  }
};

// Client-implemented tool for generating discount codes
export const generateDiscountTool: ClientToolImplementation = (parameters) => {
  const { discountData } = parameters;
  
  try {
    const discountCode = `VIP-${nanoid(8)}`;
    const expirationTime = addMinutes(new Date(), 30);
    const formattedExpiration = format(expirationTime, 'h:mm a');
    
    const discountInfo = {
      code: discountCode,
      packageName: discountData.packageName,
      originalPrice: discountData.originalPrice,
      discountedPrice: discountData.originalPrice * 0.75, // 25% off
      expiresAt: formattedExpiration
    };

    if (typeof window !== "undefined") {
      const event = new CustomEvent("discountGenerated", {
        detail: JSON.stringify(discountInfo)
      });
      window.dispatchEvent(event);
    }

    return `Generated discount code ${discountCode} valid until ${formattedExpiration}`;
  } catch (error) {
    console.error("Error in generateDiscountTool:", error);
    return "Failed to generate discount code.";
  }
};