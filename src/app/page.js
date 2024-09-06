'use client';
import Link from 'next/link';
import { Button } from '@carbon/react';
import Image from 'next/image';
import styles from './page.module.css';
import LandingPage from './home/page';

export default function Home() {
  return (
    <div>
      <LandingPage />
      <Link href="/newPage">
        <Button>Go to New Page</Button>
      </Link>
    </div>
  );
}
