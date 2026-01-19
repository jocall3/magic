import React, { useState, useMemo } from 'react';

// --- TYPE DEFINITION (for clarity) ---
interface Charge {
  id: string;
  object: "charge";
  amount: number; // in cents
  amount_refunded: number; // in cents
  currency: string;
  description: string | null;
  status: "succeeded" | "pending" | "failed";
  refunded: boolean;
  payment_intent: string;
}

// --- MOCK DATA (self-contained) ---
// This data now lives inside the component file, removing the need for DataContext.
const MOCK_CHARGES: Charge[] = [
  {
    id: "ch_3PFr1bLkdIwHu7ix1lA2n6n4",
    object: "charge",
    amount: 10000, // $100.00
    amount_refunded: 0,
    currency: "usd",
    description: "Monthly Subscription",
    status: "succeeded",
    refunded: false,
    payment_intent: "pi_1"
  },
  {
    id: "ch_3PFr2cLkdIwHu7ix2mB3o7o5",
    object: "charge",
    amount: 2550, // $25.50
    amount_refunded: 550, // $5.50 already refunded
    currency: "usd",
    description: "E-book Purchase",
    status: "succeeded",
    refunded: false,
    payment_intent: "pi_2"
  },
  {
    id: "ch_3PFr3dLkdIwHu7ix3nC4p8p6",
    object: "charge",
    amount: 50000,
    amount_refunded: 50000,
    currency: "usd",
    description: "Consulting Fee (Fully Refunded)",
    status: "succeeded",
    refunded: true, // This one won't appear in the list
    payment_intent: "pi_3"
  },
  {
    id: "ch_3PFr4eLkdIwHu7ix4oD5q9q7",
    object: "charge",
    amount: 1200,
    amount_refunded: 0,
    currency: "usd",
    description: "Coffee and croissant",
    status: "pending", // This one won't appear
    refunded: false,
    payment_intent: "pi_4"
  },
];

// --- STYLING (optional, but makes it look clean) ---
const styles = `
  .refund-form-container { 
    background-color: #1a1a1a; 
    color: #f0f0f0; 
    border: 1px solid #333; 
    border-radius: 8px; 
    padding: 24px; 
    max-width: 500px; 
    margin: 20px auto; 
    font-family: sans-serif;
  }
  .refund-form-title { 
    font-size: 1.5rem; 
    font-weight: bold; 
    margin-bottom: 24px; 
  }
  .form-group { 
    margin-bottom: 20px; 
  }
  .form-group label { 
    display: block; 
    margin-bottom: 8px; 
    font-weight: 500;
    font-size: 0.9rem;
  }
  .form-group input, .form-group select { 
    width: 100%; 
    padding: 10px; 
    border-radius: 4px; 
    border: 1px solid #444; 
    background-color: #2a2a2a; 
    color: #f0f0f0;
    box-sizing: border-box; /* Important for padding */
  }
  .form-group input:disabled {
    background-color: #222;
    cursor: not-allowed;
  }
  .form-description {
    font-size: 0.8rem;
    color: #888;
    margin-top: 8px;
  }
  .form-error {
    font-size: 0.8rem;
    color: #ff6b6b;
    margin-top: 8px;
  }
  .submit-button {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .submit-button:hover {
    background-color: #0056b3;
  }
  .response-box {
    margin-top: 24px;
    background-color: #222;
    border: 1px solid #444;
    border-radius: 4px;
    padding: 16px;
  }
  .response-box h3 {
    margin-top: 0;
  }
  .response-box pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: monospace;
    font-size: 0.85rem;
    color: #aaeebb;
  }
`;

// --- HELPER FUNCTIONS ---
const generateId = (length = 14) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const formatCurrency = (amountInCents, currency) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amountInCents / 100);
}


