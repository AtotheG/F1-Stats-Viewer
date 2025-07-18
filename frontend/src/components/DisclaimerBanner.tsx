'use client';
import { useState } from 'react';
import styles from './DisclaimerBanner.module.css';

export default function DisclaimerBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className={styles.banner}>
      <span>Unofficial; data © Formula One World Championship Ltd. Used under fair-use / personal-study terms.</span>
      <button className={styles.dismissBtn} onClick={() => setVisible(false)}>
        Dismiss
      </button>
    </div>
  );
}
