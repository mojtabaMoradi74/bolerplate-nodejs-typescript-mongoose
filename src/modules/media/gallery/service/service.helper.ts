import Interface from "../interface";
import mongo from "../mongo";
import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from "src/app/database/database.interface";
import { STATUS } from "src/enum";
import mongoose, { Types } from 'mongoose';
import { HelperStringService } from "src/utils/helper/service/helper.string.service";
import mediaFolderConstant from "../../folder/constant";
import userConstant from "src/modules/user/constant";
import blogPostConstant from "src/modules/blog/post/constant";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

class MediaGalleryHelperService {

    public helperStringService: HelperStringService;

    constructor(

    ) {
        this.helperStringService = new HelperStringService()

    }

    multerStorage = multer.memoryStorage();

    // multerFilter = (req: any, file: any, cb: any) => {
    //     if (file.mimetype.startsWith("image")) {
    //         cb(null, true);
    //     } else {
    //         cb("Please upload only images.", false);
    //     }
    // };

    upload = multer({
        // storage: this.multerStorage,
        limits: {
            fileSize: 4 * 1024 * 1024,
        }
        // fileFilter: this.multerFilter
    });

    createDirectories(pathname: string) {
        const __dirname = path.resolve();
        pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
        fs.mkdir(path.resolve(__dirname, pathname), { recursive: true }, e => {
            if (e) {
                console.error(e);
            } else {
                console.log('Success');
            }
        });
    }

    // uploadFiles = this.upload.array("images", 10);
    // uploadFile = this.upload.single("image");

    // uploadImage = async (req: Request, res: Response, next: NextFunction) => {

    //     this.uploadFile(req, res, err => {
    //         console.log(req.file, req.files, { err });

    //         if (err instanceof multer.MulterError) {
    //             if (err.code === "LIMIT_UNEXPECTED_FILE") {
    //                 return res.send("Too many files to upload.");
    //             }
    //         } else if (err) {
    //             // console.log({ err });
    //         }
    //     });




    // };


    // uploadImages = async (req: Request, res: Response) => {

    //     this.uploadFiles(req, res, err => {
    //         console.log(req.file, req.files, { err });

    //         if (err instanceof multer.MulterError) {
    //             if (err.code === "LIMIT_UNEXPECTED_FILE") {
    //                 // return res.send("Too many files to upload.");
    //             }
    //         } else if (err) {
    //             console.log({ err });
    //         }
    //     });

    // };


    resizeImage = async (filename: string, content: any, options: any) => {

        let path: string = options.path;


        if (path)
            path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

        const key: string = path ? `${path}/${filename}` : filename;


        this.createDirectories(`media/${key}`);

        await sharp(content)
            .flatten(true)
            .resize(300, 300, {
                // fit: sharp.fit.contain, 
                background: { r: 255, g: 255, b: 255 },
                fit: sharp.fit.inside,
                withoutEnlargement: true,
                // fit: sharp.fit.outside,
                // withoutReduction: true
            })
            .toFormat("jpg")
            .jpeg({ quality: 80 })
            .toFile(`media/${key}`);

        return {
            path,
            pathWithFilename: key,
            filename: filename,
            url: `media/${key}`,
        };
    };


    // resizeImages = async (req: Request, res: Response, next: NextFunction) => {
    //     if (!req.files) return next();

    //     req.body.images = [];
    //     const files: any = req.files
    //     await Promise.all(
    //         files.map(async (file: any) => {
    //             const filename = file.originalname.replace(/\..+$/, "");
    //             const newFilename = `${filename}-${Date.now()}.jpeg`;

    //             // if (!fs.existsSync(dir)){
    //             //     fs.mkdirSync(dir, { recursive: true });
    //             // }
    //             this.createDirectories('upload/image')
    //             await sharp(file.buffer)
    //                 .flatten(true)
    //                 .resize(300, 300, {
    //                     // fit: sharp.fit.contain, 
    //                     background: { r: 255, g: 255, b: 255 },
    //                     fit: sharp.fit.inside,
    //                     withoutEnlargement: true,
    //                     // fit: sharp.fit.outside,
    //                     // withoutReduction: true
    //                 })
    //                 .toFormat("jpeg")
    //                 .jpeg({ quality: 80 })
    //                 .toFile(`upload/image/${newFilename}`);

    //             req.body.images.push(newFilename);
    //         })
    //     );

    //     next();
    // };
}

export default MediaGalleryHelperService
