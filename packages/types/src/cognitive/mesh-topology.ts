import type {
  DistributedGrammarEngine,
  AtomSpace,
  HypergraphNode,
  AttentionWeight
} from '../entities/cognitive-tensor.js';

import type {
  ECANScheduler,
  ECANAttentionValue,
  ResourceAllocation,
  ScheduledTask,
  ResourceRequirements
} from './ecan-scheduler.js';

/**
 * Distributed Mesh Topology for Cognitive Resource Coordination
 * 
 * Manages a network of distributed cognitive agents with dynamic
 * load balancing and attention flow coordination.
 */

export interface MeshNode {
  id: string;
  endpoint: string;
  capabilities: string[];
  currentLoad: number;
  maxCapacity: ResourceRequirements;
  availableResources: ResourceRequirements;
  status: 'active' | 'busy' | 'offline' | 'maintenance';
  lastHeartbeat: number;
  grammarEngine?: DistributedGrammarEngine;
  scheduler?: ECANScheduler;
}

export interface MeshTopology {
  nodes: Map<string, MeshNode>;
  connections: Map<string, Set<string>>;
  routingTable: Map<string, string[]>;
  loadBalancer: LoadBalancer;
}

export interface LoadBalancingStrategy {
  type: 'round-robin' | 'least-connections' | 'weighted' | 'cognitive-priority';
  parameters: Record<string, unknown>;
}

export interface AttentionFlowMetrics {
  sourceNodeId: string;
  targetNodeId: string;
  flowRate: number;
  latency: number;
  bandwidth: number;
  efficiency: number;
  timestamp: number;
}

export interface MeshPerformanceMetrics {
  totalNodes: number;
  activeNodes: number;
  averageLoad: number;
  throughput: number;
  latency: number;
  attentionFlowRates: AttentionFlowMetrics[];
  resourceUtilization: ResourceUtilization;
}

export interface ResourceUtilization {
  cpu: number;
  memory: number;
  bandwidth: number;
  storage: number;
}

export interface LoadBalancer {
  strategy: LoadBalancingStrategy;
  selectNode(task: ScheduledTask, availableNodes: MeshNode[]): MeshNode | null;
  distributeLoad(tasks: ScheduledTask[], topology: MeshTopology): Map<string, ScheduledTask[]>;
  rebalance(topology: MeshTopology): Promise<RebalancingResult>;
}

export interface RebalancingResult {
  movedTasks: number;
  improvedUtilization: number;
  migrationCost: number;
  success: boolean;
}

export class CognitiveMeshCoordinator {
  private topology: MeshTopology;
  private performanceHistory: MeshPerformanceMetrics[] = [];
  private attentionFlowHistory = new Map<string, AttentionFlowMetrics[]>();
  private heartbeatInterval = 5000; // 5 seconds
  private rebalancingInterval = 30000; // 30 seconds
  private maxHistorySize = 1000;

  constructor(initialNodes: MeshNode[] = []) {
    this.topology = {
      nodes: new Map(),
      connections: new Map(),
      routingTable: new Map(),
      loadBalancer: new CognitiveLoadBalancer()
    };

    // Initialize with provided nodes
    for (const node of initialNodes) {
      this.addNode(node);
    }

    // Start background processes
    this.startHeartbeatMonitoring();
    this.startPerformanceMonitoring();
    this.startRebalancing();
  }

  /**
   * Add a new node to the mesh
   */
  addNode(node: MeshNode): void {
    this.topology.nodes.set(node.id, { ...node });
    this.topology.connections.set(node.id, new Set());
    
    // Update routing table
    this.updateRoutingTable();
    
    // Establish connections with existing nodes
    this.establishConnections(node.id);
  }

  /**
   * Remove a node from the mesh
   */
  removeNode(nodeId: string): void {
    const node = this.topology.nodes.get(nodeId);
    if (!node) return;

    // Gracefully migrate tasks if needed
    this.migrateNodeTasks(nodeId);
    
    // Clean up connections
    this.topology.connections.delete(nodeId);
    for (const connections of this.topology.connections.values()) {
      connections.delete(nodeId);
    }
    
    // Remove from nodes
    this.topology.nodes.delete(nodeId);
    
    // Update routing table
    this.updateRoutingTable();
  }

