import { Request, Response } from "express";
import Interface from '../interface';
import Service from "../service/service.admin";
import BulkService from "../service/bulk.service";
import HelperService from "../service/service.helper";
import { ActiveError, notFoundError } from "src/utils/error-converter";
// import { MEMBER_TYPE } from "../constant";
import mongoose, { Types } from 'mongoose';
import { InternalServerErrorException } from "packages/errors/InternalServerErrorException";
import { STATUS } from "src/enum";
// import MediaGalleryInterface from 'src/modules/media/gallery/interface';
import MediaFolderService from "../../folder/service/service.admin";
import { NotFoundException } from "packages/errors/NotFoundException";
import { IAwsS3Response } from './../../aws/aws.interface';
import { AwsS3Service } from "../../aws/service/aws.s3.service";
import uploadMiddleware from "src/app/middleware/uploadMiddleware";
import multer from "multer";

class MediaGalleryController {
    constructor(
        private readonly service: Service,
        private readonly bulkService: BulkService,
        private readonly helperService: HelperService,
        private readonly awsService: AwsS3Service,
        private readonly mediaFolderService: MediaFolderService,
    ) { }


    async List(req: Request, res: Response) {

        const { skip,
            limit,
            sort,
            search,
            status,
            folder
        } = req.query as Record<string, any>;

        const find: Record<string, any> = {
            // 'folder.status': STATUS.ACTIVE
        };

        if (folder) {
            let findData: Record<string, any> = await this.mediaFolderService.findOne(
                { slug: folder }
            );
            let folderId: string = findData?._id;

            if ((folderId)) find["folder"] = new Types.ObjectId(folderId || folder)
        }

        if (status) {
            find["status"] = {
                $in: status
            }
        }

        if (search) {
            find['$or'] = [
                {
                    title: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },

                },
            ];
        }