const RefundForm = () => {
  // State for form fields, replacing react-hook-form
  const [chargeId, setChargeId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<{ chargeId?: string, amount?: string }>({});

  // State for API response simulation
  const [createdRefund, setCreatedRefund] = useState<object | null>(null);
  
  // Derived state: Calculate refundable charges from our mock data
  const refundableCharges = useMemo(() => {
    return MOCK_CHARGES.filter(
      (c) => c.status === "succeeded" && !c.refunded && c.amount > c.amount_refunded
    );
  }, []); // This only needs to run once as our mock data is static

  // Derived state: Find the currently selected charge object
  const selectedCharge = useMemo(() => {
    return refundableCharges.find(c => c.id === chargeId) || null;
  }, [chargeId, refundableCharges]);

  const handleChargeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newChargeId = e.target.value;
    setChargeId(newChargeId);

    // When a charge is selected, automatically fill the amount field
    const newSelectedCharge = refundableCharges.find(c => c.id === newChargeId);
    if (newSelectedCharge) {
      const maxRefundable = (newSelectedCharge.amount - newSelectedCharge.amount_refunded) / 100;
      setAmount(maxRefundable.toFixed(2));
    } else {
      setAmount('');
    }
    // Clear errors when changing selection
    setErrors({});
    setCreatedRefund(null);
  };
  
  const validateForm = () => {
    const newErrors: { chargeId?: string, amount?: string } = {};

    if (!selectedCharge) {
      newErrors.chargeId = "Please select a charge to refund.";
    }

    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount)) {
      newErrors.amount = "Please enter a valid refund amount.";
    } else if (numericAmount <= 0) {
      newErrors.amount = "Amount must be a positive number.";
    } else if (selectedCharge) {
        const maxRefundableCents = selectedCharge.amount - selectedCharge.amount_refunded;
        if (numericAmount * 100 > maxRefundableCents) {
            newErrors.amount = `Amount cannot exceed the refundable balance of ${formatCurrency(maxRefundableCents, selectedCharge.currency)}.`;
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreatedRefund(null);

    const isValid = validateForm();
    if (!isValid || !selectedCharge) {
      return;
    }
    
    // Simulate API call and response
    const refundAmountInCents = Math.round(parseFloat(amount) * 100);
    const newRefund = {
        id: `re_${generateId()}`,
        object: "refund",
        amount: refundAmountInCents,
        charge: selectedCharge.id,
        created: Math.floor(Date.now() / 1000),
        currency: selectedCharge.currency,
        reason: reason || null,
        status: "succeeded",
    };
    
    setCreatedRefund(newRefund);
    window.alert(`Mock refund of ${formatCurrency(refundAmountInCents, selectedCharge.currency)} created successfully!`);
  };

  const getRefundableAmountText = () => {
    if (!selectedCharge) return "";
    const refundableCents = selectedCharge.amount - selectedCharge.amount_refunded;
    return `Max refundable: ${formatCurrency(refundableCents, selectedCharge.currency)}`;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="refund-form-container">
        <h2 className="refund-form-title">Create a Refund</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="chargeId">Charge to Refund</label>
            <select id="chargeId" value={chargeId} onChange={handleChargeChange}>
              <option value="" disabled>Select a charge...</option>
              {refundableCharges.map(charge => (
                <option key={charge.id} value={charge.id}>
                  {charge.id} ({formatCurrency(charge.amount, charge.currency)} - {charge.description})
                </option>
              ))}
            </select>
            {errors.chargeId && <p className="form-error">{errors.chargeId}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input 
              type="number"
              id="amount"
              step="0.01"
              placeholder="e.g., 20.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!selectedCharge}
            />
            {selectedCharge && <p className="form-description">{getRefundableAmountText()}</p>}
            {errors.amount && <p className="form-error">{errors.amount}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason (Optional)</label>
            <select id="reason" value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">Select a reason...</option>
              <option value="duplicate">Duplicate</option>
              <option value="fraudulent">Fraudulent</option>
              <option value="requested_by_customer">Requested by customer</option>
            </select>
          </div>
          
          <button type="submit" className="submit-button">Create Refund</button>

        </form>
        
        {createdRefund && (
          <div className="response-box">
            <h3>Mock API Response</h3>
            <pre>{JSON.stringify(createdRefund, null, 2)}</pre>
          </div>
        )}
      </div>
    </>
  );
};

export default RefundForm;