  /**
   * Establish connections between nodes based on proximity and capabilities
   */
  private establishConnections(nodeId: string): void {
    const node = this.topology.nodes.get(nodeId);
    if (!node) return;

    const connections = this.topology.connections.get(nodeId)!;
    
    // Connect to nodes with complementary capabilities
    for (const [otherId, otherNode] of this.topology.nodes) {
      if (otherId === nodeId) continue;
      
      const compatibility = this.calculateNodeCompatibility(node, otherNode);
      if (compatibility > 0.4) { // Lowered threshold to ensure connections
        connections.add(otherId);
        this.topology.connections.get(otherId)?.add(nodeId);
      }
    }
  }

  /**
   * Calculate compatibility between two nodes
   */
  private calculateNodeCompatibility(node1: MeshNode, node2: MeshNode): number {
    // Defensive check for capabilities
    if (!node1.capabilities || !node2.capabilities) {
      return 0;
    }
    
    // Check capability overlap
    const sharedCapabilities = node1.capabilities.filter(cap => 
      node2.capabilities.includes(cap)
    );
    
    const capabilityScore = sharedCapabilities.length / 
      Math.max(node1.capabilities.length, node2.capabilities.length);
    
    // Check load balance potential
    const loadDifference = Math.abs(node1.currentLoad - node2.currentLoad);
    const loadScore = 1 - (loadDifference / 100);
    
    // Check resource complementarity
    const resourceScore = this.calculateResourceComplementarity(
      node1.availableResources, 
      node2.availableResources
    );
    
    // Always allow some connections even with low compatibility
    const baseCompatibility = 0.3; // Minimum compatibility threshold
    const calculatedCompatibility = (capabilityScore * 0.4 + loadScore * 0.3 + resourceScore * 0.3);
    
    return Math.max(baseCompatibility, calculatedCompatibility);
  }

  /**
   * Calculate how well two nodes' resources complement each other
   */
  private calculateResourceComplementarity(res1: ResourceRequirements, res2: ResourceRequirements): number {
    const total1 = res1.cpu + res1.memory + res1.bandwidth + res1.storage;
    const total2 = res2.cpu + res2.memory + res2.bandwidth + res2.storage;
    
    if (total1 === 0 || total2 === 0) return 0;
    
    // Higher complementarity when one has what the other lacks
    const cpuComplement = Math.min(res1.cpu, res2.cpu) / Math.max(res1.cpu, res2.cpu);
    const memoryComplement = Math.min(res1.memory, res2.memory) / Math.max(res1.memory, res2.memory);
    const bandwidthComplement = Math.min(res1.bandwidth, res2.bandwidth) / Math.max(res1.bandwidth, res2.bandwidth);
    const storageComplement = Math.min(res1.storage, res2.storage) / Math.max(res1.storage, res2.storage);
    
    return (cpuComplement + memoryComplement + bandwidthComplement + storageComplement) / 4;
  }

  /**
   * Update routing table for efficient task distribution
   */
  private updateRoutingTable(): void {
    this.topology.routingTable.clear();
    
    // Use Floyd-Warshall algorithm for shortest paths
    const nodeIds = Array.from(this.topology.nodes.keys());
    const distances = new Map<string, Map<string, number>>();
    const nextHop = new Map<string, Map<string, string>>();
    
    // Initialize distances
    for (const i of nodeIds) {
      distances.set(i, new Map());
      nextHop.set(i, new Map());
      
      for (const j of nodeIds) {
        if (i === j) {
          distances.get(i)!.set(j, 0);
        } else if (this.topology.connections.get(i)?.has(j)) {
          distances.get(i)!.set(j, 1);
          nextHop.get(i)!.set(j, j);
        } else {
          distances.get(i)!.set(j, Infinity);
        }
      }
    }
    
    // Floyd-Warshall
    for (const k of nodeIds) {
      for (const i of nodeIds) {
        for (const j of nodeIds) {
          const distIK = distances.get(i)!.get(k)!;
          const distKJ = distances.get(k)!.get(j)!;
          const distIJ = distances.get(i)!.get(j)!;
          
          if (distIK + distKJ < distIJ) {
            distances.get(i)!.set(j, distIK + distKJ);
            nextHop.get(i)!.set(j, nextHop.get(i)!.get(k)!);
          }
        }
      }
    }
    
    // Build routing table
    for (const [source, destinations] of nextHop) {
      const routes: string[] = [];
      for (const [dest, next] of destinations) {
        if (source !== dest && next) {
          routes.push(next);
        }
      }
      this.topology.routingTable.set(source, routes);
    }
  }

