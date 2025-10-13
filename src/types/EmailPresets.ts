// Types for Email Presets Page

export interface EmailPreset {
  id: string;
  name: string;
  recipients: string[];
  subject: string;
  message: string;
  keywords: string[];
}

export interface EmailFile {
  id: string;
  name: string;
  size: number;
}

export interface EmailPresetSendRequest {
  presetIds: string[];
  fileIds: string[];
}

export interface EmailPresetWithFiles extends EmailPreset {
  matchedFiles: EmailFile[];
}
