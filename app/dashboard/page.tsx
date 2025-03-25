'use client';

import { useState, useEffect } from 'react';

type UserData = {
  name: string;
  email: string;
};

type ParticipantData = {
  id: string;
  email: string;
  firstName: string;
  totalReferrals: number;
};

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [participantData, setParticipantData] =
    useState<ParticipantData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('userFormData');
      if (savedData) {
        const parsedData: UserData = JSON.parse(savedData);
        setUserData(parsedData);
        getUserDetails(parsedData.email);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const getUserDetails = async (userEmail: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.growsurf.com/v2/campaign/10inlw/participant/${userEmail}`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer XX4BK2VTBSMYMBQWGBDY6KHFV1TG',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.statusText}`);
      }

      const data = await response.json();
      setParticipantData(data);
    } catch (error) {
      console.error('GrowSurf Error:', error);
      setError('Failed to fetch participant data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : (
        <>
          {userData && (
            <div className='p-4 border rounded shadow-md mb-4'>
              <p>
                <strong>Name:</strong> {userData.name}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
            </div>
          )}

          {participantData ? (
            <div className='p-4 border rounded shadow-md'>
              <h2 className='text-lg font-semibold mb-2'>
                GrowSurf Participant Details
              </h2>
              <p>
                <strong>ID:</strong> {participantData.id}
              </p>
              <p>
                <strong>Email:</strong> {participantData.email}
              </p>
              <p>
                <strong>Total Referrals:</strong>{' '}
                {participantData.totalReferrals}
              </p>
            </div>
          ) : (
            <p>No participant data found.</p>
          )}
        </>
      )}
    </div>
  );
}
