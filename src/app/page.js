'use client';

import { useState } from 'react';
import TripForm from '@/components/TripForm';
import Map from '@/components/Map';
import CostEstimator from '@/components/CostEstimator';
import ChatAssistant from '@/components/ChatAssistant';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [tripData, setTripData] = useState(null);

  const handlePlanTrip = (data) => {
    console.log('Trip calculated:', data);
    setTripData(data);
  };

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', width: "100%", overflow: 'hidden' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'hsl(var(--primary))',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white'
          }}>
            <Sparkles size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Travana
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" style={{ background: 'hsl(var(--background) / 0.5)', border: '1px solid hsl(var(--border))', color: "white" }}>
            Login
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '350px 1fr 400px',
        gap: '1rem',
        flex: 1,
        minHeight: 0, // Important for nested scrolling
        padding: '0 1rem 1rem 1rem'
      }}>
        {/* Left Panel - Scrollable */}
        <div style={{ overflowY: 'auto', paddingRight: '0.5rem' }}>
          <div className="glass-card">
            <TripForm onPlanTrip={handlePlanTrip} />
          </div>

          {tripData && (
            <CostEstimator
              distance={tripData.distance}
              fuelCost={tripData.fuelCost}
              tollCost={tripData.tollCost}
              currency={tripData.currency}
            />
          )}
        </div>

        {/* Center Panel - Map */}
        <div style={{ height: '100%', minHeight: '400px' }}>
          <Map routeGeometry={tripData?.geometry} />
        </div>

        {/* Right Panel - Chat */}
        <div style={{ height: '100%' }}>
          <ChatAssistant />
        </div>
      </div>
    </main>
  );
}
