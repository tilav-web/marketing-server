import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Nodes, NodesDocument } from './nodes.schema';
import { CreateNodeDto, UpdateNodeDto } from './nodes.dto';
import { DiagramService } from '../diagram/diagram.service';

@Injectable()
export class NodesService {
  constructor(
    @InjectModel(Nodes.name) private model: Model<NodesDocument>,
    @Inject(forwardRef(() => DiagramService))
    private readonly diagramService: DiagramService,
  ) {}

  async create(createNodeDto: CreateNodeDto): Promise<Nodes> {
    const createdNode = new this.model({
      ...createNodeDto,
      diagram: new Types.ObjectId(createNodeDto.diagram),
    });

    await this.diagramService.pushNode({
      node: new Types.ObjectId(createdNode._id.toString()),
      diagram: createNodeDto.diagram,
    });

    return createdNode.save();
  }

  async createOrUpdateMany(nodes: CreateNodeDto[]): Promise<string[]> {
    const nodeIds: string[] = [];
    for (const node of nodes) {
      const existingNode = await this.model.findOne({ id: node.id }).exec();
      if (existingNode) {
        await this.model.updateOne({ id: node.id }, { $set: node });
        nodeIds.push(existingNode._id.toString());
      } else {
        const createdNode = await this.create(node);
        nodeIds.push(createdNode.id.toString());
      }
    }
    return nodeIds;
  }

  async findAll(): Promise<Nodes[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Nodes> {
    const node = await this.model.findOne({ id }).exec();
    if (!node) {
      throw new NotFoundException(`Node with id ${id} not found`);
    }
    return node;
  }

  async update(id: string, updateNodeDto: UpdateNodeDto): Promise<Nodes> {
    const updatedNode = await this.model
      .findOneAndUpdate({ id }, updateNodeDto, { new: true })
      .exec();
    if (!updatedNode) {
      throw new NotFoundException(`Node with id ${id} not found`);
    }
    return updatedNode;
  }

  async remove({ node, diagram }): Promise<void> {
    await this.model.findByIdAndDelete(node).exec();
    await this.diagramService.pullNode({ node, diagram });
  }

  async removeMany(id: string[]): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
