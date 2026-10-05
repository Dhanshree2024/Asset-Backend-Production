type UserPasswordResetEmailProps = {
    name: string;
    companyName: string;
    companyLogo?: string;
    mailReply: string;
    resetPasswordUrl: string;
};
export declare function UserPasswordResetEmail({ name, companyName, companyLogo, mailReply, resetPasswordUrl, }: UserPasswordResetEmailProps): import("react/jsx-runtime").JSX.Element;
export {};
