import { patientDetailMock } from '../data/patient-detail.mock';

export async function getPatientDetail(patientId: string) {
  // simulate API latency
  await new Promise(res => setTimeout(res, 400));

  return patientDetailMock(patientId);
}

/*
🚀 Future:
export async function getPatientDetail(patientId: string) {
  const res = await fetch(`/api/patients/${patientId}`);
  return res.json();
}
*/
