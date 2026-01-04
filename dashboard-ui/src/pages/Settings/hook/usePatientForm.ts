import { useEffect, useState } from 'react';
import type { SettingsPatient } from '../types/settings.types';

interface UsePatientFormProps {
  mode: 'create' | 'edit';
  initialData: SettingsPatient | null;
  onSave: (patient: SettingsPatient) => void;
  onClose: () => void;
}

export function usePatientForm({
  mode,
  initialData,
  onSave,
  onClose,
}: UsePatientFormProps) {
  const [form, setForm] = useState<SettingsPatient>({
    id: '',
    name: '',
    patientId: '',
    phone: '',
    assignedDevice: null, // ✅ فقط رابطه
    // ❌ status اینجا نیست
  });

  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  /* ---------- Init / Prefill ---------- */
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      // ✅ status از backend میاد → 그대로
      setForm(initialData);
    }

    if (mode === 'create') {
      setForm({
        id: crypto.randomUUID(),
        name: '',
        patientId: `PT-${Math.floor(100 + Math.random() * 900)}`,
        phone: '',
        assignedDevice: null,
        // ❌ status set نمی‌شود
      });
    }
  }, [mode, initialData]);

  /* ---------- Helpers ---------- */
  function setField<K extends keyof SettingsPatient>(
    key: K,
    value: SettingsPatient[K]
  ) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    if (!validate()) return;

    console.log('📤 Patient payload to be sent:', {
      ...form,
      timestamp: new Date().toISOString(),
    });

    onSave(form); // backend status را برمی‌گرداند
    onClose();
  }

  return { form, errors, setField, submit };
}
