import { useState, useEffect } from 'react';
import { Drug } from '@/types/drug';
import { loadDrugDatabase } from '@/lib/drugDatabase';

export function useDrugDatabase() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const drugData = await loadDrugDatabase();
        setDrugs(drugData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load drug database');
        setDrugs([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { drugs, loading, error, reload: () => loadDrugDatabase() };
}