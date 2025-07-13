import { useState, useEffect } from 'react';
import { mockMails } from '../data/mockMails.js';
import io from 'socket.io-client';

// Custom hook để load dữ liệu mail từ API server
export const useMailData = () => {
  const [mails, setMails] = useState([]); // Bắt đầu với array rỗng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedFromFiles, setLoadedFromFiles] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [socket, setSocket] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Đang tải dữ liệu mail từ C:\\classifyMail\\...');

      // Load dữ liệu từ API server
      const response = await fetch('http://localhost:3001/api/mails');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const loadedMails = await response.json();

      if (loadedMails && loadedMails.length > 0) {
        setMails(loadedMails);
        setLoadedFromFiles(true);
        console.log(`✅ Đã load ${loadedMails.length} mail từ C:\\classifyMail\\`);
      } else {
        // Fallback nếu không có file nào
        console.log('⚠️ Không tìm thấy file JSON, sử dụng fallback data');
        setMails(mockMails);
        setLoadedFromFiles(false);
      }
    } catch (err) {
      console.error('❌ Lỗi khi tải dữ liệu mail từ server, sử dụng fallback data:', err);
      setError(err.message);
      setMails(mockMails);
      setLoadedFromFiles(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Setup WebSocket connection for real-time updates
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Listen for mail stats updates
    newSocket.on('mailStatsUpdate', (stats) => {
      console.log('📡 Received mail stats update:', stats);
      // Reload mails when stats change
      loadData();
    });

    // Listen for new mails detected
    newSocket.on('newMailsDetected', (data) => {
      console.log('🆕 New mails detected:', data);
      // Reload mails when new mails are detected
      loadData();
    });

    // Listen for mail moved events
    newSocket.on('mailMoved', (data) => {
      console.log('📧 Mail moved:', data);
      // Reload mails when mail is moved
      loadData();
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [reloadTrigger]);

  // Listen for reload events (only manual reload)
  useEffect(() => {
    const handleReload = (event) => {
      // Only reload if it's a manual reload
      if (event.detail && event.detail.manual) {
        console.log('🔄 Received manual reload signal - refreshing mail data');
        setReloadTrigger(prev => prev + 1);
      } else {
        console.log('🔄 Ignoring automatic reload signal');
      }
    };

    window.addEventListener('mailDataReload', handleReload);

    return () => {
      window.removeEventListener('mailDataReload', handleReload);
    };
  }, []);

  return {
    mails,
    loading,
    error,
    loadedFromFiles,
    totalFiles: mails.length
  };
};

// Hook để load một file mail cụ thể
export const useMailFile = (filePath) => {
  const [mailData, setMailData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!filePath) return;

    const loadFile = async () => {
      setLoading(true);
      setError(null);

      try {
        const module = await import(filePath);
        setMailData(module.default);
        console.log('✅ Loaded mail file:', filePath);
      } catch (err) {
        console.error('❌ Error loading mail file:', filePath, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [filePath]);

  return { mailData, loading, error };
};
