import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Diagram } from './diagram.schema';
import { CreateDiagramDto, UpdateDiagramDto } from './diagram.dto';
import { ShapeService } from '../shape/shape.service';

@Injectable()
export class DiagramService {
  constructor(
    @InjectModel(Diagram.name) private diagramModel: Model<Diagram>,
    private shapeService: ShapeService,
  ) {}

  async create(createDiagramDto: CreateDiagramDto): Promise<Diagram> {
    // Shapes maydoni ixtiyoriy, agar mavjud bo‘lsa tekshirish
    if (createDiagramDto.shapes && createDiagramDto.shapes.length > 0) {
      for (const shapeId of createDiagramDto.shapes) {
        try {
          await this.shapeService.findOne(shapeId);
        } catch (error) {
          console.log(error);
          throw new NotFoundException(`Shape with ID ${shapeId} not found`);
        }
      }
    }
    const createdDiagram = new this.diagramModel({
      ...createDiagramDto,
      shapes: createDiagramDto.shapes || [], // Bo‘sh massiv, agar shapes yo‘q bo‘lsa
    });
    return createdDiagram.save();
  }

  async findAll(userId: string): Promise<Diagram[]> {
    console.log(userId);

    const diagrams = await this.diagramModel.find({ userId }).lean().exec();
    // Har bir diagramma uchun shapes ni olish
    const result: Diagram[] = [];
    for (const diagram of diagrams) {
      const shapes = await this.shapeService.findByDiagramId(
        diagram._id.toString(),
      );
      result.push({ ...diagram, shapes });
    }
    return result;
  }

  async findOne(id: string): Promise<Diagram> {
    const diagram = await this.diagramModel.findById(id).lean().exec();
    if (!diagram) {
      throw new NotFoundException(`Diagram with ID ${id} not found`);
    }
    const shapes = await this.shapeService.findByDiagramId(id);
    return { ...diagram, shapes };
  }

  async update(
    id: string,
    updateDiagramDto: UpdateDiagramDto,
  ): Promise<Diagram> {
    // Shapes maydoni ixtiyoriy, agar mavjud bo‘lsa tekshirish
    if (updateDiagramDto.shapes && updateDiagramDto.shapes.length > 0) {
      for (const shapeId of updateDiagramDto.shapes) {
        try {
          await this.shapeService.findOne(shapeId);
        } catch (error) {
          console.log(error);
          throw new NotFoundException(`Shape with ID ${shapeId} not found`);
        }
      }
    }
    const updatedDiagram = await this.diagramModel
      .findByIdAndUpdate(id, updateDiagramDto, { new: true })
      .lean()
      .exec();
    if (!updatedDiagram) {
      throw new NotFoundException(`Diagram with ID ${id} not found`);
    }
    const shapes = await this.shapeService.findByDiagramId(id);
    return { ...updatedDiagram, shapes };
  }

  async delete(id: string): Promise<void> {
    const result = await this.diagramModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Diagram with ID ${id} not found`);
    }
    // Bog‘langan shapes ni o‘chirish (ixtiyoriy)
    await this.shapeService.deleteByDiagramId(id);
  }
}
