import { LucideIcon } from 'lucide-react';

export enum fileExtension {
  MP4 = 'application/mp4',
  DOCX = 'application/msword',
  PDF = 'application/pdf',
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
}

export enum fileType {
  INVOICE = 'INVOICE',
  NOTICE = 'NOTICE',
  OTHER = 'OTHER',
}

export enum uploadLocation {
}

export interface fileTypesProps {
  value: fileType;
  label: string;
  icon: LucideIcon;
}

export interface Folder {
  path: string;
  pathByIds: string;
  id: string;
  name: string;
  files: File[] | null;
  folders: Folder[] | null;
}

export interface File {
  id: string;
  name: string;
  fileType: fileType;
  fileExtension: fileExtension;
  size: number;
}