  /**
   * Distribute tasks across the mesh using load balancing
   */
  async distributeTasks(tasks: ScheduledTask[]): Promise<Map<string, ScheduledTask[]>> {
    const distribution = this.topology.loadBalancer.distributeLoad(tasks, this.topology);
    
    // Track attention flow for distributed tasks
    await this.trackAttentionFlow(distribution);
    
    return distribution;
  }

  /**
   * Track attention flow between nodes for performance analysis
   */
  private async trackAttentionFlow(distribution: Map<string, ScheduledTask[]>): Promise<void> {
    const timestamp = Date.now();
    
    for (const [nodeId, tasks] of distribution) {
      const node = this.topology.nodes.get(nodeId);
      if (!node?.grammarEngine) continue;
      
      // Calculate flow metrics for each task
      for (const task of tasks) {
        const flowMetrics: AttentionFlowMetrics = {
          sourceNodeId: 'coordinator',
          targetNodeId: nodeId,
          flowRate: this.calculateFlowRate(task),
          latency: this.estimateLatency(nodeId),
          bandwidth: this.calculateBandwidth(task),
          efficiency: this.calculateEfficiency(node, task),
          timestamp
        };
        
        const history = this.attentionFlowHistory.get(nodeId) || [];
        history.push(flowMetrics);
        
        // Keep history bounded
        if (history.length > this.maxHistorySize) {
          history.shift();
        }
        
        this.attentionFlowHistory.set(nodeId, history);
      }
    }
  }

  /**
   * Calculate attention flow rate for a task
   */
  private calculateFlowRate(task: ScheduledTask): number {
    const baseRate = task.priority * 10;
    const complexityMultiplier = (task.resourceRequirements.cpu + task.resourceRequirements.memory) / 100;
    return baseRate * (1 + complexityMultiplier);
  }

  /**
   * Estimate latency to a node
   */
  private estimateLatency(nodeId: string): number {
    const node = this.topology.nodes.get(nodeId);
    if (!node) return 1000; // Default high latency
    
    const baseLatency = 50; // Base network latency
    const loadPenalty = node.currentLoad * 2; // Higher load = higher latency
    
    return baseLatency + loadPenalty;
  }

  /**
   * Calculate bandwidth for a task
   */
  private calculateBandwidth(task: ScheduledTask): number {
    return task.resourceRequirements.bandwidth || 1000; // Default bandwidth
  }

  /**
   * Calculate processing efficiency for a node-task combination
   */
  private calculateEfficiency(node: MeshNode, task: ScheduledTask): number {
    const loadFactor = 1 - (node.currentLoad / 100);
    const resourceMatch = this.calculateResourceMatch(node.availableResources, task.resourceRequirements);
    const capabilityMatch = this.calculateCapabilityMatch(node.capabilities, task);
    
    return loadFactor * resourceMatch * capabilityMatch;
  }

  /**
   * Calculate how well node resources match task requirements
   */
  private calculateResourceMatch(available: ResourceRequirements, required: ResourceRequirements): number {
    const cpuMatch = Math.min(1, available.cpu / required.cpu);
    const memoryMatch = Math.min(1, available.memory / required.memory);
    const bandwidthMatch = Math.min(1, available.bandwidth / required.bandwidth);
    const storageMatch = Math.min(1, available.storage / required.storage);
    
    return (cpuMatch + memoryMatch + bandwidthMatch + storageMatch) / 4;
  }

  /**
   * Calculate capability match between node and task
   */
  private calculateCapabilityMatch(nodeCapabilities: string[], task: ScheduledTask): number {
    // This is a simplified version - in practice, you'd have more sophisticated matching
    const requiredCapabilities = this.inferRequiredCapabilities(task);
    const matches = requiredCapabilities.filter(cap => nodeCapabilities.includes(cap));
    
    if (requiredCapabilities.length === 0) return 1;
    return matches.length / requiredCapabilities.length;
  }

  /**
   * Infer required capabilities from task characteristics
   */
  private inferRequiredCapabilities(task: ScheduledTask): string[] {
    const capabilities: string[] = [];
    
    if (task.resourceRequirements.cpu > 1000) capabilities.push('high-cpu');
    if (task.resourceRequirements.memory > 1000) capabilities.push('high-memory');
    if (task.resourceRequirements.bandwidth > 1000) capabilities.push('high-bandwidth');
    if (task.resourceRequirements.storage > 1000) capabilities.push('high-storage');
    
    // Infer from task ID patterns
    if (task.id.includes('nlp')) capabilities.push('natural-language');
    if (task.id.includes('vision')) capabilities.push('computer-vision');
    if (task.id.includes('reasoning')) capabilities.push('logical-reasoning');
    
    return capabilities;
  }

