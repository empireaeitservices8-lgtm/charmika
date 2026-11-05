import { redirect } from 'next/navigation';

export default function ProductPageFallback() {
  redirect('/shop');
}
