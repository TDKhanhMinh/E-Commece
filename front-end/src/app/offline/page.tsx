"use client";

import React from "react";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
    return (
        <div 
            className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center"
            style={{
                display: 'flex',
                minHeight: '100vh',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fafafa',
                padding: '1rem',
                textAlign: 'center',
                fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
        >
            <div 
                style={{
                    marginBottom: '1.5rem',
                    borderRadius: '9999px',
                    backgroundColor: '#f3f4f6',
                    padding: '1.5rem',
                }}
            >
                <WifiOff style={{ width: '3rem', height: '3rem', color: '#6b7280' }} />
            </div>
            <h1 
                style={{
                    marginBottom: '0.5rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    letterSpacing: '-0.025em',
                    color: '#111827',
                }}
            >
                You&apos;re Offline
            </h1>
            <p 
                style={{
                    marginBottom: '2rem',
                    maxWidth: '28rem',
                    color: '#6b7280',
                }}
            >
                It looks like you&apos;re not connected to the internet. 
                Please check your connection and try again.
            </p>
            <button 
                onClick={() => window.location.reload()}
                style={{
                    width: '100%',
                    maxWidth: '200px',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#0a0a0a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                }}
            >
                Try Again
            </button>
        </div>
    );
}
