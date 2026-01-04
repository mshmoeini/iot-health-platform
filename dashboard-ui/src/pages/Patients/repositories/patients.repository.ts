import type { Patient } from '../types/patient.types';
import { PATIENTS_MOCK } from '../data/patients.mock';

/* -----------------------------
   DTOs (future-proof)
------------------------------ */
export interface GetPatientsParams {
  search?: string;
  status?: 'All' | 'Normal' | 'Warning' | 'Critical';
  sort?: 'az' | 'za';
}

export async function getPatients(
  params?: GetPatientsParams
): Promise<Patient[]> {
  // ⏳ simulate API latency
  await new Promise(res => setTimeout(res, 400));

  let data = [...PATIENTS_MOCK];

  /* -------- search -------- */
  if (params?.search) {
    const q = params.search.toLowerCase();
    data = data.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.deviceId.toLowerCase().includes(q)
    );
  }

  /* -------- status filter -------- */
  if (params?.status && params.status !== 'All') {
    data = data.filter(p => p.healthStatus === params.status);
  }

  /* -------- sort -------- */
  if (params?.sort === 'az') {
    data.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (params?.sort === 'za') {
    data.sort((a, b) => b.name.localeCompare(a.name));
  }

  return data;
}

/* -----------------------------
   Single patient (list → detail)
------------------------------ */
export async function getPatientById(
  patientId: string
): Promise<Patient | undefined> {
  await new Promise(res => setTimeout(res, 200));
  return PATIENTS_MOCK.find(p => p.id === patientId);
}
