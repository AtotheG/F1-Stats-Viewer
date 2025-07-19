'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        F1 Insights
      </Link>
      <Button variant="ghost" size="icon" className={styles.toggle} onClick={() => setOpen(!open)} aria-label="Toggle navigation">
        <Menu size={24} />
      </Button>
      <ul className={`${styles.links} ${open ? styles.show : ''}`}>
        <li>
          <Link href="/" className={pathname === '/' ? styles.active : undefined}>Home</Link>
        </li>
        <li>
          <Link href="/drivers" className={pathname.startsWith('/drivers') ? styles.active : undefined}>Drivers</Link>
        </li>
        <li>
          <Link href="/constructors" className={pathname.startsWith('/constructors') ? styles.active : undefined}>Constructors</Link>
        </li>
        <li>
          <Link href="/compare" className={pathname.startsWith('/compare') ? styles.active : undefined}>Compare</Link>
        </li>
      </ul>
    </nav>
  );
}
