import type {
  AtomSpace,
  HypergraphNode,
  HypergraphEdge,
  DistributedGrammarEngine,
  CognitiveNode,
  TensorKernel
} from '../entities/cognitive-tensor.js';

import { ECANScheduler } from './ecan-scheduler.js';
import { CognitiveMeshCoordinator } from './mesh-topology.js';
import { AttentionFlowVisualizer } from './attention-visualizer.js';
import { TutorialKitDistributedGrammarEngine } from './grammar-engine.js';

import type {
  ECANConfig,
  ScheduledTask,
  ResourceRequirements
} from './ecan-scheduler.js';

import type {
  MeshNode,
  AttentionFlowMetrics,
  MeshPerformanceMetrics
} from './mesh-topology.js';

/**
 * Phase 2 Integration: Complete ECAN Attention Allocation & Resource Kernel Construction
 * 
 * This module demonstrates the complete integration of all Phase 2 components:
 * - ECAN economic attention allocation
 * - Distributed mesh topology
 * - Load balancing and resource scheduling
 * - Attention flow visualization
 * - Performance analysis and optimization
 */

export interface Phase2SystemConfig {
  ecanConfig: ECANConfig;
  meshNodes: MeshNode[];
  visualizationEnabled: boolean;
  performanceMonitoring: boolean;
  maxConcurrentTasks: number;
  rebalancingInterval: number;
}

export interface Phase2SystemState {
  totalNodes: number;
  activeNodes: number;
  scheduledTasks: number;
  attentionBankBalance: number;
  averageLoad: number;
  systemEfficiency: number;
  lastRebalancing: number;
}

export interface TaskProcessingResult {
  tasksScheduled: number;
  tasksCompleted: number;
  averageProcessingTime: number;
  resourceUtilization: number;
  attentionFlowEfficiency: number;
  bottlenecksDetected: number;
  recommendationsGenerated: number;
}

export class Phase2CognitiveSystem {
  private ecanScheduler: ECANScheduler;
  private meshCoordinator: CognitiveMeshCoordinator;
  private visualizer: AttentionFlowVisualizer;
  private grammarEngines: Map<string, DistributedGrammarEngine>;
  private atomSpace: AtomSpace;
  private config: Phase2SystemConfig;
  private isRunning = false;
  private processingHistory: TaskProcessingResult[] = [];

  constructor(config: Phase2SystemConfig) {
    this.config = config;
    this.ecanScheduler = new ECANScheduler(config.ecanConfig);
    this.meshCoordinator = new CognitiveMeshCoordinator(config.meshNodes);
    this.visualizer = new AttentionFlowVisualizer();
    this.grammarEngines = new Map();
    
    // Initialize AtomSpace
    this.atomSpace = {
      id: 'phase2-atomspace',
      nodes: new Map(),
      edges: new Map(),
      indices: new Map(),
      metadata: {
        created: Date.now(),
        version: '2.0',
        capabilities: ['ecan', 'mesh-topology', 'attention-flow', 'visualization']
      }
    };

    this.initializeSystem();
  }

  /**
   * Initialize the complete Phase 2 system
   */
  private async initializeSystem(): Promise<void> {
    // Initialize grammar engines for each node
    for (const node of this.config.meshNodes) {
      const grammarEngine = new TutorialKitDistributedGrammarEngine(
        `grammar-${node.id}`,
        this.createDefaultGrammar(),
        this.atomSpace
      );
      this.grammarEngines.set(node.id, grammarEngine);
    }

    // Populate AtomSpace with initial cognitive nodes
    await this.populateInitialAtomSpace();

    // Start background processes if monitoring is enabled
    if (this.config.performanceMonitoring) {
      this.startPerformanceMonitoring();
    }

    console.log('Phase 2 Cognitive System initialized successfully');
  }

