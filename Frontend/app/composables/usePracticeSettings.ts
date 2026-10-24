import { useState } from '#imports';

export interface PracticeSettings {
  operations: string[];
  operationWeights: Record<string, number>;
  minValue: number;
  maxValue: number;
  allowNegative: boolean;
  operands: number;
  speed: number;
  timerType: 'per_operand' | 'whole_expression';
  questionCount: number;
  soundEffects: boolean;
  dictationMode: boolean;
  reducePulse: boolean;
}

const DEFAULT_SETTINGS: PracticeSettings = {
  operations: ['addition', 'subtraction'],
  operationWeights: { addition: 5, subtraction: 5, multiplication: 5, division: 5 },
  minValue: 1,
  maxValue: 100,
  allowNegative: false,
  operands: 3,
  speed: 2.5,
  timerType: 'per_operand',
  questionCount: 10,
  soundEffects: true,
  dictationMode: false,
  reducePulse: false,
};

export const usePracticeSettings = () => {
  const isSyncing = useState<boolean>('practice_settings_syncing', () => false);
  const syncError = useState<string | null>('practice_settings_sync_error', () => null);

  const settings = useState<PracticeSettings>('practice_settings', () => {
    // In client side, try reading cached settings from localStorage
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem('anzan_practice_settings');
        if (saved) {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.error('Failed to load settings from localStorage', e);
      }
    }
    return { ...DEFAULT_SETTINGS };
  });

  const saveSettingsToDb = async (customSettings?: PracticeSettings) => {
    if (!import.meta.client) return;
    const token = localStorage.getItem('anzan_token') || sessionStorage.getItem('anzan_token');
    if (!token) return;

    try {
      isSyncing.value = true;
      syncError.value = null;
      const config = useRuntimeConfig();
      const apiBase = config.public?.apiBase || 'http://localhost:3001';
      await $fetch(`${apiBase}/api/users/settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: {
          settings: customSettings || settings.value,
        },
      });
    } catch (err: any) {
      console.warn('Failed to sync settings to cloud database:', err?.message || err);
      syncError.value = err?.message || 'Sync failed';
    } finally {
      isSyncing.value = false;
    }
  };

  const loadSettingsFromDb = async () => {
    if (!import.meta.client) return;
    const token = localStorage.getItem('anzan_token') || sessionStorage.getItem('anzan_token');
    if (!token) return;

    try {
      isSyncing.value = true;
      const config = useRuntimeConfig();
      const apiBase = config.public?.apiBase || 'http://localhost:3001';
      const res = await $fetch<{ success: boolean; settings: PracticeSettings }>(
        `${apiBase}/api/users/settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res?.settings) {
        settings.value = { ...DEFAULT_SETTINGS, ...res.settings };
        localStorage.setItem('anzan_practice_settings', JSON.stringify(settings.value));
      }
    } catch (err) {
      console.warn('Could not fetch cloud settings:', err);
    } finally {
      isSyncing.value = false;
    }
  };

  const saveSettings = (newSettings?: Partial<PracticeSettings>) => {
    if (newSettings) {
      settings.value = { ...settings.value, ...newSettings };
    }
    if (import.meta.client) {
      try {
        localStorage.setItem('anzan_practice_settings', JSON.stringify(settings.value));
      } catch (e) {
        console.error('Failed to persist settings locally', e);
      }
    }
    // Debounced or direct cloud sync
    saveSettingsToDb();
  };

  const toggleOperation = (op: string) => {
    const current = [...settings.value.operations];
    const index = current.indexOf(op);
    if (index > -1) {
      // Prevent unchecking if it's the last selected operation
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      current.push(op);
    }
    settings.value.operations = current;
    saveSettings();
  };

   const incrementOperands = (amount = 1) => {
      settings.value.operands = Math.min(100, (Number(settings.value.operands) || 2) + amount);
      saveSettings();
   };

   const decrementOperands = (amount = 1) => {
      settings.value.operands = Math.max(2, (Number(settings.value.operands) || 2) - amount);
      saveSettings();
   };

   const incrementQuestions = (amount = 1) => {
      settings.value.questionCount = Math.min(100, (Number(settings.value.questionCount) || 10) + amount);
      saveSettings();
   };

   const decrementQuestions = (amount = 1) => {
      settings.value.questionCount = Math.max(1, (Number(settings.value.questionCount) || 10) - amount);
      saveSettings();
   };

  return {
    settings,
    isSyncing,
    syncError,
    saveSettings,
    saveSettingsToDb,
    loadSettingsFromDb,
    toggleOperation,
    incrementOperands,
    decrementOperands,
    incrementQuestions,
    decrementQuestions,
  };
};

