import express from "express";
import "express-async-errors";
import cors from "cors";
import { NotFoundError } from "../../packages/errors/not-found-error";
import { errorHandler } from "./middleware/error-handler";
import { GetAdminRoutes } from "./routes/admin";
import http from "http";
// import { json } from "body-parser";
import bodyParser from "body-parser";

// import i18next from 'i18next';
// import Backend from 'i18next-node-fs-backend';
// import i18nextMiddleware from 'i18next-express-middleware';
import i18next from 'i18next';
import Backend from 'i18next-node-fs-backend';
import i18nextMiddleware from 'i18next-express-middleware';
import { paginationParams } from "src/utils/helper/request/request.service";
import path from 'path';


export class ExpressServer {
    constructor() {
        this.Init();
    }

    app = express();
    server: http.Server = http.createServer(this.app);






    Init() {

        i18next
            .use(Backend)
            .use(i18nextMiddleware.LanguageDetector)
            .init({
                preload: ['en', 'fa'],
                fallbackLng: 'en',
                backend: {
                    loadPath: __dirname + '/../../packages/locales/{{lng}}/{{ns}}.json'
                },
                ns: ['translation', 'error'],
                defaultNS: 'translation',
                detection: {
                    lookupHeader: 'language',
                },
            });

        this.use(
            cors({
                origin: "*",
                methods: ["GET, POST, OPTIONS, PUT, PATCH, DELETE"],
                credentials: true,
            })
        );
        this.app.use(i18nextMiddleware.handle(i18next));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // this.app.use(
        //     multer({ storage: fileStorage, fileFilter: fileFilter }).single('file')
        // );
        // this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(express.static('public'));
        // this.app.use('/media', express.static("../../media"));
        this.app.use('/media', express.static(path.join(__dirname, '../../media')));

        this.app.use(paginationParams);
        const adminRoutes = GetAdminRoutes();
        this.app.use("/api/v1/admin", adminRoutes);
        this.app.all("*", async (req, res) => {
            throw new NotFoundError();
        });
        this.app.use(errorHandler);
    }
    private use(middleware: any) {
        this.app.use(middleware);
    }
    Start(port: number) {
        this.server.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    }
    Shutdown() {
        //todo bug bug Cannot read property 'close' of undefined
        process.exit(0);
        console.log("Received kill signal, shutting down gracefully");
        this.server.close(() => {
            console.log("Closed out remaining connections");
        });
        setTimeout(() => {
            console.error("Could not close connections in time, forcefully shutting down");
            process.exit(1);
        }, 10000);
    }
}