  /**
   * Start the complete ECAN attention allocation and resource scheduling system
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('System is already running');
    }

    this.isRunning = true;
    console.log('Starting Phase 2 Cognitive System...');

    // Start the main processing loop
    this.startMainProcessingLoop();
  }

  /**
   * Stop the system gracefully
   */
  async stop(): Promise<void> {
    this.isRunning = false;
    console.log('Phase 2 Cognitive System stopped');
  }

  /**
   * Process a batch of cognitive tasks through the complete pipeline
   */
  async processCognitiveTasks(
    cognitiveNodes: CognitiveNode[],
    tensorKernels: TensorKernel[]
  ): Promise<TaskProcessingResult> {
    const startTime = Date.now();
    let tasksScheduled = 0;
    let tasksCompleted = 0;
    let bottlenecksDetected = 0;
    let recommendationsGenerated = 0;

    try {
      // 1. Update AtomSpace with new cognitive content
      await this.updateAtomSpaceWithCognitiveNodes(cognitiveNodes);
      await this.updateAtomSpaceWithTensorKernels(tensorKernels);

      // 2. Run ECAN attention allocation cycle
      await this.ecanScheduler.runECANCycle(this.atomSpace);

      // 3. Create scheduled tasks from cognitive nodes and tensor kernels
      const scheduledTasks = this.createScheduledTasks(cognitiveNodes, tensorKernels);
      tasksScheduled = scheduledTasks.length;

      // 4. Distribute tasks across the mesh
      const taskDistribution = await this.meshCoordinator.distributeTasks(scheduledTasks);

      // 5. Execute tasks on distributed nodes
      const executionResults = await this.executeTasks(taskDistribution);
      tasksCompleted = executionResults.completedTasks;

      // 6. Analyze attention flow and performance
      const flowMetrics = this.collectAttentionFlowMetrics();
      const flowAnalysis = this.visualizer.analyzeAttentionFlow(
        flowMetrics,
        this.meshCoordinator.getTopology()
      );

      bottlenecksDetected = flowAnalysis.bottlenecks.length;
      recommendationsGenerated = flowAnalysis.recommendations.length;

      // 7. Apply optimizations based on analysis
      await this.applyOptimizations(flowAnalysis.recommendations);

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      const result: TaskProcessingResult = {
        tasksScheduled,
        tasksCompleted,
        averageProcessingTime: processingTime / Math.max(1, tasksCompleted),
        resourceUtilization: this.calculateResourceUtilization(),
        attentionFlowEfficiency: flowAnalysis.efficiency.overallEfficiency,
        bottlenecksDetected,
        recommendationsGenerated
      };

      this.processingHistory.push(result);
      return result;

    } catch (error) {
      console.error('Error processing cognitive tasks:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive visualization of the system state
   */
  async generateSystemVisualization(): Promise<{
    attentionFlowChart: string;
    resourceAllocationChart: string;
    performanceAnalysis: string;
    recursiveAllocationFlowchart: string;
  }> {
    const flowMetrics = this.collectAttentionFlowMetrics();
    const performanceMetrics = this.meshCoordinator.getPerformanceMetrics();
    
    // Generate Mermaid flowchart for attention flow
    const attentionFlowViz = this.visualizer.generateMermaidFlowchart(
      this.meshCoordinator.getTopology(),
      flowMetrics,
      300000 // 5 minutes window
    );

    // Generate recursive resource allocation pathways
    const recursiveViz = this.visualizer.generateRecursiveAllocationFlowchart(
      this.ecanScheduler,
      this.atomSpace,
      3 // depth
    );

    // Generate performance analysis chart
    const performanceChart = this.visualizer.generatePerformanceAnalysisChart(
      performanceMetrics,
      'timeline'
    );

    return {
      attentionFlowChart: attentionFlowViz.content,
      resourceAllocationChart: JSON.stringify(performanceChart, null, 2),
      performanceAnalysis: this.generatePerformanceReport(),
      recursiveAllocationFlowchart: recursiveViz.content
    };
  }

  /**
   * Get current system state
   */
  getSystemState(): Phase2SystemState {
    const topology = this.meshCoordinator.getTopology();
    const activeNodes = Array.from(topology.nodes.values())
      .filter(node => node.status === 'active');

    return {
      totalNodes: topology.nodes.size,
      activeNodes: activeNodes.length,
      scheduledTasks: this.getCurrentScheduledTaskCount(),
      attentionBankBalance: this.ecanScheduler.getAttentionBank(),
      averageLoad: this.calculateAverageLoad(activeNodes),
      systemEfficiency: this.calculateSystemEfficiency(),
      lastRebalancing: Date.now() // Simplified
    };
  }

  /**
   * Benchmark system performance under load
   */
  async benchmarkPerformance(
    taskCounts: number[],
    nodeCounts: number[]
  ): Promise<Record<string, any>> {
    const benchmarkResults: Record<string, any> = {};

    for (const nodeCount of nodeCounts) {
      benchmarkResults[`nodes_${nodeCount}`] = {};
      
      // Setup test nodes
      const testNodes = this.createTestNodes(nodeCount);
      const testCoordinator = new CognitiveMeshCoordinator(testNodes);
      
      for (const taskCount of taskCounts) {
        const startTime = performance.now();
        
        // Create test tasks
        const testTasks = this.createTestTasks(taskCount);
        
        // Distribute tasks
        await testCoordinator.distributeTasks(testTasks);
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        benchmarkResults[`nodes_${nodeCount}`][`tasks_${taskCount}`] = {
          duration,
          throughput: taskCount / (duration / 1000),
          averageLatency: duration / taskCount
        };
      }
    }

    return benchmarkResults;
  }

  /**
   * Validate economic attention principles
   */
  async validateEconomicAttentionPrinciples(): Promise<{
    conservationOfAttention: boolean;
    rentCollection: boolean;
    wagePayment: boolean;
    importanceSpreading: boolean;
    forgettingMechanism: boolean;
    results: Record<string, any>;
  }> {
    const results: Record<string, any> = {};

    // Test 1: Conservation of Attention
    const initialBank = this.ecanScheduler.getAttentionBank();
    await this.ecanScheduler.runECANCycle(this.atomSpace);
    const finalBank = this.ecanScheduler.getAttentionBank();
    
    const totalSTI = Array.from(this.atomSpace.nodes.keys())
      .map(nodeId => this.ecanScheduler.getAttentionValue(nodeId)?.sti || 0)
      .reduce((sum, sti) => sum + Math.max(0, sti), 0);
    
    const conservationOfAttention = Math.abs((finalBank + totalSTI) - initialBank) < initialBank * 0.1;
    results.conservationTest = { initialBank, finalBank, totalSTI, conserved: conservationOfAttention };

    // Test 2: Rent Collection
    const nodeWithHighSTI = Array.from(this.atomSpace.nodes.entries())
      .find(([nodeId, _]) => {
        const av = this.ecanScheduler.getAttentionValue(nodeId);
        return av && av.sti > 1000;
      });

    let rentCollection = false;
    if (nodeWithHighSTI) {
      const initialSTI = this.ecanScheduler.getAttentionValue(nodeWithHighSTI[0])!.sti;
      this.ecanScheduler.collectRent();
      const finalSTI = this.ecanScheduler.getAttentionValue(nodeWithHighSTI[0])!.sti;
      rentCollection = finalSTI < initialSTI;
      results.rentCollectionTest = { initialSTI, finalSTI, collected: rentCollection };
    }

    // Test 3: Wage Payment
    const nodeWithHighLTI = Array.from(this.atomSpace.nodes.entries())
      .find(([nodeId, _]) => {
        const av = this.ecanScheduler.getAttentionValue(nodeId);
        return av && av.lti > 2000;
      });

    let wagePayment = false;
    if (nodeWithHighLTI) {
      const initialSTI = this.ecanScheduler.getAttentionValue(nodeWithHighLTI[0])!.sti;
      this.ecanScheduler.payWages();
      const finalSTI = this.ecanScheduler.getAttentionValue(nodeWithHighLTI[0])!.sti;
      wagePayment = finalSTI > initialSTI;
      results.wagePaymentTest = { initialSTI, finalSTI, paid: wagePayment };
    }

    // Test 4: Importance Spreading
    const spreadingTestResults = await this.testImportanceSpreading();
    const importanceSpreading = spreadingTestResults.spreading;
    results.importanceSpreadingTest = spreadingTestResults;

    // Test 5: Forgetting Mechanism
    const forgettingTestResults = await this.testForgettingMechanism();
    const forgettingMechanism = forgettingTestResults.forgetting;
    results.forgettingTest = forgettingTestResults;

    return {
      conservationOfAttention,
      rentCollection,
      wagePayment,
      importanceSpreading,
      forgettingMechanism,
      results
    };
  }

  // Private helper methods

  private async populateInitialAtomSpace(): Promise<void> {
    // Create initial cognitive nodes representing TutorialKit concepts
    const initialNodes: HypergraphNode[] = [
      {
        id: 'tutorial-concept',
        type: 'concept',
        attributes: {
          activation: 0.8,
          attention: 0.7,
          lastActivation: Date.now(),
          activationCount: 50,
          systemCritical: true
        },
        embeddings: Array.from({ length: 64 }, (_, i) => Math.sin(i * 0.1))
      },
      {
        id: 'lesson-structure',
        type: 'relation',
        attributes: {
          activation: 0.6,
          attention: 0.5,
          lastActivation: Date.now() - 5000,
          activationCount: 30
        },
        embeddings: Array.from({ length: 64 }, (_, i) => Math.cos(i * 0.1))
      },
      {
        id: 'interactive-element',
        type: 'context',
        attributes: {
          activation: 0.4,
          attention: 0.3,
          lastActivation: Date.now() - 10000,
          activationCount: 20
        },
        embeddings: Array.from({ length: 64 }, (_, i) => Math.sin(i * 0.05))
      }
    ];

    for (const node of initialNodes) {
      this.atomSpace.nodes.set(node.id, node);
      
      // Calculate and set initial attention values
      const attention = this.ecanScheduler.calculateEconomicAttention(node);
      this.ecanScheduler.setAttentionValue(node.id, attention);
    }

    // Create semantic relationships
    const edges: HypergraphEdge[] = [
      {
        id: 'tutorial-lesson-edge',
        nodes: ['tutorial-concept', 'lesson-structure'],
        type: 'semantic',
        weight: 0.9,
        attributes: { relationship: 'contains' }
      },
      {
        id: 'lesson-interactive-edge',
        nodes: ['lesson-structure', 'interactive-element'],
        type: 'structural',
        weight: 0.7,
        attributes: { relationship: 'includes' }
      }
    ];

    for (const edge of edges) {
      this.atomSpace.edges.set(edge.id, edge);
    }
  }

  private createDefaultGrammar(): any {
    // Return a simplified grammar structure
    return {
      id: 'default-grammar',
      patterns: [],
      activationRules: [],
      attentionWeights: []
    };
  }

  private startMainProcessingLoop(): void {
    const processLoop = async () => {
      while (this.isRunning) {
        try {
          // Run ECAN cycle
          await this.ecanScheduler.runECANCycle(this.atomSpace);
          
          // Update performance metrics
          if (this.config.performanceMonitoring) {
            await this.updatePerformanceMetrics();
          }
          
          // Wait before next cycle
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('Error in main processing loop:', error);
        }
      }
    };

    processLoop();
  }

  private startPerformanceMonitoring(): void {
    setInterval(() => {
      this.collectAndStorePerformanceMetrics();
    }, 10000); // Every 10 seconds
  }

  private async updateAtomSpaceWithCognitiveNodes(nodes: CognitiveNode[]): Promise<void> {
    for (const cogNode of nodes) {
      const hypergraphNode: HypergraphNode = {
        id: cogNode.id,
        type: cogNode.type === 'function' ? 'concept' : cogNode.type === 'module' ? 'relation' : 'context',
        attributes: {
          arity: cogNode.arity,
          complexity: cogNode.complexity,
          activation: 0.5,
          attention: 0.3,
          lastActivation: Date.now(),
          activationCount: 1,
          ...cogNode.metadata
        },
        embeddings: Array.from({ length: 64 }, () => Math.random())
      };

      this.atomSpace.nodes.set(hypergraphNode.id, hypergraphNode);
      
      // Calculate attention value
      const attention = this.ecanScheduler.calculateEconomicAttention(hypergraphNode);
      this.ecanScheduler.setAttentionValue(hypergraphNode.id, attention);
    }
  }

  private async updateAtomSpaceWithTensorKernels(kernels: TensorKernel[]): Promise<void> {
    for (const kernel of kernels) {
      // Create hypergraph representation of tensor kernel
      const kernelNode: HypergraphNode = {
        id: `kernel-${kernel.id}`,
        type: 'concept',
        attributes: {
          kernelId: kernel.id,
          nodeId: kernel.nodeId,
          shape: kernel.shape,
          dtype: kernel.dtype,
          operationCount: kernel.operations.length,
          activation: 0.6,
          attention: 0.4,
          lastActivation: Date.now(),
          activationCount: 1
        },
        embeddings: Array.from({ length: 64 }, () => Math.random())
      };

      this.atomSpace.nodes.set(kernelNode.id, kernelNode);
      
      const attention = this.ecanScheduler.calculateEconomicAttention(kernelNode);
      this.ecanScheduler.setAttentionValue(kernelNode.id, attention);
    }
  }

  private createScheduledTasks(
    cognitiveNodes: CognitiveNode[],
    tensorKernels: TensorKernel[]
  ): ScheduledTask[] {
    const tasks: ScheduledTask[] = [];

    // Create tasks from cognitive nodes
    for (const node of cognitiveNodes) {
      const attention = this.ecanScheduler.getAttentionValue(node.id);
      const priority = attention ? Math.min(100, attention.sti / 100) : 50;

      tasks.push({
        id: `cognitive-task-${node.id}`,
        nodeId: node.id,
        priority,
        estimatedCost: node.complexity * 10,
        resourceRequirements: {
          cpu: node.complexity * 50,
          memory: node.arity * 100,
          bandwidth: 50,
          storage: 100
        },
        dependencies: node.connections
      });
    }

    // Create tasks from tensor kernels
    for (const kernel of tensorKernels) {
      const attention = this.ecanScheduler.getAttentionValue(`kernel-${kernel.id}`);
      const priority = attention ? Math.min(100, attention.sti / 100) : 50;
      const complexity = kernel.shape.reduce((a, b) => a * b, 1);

      tasks.push({
        id: `kernel-task-${kernel.id}`,
        nodeId: kernel.nodeId,
        priority,
        estimatedCost: complexity / 1000,
        resourceRequirements: {
          cpu: complexity / 10,
          memory: kernel.data.byteLength / 1000,
          bandwidth: 100,
          storage: kernel.data.byteLength / 1000
        },
        dependencies: []
      });
    }

    return tasks;
  }

  private async executeTasks(
    taskDistribution: Map<string, ScheduledTask[]>
  ): Promise<{ completedTasks: number }> {
    let completedTasks = 0;

    for (const [nodeId, tasks] of taskDistribution) {
      const grammarEngine = this.grammarEngines.get(nodeId);
      if (!grammarEngine) continue;

      for (const task of tasks) {
        try {
          // Simulate task execution
          await new Promise(resolve => setTimeout(resolve, task.estimatedCost));
          completedTasks++;
        } catch (error) {
          console.error(`Task execution failed: ${task.id}`, error);
        }
      }
    }

    return { completedTasks };
  }

  private collectAttentionFlowMetrics(): AttentionFlowMetrics[] {
    const metrics: AttentionFlowMetrics[] = [];
    
    // Collect metrics from mesh coordinator
    for (const nodeId of this.meshCoordinator.getTopology().nodes.keys()) {
      const nodeMetrics = this.meshCoordinator.getAttentionFlowHistory(nodeId);
      metrics.push(...nodeMetrics);
    }

    return metrics;
  }

  private async applyOptimizations(recommendations: any[]): Promise<void> {
    for (const rec of recommendations) {
      if (rec.priority === 'critical' || rec.priority === 'high') {
        // Apply immediate optimizations
        console.log(`Applying optimization: ${rec.description}`);
      }
    }
  }

  private calculateResourceUtilization(): number {
    const topology = this.meshCoordinator.getTopology();
    const nodes = Array.from(topology.nodes.values());
    
    if (nodes.length === 0) return 0;
    
    const averageLoad = nodes.reduce((sum, node) => sum + node.currentLoad, 0) / nodes.length;
    return averageLoad;
  }

  private generatePerformanceReport(): string {
    const recentResults = this.processingHistory.slice(-10);
    
    if (recentResults.length === 0) {
      return 'No performance data available';
    }

    const avgEfficiency = recentResults.reduce((sum, result) => sum + result.attentionFlowEfficiency, 0) / recentResults.length;
    const avgUtilization = recentResults.reduce((sum, result) => sum + result.resourceUtilization, 0) / recentResults.length;
    const totalBottlenecks = recentResults.reduce((sum, result) => sum + result.bottlenecksDetected, 0);

    return `
Performance Report (Last ${recentResults.length} cycles):
- Average Efficiency: ${(avgEfficiency * 100).toFixed(1)}%
- Average Resource Utilization: ${avgUtilization.toFixed(1)}%
- Total Bottlenecks Detected: ${totalBottlenecks}
- Total Recommendations Generated: ${recentResults.reduce((sum, result) => sum + result.recommendationsGenerated, 0)}
    `.trim();
  }

  private getCurrentScheduledTaskCount(): number {
    // This would be tracked by the actual task execution system
    return 0; // Placeholder
  }

  private calculateAverageLoad(nodes: MeshNode[]): number {
    if (nodes.length === 0) return 0;
    return nodes.reduce((sum, node) => sum + node.currentLoad, 0) / nodes.length;
  }

  private calculateSystemEfficiency(): number {
    const recentResults = this.processingHistory.slice(-5);
    if (recentResults.length === 0) return 0;
    
    return recentResults.reduce((sum, result) => sum + result.attentionFlowEfficiency, 0) / recentResults.length;
  }

  private createTestNodes(count: number): MeshNode[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `test-node-${i}`,
      endpoint: `http://localhost:${8000 + i}`,
      capabilities: ['general-processing'],
      currentLoad: Math.floor(Math.random() * 80),
      maxCapacity: { cpu: 1000, memory: 2000, bandwidth: 500, storage: 1000 },
      availableResources: { cpu: 800, memory: 1600, bandwidth: 400, storage: 800 },
      status: 'active',
      lastHeartbeat: Date.now()
    }));
  }

