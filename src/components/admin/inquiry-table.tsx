'use client';

interface Inquiry {
    id: number;
    userName: string;
    userId: string;
    category: string;
    content: string;
    status: string;
    createdAt: string;
    reply: string | null;
}

interface InquiryTableProps {
    inquiries: Inquiry[];
    selectedId: number;
    onSelect: (inquiry: Inquiry) => void;
}

export function InquiryTable({ inquiries, selectedId, onSelect }: InquiryTableProps) {
    return (
        <div className="w-1/2 bg-[#1E1E1E] border border-[#2C2C2C] rounded-lg overflow-y-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#242424] text-xs uppercase text-gray-400 sticky top-0">
                    <tr>
                        <th className="p-4 font-medium">상태</th>
                        <th className="p-4 font-medium">유형</th>
                        <th className="p-4 font-medium">작성자</th>
                        <th className="p-4 font-medium">작성일</th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y divide-[#2C2C2C]">
                    {inquiries.map((inquiry) => (
                        <tr
                            key={inquiry.id}
                            onClick={() => onSelect(inquiry)}
                            className={`cursor-pointer hover:bg-[#2A2A2A] transition-colors ${selectedId === inquiry.id ? "bg-[#2A2A2A]" : ""
                                }`}
                        >
                            <td className="p-4">
                                <span
                                    className={`px-2 py-1 text-xs rounded-md ${inquiry.status === "대기중"
                                            ? "bg-red-900/30 text-red-400"
                                            : "bg-green-900/30 text-green-400"
                                        }`}
                                >
                                    {inquiry.status}
                                </span>
                            </td>
                            <td className="p-4 text-gray-300">{inquiry.category}</td>
                            <td className="p-4 text-gray-300">{inquiry.userName}</td>
                            <td className="p-4 text-gray-500">{inquiry.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}