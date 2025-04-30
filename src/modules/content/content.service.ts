import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Content } from './content.schema';
import { CreateContentDto, UpdateContentDto } from './content.dto';

@Injectable()
export class ContentService {
  constructor(@InjectModel(Content.name) private model: Model<Content>) {}

  async create(createContentDto: CreateContentDto): Promise<Content> {
    return (await this.model.create(createContentDto)).populate('assignedTo');
  }

  async findAll(): Promise<Content[]> {
    return this.model.find().populate('assignedTo').exec();
  }

  async findOne(id: string): Promise<Content> {
    return this.model.findById(id).exec();
  }

  async update(
    id: string,
    { name, status, assignedTo, type, publish_date }: UpdateContentDto,
  ): Promise<Content> {
    const content = await this.model.findById(id).exec();
    if (!content) {
      throw new Error('Content not found');
    }

    if (name) content.name = name;
    if (status) content.status = status;
    if (isValidObjectId(assignedTo)) {
      content.assignedTo = new Types.ObjectId(assignedTo);
    }
    if (type) content.type = type;
    if (publish_date) content.publish_date = publish_date;

    return (await content.save()).populate('assignedTo');
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
