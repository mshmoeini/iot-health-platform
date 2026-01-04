import { UIAlert } from '../types/alerts.types';
import { ALERTS_MOCK } from '../data/alerts.mock';

export const alertsRepository = {
  async getAlerts(): Promise<UIAlert[]> {
    // mock fetch
    await new Promise((res) => setTimeout(res, 300));
    return ALERTS_MOCK;
  },

  async acknowledgeAlert(id: string): Promise<void> {
    // mock API call
    await new Promise((res) => setTimeout(res, 400));

    // real version later:
    // return fetch(`/api/alerts/${id}/acknowledge`, { method: 'POST' });
  },
};
