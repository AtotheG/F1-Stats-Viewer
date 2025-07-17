'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        F1 Insights
      </Link>
      <button className={styles.toggle} onClick={() => setOpen(!open)} aria-label="Toggle navigation">
        <Menu size={24} />
      </button>
      <ul className={`${styles.links} ${open ? styles.show : ''}`}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/drivers">Drivers</Link>
        </li>
        <li>
          <Link href="/constructors">Constructors</Link>
        </li>
        <li>
          <Link href="/compare">Compare</Link>
        </li>
      </ul>
    </nav>
  );
}
