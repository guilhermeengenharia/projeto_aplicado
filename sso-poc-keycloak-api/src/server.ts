import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import Routes from './routes';
import { env } from "./env";
import { ReqRespLogExpressPlugin } from './lib/plugins/express/log/req-resp-log';

export default class Server {
    constructor(app: Application) {
        this.config(app);
        new Routes(app);
        this.errorHandling(app);
    }

    private config(app: Application): void {
        // CORS configuration
        const corsOptions = {
            origin: env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            maxAge: 86400 // 24 hours
        };
        
        // Middlewares
        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(ReqRespLogExpressPlugin.handler!());
        
        // Initialize global variables (consider using a proper config system)
        (global as any).connStrApp = [];
        (global as any).connStrAdm = [];
    }

    private errorHandling(app: Application): void {
        // 404 handler
        app.use((req: Request, res: Response, next: NextFunction) => {
            res.status(404).send("Not Found");
        });

        // Error handler
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        });
    }
}

const app: Application = express();
const server: Server = new Server(app);
const PORT: number = parseInt(env.PORT || '7007', 10);

app.listen(PORT, "0.0.0.0", function () {
    console.log(`Server is running on port ${PORT}.`);
}).on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
        console.log(`Port ${PORT} is already in use`);
        process.exit(1);
    } else {
        console.log("Server error:", err);
        process.exit(1);
    }
});