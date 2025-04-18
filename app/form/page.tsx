'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from "next/head";

export default function Form() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedData = localStorage.getItem('userFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    const storedCode = localStorage.getItem('referralCode');
    if (storedCode) {
      setReferralCode(storedCode);
      console.log('Referral code retrieved:', storedCode);
    }
  }, []);
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    localStorage.setItem('userFormData', JSON.stringify(formData));

    // GrowSurf API request
    try {
      const res = await fetch('https://api.growsurf.com/v2/campaign/10inlw/participant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer XX4BK2VTBSMYMBQWGBDY6KHFV1TG`, // Replace with your actual API key
        },
        body: JSON.stringify({
          campaignId: '10inlw', // Replace with your actual campaign ID
          email: formData.email,
          firstName: formData.name,
          referredBy: referralCode || null,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to register with GrowSurf');
      }

      alert('GrowSurf registration successful');
    } catch (error) {
      alert(error);
    }

    alert('Form data saved!');
    router.push('/dashboard');
  };

  return (
    <>
  
   

    <div className='flex items-center justify-center h-screen'>
      <div className='max-w-md w-full p-6 border rounded shadow-lg'>
        <h2 className='text-xl font-bold mb-4 text-center'>User Form</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Enter your name'
            className='p-2 border rounded'
            required
          />
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Enter your email'
            className='p-2 border rounded'
            required
          />
          <button type='submit' className='bg-blue-500 text-white p-2 rounded'>
           Sign Up
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
