import type {
  MeshPerformanceMetrics,
  AttentionFlowMetrics,
  MeshTopology,
  MeshNode,
  ResourceUtilization
} from './mesh-topology.js';

import type {
  ECANAttentionValue,
  ECANScheduler,
  ScheduledTask
} from './ecan-scheduler.js';

import type {
  AtomSpace,
  HypergraphNode,
  HypergraphEdge,
  AttentionWeight
} from '../entities/cognitive-tensor.js';

/**
 * Attention Flow Visualization and Analysis Tools
 * 
 * Provides comprehensive visualization and analysis capabilities for
 * cognitive attention flow patterns in the distributed mesh network.
 */

export interface AttentionFlowVisualization {
  type: 'mermaid' | 'graphviz' | 'd3' | 'cytoscape';
  content: string;
  metadata: VisualizationMetadata;
}

export interface VisualizationMetadata {
  title: string;
  timestamp: number;
  nodeCount: number;
  edgeCount: number;
  timeRange: [number, number];
  maxFlowRate: number;
  averageFlowRate: number;
}

export interface FlowAnalysisResult {
  criticalPaths: CriticalPath[];
  bottlenecks: FlowBottleneck[];
  clusters: AttentionCluster[];
  efficiency: EfficiencyMetrics;
  recommendations: FlowRecommendation[];
}

export interface CriticalPath {
  path: string[];
  totalFlow: number;
  averageLatency: number;
  bottleneckNode?: string;
  importance: number;
}

export interface FlowBottleneck {
  nodeId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  inputFlow: number;
  outputFlow: number;
  queueSize: number;
  recommendations: string[];
}

export interface AttentionCluster {
  nodeIds: string[];
  centralNode: string;
  cohesion: number;
  totalFlow: number;
  averageEfficiency: number;
}

export interface EfficiencyMetrics {
  overallEfficiency: number;
  throughputUtilization: number;
  latencyOptimization: number;
  resourceBalance: number;
  attentionDistribution: number;
}

export interface FlowRecommendation {
  type: 'rebalance' | 'scale-up' | 'scale-down' | 'reconfigure' | 'optimize';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  targetNodes: string[];
  expectedImprovement: number;
}

export interface ResourceAllocationChart {
  type: 'timeline' | 'heatmap' | 'scatter' | 'bar';
  data: ChartDataPoint[];
  config: ChartConfig;
}

export interface ChartDataPoint {
  timestamp: number;
  nodeId: string;
  value: number;
  category: string;
  metadata?: Record<string, unknown>;
}

export interface ChartConfig {
  title: string;
  xAxis: string;
  yAxis: string;
  colorScheme: string[];
  interactive: boolean;
  exportFormats: string[];
}

export class AttentionFlowVisualizer {
  private flowHistory: AttentionFlowMetrics[] = [];
  private performanceHistory: MeshPerformanceMetrics[] = [];
  private maxHistorySize = 10000;

