'use client';

import { DollarSign, Fuel, Ticket, Coins } from 'lucide-react';

export default function CostEstimator({ distance = 0, fuelCost = 0, tollCost = 0, currency = { code: 'AUD', symbol: '$' } }) {
    const totalCost = fuelCost + tollCost;

    return (
        <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Estimated Cost</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '400', background: 'hsl(var(--primary) / 0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem', color: 'hsl(var(--primary))' }}>
                    {currency.code}
                </span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--foreground) / 0.7)' }}>
                        <Fuel size={16} />
                        <span>Fuel ({distance} km)</span>
                    </div>
                    <span style={{ fontWeight: '500' }}>{currency.symbol}{fuelCost}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--foreground) / 0.7)' }}>
                        <Ticket size={16} />
                        <span>Tolls</span>
                    </div>
                    <span style={{ fontWeight: '500' }}>{currency.symbol}{tollCost}</span>
                </div>

                <div style={{ height: '1px', background: 'hsl(var(--border))', margin: '0.25rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', fontWeight: '700', color: 'hsl(var(--primary))' }}>
                    <span>Total</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>{currency.symbol}</span>
                        <span>{totalCost}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
