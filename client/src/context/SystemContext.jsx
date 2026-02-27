const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const SystemContext = createContext(null);



export const SystemProvider = ({ children }) => {
    const [status, setStatus] = useState({
        maintenance_mode: false,
        frozen_modules: []
    });
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const [statusRes, settingsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/system/status`, config),
                axios.get(`${API_BASE_URL}/api/settings`)
            ]);
            setStatus(statusRes.data);
            setSettings(settingsRes.data);
        } catch (error) {
            console.error('Error fetching system status or settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        // Refresh every 30 seconds to stay updated
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const isModuleFrozen = (moduleId) => {
        return status.frozen_modules.includes(moduleId);
    };

    return (
        <SystemContext.Provider value={{ ...status, settings, loading, fetchStatus, isModuleFrozen }}>
            {children}
        </SystemContext.Provider>
    );
};

export const useSystemStatus = () => {
    const context = useContext(SystemContext);
    if (!context) {
        throw new Error('useSystemStatus must be used within a SystemProvider');
    }
    return context;
};
