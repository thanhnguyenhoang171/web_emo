import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseFilters,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpExceptionFilter } from 'src/core/http-exception.filter';
import { Public } from 'src/decorator/auth_global.decorator';
import { ResponseMessage } from 'src/decorator/response.decorator';
import { PythonShell } from 'python-shell';
import * as path from 'path';
import * as fs from 'fs';

@Controller('files')
export class FilesController {

  @Public()
  @Post('upload')
  @ResponseMessage("Upload Single File")
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(FileInterceptor('fileUpload'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename
    }
  }

  @Post('upload-feedback')
  @Public()
  @ResponseMessage('Upload single file')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(FileInterceptor('fileUpload'))
  async uploadFileFeedback(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const filePath = path.resolve(file.path); // Chuyển đường dẫn thành dạng tuyệt đối
    // console.log("Check file path = ", filePath);
    const pythonOptions = {
      scriptPath: path.resolve(__dirname, '../../src/python-model-AI/'), // Đường dẫn tuyệt đối đến thư mục chứa script Python
      pythonPath: path.resolve(__dirname, '../../env/Scripts/python.exe'), 
      args: [filePath],
      pythonOptions: ['-u'],
      encoding: 'utf-8', 
    };


    try {
      const results = await this.runPythonScript('emotion_detection.py', pythonOptions);

      // Ghép các dòng output và lọc phần JSON
      const combinedResults = results.join('');
      // console.log('Check raw Python output = ', combinedResults);

      const jsonMatch = combinedResults.match(/{.*}/s);  // Regex tìm đoạn JSON trong output
      if (!jsonMatch) {
        throw new Error('Invalid result from Python script');
      }

      const parsedResults = JSON.parse(jsonMatch[0]);
      // console.log('Check detectionEmotion = ', parsedResults.results);

      // console.log("Check detected image file name = ", parsedResults.output_image);
      // const outputImagePath = path.resolve(pythonOptions.scriptPath, parsedResults.output_image);
      // if (!fs.existsSync(outputImagePath)) {
      //   throw new Error('Output image not found');
      // }

      return {
        fileName: file.filename,
        detectedEmotion: parsedResults.results,
        outputImage: parsedResults.output_image,
      };
    } catch (error) {
      console.error('Error running Python script:', error.message);
      throw new Error('Error processing image');
    }

  }

  private runPythonScript(scriptName: string, options: any): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const shell = new PythonShell(scriptName, options);
      let resultData: string[] = [];

      shell.on('message', (message) => {
        resultData.push(message);
      });

      shell.end((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(resultData);
        }
      });
    });
  }
}