        try {
            const MediaGallery: Interface.IDocument[] = await this.service.findAll(find, {
                limit,
                skip,
                sort,
                populate: {
                    folder: true,
                    users: true,
                    posts: true,
                }
            });
            const count: number = await this.service.getTotal(find);

            const result: any[] = MediaGallery;


            res.status(200).send({
                count,
                result,
            });
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);

        }

    }




    async Create(req: Request, res: Response): Promise<any> {

        const uploadFile = this.helperService.upload.single("image");


        uploadFile(req, res, async (error) => {

            const { file, body, user } = req;

            console.log(file, { error }, notFoundError({ key: "folder" }));
            if (!file) throw new NotFoundException(notFoundError({ key: "folder" }));

            if (error instanceof multer.MulterError) {

                if (error.code === "LIMIT_UNEXPECTED_FILE") {
                    throw new InternalServerErrorException("Too many files to upload.");
                }

            } else if (error) {
                throw new InternalServerErrorException(error.message);
            }


            try {

                const originalName = file.originalname;
                const baseName = body.title || originalName.substring(0, originalName.lastIndexOf('.') + 1);
                let mimetype = file.mimetype;
                const [type, mime] = mimetype.split(".");
                const content: Buffer = file.buffer;

                // const randomFileName: string = await this.service.createRandomFilename();
                const folder: Record<string, any> = await this.mediaFolderService.findOneById(body.folder)


                if (!folder) {
                    throw new NotFoundException(notFoundError({ key: "folder" }));
                } else if (folder.status !== STATUS.ACTIVE) {
                    throw new InternalServerErrorException(ActiveError({ key: "folder" }));
                }

                type TUploaded = {
                    path: string;
                    pathWithFilename: string;
                    filename: string;
                    url: string;
                }

                const uploaded: TUploaded = await this.helperService.resizeImage(`${baseName}.${mime}`, content, {
                    path: `${file.fieldname}/${body.folder}`,
                })
                // res.status(200).send(uploaded);

                // mimetype
                const create = await this.service.create({
                    title: baseName,
                    path: uploaded.path,
                    pathWithFilename: uploaded.pathWithFilename,
                    filename: uploaded.filename,
                    url: uploaded.url,
                    mimetype: mimetype,
                    fieldName: file.fieldname,
                    status: body.status || STATUS.ACTIVE,
                    createdBy: user._id,
                    folder: folder._id
                });

                console.log({ create });

                // folder.galleries.push(folder._id)

                this.mediaFolderService.addGallery(folder._id, create._id)


                res.status(200).send(create);
                // res.status(200).send();
            } catch (err: any) {
                throw new InternalServerErrorException(err.message);
            }

        });
        // if (req.body.images.length <= 0) {
        //     return res.send(`You must select at least 1 image.`);
        // }

        // req.body.images 


    }

    upload = uploadMiddleware.single('file');

    // async Createuploaded(req: Request, res: Response): Promise<any> {

    //     this.upload(req, res, async (err) => {
    //         const { body, file, user } = req;

    //         console.log({ body, file, user, err });

    //         if (!file) throw new InternalServerErrorException("error file not found");
    //         if (!user) throw new InternalServerErrorException("error user not found");


    //         const originalName = file.originalname;
    //         const baseName = body.title || originalName.substring(0, originalName.lastIndexOf('.') + 1);
    //         const mime = originalName.substring(originalName.lastIndexOf('.') + 1);
    //         const content: Buffer = file.buffer;

    //         // const mime: string = filename
    //         //     .substring(filename.lastIndexOf('.') + 1, filename.length)
    //         //     .toUpperCase();


    //         const randomFileName: string = await this.service.createRandomFilename();
    //         const folder: Record<string, any> = await this.mediaFolderService.findOneById(body.folder)
    //         // console.log({ folder });

    //         if (!folder) {
    //             throw new NotFoundException(notFoundError({ key: "folder" }));
    //         } else if (folder.status !== STATUS.ACTIVE) {
    //             throw new InternalServerErrorException(ActiveError({ key: "folder" }));
    //         }

    //         console.log({
    //             content,
    //             mime,
    //             originalName,
    //             a: `${baseName}/${randomFileName}.${mime.toUpperCase()}`,
    //             b: `${folder.title}`
    //         });


    //         try {
    //             const aws: IAwsS3Response = await this.awsService.putItemInBucket(
    //                 // `${path.filename}.${mime.toUpperCase()}`,
    //                 `${baseName}/${randomFileName}.${mime.toUpperCase()}`,
    //                 content,
    //                 {
    //                     path: `${body.folder}`,
    //                 }
    //             );
    //             console.log({ aws });

    //             // mimetype
    //             const create = await this.service.create({
    //                 title: baseName,
    //                 baseUrl: aws.baseUrl,
    //                 completedUrl: aws.completedUrl,
    //                 filename: aws.filename,
    //                 mimetype: file.mimetype,
    //                 status: body.status || STATUS.ACTIVE,
    //                 createdBy: user._id,
    //                 folder: folder._id
    //             });

    //             console.log({ create });

    //             // folder.galleries.push(folder._id)

    //             this.mediaFolderService.addGallery(folder._id, create._id)


    //             res.status(200).send(create);
    //         } catch (error: any) {
    //             console.log({ error });
    //             throw new InternalServerErrorException(error.message);
    //         }
    //     });

    // }

    async GetById(req: Request, res: Response): Promise<any> {
        const { _data } = req;
        res.status(200).send(_data);
    }

    async getBySlug(req: Request, res: Response): Promise<any> {
        const { _data } = req;
        res.status(200).send(_data);
    }
    async Update(req: Request, res: Response): Promise<any> {


        this.upload(req, res, async (err) => {
            const { _data, body } = req;
            const { title, status } = body


            try {
                const update = await this.service.updateOneById(_data._id,
                    {
                        title,
                        ...(status && { status }),
                        folder: new mongoose.Types.ObjectId(body.folder)
                    });
                await this.mediaFolderService.addGallery(body.folder, update._id)
                res.status(200).send({
                    _id: _data._id,
                });
            } catch (error: any) {
                throw new InternalServerErrorException(error.message);

            }

        })
    }


    async Delete(req: Request, res: Response): Promise<void> {
        const { _data } = req;
        try {
            await this.service.deleteOneById(_data._id);
            res.status(200).send(_data)
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async ChangeStatus(req: Request, res: Response): Promise<void> {
        const { body } = req;
        const find = { _id: { $in: body.data } }
        const set = { $set: { status: body.status } }

        try {
            await this.bulkService.updateMany(find, set);
            res.status(200).send(body)
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
    }


}

export default MediaGalleryController