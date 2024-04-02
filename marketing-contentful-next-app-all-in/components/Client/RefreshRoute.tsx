'use client';
import { useRouter } from 'next/navigation';

export default function Refresh() {
  const router = useRouter();
  router.refresh();
  return null;
}
