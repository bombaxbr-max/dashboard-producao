import { useState, useEffect, useRef } from 'react';

export const useDashboardData = (url, interval = 15000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [isStale, setIsStale] = useState(false);

  const fetchData = async () => {
    try {
      // Cache busting with timestamp
      const cacheBustUrl = `${url}?t=${new Date().getTime()}`;
      const response = await fetch(cacheBustUrl);
      if (!response.ok) throw new Error('Falha ao carregar dados');
      
      const jsonData = await response.json();
      setData(jsonData);
      setLastFetch(new Date());
      setError(null);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, interval);
    return () => clearInterval(timer);
  }, [url, interval]);

  // Check for stale data (e.g., > 5 minutes without update)
  useEffect(() => {
    const checkStale = () => {
      if (!data?.lastUpdated) return;
      
      const lastUpdateDate = new Date(data.lastUpdated);
      const diffMinutes = (new Date() - lastUpdateDate) / (1000 * 60);
      
      setIsStale(diffMinutes > 10); // 10 minutes threshold
    };

    const staleTimer = setInterval(checkStale, 30000); // Check every 30s
    checkStale();
    
    return () => clearInterval(staleTimer);
  }, [data]);

  return { data, loading, error, lastFetch, isStale };
};
