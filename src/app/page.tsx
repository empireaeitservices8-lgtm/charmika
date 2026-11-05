import React from 'react';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { BestSellersSection } from '@/components/home/BestSellersSection';
import { RentalSpotlight } from '@/components/home/RentalSpotlight';
import { ComboOffersSection } from '@/components/home/ComboOffersSection';
import { CustomerReviews } from '@/components/home/CustomerReviews';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <CategoryGrid />
      <BestSellersSection />
      <RentalSpotlight />
      <ComboOffersSection />
      <CustomerReviews />
    </>
  );
}
