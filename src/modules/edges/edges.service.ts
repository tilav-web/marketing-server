import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Edges, EdgesDocument } from './edges.schema';
import { CreateEdgeDto, UpdateEdgeDto } from './edges.dto';
import { DiagramService } from '../diagram/diagram.service';

@Injectable()
export class EdgesService {
  constructor(
    @InjectModel(Edges.name) private model: Model<EdgesDocument>,
    @Inject(forwardRef(() => DiagramService))
    private readonly diagramService: DiagramService,
  ) {}

  async create(createEdgeDto: CreateEdgeDto): Promise<Edges> {
    const createdEdge = new this.model({
      ...createEdgeDto,
      diagram: new Types.ObjectId(createEdgeDto.diagram),
    });

    await this.diagramService.pushEdge({
      edge: new Types.ObjectId(createdEdge._id.toString()),
      diagram: createEdgeDto.diagram,
    });

    return createdEdge.save();
  }

  async createOrUpdateMany(edges: CreateEdgeDto[]): Promise<string[]> {
    const edgeIds: string[] = [];
    for (const edge of edges) {
      const existingEdge = await this.model.findOne({ id: edge.id }).exec();
      if (existingEdge) {
        await this.model.updateOne({ id: edge.id }, { $set: edge });
        edgeIds.push(existingEdge._id.toString());
      } else {
        const createdEdge = await this.create(edge);
        edgeIds.push(createdEdge.id.toString());
      }
    }
    return edgeIds;
  }

  async findAll(): Promise<Edges[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Edges> {
    const edge = await this.model.findOne({ id }).exec();
    if (!edge) {
      throw new NotFoundException(`Edge with id ${id} not found`);
    }
    return edge;
  }

  async update(id: string, updateEdgeDto: UpdateEdgeDto): Promise<Edges> {
    const updatedEdge = await this.model
      .findOneAndUpdate({ id }, updateEdgeDto, { new: true })
      .exec();
    if (!updatedEdge) {
      throw new NotFoundException(`Edge with id ${id} not found`);
    }
    return updatedEdge;
  }

  async remove({ edge, diagram }): Promise<void> {
    await this.model.findByIdAndDelete(edge).exec();
    await this.diagramService.pullEdge({ edge, diagram });
  }

  async removeMany(id: string[]): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
