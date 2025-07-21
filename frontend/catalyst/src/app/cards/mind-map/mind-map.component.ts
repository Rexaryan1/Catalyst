import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';


// Interfaces (you can create a separate file for these later)
export interface MindMapNode {
  id: string;
  label: string;
  type: 'root' | 'topic' | 'subtopic';
  progress?: number;
  x?: number;
  y?: number;
  style?: {
    fill?: string;
    stroke?: string;
    textColor?: string;
  };
}

export interface MindMapEdge {
  source: string;
  target: string;
}

export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

@Component({
  selector: 'app-mind-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mind-map.component.html',
  styleUrls: ['./mind-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MindMapComponent implements OnInit, OnChanges {
  @Input() data: MindMapData = { nodes: [], edges: [] };
  @Input() width: number = 800;
  @Input() height: number = 600;
  @Input() showProgress: boolean = true;

  @Output() nodeClick = new EventEmitter<MindMapNode>();

  processedNodes: MindMapNode[] = [];
  processedEdges: any[] = [];

  ngOnInit(): void {
    this.calculateLayout();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.calculateLayout();
    }
  }

  trackNode(index: number, node: MindMapNode): string {
    return node.id;
  }

  trackEdge(index: number, edge: any): string {
    return `${edge.source}-${edge.target}`;
  }

  getNodeRadius(node: MindMapNode): number {
    return node.type === 'root' ? 40 : node.type === 'topic' ? 30 : 25;
  }

  getProgressCircumference(node: MindMapNode): string {
    const radius = this.getNodeRadius(node) + 4;
    const circumference = 2 * Math.PI * radius;
    return `${circumference} ${circumference}`;
  }

  getProgressOffset(node: MindMapNode): number {
    const radius = this.getNodeRadius(node) + 4;
    const circumference = 2 * Math.PI * radius;
    const progress = node.progress || 0;
    return circumference - (progress * circumference);
  }

  onNodeClick(node: MindMapNode): void {
    this.nodeClick.emit(node);
  }

  private calculateLayout(): void {
    if (!this.data.nodes.length) return;

    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const levelSpacing = 160;

    // Create node copies
    const nodeMap = new Map(this.data.nodes.map(n => [n.id, { ...n }]));

    // Find root node
    const rootNode = this.data.nodes.find(n => n.type === 'root') || this.data.nodes[0];

    // Position root at center
    const rootProcessed = nodeMap.get(rootNode.id)!;
    rootProcessed.x = centerX;
    rootProcessed.y = centerY;

    // Build adjacency list for children
    const adjacencyList = new Map<string, string[]>();
    this.data.edges.forEach(edge => {
      if (!adjacencyList.has(edge.source)) {
        adjacencyList.set(edge.source, []);
      }
      adjacencyList.get(edge.source)!.push(edge.target);
    });

    // Position children in circle around root
    const children = adjacencyList.get(rootNode.id) || [];
    const angleStep = (2 * Math.PI) / children.length;

    children.forEach((childId, index) => {
      const angle = index * angleStep;
      const childNode = nodeMap.get(childId)!;

      childNode.x = centerX + levelSpacing * Math.cos(angle);
      childNode.y = centerY + levelSpacing * Math.sin(angle);

      // Position grandchildren
      const grandchildren = adjacencyList.get(childId) || [];
      const grandchildSpacing = 100;

      grandchildren.forEach((grandchildId, gIndex) => {
        const grandchildNode = nodeMap.get(grandchildId)!;
        const gAngle = angle + (gIndex - (grandchildren.length - 1) / 2) * 0.3;

        grandchildNode.x = childNode.x! + grandchildSpacing * Math.cos(gAngle);
        grandchildNode.y = childNode.y! + grandchildSpacing * Math.sin(gAngle);
      });
    });

    this.processedNodes = Array.from(nodeMap.values());
    this.calculateEdges();
  }

  private calculateEdges(): void {
    const nodeMap = new Map(this.processedNodes.map(n => [n.id, n]));

    this.processedEdges = this.data.edges.map(edge => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);

      return {
        x1: sourceNode?.x,
        y1: sourceNode?.y,
        x2: targetNode?.x,
        y2: targetNode?.y
      };
    }).filter(edge => edge.x1 && edge.y1 && edge.x2 && edge.y2);
  }
}
