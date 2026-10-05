"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const core_1 = require("@nestjs/core");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const cookie_config_1 = require("./common/config/cookie.config");
const swagger_1 = require("@nestjs/swagger");
const bodyParser = __importStar(require("body-parser"));
const express = __importStar(require("express"));
const session = __importStar(require("express-session"));
const path_1 = require("path");
const expressSession = session.default || session;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const corsOrigins = (process.env.CORS_ORIGINS ?? '')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
    if (process.env.NODE_ENV === 'production' && !corsOrigins.length) {
        throw new Error('CORS_ORIGINS must be set in production — credentialed CORS cannot use a wildcard origin.');
    }
    app.enableCors({
        origin: corsOrigins.length ? corsOrigins : ['http://localhost:3005'],
        methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        allowedHeaders: 'Content-Type, Authorization, X-API-KEY, x-branch-access',
        credentials: true,
        exposedHeaders: ['Content-Disposition'],
    });
    app.use('/uploads', express.static((0, path_1.join)(process.cwd(), 'uploads'), {
        index: false,
        fallthrough: false,
    }));
    app.use(express.static((0, path_1.join)(process.cwd(), 'public'), {
        index: false,
    }));
    app.use((0, cookie_parser_1.default)(), expressSession({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: (0, cookie_config_1.authCookieOptions)({ maxAge: 3600000 }),
    }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Authentication Service API')
        .setDescription('API documentation for Authentication Service')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(process.env.PORT ?? 8013);
    console.log(`🚀 Server running on http://localhost:${process.env.PORT ?? 8013}`);
}
bootstrap();
