
import api from '.';
import type { EmailPreset, EmailFile, EmailPresetSendRequest } from '@/types/EmailPresets';

export const getEmailPresets = async (): Promise<EmailPreset[]> => {
	return (await api.get('/email-presets')).data;
};

export const createEmailPreset = async (preset: Partial<EmailPreset>): Promise<EmailPreset> => {
	return (await api.post('/email-presets', preset)).data;
};

export const updateEmailPreset = async (preset: EmailPreset): Promise<EmailPreset> => {
	return (await api.put(`/email-presets/${preset.id}`, preset)).data;
};

export const uploadEmailPresetFile = async (file: File): Promise<EmailFile> => {
	const formData = new FormData();
	formData.append('file', file);
	return (await api.post('/email-presets/files', formData)).data;
};

export const sendEmailPresets = async (data: EmailPresetSendRequest): Promise<any> => {
	return (await api.post('/email-presets/send', data)).data;
};

export const getEmailPresetFiles = async (): Promise<EmailFile[]> => {
	return (await api.get('/email-presets/files')).data;
};

export const deleteEmailPresetFile = async (fileId: string): Promise<void> => {
	await api.delete(`/email-presets/files/${fileId}`);
};

