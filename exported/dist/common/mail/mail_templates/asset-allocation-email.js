"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetAllocationEmail = AssetAllocationEmail;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
function AssetAllocationEmail({ name, inviter, companyName, companyLogo, mailReply, inviteUrl }) {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsx)(components_1.Head, {}), (0, jsx_runtime_1.jsx)(components_1.Preview, { children: "Asset Allotment Notification" }), (0, jsx_runtime_1.jsx)(components_1.Body, { style: styles.body, children: (0, jsx_runtime_1.jsxs)(components_1.Container, { style: styles.container, children: [(0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.header, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.companyName, children: companyName }), (0, jsx_runtime_1.jsx)(components_1.Hr, { style: styles.divider })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.section, children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.greeting, children: ["\uD83D\uDC4B Dear ", name, ","] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.message, children: ["We\u2019re happy to inform you that ", inviter, " has assigned a new asset to you in the ", companyName] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.note, children: "We\u2019re excited to have you on board. To get started, please click the button below and set up your account:" }), (0, jsx_runtime_1.jsx)(components_1.Button, { href: inviteUrl, style: styles.button, children: "Join Now" })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.footerSection, children: [(0, jsx_runtime_1.jsx)(components_1.Hr, { style: styles.divider }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.footer, children: ["Thanks for trusting ", companyName, "! \uD83D\uDE80"] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.support, children: ["If you have any questions, feel free to reach out to us at ", (0, jsx_runtime_1.jsx)("a", { href: `mailto:${mailReply}`, children: mailReply })] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.disclaimer, children: "This is a system-generated mail, do not reply." })] })] }) })] }));
}
const styles = {
    body: { backgroundColor: "#f9f9f9", fontFamily: "Arial, sans-serif", padding: "20px" },
    container: { maxWidth: "600px", margin: "auto", backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1), 0 -6px 12px rgba(0, 0, 0, 0.1)" },
    header: { textAlign: "center", paddingBottom: "15px" },
    logo: { width: "120px", height: "auto", marginBottom: "10px" },
    companyName: { fontSize: "22px", fontWeight: "bold", color: "#333" },
    divider: { borderTop: "1px solid #ddd", margin: "15px 0" },
    section: { textAlign: "center", padding: "10px 0" },
    greeting: { fontSize: "18px", fontWeight: "bold", marginBottom: "10px", color: "#444" },
    message: { fontSize: "16px", marginBottom: "8px", color: "#555" },
    note: { fontSize: "14px", marginTop: "10px", color: "#666" },
    button: { backgroundColor: "#365CCE", color: "#fff", padding: "10px 20px", fontSize: "16px", borderRadius: "8px", textDecoration: "none", display: "inline-block", marginTop: "15px" },
    footerSection: { textAlign: "center", marginTop: "20px" },
    footer: { fontSize: "16px", fontWeight: "bold", marginTop: "15px", color: "#444" },
    support: { fontSize: "14px", color: "#666", marginBottom: "8px" },
    disclaimer: { fontSize: "12px", color: "#999", marginTop: "10px" },
};