  /**
   * Migrate tasks from a node (e.g., when node goes offline)
   */
  private async migrateNodeTasks(nodeId: string): Promise<void> {
    const node = this.topology.nodes.get(nodeId);
    if (!node?.scheduler) return;
    
    // Get tasks currently running on the node
    // This would need integration with the actual task execution system
    const runningTasks: ScheduledTask[] = []; // Placeholder
    
    if (runningTasks.length > 0) {
      const redistribution = await this.distributeTasks(runningTasks);
      // Handle the redistribution...
    }
  }

  /**
   * Start heartbeat monitoring for mesh health
   */
  private startHeartbeatMonitoring(): void {
    setInterval(() => {
      this.checkNodeHealth();
    }, this.heartbeatInterval);
  }

  /**
   * Check health of all nodes
   */
  private checkNodeHealth(): void {
    const now = Date.now();
    const timeout = this.heartbeatInterval * 3; // 3 missed heartbeats = offline
    
    for (const [nodeId, node] of this.topology.nodes) {
      if (now - node.lastHeartbeat > timeout) {
        node.status = 'offline';
        // Handle offline node...
      }
    }
  }

  /**
   * Start performance monitoring
   */
  private startPerformanceMonitoring(): void {
    setInterval(() => {
      this.collectPerformanceMetrics();
    }, 10000); // Every 10 seconds
  }

  /**
   * Collect performance metrics from the mesh
   */
  private collectPerformanceMetrics(): void {
    const activeNodes = Array.from(this.topology.nodes.values())
      .filter(node => node.status === 'active');
    
    const totalLoad = activeNodes.reduce((sum, node) => sum + node.currentLoad, 0);
    const averageLoad = activeNodes.length > 0 ? totalLoad / activeNodes.length : 0;
    
    // Calculate resource utilization
    const totalCapacity = activeNodes.reduce((sum, node) => ({
      cpu: sum.cpu + node.maxCapacity.cpu,
      memory: sum.memory + node.maxCapacity.memory,
      bandwidth: sum.bandwidth + node.maxCapacity.bandwidth,
      storage: sum.storage + node.maxCapacity.storage
    }), { cpu: 0, memory: 0, bandwidth: 0, storage: 0 });
    
    const totalUsed = activeNodes.reduce((sum, node) => ({
      cpu: sum.cpu + (node.maxCapacity.cpu - node.availableResources.cpu),
      memory: sum.memory + (node.maxCapacity.memory - node.availableResources.memory),
      bandwidth: sum.bandwidth + (node.maxCapacity.bandwidth - node.availableResources.bandwidth),
      storage: sum.storage + (node.maxCapacity.storage - node.availableResources.storage)
    }), { cpu: 0, memory: 0, bandwidth: 0, storage: 0 });
    
    const resourceUtilization: ResourceUtilization = {
      cpu: totalCapacity.cpu > 0 ? (totalUsed.cpu / totalCapacity.cpu) * 100 : 0,
      memory: totalCapacity.memory > 0 ? (totalUsed.memory / totalCapacity.memory) * 100 : 0,
      bandwidth: totalCapacity.bandwidth > 0 ? (totalUsed.bandwidth / totalCapacity.bandwidth) * 100 : 0,
      storage: totalCapacity.storage > 0 ? (totalUsed.storage / totalCapacity.storage) * 100 : 0
    };
    
    // Collect attention flow rates
    const attentionFlowRates: AttentionFlowMetrics[] = [];
    for (const flows of this.attentionFlowHistory.values()) {
      if (flows.length > 0) {
        attentionFlowRates.push(flows[flows.length - 1]); // Latest metric
      }
    }
    
    const metrics: MeshPerformanceMetrics = {
      totalNodes: this.topology.nodes.size,
      activeNodes: activeNodes.length,
      averageLoad,
      throughput: this.calculateThroughput(),
      latency: this.calculateAverageLatency(),
      attentionFlowRates,
      resourceUtilization,
    };
    
    this.performanceHistory.push(metrics);
    
    // Keep history bounded
    if (this.performanceHistory.length > this.maxHistorySize) {
      this.performanceHistory.shift();
    }
  }

