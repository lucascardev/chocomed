import React from 'react';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import ProductDetailsClient from '@/components/ProductDetailsClient';

interface IProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    await connectDB();
    const product = await Product.findOne({ slug });
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch (err) {
    console.error('Error fetching product in details page:', err);
    return null;
  }
}

export default async function ProductDetailPage({ params }: IProductPageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container" style={{ minHeight: '60vh' }}>
      <ProductDetailsClient product={product} />
    </div>
  );
}
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
