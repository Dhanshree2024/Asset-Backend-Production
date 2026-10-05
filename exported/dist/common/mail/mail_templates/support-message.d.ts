interface SupportMessageEmailProps {
    name: string;
    email: string;
    subject: string;
    message: string;
    companyName?: string;
    mailReply?: string;
}
export declare const SupportMessageEmail: ({ name, email, subject, message, companyName, mailReply, }: SupportMessageEmailProps) => import("react/jsx-runtime").JSX.Element;
export {};
