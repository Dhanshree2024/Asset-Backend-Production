"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingConfirmationEmail = OnboardingConfirmationEmail;
const jsx_runtime_1 = require("react/jsx-runtime");
const render_1 = require("@react-email/render");
const components_1 = require("@react-email/components");
function OnboardingConfirmationEmail({ name, companyName, companyLogo, mailReply, trialUrl, username, password }) {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsx)(components_1.Head, {}), (0, jsx_runtime_1.jsxs)(components_1.Preview, { children: ["\uD83C\uDFE2 Welcome to ", companyName, "! Your Free Trial is Ready"] }), (0, jsx_runtime_1.jsx)(components_1.Body, { style: styles.body, children: (0, jsx_runtime_1.jsxs)(components_1.Container, { style: styles.container, children: [(0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.header, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.companyName, children: companyName }), (0, jsx_runtime_1.jsx)(components_1.Hr, { style: styles.divider })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.section, children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.greeting, children: ["\uD83D\uDC4B Welcome to our platform, ", name, "!"] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.message, children: "Thank you for signing up for a free trial. We are pleased to inform you that your 30-day free trial has been successfully created." }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.note, children: "You can use the following credentials to access your trial subscription:" }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.credentials, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Username:" }), " ", username] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.credentials, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Password:" }), " ", password] }), (0, jsx_runtime_1.jsx)(components_1.Button, { href: trialUrl, style: styles.button, children: "Click here to Login" })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.footerSection, children: [(0, jsx_runtime_1.jsx)(components_1.Hr, { style: styles.divider }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.footer, children: "Welcome aboard! \uD83D\uDE80" }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.support, children: ["Need help? Contact us at ", (0, jsx_runtime_1.jsx)("a", { href: `mailto:${mailReply}`, children: mailReply })] })] })] }) })] }));
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
    credentials: { fontSize: "14px", fontWeight: "bold", color: "#333", marginTop: "5px" },
    button: { backgroundColor: "#365CCE", color: "#fff", padding: "10px 20px", fontSize: "16px", borderRadius: "8px", textDecoration: "none", display: "inline-block", marginTop: "15px" },
    footerSection: { textAlign: "center", marginTop: "20px" },
    footer: { fontSize: "16px", fontWeight: "bold", marginTop: "15px", color: "#444" },
    support: { fontSize: "14px", color: "#666", marginBottom: "8px" },
};
console.log((0, render_1.render)((0, jsx_runtime_1.jsx)(OnboardingConfirmationEmail, { name: "John Doe", companyName: "Your Company", companyLogo: "https://yourcompany.com/logo.png", mailReply: "support@yourcompany.com", trialUrl: "https://yourcompany.com/trial", username: "johndoe", password: "securepassword" })));