  /**
   * Calculate overall mesh throughput
   */
  private calculateThroughput(): number {
    // Simplified throughput calculation
    const activeNodes = Array.from(this.topology.nodes.values())
      .filter(node => node.status === 'active');
    
    return activeNodes.reduce((sum, node) => sum + (100 - node.currentLoad), 0);
  }

  /**
   * Calculate average latency across the mesh
   */
  private calculateAverageLatency(): number {
    const recentFlows = Array.from(this.attentionFlowHistory.values())
      .flat()
      .filter(flow => Date.now() - flow.timestamp < 60000); // Last minute
    
    if (recentFlows.length === 0) return 0;
    
    const totalLatency = recentFlows.reduce((sum, flow) => sum + flow.latency, 0);
    return totalLatency / recentFlows.length;
  }

  /**
   * Start automatic rebalancing
   */
  private startRebalancing(): void {
    setInterval(async () => {
      await this.topology.loadBalancer.rebalance(this.topology);
    }, this.rebalancingInterval);
  }

  /**
   * Get current mesh topology
   */
  getTopology(): MeshTopology {
    return { ...this.topology };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): MeshPerformanceMetrics[] {
    return [...this.performanceHistory];
  }

  /**
   * Get attention flow history for a node
   */
  getAttentionFlowHistory(nodeId: string): AttentionFlowMetrics[] {
    return this.attentionFlowHistory.get(nodeId) || [];
  }
}

/**
 * Cognitive Load Balancer Implementation
 */
class CognitiveLoadBalancer implements LoadBalancer {
  strategy: LoadBalancingStrategy = {
    type: 'cognitive-priority',
    parameters: {}
  };

  selectNode(task: ScheduledTask, availableNodes: MeshNode[]): MeshNode | null {
    if (availableNodes.length === 0) return null;
    
    switch (this.strategy.type) {
      case 'round-robin':
        return this.roundRobinSelection(availableNodes);
      case 'least-connections':
        return this.leastConnectionsSelection(availableNodes);
      case 'weighted':
        return this.weightedSelection(availableNodes);
      case 'cognitive-priority':
        return this.cognitivePrioritySelection(task, availableNodes);
      default:
        return availableNodes[0];
    }
  }

  distributeLoad(tasks: ScheduledTask[], topology: MeshTopology): Map<string, ScheduledTask[]> {
    const distribution = new Map<string, ScheduledTask[]>();
    const availableNodes = Array.from(topology.nodes.values())
      .filter(node => node.status === 'active');
    
    // Track remaining resources for each node
    const nodeRemainingResources = new Map<string, ResourceRequirements>();
    for (const node of availableNodes) {
      nodeRemainingResources.set(node.id, { ...node.availableResources });
    }
    
    for (const task of tasks) {
      const selectedNode = this.selectNodeWithResourceCheck(task, availableNodes, nodeRemainingResources);
      if (selectedNode) {
        if (!distribution.has(selectedNode.id)) {
          distribution.set(selectedNode.id, []);
        }
        distribution.get(selectedNode.id)!.push(task);
        
        // Update remaining resources
        const remaining = nodeRemainingResources.get(selectedNode.id)!;
        remaining.cpu -= task.resourceRequirements.cpu;
        remaining.memory -= task.resourceRequirements.memory;
        remaining.bandwidth -= task.resourceRequirements.bandwidth;
        remaining.storage -= task.resourceRequirements.storage;
      }
    }
    
    return distribution;
  }

  private selectNodeWithResourceCheck(
    task: ScheduledTask,
    availableNodes: MeshNode[],
    remainingResources: Map<string, ResourceRequirements>
  ): MeshNode | null {
    // Filter nodes that can handle the task requirements
    const viableNodes = availableNodes.filter(node => {
      const remaining = remainingResources.get(node.id)!;
      return remaining.cpu >= task.resourceRequirements.cpu &&
             remaining.memory >= task.resourceRequirements.memory &&
             remaining.bandwidth >= task.resourceRequirements.bandwidth &&
             remaining.storage >= task.resourceRequirements.storage;
    });
    
    if (viableNodes.length === 0) return null;
    
    return this.selectNode(task, viableNodes);
  }

