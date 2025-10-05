import { EmailsApiClient } from './emailsApiClient';
import { EmailsQueryKeys } from './query.keys';

export const getEmailPresets = () => {
  return {
    queryKey: EmailsQueryKeys.emailsGetInvoicePresets(),
    queryFn: () => EmailsApiClient.listInvoicePresets(),
  };
};

