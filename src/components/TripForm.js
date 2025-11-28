'use client';

import { useState } from 'react';
import { MapPin, Navigation, Calendar, Search } from 'lucide-react';
import styles from './TripForm.module.css';

const TRIP_TYPES = [
    { id: 'romantic', label: 'Romantic' },
    { id: 'adventurous', label: 'Adventurous' },
    { id: 'chill', label: 'Chill' },
    { id: 'scenic', label: 'Scenic' },
    { id: 'budget', label: 'Budget' },
];

export default function TripForm({ onPlanTrip }) {
    const [start, setStart] = useState('');
    const [destination, setDestination] = useState('');
    const [tripType, setTripType] = useState('scenic');

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/trip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ start, destination, tripType }),
            });

            const data = await response.json();

            if (response.ok && onPlanTrip) {
                onPlanTrip(data);
            } else {
                alert(data.error || 'Failed to plan trip');
            }
        } catch (error) {
            console.error('Error planning trip:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.inputGroup}>
                <label className={styles.label}>Start Location</label>
                <div className={styles.inputWrapper}>
                    <MapPin className={styles.icon} size={18} />
                    <input
                        type="text"
                        placeholder="e.g. Sydney"
                        className={styles.input}
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Destination</label>
                <div className={styles.inputWrapper}>
                    <Navigation className={styles.icon} size={18} />
                    <input
                        type="text"
                        placeholder="e.g. Melbourne"
                        className={styles.input}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Trip Vibe</label>
                <div className={styles.tripTypes}>
                    {TRIP_TYPES.map((type) => (
                        <button
                            key={type.id}
                            type="button"
                            className={`${styles.typeBtn} ${tripType === type.id ? styles.active : ''}`}
                            onClick={() => setTripType(type.id)}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                className={`btn btn-primary ${styles.submitBtn}`}
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.7 : 1 }}
            >
                {isLoading ? (
                    <span>Calculating...</span>
                ) : (
                    <>
                        <Search size={18} style={{ marginRight: '0.5rem' }} />
                        Plan My Trip
                    </>
                )}
            </button>
        </form>
    );
}