  async rebalance(topology: MeshTopology): Promise<RebalancingResult> {
    const nodes = Array.from(topology.nodes.values())
      .filter(node => node.status === 'active');
    
    if (nodes.length < 2) {
      return { movedTasks: 0, improvedUtilization: 0, migrationCost: 0, success: false };
    }
    
    // Find overloaded and underloaded nodes
    const averageLoad = nodes.reduce((sum, node) => sum + node.currentLoad, 0) / nodes.length;
    const overloaded = nodes.filter(node => node.currentLoad > averageLoad + 20);
    const underloaded = nodes.filter(node => node.currentLoad < averageLoad - 20);
    
    let movedTasks = 0;
    let migrationCost = 0;
    
    // Move tasks from overloaded to underloaded nodes
    for (const overloadedNode of overloaded) {
      for (const underloadedNode of underloaded) {
        if (overloadedNode.currentLoad > underloadedNode.currentLoad + 10) {
          // Simulate task migration (in practice, this would involve actual task movement)
          const tasksToMove = Math.min(5, Math.floor((overloadedNode.currentLoad - underloadedNode.currentLoad) / 2));
          movedTasks += tasksToMove;
          migrationCost += tasksToMove * 10; // Cost per task migration
          
          // Update loads (simplified)
          overloadedNode.currentLoad -= tasksToMove * 5;
          underloadedNode.currentLoad += tasksToMove * 5;
        }
      }
    }
    
    const newAverageLoad = nodes.reduce((sum, node) => sum + node.currentLoad, 0) / nodes.length;
    const improvedUtilization = Math.abs(averageLoad - 50) - Math.abs(newAverageLoad - 50); // 50% is optimal
    
    return {
      movedTasks,
      improvedUtilization,
      migrationCost,
      success: movedTasks > 0
    };
  }

  private roundRobinSelection(nodes: MeshNode[]): MeshNode {
    // Simple round-robin (would need state tracking in real implementation)
    return nodes[Date.now() % nodes.length];
  }

  private leastConnectionsSelection(nodes: MeshNode[]): MeshNode {
    return nodes.reduce((min, node) => 
      node.currentLoad < min.currentLoad ? node : min
    );
  }

  private weightedSelection(nodes: MeshNode[]): MeshNode {
    const weights = nodes.map(node => 100 - node.currentLoad);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    if (totalWeight === 0) return nodes[0];
    
    let random = Math.random() * totalWeight;
    for (let i = 0; i < nodes.length; i++) {
      random -= weights[i];
      if (random <= 0) return nodes[i];
    }
    
    return nodes[nodes.length - 1];
  }

  private cognitivePrioritySelection(task: ScheduledTask, nodes: MeshNode[]): MeshNode {
    // Score nodes based on cognitive criteria
    const scores = nodes.map(node => {
      const loadScore = (100 - node.currentLoad) / 100;
      const resourceScore = this.calculateResourceScore(node, task);
      const capabilityScore = this.calculateCapabilityScore(node, task);
      
      return {
        node,
        score: loadScore * 0.4 + resourceScore * 0.3 + capabilityScore * 0.3
      };
    });
    
    scores.sort((a, b) => b.score - a.score);
    return scores[0].node;
  }

  private calculateResourceScore(node: MeshNode, task: ScheduledTask): number {
    const req = task.resourceRequirements;
    const avail = node.availableResources;
    
    if (req.cpu > avail.cpu || req.memory > avail.memory || 
        req.bandwidth > avail.bandwidth || req.storage > avail.storage) {
      return 0; // Cannot satisfy requirements
    }
    
    const cpuScore = avail.cpu > 0 ? Math.min(1, req.cpu / avail.cpu) : 0;
    const memoryScore = avail.memory > 0 ? Math.min(1, req.memory / avail.memory) : 0;
    const bandwidthScore = avail.bandwidth > 0 ? Math.min(1, req.bandwidth / avail.bandwidth) : 0;
    const storageScore = avail.storage > 0 ? Math.min(1, req.storage / avail.storage) : 0;
    
    return (cpuScore + memoryScore + bandwidthScore + storageScore) / 4;
  }

  private calculateCapabilityScore(node: MeshNode, task: ScheduledTask): number {
    // Simplified capability matching
    if (task.id.includes('nlp') && node.capabilities.includes('natural-language')) return 1;
    if (task.id.includes('vision') && node.capabilities.includes('computer-vision')) return 1;
    if (task.id.includes('reasoning') && node.capabilities.includes('logical-reasoning')) return 1;
    
    return 0.5; // Default score for general capabilities
  }
}