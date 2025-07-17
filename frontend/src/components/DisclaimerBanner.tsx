'use client';
import { useState } from 'react';

export default function DisclaimerBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="bg-red-900 text-white p-2 text-center text-sm">
      <span>Unofficial; data © Formula One World Championship Ltd. Used under fair-use / personal-study terms.</span>
      <button className="ml-4 underline" onClick={() => setVisible(false)}>
        Dismiss
      </button>
    </div>
  );
}
