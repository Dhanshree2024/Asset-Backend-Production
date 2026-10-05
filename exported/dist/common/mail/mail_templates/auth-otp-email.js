"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthLoginVerificationEmail = AuthLoginVerificationEmail;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
function AuthLoginVerificationEmail({ name, otp, companyName, companyLogo, mailReply }) {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsx)(components_1.Head, {}), (0, jsx_runtime_1.jsxs)(components_1.Preview, { children: ["\uD83D\uDD10 Login Verification Required for Your ", companyName, " Account"] }), (0, jsx_runtime_1.jsx)(components_1.Body, { style: styles.body, children: (0, jsx_runtime_1.jsx)(components_1.Container, { style: styles.outerContainer, children: (0, jsx_runtime_1.jsxs)(components_1.Container, { style: styles.container, children: [(0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.header, children: [companyLogo ? (0, jsx_runtime_1.jsx)(components_1.Img, { src: companyLogo, alt: `${companyName} Logo`, style: styles.logo }) : null, (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.companyName, children: companyName }), (0, jsx_runtime_1.jsx)(components_1.Hr, { style: styles.divider })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.section, children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.greeting, children: ["\uD83D\uDC4B Dear ", name, ","] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.otpText, children: ["We have received a login request for your ", companyName, " account. For security purposes, please verify your identity by providing the following One-Time Password (OTP):"] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.footer, children: "Your One-Time Password (OTP) verification code is:" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.otp, children: otp }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.note, children: "This OTP is valid for 5 minutes. Please do not share it with anyone." })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.footerSection, children: [(0, jsx_runtime_1.jsx)(components_1.Hr, { style: styles.divider }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.disclaimer, children: "If you did not initiate this login request, please disregard this message. Ensure the confidentiality of your OTP and do not share it with anyone." }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.support, children: ["For assistance, please contact our support team at ", (0, jsx_runtime_1.jsx)("a", { href: `mailto:${mailReply}`, children: mailReply })] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.disclaimer, children: "This is an automated message. Please do not reply to this email." })] })] }) }) })] }));
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
    otpText: { fontSize: "14px", marginBottom: "8px", color: "#555" },
    otp: { fontSize: "26px", fontWeight: "bold", color: "#ff5733", padding: "12px", backgroundColor: "#f4f4f4", display: "inline-block", borderRadius: "8px", letterSpacing: "2px" },
    note: { fontSize: "14px", marginTop: "10px", color: "#666" },
    footerSection: { textAlign: "center", marginTop: "20px" },
    footer: { fontSize: "16px", fontWeight: "bold", marginTop: "15px", color: "#444" },
    support: { fontSize: "14px", color: "#666", marginBottom: "8px" },
    disclaimer: { fontSize: "12px", color: "#999", marginTop: "10px" },
};