  /**
   * Generate Mermaid flowchart for attention flow patterns
   */
  generateMermaidFlowchart(
    topology: MeshTopology,
    flowMetrics: AttentionFlowMetrics[],
    timeWindow = 300000 // 5 minutes
  ): AttentionFlowVisualization {
    const now = Date.now();
    const recentFlows = flowMetrics.filter(
      flow => now - flow.timestamp <= timeWindow
    );

    let mermaidContent = 'flowchart TD\n';
    
    // Add nodes
    for (const [nodeId, node] of topology.nodes) {
      const nodeLoad = Math.round(node.currentLoad);
      const nodeStatus = this.getNodeStatusIcon(node.status);
      mermaidContent += `    ${nodeId}["${node.id}<br/>Load: ${nodeLoad}%<br/>${nodeStatus}"]\n`;
      
      // Style nodes based on load
      if (nodeLoad > 80) {
        mermaidContent += `    ${nodeId} --> |"High Load"| ${nodeId}\n`;
        mermaidContent += `    class ${nodeId} high-load;\n`;
      } else if (nodeLoad > 60) {
        mermaidContent += `    class ${nodeId} medium-load;\n`;
      } else {
        mermaidContent += `    class ${nodeId} low-load;\n`;
      }
    }

    // Add flow connections
    const flowConnections = new Map<string, { target: string; totalFlow: number; avgLatency: number }>();
    
    for (const flow of recentFlows) {
      const key = `${flow.sourceNodeId}-${flow.targetNodeId}`;
      const existing = flowConnections.get(key) || { target: flow.targetNodeId, totalFlow: 0, avgLatency: 0 };
      existing.totalFlow += flow.flowRate;
      existing.avgLatency = (existing.avgLatency + flow.latency) / 2;
      flowConnections.set(key, existing);
    }

    // Add edges with flow information
    for (const [key, connection] of flowConnections) {
      const [source] = key.split('-');
      const flowRate = Math.round(connection.totalFlow);
      const latency = Math.round(connection.avgLatency);
      
      if (flowRate > 0) {
        mermaidContent += `    ${source} -->|"Flow: ${flowRate}<br/>Latency: ${latency}ms"| ${connection.target}\n`;
      }
    }

    // Add styling
    mermaidContent += `
    classDef high-load fill:#ff6b6b,stroke:#d63447,stroke-width:3px;
    classDef medium-load fill:#ffd93d,stroke:#f39c12,stroke-width:2px;
    classDef low-load fill:#6bcf7f,stroke:#27ae60,stroke-width:2px;
    `;

    const maxFlowRate = Math.max(...recentFlows.map(f => f.flowRate), 0);
    const avgFlowRate = recentFlows.length > 0 
      ? recentFlows.reduce((sum, f) => sum + f.flowRate, 0) / recentFlows.length 
      : 0;

    return {
      type: 'mermaid',
      content: mermaidContent,
      metadata: {
        title: 'Attention Flow Network',
        timestamp: now,
        nodeCount: topology.nodes.size,
        edgeCount: flowConnections.size,
        timeRange: [now - timeWindow, now],
        maxFlowRate,
        averageFlowRate: avgFlowRate
      }
    };
  }

  /**
   * Generate recursive resource allocation pathways flowchart
   */
  generateRecursiveAllocationFlowchart(
    scheduler: ECANScheduler,
    atomSpace: AtomSpace,
    depth = 3
  ): AttentionFlowVisualization {
    let mermaidContent = 'flowchart TB\n';
    
    // Start with high-attention nodes
    const highAttentionNodes = Array.from(atomSpace.nodes.values())
      .map(node => ({
        node,
        attention: scheduler.getAttentionValue(node.id)
      }))
      .filter(item => item.attention && item.attention.sti > 1000)
      .sort((a, b) => b.attention!.sti - a.attention!.sti)
      .slice(0, 10); // Top 10 nodes

    // Build recursive allocation tree
    let nodeCounter = 0;
    const processedNodes = new Set<string>();
    
    for (const { node, attention } of highAttentionNodes) {
      if (processedNodes.has(node.id)) continue;
      
      this.addRecursiveAllocationPath(
        mermaidContent,
        node,
        attention!,
        atomSpace,
        scheduler,
        depth,
        processedNodes,
        nodeCounter
      );
      nodeCounter++;
    }

    // Add styling for different attention levels
    mermaidContent += `
    classDef high-sti fill:#ff4757,stroke:#ff3742,stroke-width:3px;
    classDef medium-sti fill:#ffa502,stroke:#ff9500,stroke-width:2px;
    classDef low-sti fill:#2ed573,stroke:#1dd1a1,stroke-width:2px;
    classDef vlti fill:#5352ed,stroke:#3742fa,stroke-width:4px;
    `;

    return {
      type: 'mermaid',
      content: mermaidContent,
      metadata: {
        title: 'Recursive Resource Allocation Pathways',
        timestamp: Date.now(),
        nodeCount: highAttentionNodes.length,
        edgeCount: 0, // Would count edges during generation
        timeRange: [Date.now() - 300000, Date.now()],
        maxFlowRate: Math.max(...highAttentionNodes.map(item => item.attention!.sti)),
        averageFlowRate: highAttentionNodes.reduce((sum, item) => sum + item.attention!.sti, 0) / highAttentionNodes.length
      }
    };
  }

