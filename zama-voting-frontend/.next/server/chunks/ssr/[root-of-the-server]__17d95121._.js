module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// Simple translation dictionary
const translations = {
    en: {
        // Navigation
        "nav.home": "Home",
        "nav.create": "Create Voting",
        "nav.admin": "Admin",
        "nav.connect": "Connect Wallet",
        "nav.disconnect": "Disconnect",
        // Common
        "common.loading": "Loading...",
        "common.error": "Error",
        "common.success": "Success",
        "common.cancel": "Cancel",
        "common.confirm": "Confirm",
        "common.save": "Save",
        "common.delete": "Delete",
        "common.edit": "Edit",
        "common.view": "View",
        "common.back": "Back",
        "common.next": "Next",
        "common.previous": "Previous",
        "common.end": "End",
        // Voting
        "voting.title": "ZamaVoting",
        "voting.subtitle": "Confidential Voting System",
        "voting.create": "Create New Voting",
        "voting.vote": "Vote",
        "voting.results": "Results",
        "voting.active": "Active",
        "voting.ended": "Ended",
        "voting.upcoming": "Upcoming",
        "voting.total_votes": "Total Votes",
        "voting.time_left": "Time Left",
        "voting.ends_at": "Ends At",
        "voting.starts_at": "Starts At",
        "voting.created_by": "Created By",
        "voting.public": "Public",
        "voting.private": "Private",
        "voting.whitelist_only": "Whitelist Only",
        // Forms
        "form.title": "Title",
        "form.description": "Description",
        "form.options": "Options",
        "form.start_time": "Start Time",
        "form.end_time": "End Time",
        "form.voting_type": "Voting Type",
        "form.add_option": "Add Option",
        "form.remove_option": "Remove Option",
        "form.whitelist": "Whitelist Addresses",
        // Messages
        "msg.wallet_not_connected": "Please connect your wallet",
        "msg.voting_created": "Voting created successfully",
        "msg.vote_cast": "Vote cast successfully",
        "msg.already_voted": "You have already voted",
        "msg.voting_not_active": "Voting is not active",
        "msg.not_authorized": "You are not authorized to vote",
        "msg.invalid_option": "Invalid voting option"
    },
    zh: {
        // Navigation
        "nav.home": "首页",
        "nav.create": "创建投票",
        "nav.admin": "管理",
        "nav.connect": "连接钱包",
        "nav.disconnect": "断开连接",
        // Common
        "common.loading": "加载中...",
        "common.error": "错误",
        "common.success": "成功",
        "common.cancel": "取消",
        "common.confirm": "确认",
        "common.save": "保存",
        "common.delete": "删除",
        "common.edit": "编辑",
        "common.view": "查看",
        "common.back": "返回",
        "common.next": "下一步",
        "common.previous": "上一步",
        "common.end": "结束",
        // Voting
        "voting.title": "Zama投票",
        "voting.subtitle": "机密投票系统",
        "voting.create": "创建新投票",
        "voting.vote": "投票",
        "voting.results": "结果",
        "voting.active": "进行中",
        "voting.ended": "已结束",
        "voting.upcoming": "即将开始",
        "voting.total_votes": "总票数",
        "voting.time_left": "剩余时间",
        "voting.ends_at": "结束时间",
        "voting.starts_at": "开始时间",
        "voting.created_by": "创建者",
        "voting.public": "公开",
        "voting.private": "私有",
        "voting.whitelist_only": "仅限白名单",
        // Forms
        "form.title": "标题",
        "form.description": "描述",
        "form.options": "选项",
        "form.start_time": "开始时间",
        "form.end_time": "结束时间",
        "form.voting_type": "投票类型",
        "form.add_option": "添加选项",
        "form.remove_option": "移除选项",
        "form.whitelist": "白名单地址",
        // Messages
        "msg.wallet_not_connected": "请连接您的钱包",
        "msg.voting_created": "投票创建成功",
        "msg.vote_cast": "投票成功",
        "msg.already_voted": "您已经投过票了",
        "msg.voting_not_active": "投票未激活",
        "msg.not_authorized": "您无权投票",
        "msg.invalid_option": "无效的投票选项"
    }
};
function Providers({ children }) {
    const [language, setLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("en");
    const t = (key)=>{
        return translations[language][key] || key;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: {
            language,
            setLanguage,
            t
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/providers.tsx",
        lineNumber: 150,
        columnNumber: 5
    }, this);
}
function useLanguage() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__17d95121._.js.map