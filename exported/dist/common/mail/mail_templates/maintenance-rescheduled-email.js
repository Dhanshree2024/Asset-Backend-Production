"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceRescheduledEmail = MaintenanceRescheduledEmail;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
function MaintenanceRescheduledEmail({ userName, assetName, assetId, tagNumber, date, time, reason, ctaLink, }) {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsx)(components_1.Head, {}), (0, jsx_runtime_1.jsxs)(components_1.Preview, { children: ["Maintenance Rescheduled - Asset #", assetId] }), (0, jsx_runtime_1.jsx)(components_1.Body, { style: styles.body, children: (0, jsx_runtime_1.jsxs)(components_1.Container, { style: styles.container, children: [(0, jsx_runtime_1.jsx)(components_1.Section, { style: styles.logoHeader, children: (0, jsx_runtime_1.jsx)(components_1.Img, { src: "https://webmarketing2.blob.core.windows.net/systememail/Maintenance Rescheduled/Norbik-asset-logo-Dark.png", style: styles.logo }) }), (0, jsx_runtime_1.jsx)(components_1.Section, { children: (0, jsx_runtime_1.jsx)(components_1.Img, { src: "https://webmarketing2.blob.core.windows.net/systememail/Maintenance Rescheduled/Maintenance_Rescheduled.png", style: styles.heroImage }) }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.overlayBox, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.title, children: "Maintenance Rescheduled" }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.assetId, children: ["Update: Asset #", assetId] })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.content, children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.text, children: ["Hi ", (0, jsx_runtime_1.jsx)("strong", { children: userName }), ","] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.text, children: "Please be advised that the maintenance for the following asset has been moved to a new date." }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.detailsBox, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.detailsTitle, children: "New Schedule Details:" }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.listItem, children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "Asset Name:" }), " ", assetName] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.listItem, children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "Asset ID:" }), " ", tagNumber] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.listItem, children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "New Date:" }), " ", date] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.listItem, children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "New Time:" }), " ", time] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.listItem, children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "Reason for Change:" }), " ", reason] })] }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.text, children: "Please update your calendar to reflect these changes. If this new time conflicts with your operations, please let us know or reschedule through the portal." }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: styles.ctaContainer, children: (0, jsx_runtime_1.jsx)(components_1.Link, { href: ctaLink, style: styles.button, children: "View Updated Schedule" }) })] }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: styles.closing, children: (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.text, children: ["Best regards,", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("strong", { children: "Norbik Asset Team" })] }) }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.footer, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.footerText, children: "SP IT SOLUTIONS LLP" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.footerAddress, children: "Unit No.5, Shivkrupa Industrial Estate, Opp. Nanded City Gate, Sinhgad Road, Pune - 411041, Maharashtra, India" }), (0, jsx_runtime_1.jsx)(components_1.Link, { href: "https://www.norbikasset.com", style: styles.footerLink, children: "www.norbikasset.com" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.footerDisclaimer, children: "This is a system-generated email. Please do not reply." })] })] }) })] }));
}
const styles = {
    body: {
        backgroundColor: "#f4f7f9",
        fontFamily: "Segoe UI, Arial, sans-serif",
        padding: "20px",
    },
    container: {
        maxWidth: "650px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        overflow: "hidden",
    },
    logoHeader: {
        textAlign: "center",
        padding: "30px 0",
    },
    logo: {
        maxWidth: "200px",
    },
    heroImage: {
        width: "100%",
    },
    overlayBox: {
        padding: "20px 30px",
        textAlign: "left",
    },
    title: {
        fontSize: "24px",
        fontWeight: 800,
        color: "#002d5b",
        margin: "0",
    },
    assetId: {
        fontSize: "14px",
        fontWeight: 600,
        color: "#007bff",
        marginTop: "6px",
    },
    content: {
        padding: "30px 40px",
    },
    text: {
        fontSize: "15px",
        color: "#1e293b",
        lineHeight: "1.6",
    },
    detailsBox: {
        backgroundColor: "#ebf3ff",
        borderRadius: "12px",
        padding: "20px",
        margin: "20px 0",
    },
    detailsTitle: {
        fontSize: "16px",
        fontWeight: 700,
        marginBottom: "10px",
        color: "#002d5b",
    },
    listItem: {
        fontSize: "14px",
        marginBottom: "6px",
        color: "#1e293b",
    },
    ctaContainer: {
        textAlign: "center",
        margin: "30px 0",
    },
    button: {
        display: "inline-block",
        padding: "14px 28px",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        textDecoration: "none",
        borderRadius: "8px",
        fontWeight: 600,
    },
    closing: {
        padding: "0 40px 30px 40px",
    },
    footer: {
        backgroundColor: "#f9fafb",
        padding: "30px",
        textAlign: "center",
    },
    footerText: {
        fontSize: "12px",
        fontWeight: 700,
        color: "#1a2b4b",
    },
    footerAddress: {
        fontSize: "11px",
        color: "#64748b",
        margin: "10px 0",
    },
    footerLink: {
        fontSize: "11px",
        color: "#2563eb",
        textDecoration: "none",
    },
    footerDisclaimer: {
        fontSize: "12px",
        color: "#475569",
        marginTop: "10px",
        fontStyle: "italic",
    },
};
