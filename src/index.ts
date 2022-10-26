import * as dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";
import configService from "./app/config";
import seeds from './app/seeds';
import { ExpressServer } from "./app/server";
const main = async () => {

    const databaseConfig = configService.database;
    let uri = `${databaseConfig.host}`;
    if (databaseConfig.name) {
        uri = `${uri}/${databaseConfig.name}${databaseConfig.options}`;
    }

    // .................................................................................. seed params
    const migrateSeeds = process.argv.filter((x: any) => x.includes('insert:') || x.includes('remove:'))
    // console.log({ migrateSeeds });


    try {
        await mongoose.connect(uri, {
            pass: databaseConfig.password || ''
        });
        const PORT: any = process.env.APP_PORT;
        // console.log("PORT ===>", PORT);


        const expressServer = new ExpressServer();
        if (migrateSeeds?.length) seeds(migrateSeeds);
        else expressServer.Start(PORT);
        // process
        //     .on("SIGTERM", expressServer.Shutdown)
        //     .on("SIGINT", expressServer.Shutdown)
        //     .on("uncaughtException", expressServer.Shutdown);
    } catch (error) {
        console.log(error);
    }
};
main();