  /**
   * Generate performance analysis visualization
   */
  generatePerformanceAnalysisChart(
    performanceHistory: MeshPerformanceMetrics[],
    chartType: 'timeline' | 'heatmap' | 'scatter' = 'timeline'
  ): ResourceAllocationChart {
    const data: ChartDataPoint[] = [];
    
    for (const metrics of performanceHistory) {
      // Add throughput data points
      data.push({
        timestamp: Date.now(), // In real implementation, this would come from metrics
        nodeId: 'mesh',
        value: metrics.throughput,
        category: 'throughput'
      });
      
      // Add latency data points
      data.push({
        timestamp: Date.now(),
        nodeId: 'mesh',
        value: metrics.latency,
        category: 'latency'
      });
      
      // Add resource utilization data points
      data.push({
        timestamp: Date.now(),
        nodeId: 'mesh',
        value: metrics.resourceUtilization.cpu,
        category: 'cpu-utilization'
      });
      
      data.push({
        timestamp: Date.now(),
        nodeId: 'mesh',
        value: metrics.resourceUtilization.memory,
        category: 'memory-utilization'
      });
    }

    return {
      type: chartType,
      data,
      config: {
        title: 'Mesh Performance Analysis',
        xAxis: 'Time',
        yAxis: 'Value',
        colorScheme: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
        interactive: true,
        exportFormats: ['png', 'svg', 'pdf']
      }
    };
  }

  /**
   * Analyze attention flow patterns for optimization opportunities
   */
  analyzeAttentionFlow(
    flowMetrics: AttentionFlowMetrics[],
    topology: MeshTopology
  ): FlowAnalysisResult {
    const criticalPaths = this.findCriticalPaths(flowMetrics, topology);
    const bottlenecks = this.identifyBottlenecks(flowMetrics, topology);
    const clusters = this.findAttentionClusters(flowMetrics, topology);
    const efficiency = this.calculateEfficiencyMetrics(flowMetrics, topology);
    const recommendations = this.generateRecommendations(criticalPaths, bottlenecks, efficiency);

    return {
      criticalPaths,
      bottlenecks,
      clusters,
      efficiency,
      recommendations
    };
  }

  /**
   * Generate real-time attention flow dashboard data
   */
  generateDashboardData(
    topology: MeshTopology,
    flowMetrics: AttentionFlowMetrics[],
    performanceMetrics: MeshPerformanceMetrics[]
  ): {
    summary: Record<string, number>;
    charts: ResourceAllocationChart[];
    alerts: FlowRecommendation[];
  } {
    const recentFlows = flowMetrics.filter(
      flow => Date.now() - flow.timestamp <= 60000 // Last minute
    );

    const summary = {
      totalNodes: topology.nodes.size,
      activeNodes: Array.from(topology.nodes.values()).filter(n => n.status === 'active').length,
      averageLoad: this.calculateAverageLoad(topology),
      totalFlowRate: recentFlows.reduce((sum, flow) => sum + flow.flowRate, 0),
      averageLatency: recentFlows.length > 0 
        ? recentFlows.reduce((sum, flow) => sum + flow.latency, 0) / recentFlows.length 
        : 0,
      efficiency: this.calculateOverallEfficiency(recentFlows)
    };

    const charts = [
      this.generatePerformanceAnalysisChart(performanceMetrics, 'timeline'),
      this.generateLoadDistributionChart(topology),
      this.generateFlowRateChart(recentFlows)
    ];

    const analysis = this.analyzeAttentionFlow(recentFlows, topology);
    const alerts = analysis.recommendations.filter(rec => rec.priority === 'high' || rec.priority === 'critical');

    return { summary, charts, alerts };
  }

