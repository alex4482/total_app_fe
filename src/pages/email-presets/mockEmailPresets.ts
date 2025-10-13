import { EmailPreset } from '@/types/EmailPresets';

export const mockEmailPresets: EmailPreset[] = [
  {
    id: 'preset1',
    name: 'Facturi lunare',
    recipients: ['contabilitate@firma.ro', 'manager@firma.ro'],
    subject: 'Factura lunii {luna}',
    message: 'Bună ziua,\nVă transmitem factura pentru luna {luna}.\nVă rugăm să confirmați primirea.\nMulțumim!',
    keywords: ['factura', 'luna', 'invoice'],
  },
  {
    id: 'preset2',
    name: 'Notificare restanță',
    recipients: ['client1@email.com'],
    subject: 'Notificare restanță plată',
    message: 'Stimate client,\nAveți o restanță la plata facturii. Vă rugăm să achitați cât mai curând.\nMulțumim!',
    keywords: ['restanta', 'notificare', 'plata'],
  },
  {
    id: 'preset3',
    name: 'Transmitere contract',
    recipients: ['juridic@firma.ro', 'client2@email.com'],
    subject: 'Contract de colaborare',
    message: 'Bună ziua,\nAtașat găsiți contractul de colaborare.\nAșteptăm semnarea și returnarea documentului.\nToate cele bune!',
    keywords: ['contract', 'colaborare', 'semnare'],
  },
];
