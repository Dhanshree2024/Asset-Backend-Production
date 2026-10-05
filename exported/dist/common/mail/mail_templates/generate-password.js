"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordSetNotificationEmail = PasswordSetNotificationEmail;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
function PasswordSetNotificationEmail({ name, companyName, companyLogo, mailReply, newPassword }) {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsx)(components_1.Head, {}), (0, jsx_runtime_1.jsxs)(components_1.Preview, { children: ["Your Password Has Been Set for ", companyName, " Account"] }), (0, jsx_runtime_1.jsx)(components_1.Body, { style: styles.body, children: (0, jsx_runtime_1.jsx)(components_1.Container, { style: styles.outerContainer, children: (0, jsx_runtime_1.jsxs)(components_1.Container, { style: styles.container, children: [(0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.header, children: [companyLogo ? (0, jsx_runtime_1.jsx)(components_1.Img, { src: companyLogo, alt: `${companyName} Logo`, style: styles.logo }) : null, (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.companyName, children: companyName }), (0, jsx_runtime_1.jsx)(components_1.Hr, { style: styles.divider })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.section, children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.greeting, children: [" Hello ", name, ","] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.successText, children: ["A password has been successfully set for your ", companyName, " account."] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.successText, children: [(0, jsx_runtime_1.jsx)("strong", { children: "\uD83D\uDD39 New Password:" }), " ", (0, jsx_runtime_1.jsx)("span", { style: { color: "red", fontWeight: "bold" }, children: newPassword })] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.note, children: "If you did not request this change, please reset your password immediately and contact our support team." })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.footerSection, children: [(0, jsx_runtime_1.jsx)(components_1.Hr, { style: styles.divider }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.disclaimer, children: "If this action was intentional, no further steps are needed. Otherwise, please reset your password immediately." }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.support, children: ["For assistance, please reach out to us at ", (0, jsx_runtime_1.jsx)("a", { href: `mailto:${mailReply}`, children: mailReply }), "."] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.disclaimer, children: "This is an automated message. Please do not reply to this email." })] })] }) }) })] }));
}
const styles = {
    body: { backgroundColor: "#f9f9f9", fontFamily: "Arial, sans-serif", padding: "20px" },
    outerContainer: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "40px 0" },
    container: { maxWidth: "600px", backgroundColor: "#ffffff", padding: "40px 20px", borderRadius: "10px", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)" },
    header: { textAlign: "center", paddingBottom: "15px" },
    logo: { width: "120px", height: "auto", marginBottom: "10px" },
    companyName: { fontSize: "22px", fontWeight: "bold", color: "#333" },
    divider: { borderTop: "1px solid #ddd", margin: "15px 0" },
    section: { textAlign: "center", padding: "20px 0" },
    greeting: { fontSize: "18px", fontWeight: "bold", marginBottom: "10px", color: "#444" },
    successText: { fontSize: "14px", marginBottom: "8px", color: "#555" },
    note: { fontSize: "14px", marginTop: "10px", color: "#666" },
    footerSection: { textAlign: "center", marginTop: "20px" },
    support: { fontSize: "14px", color: "#666", marginBottom: "8px" },
    disclaimer: { fontSize: "12px", color: "#999", marginTop: "10px" },
};
