"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginVerificationEmail = LoginVerificationEmail;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
function LoginVerificationEmail({ name, otp, companyName, companyLogo, mailReply }) {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsx)(components_1.Head, {}), (0, jsx_runtime_1.jsxs)(components_1.Preview, { children: ["\uD83D\uDD10 OTP for Your ", companyName, " Account"] }), (0, jsx_runtime_1.jsx)(components_1.Body, { style: styles.body, children: (0, jsx_runtime_1.jsx)(components_1.Container, { style: styles.outerContainer, children: (0, jsx_runtime_1.jsxs)(components_1.Container, { style: styles.container, children: [(0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.header, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.companyName, children: companyName }), (0, jsx_runtime_1.jsx)(components_1.Hr, { style: styles.divider })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.section, children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.greeting, children: ["\uD83D\uDC4B Hello ", name, ","] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.otpText, children: "Your One-Time Password (OTP) is:" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.otp, children: otp }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.note, children: "This OTP is valid for 5 minutes. Do not share it with anyone." })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.footerSection, children: [(0, jsx_runtime_1.jsx)(components_1.Hr, { style: styles.divider }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.footer, children: ["Thanks for choosing ", companyName, "! \uD83D\uDE80"] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.support, children: ["Need help? Contact us at ", (0, jsx_runtime_1.jsx)("a", { href: `mailto:${companyName}`, children: mailReply })] })] })] }) }) })] }));
}
const styles = {
    body: { backgroundColor: "#f9f9f9", fontFamily: "Arial, sans-serif", padding: "20px" },
    outerContainer: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "40px 0" },
    container: { maxWidth: "600px", margin: "auto", backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1), 0 -6px 12px rgba(0, 0, 0, 0.1)" },
    header: { textAlign: "center", paddingBottom: "15px" },
    logo: { width: "120px", height: "auto", marginBottom: "10px" },
    companyName: { fontSize: "22px", fontWeight: "bold", color: "#333" },
    divider: { borderTop: "1px solid #ddd", margin: "15px 0" },
    section: { textAlign: "center", padding: "10px 0" },
    greeting: { fontSize: "18px", fontWeight: "bold", marginBottom: "10px", color: "#444" },
    otpText: { fontSize: "16px", marginBottom: "8px", color: "#555" },
    otp: { fontSize: "26px", fontWeight: "bold", color: "#ff5733", padding: "12px", backgroundColor: "#f4f4f4", display: "inline-block", borderRadius: "8px", letterSpacing: "2px" },
    note: { fontSize: "14px", marginTop: "10px", color: "#666" },
    button: { backgroundColor: "#365CCE", color: "#666", padding: "10px 20px", fontSize: "16px", borderRadius: "8px", textDecoration: "none", display: "inline-block", marginTop: "15px" },
    footerSection: { textAlign: "center", marginTop: "20px" },
    footer: { fontSize: "16px", fontWeight: "bold", marginTop: "15px", color: "#444" },
    support: { fontSize: "14px", color: "#666", marginBottom: "8px" },
    disclaimer: { fontSize: "12px", color: "#999", marginTop: "10px" },
};
