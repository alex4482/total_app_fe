export interface EmailSendData {
    name: string;
    addresses: string[];
    message: string;
    title: string;
    // attachments: File[] | null;
}

export interface EmailPresets {
    address: string;
    fileKeyword: string;
}
