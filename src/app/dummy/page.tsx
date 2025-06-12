'use client';

import NiubizPaymentForm from "@/components/NiubizPaymentForm";

export default function Home() { 

  return <NiubizPaymentForm amount={100} merchantId="110777209" purchaseNumber="123" onPaymentSuccess={() => {}} onPaymentError={() => {}} />
}