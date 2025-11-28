'use client';

import { useState } from 'react';
import TripForm from '@/components/TripForm';
import Map from '@/components/Map';
import CostEstimator from '@/components/CostEstimator';
import ChatAssistant from '@/components/ChatAssistant';
import { Sparkles, MessageCircle, X, ChevronUp, ChevronDown } from 'lucide-react';

export default function Home() {
  const [tripData, setTripData] = useState(null);
  const [activeTab, setActiveTab] = useState('map');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handlePlanTrip = (data) => {
    console.log('Trip calculated:', data);
    setTripData(data);
    // Open drawer on mobile after planning
    if (window.innerWidth < 768) {
      setIsDrawerOpen(true);
    }
  };

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', width: "100%", overflow: 'hidden' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', position: 'relative', zIndex: 10 }}>
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
          <button className="btn desktop-only" style={{ background: 'hsl(var(--background) / 0.5)', border: '1px solid hsl(var(--border))', color: "white" }}>
            Login
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="content-grid" style={{
        display: 'grid',
        gridTemplateColumns: '350px 1fr 400px',
        gap: '1rem',
        flex: 1,
        minHeight: 0,
        padding: '0 1rem 1rem 1rem',
        position: 'relative'
      }}>
        {/* Left Panel - Desktop */}
        <div className="panel-left desktop-only" style={{ overflowY: 'auto', paddingRight: '0.5rem' }}>
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
        <div className="panel-center" style={{ height: '100%', minHeight: '400px' }}>
          <Map routeGeometry={tripData?.geometry} />
        </div>

        {/* Right Panel - Desktop Chat */}
        <div className="panel-right desktop-only" style={{ height: '100%' }}>
          <ChatAssistant />
        </div>

        {/* Mobile: Bottom Drawer for Trip Planning */}
        <div className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`}>
          <div className="drawer-handle" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            {isDrawerOpen ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
              {tripData ? 'Trip Details' : 'Plan Your Trip'}
            </span>
          </div>
          <div className="drawer-content">
            <TripForm onPlanTrip={handlePlanTrip} />
            {tripData && (
              <CostEstimator
                distance={tripData.distance}
                fuelCost={tripData.fuelCost}
                tollCost={tripData.tollCost}
                currency={tripData.currency}
              />
            )}
          </div>
        </div>

        {/* Mobile: Floating Chat Button */}
        <button
          className="mobile-chat-button"
          onClick={() => setIsChatOpen(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '1rem',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'hsl(var(--primary))',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            zIndex: 100
          }}
        >
          <MessageCircle size={24} />
        </button>

        {/* Mobile: Chat Popup */}
        {isChatOpen && (
          <div className="mobile-chat-popup">
            <div className="chat-popup-header">
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Trip Assistant</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  color: 'hsl(var(--foreground))'
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ChatAssistant />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .desktop-only {
          display: block;
        }

        .mobile-drawer,
        .mobile-chat-button,
        .mobile-chat-popup {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }

          header {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
          }
          
          .content-grid {
            grid-template-columns: 1fr !important;
            padding: 0 !important;
            position: relative;
          }
          
          .panel-center {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            min-height: 100%;
          }

          /* Bottom Drawer */
          .mobile-drawer {
            display: block;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: hsl(var(--background));
            border-top-left-radius: 1rem;
            border-top-right-radius: 1rem;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
            transform: translateY(calc(100% - 60px));
            z-index: 50;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
          }

          .mobile-drawer.open {
            transform: translateY(0);
          }

          .drawer-handle {
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            cursor: pointer;
            border-bottom: 1px solid hsl(var(--border));
          }

          .drawer-content {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
          }

          /* Floating Chat Button */
          .mobile-chat-button {
            display: flex !important;
          }

          /* Chat Popup */
          .mobile-chat-popup {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: hsl(var(--background));
            z-index: 200;
          }

          .chat-popup-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
            border-bottom: 1px solid hsl(var(--border));
          }
        }
      `}</style>
    </main>
  );
}
