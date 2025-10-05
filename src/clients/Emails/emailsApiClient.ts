import api from '@/clients/index.ts';

import type { EmailSendData, EmailPresets } from '@/types/Emails.ts';

export const EmailsApiClient = {
  listInvoicePresets: async () => {
    let url = '/emails/invoice-presets';
    return (await api.get(url)).data;
  },

  sendEmails: async (emailsData: EmailSendData) => {
    return (await api.post('/emails', emailsData)).data;
  },

  savePresets: async (presets: EmailPresets) => {
    return (await api.post('/events/invoice-presets', presets)).data;
  },
};
