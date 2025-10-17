import api from '.';

// Tipuri de entități care pot avea fișiere atașate
export type OwnerType = 
  | 'TENANT' 
  | 'BUILDING' 
  | 'ROOM' 
  | 'RENTAL_SPACE' 
  | 'EMAIL_DATA' 
  | 'BUILDING_LOCATION' 
  | 'FIRM' 
  | 'CAR' 
  | 'OTHER';

// DTO pentru fișier temporar
export interface TempUploadDto {
  tempId: string;
  batchId: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  modifiedAt?: string; // Data ultimei modificări a fișierului (File.lastModified)
}

// DTO pentru fișier permanent
export interface FileDto {
  id: string;
  ownerType: OwnerType;
  ownerId: number;
  filename: string;
  contentType: string;
  sizeBytes: number;
  checksum: string;
  downloadUrl: string;
  modifiedAt?: string; // Data ultimei modificări a fișierului (File.lastModified) - ISO format
  uploadedAt?: string; // Data la care fișierul a fost încărcat pe server - ISO format
}

// Parametri pentru commit
export interface CommitFilesParams {
  ownerType: OwnerType;
  ownerId: number;
  tempIds: string[];
  overwrite?: boolean;
}

/**
 * Upload fișiere în zona temporară
 * @param files - Array de File objects
 * @param batchId - Optional UUID pentru grupare
 * @returns Array de TempUploadDto
 */
export async function uploadTempFiles(
  files: File[],
  batchId?: string
): Promise<TempUploadDto[]> {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('files', file);
    
    // Trimite data ultimei modificări a fișierului (File.lastModified)
    // Browser-ul nu oferă acces la data reală de creare din motive de securitate
    // File.lastModified este în milliseconds, convertim la ISO string
    const modifiedAt = new Date(file.lastModified).toISOString();
    formData.append('modifiedAt', modifiedAt);
  });
  
  if (batchId) {
    formData.append('batchId', batchId);
  }

  const response = await api.post<TempUploadDto[]>(
    '/files/temp',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}

/**
 * Commit fișiere temporare și asociază-le cu o entitate
 * @param params - CommitFilesParams
 * @returns Array de FileDto
 */
export async function commitFiles(
  params: CommitFilesParams
): Promise<FileDto[]> {
  const searchParams = new URLSearchParams();
  searchParams.append('ownerType', params.ownerType);
  searchParams.append('ownerId', params.ownerId.toString());
  
  params.tempIds.forEach(tempId => {
    searchParams.append('tempIds', tempId);
  });
  
  if (params.overwrite !== undefined) {
    searchParams.append('overwrite', params.overwrite.toString());
  }

  const response = await api.post<FileDto[]>(
    `/files/commit?${searchParams.toString()}`
  );

  return response.data;
}

/**
 * Listează toate fișierele asociate cu o entitate
 * @param ownerType - Tipul entității
 * @param ownerId - ID-ul entității
 * @returns Array de FileDto
 */
export async function listFiles(
  ownerType: OwnerType,
  ownerId: number
): Promise<FileDto[]> {
  const response = await api.get<FileDto[]>(
    '/files',
    {
      params: {
        ownerType,
        ownerId,
      },
    }
  );

  return response.data;
}

/**
 * Descarcă un fișier după ID
 * @param fileId - UUID-ul fișierului
 * @returns Blob
 */
export async function downloadFile(fileId: string): Promise<Blob> {
  const response = await api.get(
    `/files/${fileId}`,
    {
      responseType: 'blob',
    }
  );

  return response.data;
}

/**
 * Descarcă mai multe fișiere ca arhivă ZIP
 * @param fileIds - Array de UUID-uri de fișiere
 * @returns Blob (ZIP archive)
 */
export async function downloadFilesAsZip(fileIds: string[]): Promise<Blob> {
  const response = await api.post(
    '/files/download-zip',
    { fileIds },
    {
      responseType: 'blob',
    }
  );

  return response.data;
}

/**
 * Helper pentru a declanșa descărcarea unui fișier în browser
 * @param fileId - UUID-ul fișierului
 * @param filename - Numele fișierului
 */
export async function triggerFileDownload(
  fileId: string,
  filename: string
): Promise<void> {
  const blob = await downloadFile(fileId);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * Helper pentru a declanșa descărcarea unui ZIP cu mai multe fișiere
 * @param fileIds - Array de UUID-uri de fișiere
 * @param zipFilename - Numele arhivei ZIP (default: "files.zip")
 */
export async function triggerZipDownload(
  fileIds: string[],
  zipFilename: string = 'files.zip'
): Promise<void> {
  const blob = await downloadFilesAsZip(fileIds);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * Formatează dimensiunea fișierului în format citibil
 * @param bytes - Dimensiunea în bytes
 * @returns String formatat (ex: "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
