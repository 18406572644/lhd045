import { useState, useEffect, useCallback } from 'react';
import type { Experiment, ExperimentRecord, MockApiResponse } from '../types';
import { experiments, getExperimentById } from '../data/experiments';

const STORAGE_KEYS = {
  RECORDS: 'lab_records',
  FAVORITES: 'lab_favorites',
  SETTINGS: 'lab_settings'
};

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  async getExperiments(): Promise<MockApiResponse<Experiment[]>> {
    await delay(500 + Math.random() * 500);
    return { success: true, data: experiments };
  },

  async getExperiment(id: string): Promise<MockApiResponse<Experiment>> {
    await delay(300 + Math.random() * 300);
    const experiment = getExperimentById(id);
    if (experiment) {
      return { success: true, data: experiment };
    }
    return { success: false, error: '实验不存在' };
  },

  async getRecords(): Promise<MockApiResponse<ExperimentRecord[]>> {
    await delay(400 + Math.random() * 400);
    const stored = localStorage.getItem(STORAGE_KEYS.RECORDS);
    const records: ExperimentRecord[] = stored ? JSON.parse(stored) : [];
    return { success: true, data: records };
  },

  async saveRecord(record: Omit<ExperimentRecord, 'id'>): Promise<MockApiResponse<ExperimentRecord>> {
    await delay(500 + Math.random() * 500);
    const newRecord: ExperimentRecord = {
      ...record,
      id: `record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    const stored = localStorage.getItem(STORAGE_KEYS.RECORDS);
    const records: ExperimentRecord[] = stored ? JSON.parse(stored) : [];
    records.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    return { success: true, data: newRecord };
  },

  async updateRecord(id: string, updates: Partial<ExperimentRecord>): Promise<MockApiResponse<ExperimentRecord>> {
    await delay(300 + Math.random() * 300);
    const stored = localStorage.getItem(STORAGE_KEYS.RECORDS);
    const records: ExperimentRecord[] = stored ? JSON.parse(stored) : [];
    const index = records.findIndex(r => r.id === id);
    if (index === -1) {
      return { success: false, error: '记录不存在' };
    }
    records[index] = { ...records[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    return { success: true, data: records[index] };
  },

  async deleteRecord(id: string): Promise<MockApiResponse<boolean>> {
    await delay(300 + Math.random() * 300);
    const stored = localStorage.getItem(STORAGE_KEYS.RECORDS);
    let records: ExperimentRecord[] = stored ? JSON.parse(stored) : [];
    records = records.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    return { success: true, data: true };
  },

  async getFavorites(): Promise<MockApiResponse<string[]>> {
    await delay(200 + Math.random() * 200);
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    const favorites: string[] = stored ? JSON.parse(stored) : [];
    return { success: true, data: favorites };
  },

  async toggleFavorite(experimentId: string): Promise<MockApiResponse<string[]>> {
    await delay(200 + Math.random() * 200);
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    let favorites: string[] = stored ? JSON.parse(stored) : [];
    if (favorites.includes(experimentId)) {
      favorites = favorites.filter(id => id !== experimentId);
    } else {
      favorites.push(experimentId);
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return { success: true, data: favorites };
  },

  async exportRecords(): Promise<MockApiResponse<string>> {
    await delay(500);
    const stored = localStorage.getItem(STORAGE_KEYS.RECORDS);
    const data = {
      exportedAt: new Date().toISOString(),
      records: stored ? JSON.parse(stored) : []
    };
    return { success: true, data: JSON.stringify(data, null, 2) };
  },

  async importRecords(jsonData: string): Promise<MockApiResponse<number>> {
    await delay(500);
    try {
      const data = JSON.parse(jsonData);
      if (!data.records || !Array.isArray(data.records)) {
        return { success: false, error: '无效的数据格式' };
      }
      const stored = localStorage.getItem(STORAGE_KEYS.RECORDS);
      const existing: ExperimentRecord[] = stored ? JSON.parse(stored) : [];
      const newRecords = [...data.records, ...existing];
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(newRecords));
      return { success: true, data: data.records.length };
    } catch {
      return { success: false, error: 'JSON解析失败' };
    }
  },

  async clearAllData(): Promise<MockApiResponse<boolean>> {
    await delay(300);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    return { success: true, data: true };
  }
};

export const useMockApi = <T>(
  apiCall: () => Promise<MockApiResponse<T>>,
  deps: unknown[] = []
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      if (response.success) {
        setData(response.data as T);
      } else {
        setError(response.error || '请求失败');
      }
    } catch (e) {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { loading, error, data, refetch: execute };
};
