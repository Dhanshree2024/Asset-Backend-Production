"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceScrappedEmail = MaintenanceScrappedEmail;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
function MaintenanceScrappedEmail({ assetName, tagNumber, date, verdict, ctaLink, }) {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsx)(components_1.Head, {}), (0, jsx_runtime_1.jsx)(components_1.Preview, { children: "Maintenance Update - Asset Scrapped" }), (0, jsx_runtime_1.jsx)(components_1.Body, { style: styles.body, children: (0, jsx_runtime_1.jsxs)(components_1.Container, { style: styles.container, children: [(0, jsx_runtime_1.jsx)(components_1.Section, { style: styles.header, children: (0, jsx_runtime_1.jsx)(components_1.Img, { src: "https://webmarketing2.blob.core.windows.net/systememail/Maintenance%20Completed%20But%20Scapped/Norbik-asset-logo-Dark.png", style: styles.logo }) }), (0, jsx_runtime_1.jsx)(components_1.Section, { children: (0, jsx_runtime_1.jsx)(components_1.Img, { src: "https://webmarketing2.blob.core.windows.net/systememail/Maintenance Completed But Scapped/scrapped_asset.png", style: styles.heroImage }) }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.heroContent, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.title, children: "Maintenance Update:" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.status, children: "Final Status \u2013 Scrapped" }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.description, children: ["The maintenance session for your asset has concluded. However, upon inspection, the item has been determined to be ", (0, jsx_runtime_1.jsx)("strong", { children: "Beyond Economic Repair" }), " and has been marked as ", (0, jsx_runtime_1.jsx)("strong", { children: "Scrapped" }), "."] })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.cardsWrapper, children: [(0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.card, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.cardTitle, children: "Final Report" }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.listItem, children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "Asset Name:" }), " ", assetName] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.listItem, children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "Asset ID:" }), " ", tagNumber] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.listItem, children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "Inspection Date:" }), " ", date] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.listItem, children: ["\u2022 ", (0, jsx_runtime_1.jsx)("strong", { children: "Technical Verdict:" }), " ", verdict] }), (0, jsx_runtime_1.jsx)(components_1.Link, { href: ctaLink, style: styles.button, children: "Full Schedule" })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.card, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.cardTitle, children: "Next Steps" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.listItem, children: "\u2022 The asset has been removed from active inventory." }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.listItem, children: "\u2022 Any future scheduled services for this item have been cancelled." }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.listItem, children: "\u2022 Please contact the procurement team if a replacement is required." })] })] }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: styles.closing, children: (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.text, children: ["Best regards,", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("strong", { children: "Norbik Asset Team" })] }) }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: styles.footer, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.footerText, children: "SP IT SOLUTIONS LLP" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.footerAddress, children: "Unit No.5, Shivkrupa Industrial Estate, Opp. Nanded City Gate, Sinhgad Road, Pune - 411041, Maharashtra, India" }), (0, jsx_runtime_1.jsx)(components_1.Link, { href: "https://www.norbikasset.com", style: styles.footerLink, children: "www.norbikasset.com" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: styles.footerDisclaimer, children: "This is a system-generated email. Please do not reply." })] })] }) })] }));
}
const styles = {
    body: {
        backgroundColor: "#f3f4f6",
        fontFamily: "Segoe UI, Arial, sans-serif",
        padding: "40px 20px",
    },
    container: {
        maxWidth: "650px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
    },
    header: {
        padding: "25px 40px 15px",
        backgroundColor: "#eef2ff",
    },
    logo: {
        maxWidth: "150px",
    },
    heroImage: {
        width: "100%",
    },
    heroContent: {
        padding: "30px 40px",
        backgroundColor: "#eef2ff",
    },
    title: {
        fontSize: "24px",
        fontWeight: 800,
        margin: 0,
        color: "#111827",
    },
    status: {
        fontSize: "18px",
        fontWeight: 700,
        color: "#3b82f6",
        margin: "10px 0",
    },
    description: {
        fontSize: "14px",
        color: "#4b5563",
        lineHeight: "1.6",
    },
    cardsWrapper: {
        padding: "20px 40px",
    },
    card: {
        backgroundColor: "#f9fafb",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "15px",
    },
    cardTitle: {
        fontSize: "14px",
        fontWeight: 700,
        marginBottom: "10px",
        color: "#1e3a8a",
        textTransform: "uppercase",
    },
    listItem: {
        fontSize: "13px",
        marginBottom: "6px",
        color: "#374151",
    },
    button: {
        display: "inline-block",
        marginTop: "10px",
        padding: "12px 20px",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        textDecoration: "none",
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "13px",
    },
    closing: {
        padding: "0 40px 30px",
    },
    text: {
        fontSize: "14px",
        color: "#1e293b",
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
        fontSize: "10px",
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
