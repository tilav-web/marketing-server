import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shape } from './shape.schema';
import { CreateShapeDto, UpdateShapeDto } from './shape.dto';

@Injectable()
export class ShapeService {
  constructor(@InjectModel(Shape.name) private shapeModel: Model<Shape>) {}

  async create(createShapeDto: CreateShapeDto): Promise<Shape> {
    try {
      const createdShape = new this.shapeModel(createShapeDto);
      return await createdShape.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create shape: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Shape[]> {
    try {
      return await this.shapeModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch shapes: ${error.message}`,
      );
    }
  }

  async findByDiagramId(id: string): Promise<Shape[]> {
    try {
      return await this.shapeModel.find({ diagram: id }).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch shapes for diagram ${id}: ${error.message}`,
      );
    }
  }

  async updateMany(shapes: Shape[]): Promise<Shape[]> {
    try {
      const bulkOps = shapes.map((shape) => ({
        updateOne: {
          filter: { _id: shape._id },
          update: { $set: shape },
        },
      }));

      await this.shapeModel.bulkWrite(bulkOps);

      // Yangilangan shakllarni qayta o‘qish
      const ids = shapes.map((s) => s._id);
      return await this.shapeModel.find({ _id: { $in: ids } }).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update shapes: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<Shape> {
    try {
      const shape = await this.shapeModel.findById(id).exec();
      if (!shape) {
        throw new NotFoundException(`Shape with ID ${id} not found`);
      }
      return shape;
    } catch (error) {
      throw new NotFoundException(`Failed to fetch shape: ${error.message}`);
    }
  }

  async update(id: string, updateShapeDto: UpdateShapeDto): Promise<Shape> {
    try {
      const updatedShape = await this.shapeModel
        .findByIdAndUpdate(id, updateShapeDto, { new: true })
        .exec();
      if (!updatedShape) {
        throw new NotFoundException(`Shape with ID ${id} not found`);
      }
      return updatedShape;
    } catch (error) {
      throw new NotFoundException(`Failed to update shape: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.shapeModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Shape with ID ${id} not found`);
      }
    } catch (error) {
      throw new NotFoundException(`Failed to delete shape: ${error.message}`);
    }
  }

  async deleteByDiagramId(diagramId: string): Promise<void> {
    try {
      await this.shapeModel.deleteMany({ diagram: diagramId }).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete shapes for diagram ${diagramId}: ${error.message}`,
      );
    }
  }
}
