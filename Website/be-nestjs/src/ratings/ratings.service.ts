import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { IUser } from 'src/users/users.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { Rating, RatingDocument } from './schemas/ratings.schema';
import { PythonShell } from 'python-shell';
import * as path from 'path';

@Injectable()
export class RatingsService {

  constructor(
    @InjectModel(Rating.name)
    private ratingModel: SoftDeleteModel<RatingDocument>
  ) { }



  async create(createRatingDto: CreateRatingDto, user: IUser) {
    const { url, typeId, productId, comment, detectedEmotion } = createRatingDto;
    const { email, _id } = user;
    // Config for sentiment

    const pythonOptions = {
      scriptPath: path.resolve(__dirname, '../../src/python-model-AI/'), // Đường dẫn tuyệt đối đến thư mục chứa script Python
      pythonPath: path.resolve(__dirname, '../../env/Scripts/python.exe'),
      args: [comment],
      pythonOptions: ['-u'],
      encoding: 'utf-8',
    };
    const results = await this.runPythonScript('sentiment_detection.py', pythonOptions);

    // Ghép các dòng output và lọc phần JSON
    const combinedResults = results.join('');
    const jsonMatch = combinedResults.match(/{.*}/s);  // Regex tìm đoạn JSON trong output
    if (!jsonMatch) {
      throw new Error('Invalid result from Python script');
    }
    const parsedResults = JSON.parse(jsonMatch[0]);
    //-----

    const negativeEmotions = ['angry', 'disgust', 'fear', 'sad'];
    const threshold = 0.5;

    const sortedEmotions = detectedEmotion.sort((a, b) => b.confidenceScore - a.confidenceScore);

    // Kiểm tra cảm xúc tích cực và tiêu cực với confidenceScore cao nhất
    const topPositive = sortedEmotions.find(emotion => !negativeEmotions.includes(emotion.class) && emotion.confidenceScore >= threshold);
    const topNegative = sortedEmotions.find(emotion => negativeEmotions.includes(emotion.class) && emotion.confidenceScore >= threshold);

    let isPositive = "N/A";

    if (
      (topPositive && (!topNegative || topPositive.confidenceScore > topNegative.confidenceScore)) &&
      (parsedResults.emotion === "Positive" ||
        parsedResults.emotion === "Neutral")
    ) {
      isPositive = "Có";
    } else if (topNegative && parsedResults.emotion === "Negative") {
      isPositive = "Không";
    }
    else {
      isPositive = "Bình thường"
    }

    console.log("isPositive =", isPositive);



    const newRating = await this.ratingModel.create({
      url,
      typeId,
      productId,
      userId: _id,
      status: "PENDING",
      comment,
      detectedEmotion: sortedEmotions,
      commentEmotionAnalysis: parsedResults.emotion,
      isPositive,
      createdBy: {
        _id,
        email
      },
      history: [
        {
          status: "PENDING",
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      ]
    });

    return {
      _id: newRating?._id,
      createdAt: newRating?.createdAt
    };
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
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.ratingModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.ratingModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("not found rating")
    }

    return await this.ratingModel.findById(id);
  }
  async findByUsers(user: IUser) {
    return await this.ratingModel.find({
      userId: user._id,
    })
      .sort("-createdAt")
      .populate([
        {
          path: "typeId",
          select: { name: 1 }
        },
        {
          path: "productId",
          select: { name: 1 }
        }
      ])
  }

  async update(_id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException("not found rating")
    }

    const updated = await this.ratingModel.updateOne(
      { _id },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email
        },
        $push: {
          history: {
            status: status,
            updatedAt: new Date,
            updatedBy: {
              _id: user._id,
              email: user.email
            }
          }
        }
      });

    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.ratingModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.ratingModel.softDelete({
      _id: id
    })
  }

  async getTotal() {
    const totalItems = await this.ratingModel.countDocuments();
    return { totalItems: totalItems };
  }

  async getPositive() {
    const positiveRatings = (await this.ratingModel.find({ isPositive: "Có" })).length;
    return { positiveRatings: positiveRatings };
  }

  async getNegative() {
    const negativeRatings = (await this.ratingModel.find({ isPositive: "Không" })).length;
    return { negativeRatings: negativeRatings };
  }
}