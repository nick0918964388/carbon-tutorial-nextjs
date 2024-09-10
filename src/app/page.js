'use client';
import Link from 'next/link';
import { Button } from '@carbon/react';
import Image from 'next/image';
import styles from './page.module.css';
import LandingPage from './home/page';
import DataManage from './staticDataManage/page';

export default function Home() {
  return (
    <div>
      <LandingPage />
      
    </div>
  );
}
