"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportTicketEmail = SupportTicketEmail;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
function SupportTicketEmail({ name, email, subject, category, priority, description, companyName, companyLogo, mailReply, attachments, }) {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsx)(components_1.Head, {}), (0, jsx_runtime_1.jsxs)(components_1.Preview, { children: ["New Support Ticket \u2013 ", subject] }), (0, jsx_runtime_1.jsx)(components_1.Body, { style: styles.body, children: (0, jsx_runtime_1.jsx)(components_1.Container, { style: styles.outerContainer, children: (0, jsx_runtime_1.jsxs)(components_1.Container, { style: styles.container, children: [(0, jsx_runtime_1.jsxs)(components_1.Section, { style: { ...styles.header, paddingBottom: '20px' }, children: [companyLogo && ((0, jsx_runtime_1.jsx)(components_1.Img, { src: companyLogo, alt: `${companyName} Logo`, style: { width: '150px', height: 'auto', marginBottom: '10px' } })), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: { fontSize: '20px', fontWeight: 600, marginBottom: '5px' }, children: [companyName, " Support"] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: { fontSize: '14px', color: '#555' }, children: ["A new support request has been submitted via the ", companyName, " Support Portal."] }), (0, jsx_runtime_1.jsx)(components_1.Hr, { style: { borderColor: '#e0e0e0', margin: '15px 0' } })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: { backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '20px' }, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: { fontWeight: 600, marginBottom: '10px' }, children: "Ticket Information" }), (0, jsx_runtime_1.jsxs)(components_1.Text, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Requester Name:" }), " ", name] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Requester Email:" }), " ", email] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Subject:" }), " ", subject] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Category:" }), " ", category] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Priority:" }), " ", priority.toUpperCase()] })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: { marginBottom: '20px' }, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: { fontWeight: 600, marginBottom: '5px' }, children: "Issue Description" }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: { lineHeight: 1.5, color: '#333' }, children: ["The requester has provided the following details regarding the issue:", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("br", {}), description] })] }), attachments && attachments.length > 0 && ((0, jsx_runtime_1.jsxs)(components_1.Section, { style: { marginBottom: '20px' }, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: { fontWeight: 600, marginBottom: '5px' }, children: "Attachments" }), attachments.map((filePath, idx) => {
                                        const normalizedPath = filePath.replace(/\\/g, "/");
                                        const fileName = normalizedPath.split("/").pop();
                                        const friendlyName = fileName?.replace(/^attachment-\d+-/, "") || fileName;
                                        return ((0, jsx_runtime_1.jsx)(components_1.Text, { children: (0, jsx_runtime_1.jsx)("a", { href: `${process.env.NEXT_PUBLIC_ASSET_API_URL}/${normalizedPath}`, target: "_blank", rel: "noopener noreferrer", style: { color: '#1a73e8' }, children: friendlyName }) }, idx));
                                    })] })), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: { fontSize: '13px', color: '#555', borderTop: '1px solid #eee', paddingTop: '15px' }, children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { style: { marginBottom: '5px' }, children: ["Please address this ticket promptly. You may contact the requester directly at ", (0, jsx_runtime_1.jsx)("a", { href: `mailto:${email}`, style: { color: '#1a73e8' }, children: email }), "."] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: { marginBottom: '5px' }, children: ["This ticket was submitted via the ", companyName, " Support Portal."] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["For internal queries or assistance, contact the support team at ", (0, jsx_runtime_1.jsx)("a", { href: `mailto:${mailReply}`, style: { color: '#1a73e8' }, children: mailReply }), "."] })] })] }) }) })] }));
}
const getPriorityStyle = (priority) => {
    switch (priority) {
        case "urgent":
            return { color: "#dc2626", fontWeight: "bold" };
        case "high":
            return { color: "#ea580c", fontWeight: "bold" };
        case "medium":
            return { color: "#ca8a04", fontWeight: "bold" };
        default:
            return { color: "#16a34a", fontWeight: "bold" };
    }
};
const styles = {
    body: {
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
    },
    outerContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "40px 0",
    },
    container: {
        maxWidth: "650px",
        backgroundColor: "#ffffff",
        padding: "40px 20px",
        borderRadius: "10px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    },
    header: { textAlign: "center", paddingBottom: "15px" },
    logo: { width: "120px", marginBottom: "10px" },
    companyName: { fontSize: "22px", fontWeight: "bold", color: "#333" },
    divider: { borderTop: "1px solid #ddd", margin: "15px 0" },
    section: { textAlign: "center", padding: "10px 0" },
    title: { fontSize: "20px", fontWeight: "bold", color: "#111" },
    subText: { fontSize: "14px", color: "#555" },
    detailsBox: {
        backgroundColor: "#f8fafc",
        padding: "15px",
        borderRadius: "8px",
        marginTop: "15px",
        fontSize: "14px",
        color: "#333",
    },
    descriptionBox: {
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
    },
    descTitle: {
        fontWeight: "bold",
        marginBottom: "8px",
        color: "#111",
    },
    description: {
        fontSize: "14px",
        color: "#444",
        whiteSpace: "pre-wrap",
    },
    footerSection: { textAlign: "center", marginTop: "25px" },
    support: { fontSize: "14px", color: "#555" },
    disclaimer: { fontSize: "12px", color: "#888", marginTop: "6px" },
    link: { color: "#2563eb", textDecoration: "none" },
};
