import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import * as fs from 'fs';
import { diskStorage } from "multer";
import * as path from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    // Get root
    getRootPath = () => {
        return process.cwd();
    }
    // Check exist path
    ensureExists(targetDirectory: string) {
        fs.mkdir(targetDirectory, { recursive: true }, (error) => {
            if (!error) {
                console.log("Directory successfully created, or it already exists!");
                return;
            }
            switch (error.code) {
                case 'EEXIST':
                    console.error(
                        `Error: The requested location "${targetDirectory}" exists, but it's not a directory.`
                    );
                    break;
                case 'ENOTDIR':
                    console.error(
                        `Error: The parent directory contains a file with the same name as the directory you're trying to create: "${path.dirname(
                            targetDirectory
                        )}".`
                    );
                    break;
                case 'EACCES':
                    console.error(
                        `Error: Permission denied when trying to create "${targetDirectory}".`
                    );
                    break;
                default:
                    console.error(`Error: An unexpected error occurred - ${error.message}`);
                    break;
            }
        })
    }

    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const folder = req?.headers?.folder_type ?? 'default';
                    this.ensureExists(`public/images/${folder}`);
                    cb(null, path.join(this.getRootPath(), `public/images/${folder}`))
                },
                filename: (req, file, cb) => {
                    let extensionName = path.extname(file.originalname);
                    //get image's name without extension
                    let baseName = path.basename(file.originalname, extensionName)

                    let finalName = `${baseName}-${Date.now()}${extensionName}`;

                    cb(null, finalName);

                }
            }),
            fileFilter: (req, file, cb) => {
                const allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'];
                const fileExtension = file.originalname.split('.').pop().toLowerCase();
                const isValidFileType = allowedFileTypes.includes(fileExtension);

                if (!isValidFileType) {
                    cb(new HttpException('Định dạng file không hợp lệ', HttpStatus.UNPROCESSABLE_ENTITY), null);
                }
                else {
                    cb(null, true)
                }
            },
            limits: {
                fileSize: 1024 * 1024 * 10
            }
        };
    }
}
