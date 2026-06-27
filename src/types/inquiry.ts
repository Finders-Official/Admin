export interface Inquiry {
    id: number;
    userName: string;
    userId: string;
    category: string;
    content: string;
    status: string;
    createdAt: string;
    reply: string | null;
}