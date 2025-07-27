
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MindMapComponent, MindMapNode } from "@app/cards/mind-map/mind-map.component";



@Component({
  selector: 'app-roadmap-page',
  standalone: true,
  imports: [RouterOutlet, MindMapComponent],
  templateUrl: './roadmap-page.component.html',
  styleUrl: './roadmap-page.component.scss'
})

export class RoadmapPageComponent {
  title = 'My Mind Map App';

  // Sample data for the mind map
  mindMapData = {
    nodes: [
      { id: '1', label: 'DSA', type: 'root' as const },
      { id: '2', label: 'Arrays', type: 'topic' as const, progress: 0.8 },
      { id: '3', label: 'Linked Lists', type: 'topic' as const, progress: 0.6 },
      { id: '4', label: 'Trees', type: 'topic' as const, progress: 0.4 },
      { id: '5', label: 'Two Pointers', type: 'subtopic' as const, progress: 0.9 },
      { id: '6', label: 'Sorting', type: 'subtopic' as const, progress: 0.7 },
      { id: '7', label: 'Singly LL', type: 'subtopic' as const, progress: 0.8 },
      { id: '8', label: 'Doubly LL', type: 'subtopic' as const, progress: 0.4 }
    ],
    edges: [
      { source: '1', target: '2' },
      { source: '1', target: '3' },
      { source: '1', target: '4' },
      { source: '2', target: '5' },
      { source: '2', target: '6' },
      { source: '3', target: '7' },
      { source: '3', target: '8' }
    ]
  };

  // Function to handle clicks on a node
  handleNodeClick(node: MindMapNode) {
    console.log('Node clicked in parent:', node);
    alert(`You clicked on: ${node.label}`);
  }
}






