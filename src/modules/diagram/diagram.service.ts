import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Diagram } from './diagram.schema';
import { NodesService } from '../nodes/nodes.service';
import { EdgesService } from '../edges/edges.service';
import { CreateDiagramDto, UpdateDiagramDto } from './diagram.dto';

@Injectable()
export class DiagramService {
  constructor(
    @InjectModel(Diagram.name) private readonly model: Model<Diagram>,
    private readonly nodesService: NodesService,
    private readonly edgesService: EdgesService,
  ) {}

  async create(createDiagramDto: CreateDiagramDto): Promise<Diagram> {
    const { nodes = [], edges = [], ...rest } = createDiagramDto;

    // Node va edge'larni saqlash va ID'larini olish
    const nodeIds = await this.nodesService.createOrUpdateMany(nodes);
    const edgeIds = await this.edgesService.createOrUpdateMany(edges);

    // Diagrammani yaratish
    const createdDiagram = new this.model({
      ...rest,
      user: new Types.ObjectId(rest.user),
      nodes: nodeIds.map((id) => new Types.ObjectId(id)),
      edges: edgeIds.map((id) => new Types.ObjectId(id)),
    });
    return createdDiagram.save();
  }

  async saveDiagram(
    diagramData: UpdateDiagramDto & { _id?: string },
  ): Promise<Diagram> {
    const { _id, title, nodes = [], edges = [], user } = diagramData;

    // Node va edge'larni saqlash/yangilash
    const nodeIds = await this.nodesService.createOrUpdateMany(nodes);
    const edgeIds = await this.edgesService.createOrUpdateMany(edges);

    if (_id) {
      // Mavjud diagrammani yangilash
      const updatedDiagram = await this.model
        .findByIdAndUpdate(
          _id,
          {
            title,
            user: new Types.ObjectId(user),
            nodes: nodeIds.map((id) => new Types.ObjectId(id)),
            edges: edgeIds.map((id) => new Types.ObjectId(id)),
          },
          { new: true },
        )
        .populate('nodes')
        .populate('edges')
        .exec();
      if (!updatedDiagram) {
        throw new NotFoundException(`Diagram with id ${_id} not found`);
      }
      return updatedDiagram;
    } else {
      // Yangi diagramma yaratish
      const createdDiagram = await this.create({
        title,
        user: new Types.ObjectId(user),
        nodes,
        edges,
      });
      return createdDiagram;
    }
  }

  async findAll(userId: string): Promise<Diagram[]> {
    const diagrams = await this.model.find();
    console.log(diagrams);

    console.log(1);

    return await this.model
      .find({ user: new Types.ObjectId(userId) })
      .populate('edges')
      .populate('nodes')
      .exec();
  }

  async findOne(id: string): Promise<Diagram> {
    const diagram = await this.model
      .findById(id)
      .populate('nodes')
      .populate('edges')
      .exec();
    if (!diagram) {
      throw new NotFoundException(`Diagram with id ${id} not found`);
    }
    return diagram;
  }

  async update(
    id: string,
    updateDiagramDto: UpdateDiagramDto,
  ): Promise<Diagram> {
    const { nodes = [], edges = [], ...rest } = updateDiagramDto;

    // Node va edge'larni yangilash
    const nodeIds = await this.nodesService.createOrUpdateMany(nodes);
    const edgeIds = await this.edgesService.createOrUpdateMany(edges);

    const updatedDiagram = await this.model
      .findByIdAndUpdate(
        id,
        {
          ...rest,
          nodes: nodeIds.map((id) => new Types.ObjectId(id)),
          edges: edgeIds.map((id) => new Types.ObjectId(id)),
        },
        { new: true },
      )
      .populate('nodes')
      .populate('edges')
      .exec();
    if (!updatedDiagram) {
      throw new NotFoundException(`Diagram with id ${id} not found`);
    }
    return updatedDiagram;
  }

  async pushNode({
    node,
    diagram,
  }: {
    node: Types.ObjectId;
    diagram: Types.ObjectId;
  }) {
    const updatedDiagram = await this.model
      .findByIdAndUpdate(
        diagram,
        {
          $push: { nodes: node },
        },
        { new: true },
      )
      .exec();
    return updatedDiagram;
  }

  async pushEdge({
    edge,
    diagram,
  }: {
    edge: Types.ObjectId;
    diagram: Types.ObjectId;
  }) {
    const updatedDiagram = await this.model
      .findByIdAndUpdate(
        diagram,
        {
          $push: { edges: edge },
        },
        { new: true },
      )
      .exec();
    return updatedDiagram;
  }

  async pullNode({ node, diagram }: { node: string; diagram: string }) {
    return await this.model.findByIdAndUpdate(diagram, {
      $pull: { nodes: new Types.ObjectId(node) },
    });
  }

  async pullEdge({ edge, diagram }: { edge: string; diagram: string }) {
    return await this.model.findByIdAndUpdate(diagram, {
      $pull: { nodes: new Types.ObjectId(edge) },
    });
  }

  async remove(id: string): Promise<void> {
    const diagram = await this.model.findById(id).exec();
    if (!diagram) {
      throw new NotFoundException(`Diagram with id ${id} not found`);
    }
    // Bog'liq node va edge'larni o'chirish
    if (diagram.nodes.length > 0) {
      await this.nodesService.removeMany(
        diagram.nodes.map((id) => id.toString()),
      );
    }

    if (diagram.edges.length > 0) {
      await this.edgesService.removeMany(
        diagram.edges.map((id) => id.toString()),
      );
    }

    await this.model.findByIdAndDelete(id).exec();
  }

  async removeMany(nodeIds: string[]): Promise<void> {
    await this.model.deleteMany({ _id: { $in: nodeIds } }).exec();
  }
}
