import api from '@/clients/index.ts';

import type { EmailPreset } from '@/types/EmailPresets.ts';

export const EmailsApiClient = {
  listInvoicePresets: async () => {
    let url = '/emails/invoice-presets';
    return (await api.get(url)).data;
  },

  sendEmails: async (emailsData: EmailPreset[]) => {
    return (await api.post('/emails', emailsData)).data;
  },

  savePresets: async (presets: EmailPreset[]) => {
    return (await api.post('/events/invoice-presets', presets)).data;
  },
};
