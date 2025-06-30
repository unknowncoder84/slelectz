import React, { useContext, useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const CREDIT_TIERS = [
  { amount: 10, price: 2000 },
  { amount: 30, price: 5000 },
  { amount: 65, price: 10000 },
];

const Credits: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<number | null>(null);

  useEffect(() => {
    fetchBalance();
  }, [user]);

  const fetchBalance = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('employer_credits')
      .select('credits_balance')
      .eq('employer_id', user.id)
      .single();
    if (error) {
      setBalance(0);
      setLoading(false);
      return;
    }
    setBalance(data?.credits_balance ?? 0);
    setLoading(false);
  };

  const handlePurchase = async (amount: number, price: number) => {
    setPurchasing(amount);
    // Placeholder: Call edge function to purchase credits (simulate success)
    setTimeout(() => {
      toast.success(`Purchased ${amount} credits for ₹${price}`);
      setPurchasing(null);
      fetchBalance();
    }, 1200);
    // Example for real integration:
    // const { error } = await supabase.rpc('purchase_credits', { employer_id: user.id, amount_paid: price, credits_purchased: amount });
    // if (error) toast.error(error.message);
    // else { toast.success(...); fetchBalance(); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <h1 className="text-3xl font-bold mb-8 text-emerald-700">Employer Credits</h1>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <div className="mb-8 w-full text-center">
          <span className="text-lg text-gray-700 font-medium">Current Credit Balance</span>
          <div className="text-4xl font-bold text-emerald-600 mt-2">{loading ? '...' : balance}</div>
        </div>
        <div className="w-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Buy Credits</h2>
          <div className="space-y-4">
            {CREDIT_TIERS.map(tier => (
              <div key={tier.amount} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <span className="text-lg font-medium text-gray-900">{tier.amount} credits</span>
                  <span className="ml-2 text-gray-500">₹{tier.price}</span>
                </div>
                <button
                  className="px-6 py-2 bg-emerald-600 text-white rounded-full font-semibold shadow hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-60"
                  disabled={purchasing === tier.amount}
                  onClick={() => handlePurchase(tier.amount, tier.price)}
                >
                  {purchasing === tier.amount ? 'Processing...' : 'Buy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits; 