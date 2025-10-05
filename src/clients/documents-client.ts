import api from '@/clients/index.ts';

export const getDocument = async (documentId: string) => {
  if (documentId.startsWith('/')) {
    return await api.get('/documents' + documentId);
  }
  return await api.get('/documents/' + documentId);
};

export const uploadFile = async (formData: FormData) => {
  return await api.post(`/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const revertFile = async (
  fileId: string,
  // userId: string,
  taskId: string
) => {
  return await api.delete(`/documents/${fileId}`, {
    params: {
      // userId,
      taskId,
    },
  });
};

export const listFiles = async (path?: string) => {
  if (path) {
    return await api.get(`/documents/file-manager-segment?path=${path}`);
  } else return await api.get('/documents/file-manager-root');
};