  private getNodeStatusIcon(status: string): string {
    switch (status) {
      case 'active': return '✅';
      case 'busy': return '⚠️';
      case 'offline': return '❌';
      case 'maintenance': return '🔧';
      default: return '❓';
    }
  }

  private addRecursiveAllocationPath(
    content: string,
    node: HypergraphNode,
    attention: ECANAttentionValue,
    atomSpace: AtomSpace,
    scheduler: ECANScheduler,
    depth: number,
    processed: Set<string>,
    counter: number
  ): void {
    if (depth <= 0 || processed.has(node.id)) return;
    
    processed.add(node.id);
    
    const nodeId = `node_${counter}_${node.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const stiClass = attention.sti > 10000 ? 'high-sti' : 
                     attention.sti > 1000 ? 'medium-sti' : 'low-sti';
    const vltiClass = attention.vlti ? 'vlti' : '';
    
    content += `    ${nodeId}["${node.type}<br/>STI: ${attention.sti}<br/>LTI: ${attention.lti}"]\n`;
    content += `    class ${nodeId} ${stiClass} ${vltiClass};\n`;
    
    // Find connected nodes and recurse
    const connectedEdges = Array.from(atomSpace.edges.values())
      .filter(edge => edge.nodes.includes(node.id));
    
    for (const edge of connectedEdges.slice(0, 3)) { // Limit to 3 connections per node
      const connectedNodeId = edge.nodes.find(id => id !== node.id);
      if (connectedNodeId) {
        const connectedNode = atomSpace.nodes.get(connectedNodeId);
        const connectedAttention = scheduler.getAttentionValue(connectedNodeId);
        
        if (connectedNode && connectedAttention && !processed.has(connectedNodeId)) {
          const connectedNodeElementId = `node_${counter + 1}_${connectedNodeId.replace(/[^a-zA-Z0-9]/g, '_')}`;
          content += `    ${nodeId} -->|"Weight: ${edge.weight}"| ${connectedNodeElementId}\n`;
          
          this.addRecursiveAllocationPath(
            content,
            connectedNode,
            connectedAttention,
            atomSpace,
            scheduler,
            depth - 1,
            processed,
            counter + 1
          );
        }
      }
    }
  }

  private findCriticalPaths(
    flowMetrics: AttentionFlowMetrics[],
    topology: MeshTopology
  ): CriticalPath[] {
    const paths: CriticalPath[] = [];
    
    // Group flows by source-target pairs
    const flowGroups = new Map<string, AttentionFlowMetrics[]>();
    for (const flow of flowMetrics) {
      const key = `${flow.sourceNodeId}-${flow.targetNodeId}`;
      if (!flowGroups.has(key)) {
        flowGroups.set(key, []);
      }
      flowGroups.get(key)!.push(flow);
    }
    
    // Analyze each flow group
    for (const [key, flows] of flowGroups) {
      const [source, target] = key.split('-');
      const totalFlow = flows.reduce((sum, flow) => sum + flow.flowRate, 0);
      const averageLatency = flows.reduce((sum, flow) => sum + flow.latency, 0) / flows.length;
      const importance = this.calculatePathImportance(flows);
      
      paths.push({
        path: [source, target],
        totalFlow,
        averageLatency,
        importance
      });
    }
    
    return paths.sort((a, b) => b.importance - a.importance).slice(0, 10);
  }

  private identifyBottlenecks(
    flowMetrics: AttentionFlowMetrics[],
    topology: MeshTopology
  ): FlowBottleneck[] {
    const bottlenecks: FlowBottleneck[] = [];
    
    // Analyze each node for bottleneck patterns
    for (const [nodeId, node] of topology.nodes) {
      const incomingFlows = flowMetrics.filter(flow => flow.targetNodeId === nodeId);
      const outgoingFlows = flowMetrics.filter(flow => flow.sourceNodeId === nodeId);
      
      const inputFlow = incomingFlows.reduce((sum, flow) => sum + flow.flowRate, 0);
      const outputFlow = outgoingFlows.reduce((sum, flow) => sum + flow.flowRate, 0);
      
      // Detect bottleneck conditions
      if (inputFlow > outputFlow * 1.5 && node.currentLoad > 80) {
        const severity = node.currentLoad > 95 ? 'critical' : 
                        node.currentLoad > 90 ? 'high' : 'medium';
        
        bottlenecks.push({
          nodeId,
          severity,
          inputFlow,
          outputFlow,
          queueSize: inputFlow - outputFlow,
          recommendations: this.generateBottleneckRecommendations(node, inputFlow, outputFlow)
        });
      }
    }
    
    return bottlenecks.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  private findAttentionClusters(
    flowMetrics: AttentionFlowMetrics[],
    topology: MeshTopology
  ): AttentionCluster[] {
    const clusters: AttentionCluster[] = [];
    
    // Use simple clustering based on flow patterns
    const nodeConnections = new Map<string, Set<string>>();
    const nodeFlows = new Map<string, number>();
    
    for (const flow of flowMetrics) {
      if (!nodeConnections.has(flow.sourceNodeId)) {
        nodeConnections.set(flow.sourceNodeId, new Set());
      }
      nodeConnections.get(flow.sourceNodeId)!.add(flow.targetNodeId);
      
      nodeFlows.set(flow.sourceNodeId, (nodeFlows.get(flow.sourceNodeId) || 0) + flow.flowRate);
      nodeFlows.set(flow.targetNodeId, (nodeFlows.get(flow.targetNodeId) || 0) + flow.flowRate);
    }
    
    // Find densely connected components
    const processed = new Set<string>();
    for (const [nodeId, connections] of nodeConnections) {
      if (processed.has(nodeId)) continue;
      
      const cluster = this.expandCluster(nodeId, nodeConnections, processed);
      if (cluster.size >= 3) {
        const nodeIds = Array.from(cluster);
        const totalFlow = nodeIds.reduce((sum, id) => sum + (nodeFlows.get(id) || 0), 0);
        const centralNode = nodeIds.reduce((max, id) => 
          (nodeFlows.get(id) || 0) > (nodeFlows.get(max) || 0) ? id : max
        );
        
        clusters.push({
          nodeIds,
          centralNode,
          cohesion: this.calculateClusterCohesion(nodeIds, nodeConnections),
          totalFlow,
          averageEfficiency: this.calculateClusterEfficiency(nodeIds, flowMetrics)
        });
      }
    }
    
    return clusters.sort((a, b) => b.totalFlow - a.totalFlow).slice(0, 5);
  }

  private calculateEfficiencyMetrics(
    flowMetrics: AttentionFlowMetrics[],
    topology: MeshTopology
  ): EfficiencyMetrics {
    const overallEfficiency = this.calculateOverallEfficiency(flowMetrics);
    const throughputUtilization = this.calculateThroughputUtilization(topology);
    const latencyOptimization = this.calculateLatencyOptimization(flowMetrics);
    const resourceBalance = this.calculateResourceBalance(topology);
    const attentionDistribution = this.calculateAttentionDistribution(flowMetrics);
    
    return {
      overallEfficiency,
      throughputUtilization,
      latencyOptimization,
      resourceBalance,
      attentionDistribution
    };
  }

  private generateRecommendations(
    criticalPaths: CriticalPath[],
    bottlenecks: FlowBottleneck[],
    efficiency: EfficiencyMetrics
  ): FlowRecommendation[] {
    const recommendations: FlowRecommendation[] = [];
    
    // Recommendations for critical bottlenecks
    for (const bottleneck of bottlenecks.filter(b => b.severity === 'critical')) {
      recommendations.push({
        type: 'scale-up',
        priority: 'critical',
        description: `Critical bottleneck detected at node ${bottleneck.nodeId}. Immediate scaling required.`,
        targetNodes: [bottleneck.nodeId],
        expectedImprovement: 30
      });
    }
    
    // Recommendations for low efficiency
    if (efficiency.overallEfficiency < 0.7) {
      recommendations.push({
        type: 'optimize',
        priority: 'high',
        description: 'Overall system efficiency is below optimal. Consider rebalancing workloads.',
        targetNodes: [],
        expectedImprovement: 20
      });
    }
    
    // Recommendations for resource imbalance
    if (efficiency.resourceBalance < 0.6) {
      recommendations.push({
        type: 'rebalance',
        priority: 'medium',
        description: 'Resource distribution is unbalanced across the mesh.',
        targetNodes: [],
        expectedImprovement: 15
      });
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private calculatePathImportance(flows: AttentionFlowMetrics[]): number {
    const totalFlow = flows.reduce((sum, flow) => sum + flow.flowRate, 0);
    const averageEfficiency = flows.reduce((sum, flow) => sum + flow.efficiency, 0) / flows.length;
    const consistency = 1 - (this.calculateFlowVariance(flows) / totalFlow);
    
    return totalFlow * averageEfficiency * consistency;
  }

  private calculateFlowVariance(flows: AttentionFlowMetrics[]): number {
    const mean = flows.reduce((sum, flow) => sum + flow.flowRate, 0) / flows.length;
    const variance = flows.reduce((sum, flow) => sum + Math.pow(flow.flowRate - mean, 2), 0) / flows.length;
    return Math.sqrt(variance);
  }

  private generateBottleneckRecommendations(
    node: MeshNode,
    inputFlow: number,
    outputFlow: number
  ): string[] {
    const recommendations: string[] = [];
    
    if (node.currentLoad > 95) {
      recommendations.push('Immediate scale-up required');
    }
    
    if (inputFlow > outputFlow * 2) {
      recommendations.push('Consider load shedding or traffic throttling');
    }
    
    if (node.availableResources.cpu < 100) {
      recommendations.push('CPU resources critically low');
    }
    
    if (node.availableResources.memory < 100) {
      recommendations.push('Memory resources critically low');
    }
    
    return recommendations;
  }

  private expandCluster(
    startNode: string,
    connections: Map<string, Set<string>>,
    processed: Set<string>
  ): Set<string> {
    const cluster = new Set<string>();
    const queue = [startNode];
    
    while (queue.length > 0) {
      const node = queue.shift()!;
      if (processed.has(node)) continue;
      
      processed.add(node);
      cluster.add(node);
      
      const nodeConnections = connections.get(node);
      if (nodeConnections) {
        for (const connected of nodeConnections) {
          if (!processed.has(connected) && !queue.includes(connected)) {
            queue.push(connected);
          }
        }
      }
    }
    
    return cluster;
  }

  private calculateClusterCohesion(
    nodeIds: string[],
    connections: Map<string, Set<string>>
  ): number {
    let totalConnections = 0;
    let internalConnections = 0;
    
    for (const nodeId of nodeIds) {
      const nodeConnections = connections.get(nodeId);
      if (nodeConnections) {
        totalConnections += nodeConnections.size;
        for (const connected of nodeConnections) {
          if (nodeIds.includes(connected)) {
            internalConnections++;
          }
        }
      }
    }
    
    return totalConnections > 0 ? internalConnections / totalConnections : 0;
  }

  private calculateClusterEfficiency(
    nodeIds: string[],
    flowMetrics: AttentionFlowMetrics[]
  ): number {
    const clusterFlows = flowMetrics.filter(flow => 
      nodeIds.includes(flow.sourceNodeId) && nodeIds.includes(flow.targetNodeId)
    );
    
    if (clusterFlows.length === 0) return 0;
    
    return clusterFlows.reduce((sum, flow) => sum + flow.efficiency, 0) / clusterFlows.length;
  }

  private calculateOverallEfficiency(flowMetrics: AttentionFlowMetrics[]): number {
    if (flowMetrics.length === 0) return 0;
    return flowMetrics.reduce((sum, flow) => sum + flow.efficiency, 0) / flowMetrics.length;
  }

  private calculateThroughputUtilization(topology: MeshTopology): number {
    const activeNodes = Array.from(topology.nodes.values()).filter(n => n.status === 'active');
    if (activeNodes.length === 0) return 0;
    
    const averageLoad = activeNodes.reduce((sum, node) => sum + node.currentLoad, 0) / activeNodes.length;
    return Math.min(1, averageLoad / 80); // 80% is considered optimal
  }

  private calculateLatencyOptimization(flowMetrics: AttentionFlowMetrics[]): number {
    if (flowMetrics.length === 0) return 1;
    
    const averageLatency = flowMetrics.reduce((sum, flow) => sum + flow.latency, 0) / flowMetrics.length;
    const optimalLatency = 50; // Optimal latency target
    
    return Math.max(0, 1 - (averageLatency - optimalLatency) / optimalLatency);
  }

  private calculateResourceBalance(topology: MeshTopology): number {
    const activeNodes = Array.from(topology.nodes.values()).filter(n => n.status === 'active');
    if (activeNodes.length === 0) return 1;
    
    const loads = activeNodes.map(node => node.currentLoad);
    const average = loads.reduce((sum, load) => sum + load, 0) / loads.length;
    const variance = loads.reduce((sum, load) => sum + Math.pow(load - average, 2), 0) / loads.length;
    const standardDeviation = Math.sqrt(variance);
    
    return Math.max(0, 1 - standardDeviation / 50); // Lower deviation = better balance
  }

  private calculateAttentionDistribution(flowMetrics: AttentionFlowMetrics[]): number {
    if (flowMetrics.length === 0) return 1;
    
    const nodeFlows = new Map<string, number>();
    for (const flow of flowMetrics) {
      nodeFlows.set(flow.sourceNodeId, (nodeFlows.get(flow.sourceNodeId) || 0) + flow.flowRate);
      nodeFlows.set(flow.targetNodeId, (nodeFlows.get(flow.targetNodeId) || 0) + flow.flowRate);
    }
    
    const flows = Array.from(nodeFlows.values());
    const average = flows.reduce((sum, flow) => sum + flow, 0) / flows.length;
    const variance = flows.reduce((sum, flow) => sum + Math.pow(flow - average, 2), 0) / flows.length;
    const standardDeviation = Math.sqrt(variance);
    
    return Math.max(0, 1 - standardDeviation / average);
  }

  private calculateAverageLoad(topology: MeshTopology): number {
    const activeNodes = Array.from(topology.nodes.values()).filter(n => n.status === 'active');
    if (activeNodes.length === 0) return 0;
    
    return activeNodes.reduce((sum, node) => sum + node.currentLoad, 0) / activeNodes.length;
  }

  private generateLoadDistributionChart(topology: MeshTopology): ResourceAllocationChart {
    const data: ChartDataPoint[] = [];
    const timestamp = Date.now();
    
    for (const [nodeId, node] of topology.nodes) {
      data.push({
        timestamp,
        nodeId,
        value: node.currentLoad,
        category: 'load'
      });
    }
    
    return {
      type: 'bar',
      data,
      config: {
        title: 'Load Distribution Across Nodes',
        xAxis: 'Node ID',
        yAxis: 'Load Percentage',
        colorScheme: ['#3498db'],
        interactive: true,
        exportFormats: ['png', 'svg']
      }
    };
  }

  private generateFlowRateChart(flowMetrics: AttentionFlowMetrics[]): ResourceAllocationChart {
    const data: ChartDataPoint[] = flowMetrics.map(flow => ({
      timestamp: flow.timestamp,
      nodeId: `${flow.sourceNodeId}-${flow.targetNodeId}`,
      value: flow.flowRate,
      category: 'flow-rate'
    }));
    
    return {
      type: 'timeline',
      data,
      config: {
        title: 'Attention Flow Rates Over Time',
        xAxis: 'Time',
        yAxis: 'Flow Rate',
        colorScheme: ['#e74c3c'],
        interactive: true,
        exportFormats: ['png', 'svg']
      }
    };
  }
}