  private createTestTasks(count: number): ScheduledTask[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `test-task-${i}`,
      nodeId: 'any',
      priority: Math.floor(Math.random() * 100),
      estimatedCost: Math.floor(Math.random() * 100) + 50,
      resourceRequirements: {
        cpu: Math.floor(Math.random() * 100) + 50,
        memory: Math.floor(Math.random() * 200) + 100,
        bandwidth: Math.floor(Math.random() * 50) + 25,
        storage: Math.floor(Math.random() * 100) + 50
      },
      dependencies: []
    }));
  }

  private async updatePerformanceMetrics(): Promise<void> {
    // Update internal performance tracking
  }

  private collectAndStorePerformanceMetrics(): void {
    // Collect and store performance metrics
  }

  private async testImportanceSpreading(): Promise<{ spreading: boolean; details: any }> {
    // Create test scenario for importance spreading
    const testNodeId = 'test-spreading-node';
    const testNode: HypergraphNode = {
      id: testNodeId,
      type: 'concept',
      attributes: {
        activation: 1.0,
        attention: 1.0,
        lastActivation: Date.now(),
        activationCount: 100
      },
      embeddings: Array.from({ length: 64 }, () => Math.random())
    };

    this.atomSpace.nodes.set(testNodeId, testNode);
    this.ecanScheduler.setAttentionValue(testNodeId, { sti: 10000, lti: 5000, vlti: 1 });

    const connectedNodeId = 'test-connected-node';
    const connectedNode: HypergraphNode = {
      id: connectedNodeId,
      type: 'relation',
      attributes: {
        activation: 0.2,
        attention: 0.1,
        lastActivation: Date.now() - 10000,
        activationCount: 5
      },
      embeddings: Array.from({ length: 64 }, () => Math.random())
    };

    this.atomSpace.nodes.set(connectedNodeId, connectedNode);
    this.ecanScheduler.setAttentionValue(connectedNodeId, { sti: 500, lti: 1000, vlti: 0 });

    // Create edge between nodes
    const edge: HypergraphEdge = {
      id: 'test-edge',
      nodes: [testNodeId, connectedNodeId],
      type: 'semantic',
      weight: 0.8,
      attributes: {}
    };
    this.atomSpace.edges.set(edge.id, edge);

    const initialConnectedSTI = this.ecanScheduler.getAttentionValue(connectedNodeId)!.sti;
    
    await this.ecanScheduler.spreadImportance(this.atomSpace);
    
    const finalConnectedSTI = this.ecanScheduler.getAttentionValue(connectedNodeId)!.sti;
    
    // Clean up test nodes
    this.atomSpace.nodes.delete(testNodeId);
    this.atomSpace.nodes.delete(connectedNodeId);
    this.atomSpace.edges.delete(edge.id);

    const spreading = finalConnectedSTI > initialConnectedSTI;

    return {
      spreading,
      details: {
        initialConnectedSTI,
        finalConnectedSTI,
        increase: finalConnectedSTI - initialConnectedSTI
      }
    };
  }

  private async testForgettingMechanism(): Promise<{ forgetting: boolean; details: any }> {
    // Create test node with very low STI
    const lowSTINodeId = 'test-low-sti-node';
    const lowSTINode: HypergraphNode = {
      id: lowSTINodeId,
      type: 'context',
      attributes: {
        activation: 0.01,
        attention: 0.01,
        lastActivation: Date.now() - 60000,
        activationCount: 1
      },
      embeddings: Array.from({ length: 64 }, () => Math.random())
    };

    this.atomSpace.nodes.set(lowSTINodeId, lowSTINode);
    this.ecanScheduler.setAttentionValue(lowSTINodeId, { sti: -2000, lti: 100, vlti: 0 });

    const nodeExistsBefore = this.ecanScheduler.getAttentionValue(lowSTINodeId) !== undefined;
    
    await this.ecanScheduler.runECANCycle(this.atomSpace);
    
    const nodeExistsAfter = this.ecanScheduler.getAttentionValue(lowSTINodeId) !== undefined;
    
    const forgetting = nodeExistsBefore && !nodeExistsAfter;

    return {
      forgetting,
      details: {
        nodeExistsBefore,
        nodeExistsAfter,
        forgotten: forgetting
      }
    };
  }
}