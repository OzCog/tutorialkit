import type {
  AttentionWeight,
  HypergraphNode,
  AtomSpace,
  CognitiveNode,
  TensorKernel
} from '../entities/cognitive-tensor.js';

/**
 * ECAN (Economic Attention Networks) Scheduler
 * 
 * Implements economic attention allocation with STI (Short Term Importance),
 * LTI (Long Term Importance), and VLTI (Very Long Term Importance) values
 * based on OpenCog's ECAN framework.
 */

export interface ECANAttentionValue {
  sti: number;  // Short Term Importance (-32768 to 32767)
  lti: number;  // Long Term Importance (0 to 65535)
  vlti: number; // Very Long Term Importance (boolean 0 or 1)
}

export interface ECANConfig {
  attentionBank: number;           // Total attention budget
  maxSTI: number;                  // Maximum STI value
  minSTI: number;                  // Minimum STI value  
  maxLTI: number;                  // Maximum LTI value
  attentionDecayRate: number;      // Rate of attention decay per cycle
  importanceSpreadingRate: number; // Rate of importance spreading
  forgettingThreshold: number;     // STI threshold below which atoms are forgotten
  stimulationThreshold: number;    // STI threshold above which atoms are stimulated
  rentCollectionRate: number;      // Rate at which rent is collected
  wagePaymentRate: number;         // Rate at which wages are paid
}

export interface ResourceAllocation {
  nodeId: string;
  allocatedCPU: number;
  allocatedMemory: number;
  priority: number;
  timestamp: number;
}

export interface TaskSchedulingResult {
  scheduledTasks: ScheduledTask[];
  totalCost: number;
  attentionBudgetUsed: number;
  resourceUtilization: number;
}

export interface ScheduledTask {
  id: string;
  nodeId: string;
  priority: number;
  estimatedCost: number;
  resourceRequirements: ResourceRequirements;
  deadline?: number;
  dependencies: string[];
}

export interface ResourceRequirements {
  cpu: number;
  memory: number;
  bandwidth: number;
  storage: number;
}

export class ECANScheduler {
  private config: ECANConfig;
  private attentionValues = new Map<string, ECANAttentionValue>();
  private resourceAllocations = new Map<string, ResourceAllocation>();
  private currentAttentionBank: number;
  private taskQueue: ScheduledTask[] = [];
  private executionHistory: Map<string, number[]> = new Map();

  constructor(config: Partial<ECANConfig> = {}) {
    this.config = {
      attentionBank: 1000000,
      maxSTI: 32767,
      minSTI: -32768,
      maxLTI: 65535,
      attentionDecayRate: 0.95,
      importanceSpreadingRate: 0.1,
      forgettingThreshold: -1000,
      stimulationThreshold: 1000,
      rentCollectionRate: 0.01,
      wagePaymentRate: 0.05,
      ...config
    };
    
    this.currentAttentionBank = this.config.attentionBank;
  }

  /**
   * Calculate economic attention value for a node based on its characteristics
   */
  calculateEconomicAttention(node: HypergraphNode, context: unknown = {}): ECANAttentionValue {
    const baseSTI = this.calculateBaseSTI(node, context);
    const baseLTI = this.calculateBaseLTI(node);
    const vlti = this.calculateVLTI(node);

    return {
      sti: Math.max(this.config.minSTI, Math.min(this.config.maxSTI, baseSTI)),
      lti: Math.max(0, Math.min(this.config.maxLTI, baseLTI)),
      vlti: vlti ? 1 : 0
    };
  }

  /**
   * Calculate Short Term Importance based on recent activity and relevance
   */
  private calculateBaseSTI(node: HypergraphNode, context: unknown): number {
    let sti = 0;

    // Base importance from node attributes
    const activation = (node.attributes.activation as number) || 0;
    const attention = (node.attributes.attention as number) || 0;
    const lastActivation = (node.attributes.lastActivation as number) || 0;
    const activationCount = (node.attributes.activationCount as number) || 0;

    // Recent activity bonus
    const timeSinceActivation = Date.now() - lastActivation;
    const recentActivityBonus = Math.max(0, 1000 - (timeSinceActivation / 1000));
    
    // Frequency bonus based on activation count
    const frequencyBonus = Math.min(500, activationCount * 10);
    
    // Attention-based bonus
    const attentionBonus = attention * 100;
    
    // Activation strength bonus
    const activationBonus = activation * 50;

    sti = recentActivityBonus + frequencyBonus + attentionBonus + activationBonus;

    // Context relevance bonus
    if (context && typeof context === 'object') {
      const contextRelevance = this.calculateContextRelevance(node, context);
      sti += contextRelevance * 200;
    }

    return Math.round(sti);
  }

  /**
   * Calculate Long Term Importance based on historical patterns
   */
  private calculateBaseLTI(node: HypergraphNode): number {
    let lti = 0;

    // Base LTI from node type and embeddings
    switch (node.type) {
      case 'concept':
        lti = 1000;
        break;
      case 'relation':
        lti = 800;
        break;
      case 'context':
        lti = 600;
        break;
      case 'state':
        lti = 400;
        break;
    }

    // Historical usage patterns
    const activationCount = (node.attributes.activationCount as number) || 0;
    const createdTime = (node.attributes.created as number) || Date.now();
    const age = Date.now() - createdTime;
    
    // Longevity bonus
    const longevityBonus = Math.min(2000, age / (1000 * 60 * 60 * 24)); // 1 point per day
    
    // Usage frequency bonus
    const usageBonus = Math.min(1000, activationCount * 5);
    
    lti += longevityBonus + usageBonus;

    return Math.round(lti);
  }

  /**
   * Calculate Very Long Term Importance (binary flag for system-critical nodes)
   */
  private calculateVLTI(node: HypergraphNode): boolean {
    // System-critical nodes get VLTI
    const criticalTypes = ['concept', 'relation'];
    const activationCount = (node.attributes.activationCount as number) || 0;
    const systemCritical = (node.attributes.systemCritical as boolean) || false;
    
    return systemCritical || 
           (criticalTypes.includes(node.type) && activationCount > 100);
  }

  /**
   * Calculate context relevance based on embedding similarity and attributes
   */
  private calculateContextRelevance(node: HypergraphNode, context: any): number {
    // Simple relevance calculation - can be enhanced with embeddings
    let relevance = 0;

    // Check attribute matching
    if (context.category && node.attributes.category === context.category) {
      relevance += 0.3;
    }
    
    if (context.type && node.type === context.type) {
      relevance += 0.2;
    }

    // Embedding similarity (simplified)
    if (context.embeddings && node.embeddings) {
      const similarity = this.calculateCosineSimilarity(node.embeddings, context.embeddings);
      relevance += similarity * 0.5;
    }

    return Math.max(0, Math.min(1, relevance));
  }

  /**
   * Calculate cosine similarity between two embedding vectors
   */
  private calculateCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Spread importance between connected nodes in AtomSpace
   */
  async spreadImportance(atomSpace: AtomSpace): Promise<void> {
    const spreadAmount = this.config.importanceSpreadingRate;
    
    // Collect all nodes with positive STI
    const activeNodes = Array.from(atomSpace.nodes.entries())
      .filter(([_, node]) => {
        const av = this.attentionValues.get(node.id);
        return av && av.sti > 0;
      });

    // Spread importance through edges
    for (const edge of atomSpace.edges.values()) {
      if (edge.nodes.length < 2) continue;
      
      const sourceNode = atomSpace.nodes.get(edge.nodes[0]);
      const targetNode = atomSpace.nodes.get(edge.nodes[edge.nodes.length - 1]);
      
      if (!sourceNode || !targetNode) continue;
      
      const sourceAV = this.attentionValues.get(sourceNode.id);
      const targetAV = this.attentionValues.get(targetNode.id);
      
      if (!sourceAV || !targetAV) continue;
      
      // Calculate spread amount based on edge weight and source STI
      const spread = Math.min(
        sourceAV.sti * spreadAmount * edge.weight,
        sourceAV.sti * 0.1 // Maximum 10% of source STI
      );
      
      if (spread > 1) {
        sourceAV.sti -= spread;
        targetAV.sti += spread;
        
        // Ensure STI stays within bounds
        sourceAV.sti = Math.max(this.config.minSTI, sourceAV.sti);
        targetAV.sti = Math.min(this.config.maxSTI, targetAV.sti);
      }
    }
  }

  /**
   * Collect rent from nodes based on their attention consumption
   */
  collectRent(): void {
    const rentRate = this.config.rentCollectionRate;
    
    for (const [nodeId, av] of this.attentionValues) {
      if (av.sti > 0) {
        const rent = Math.floor(av.sti * rentRate);
        av.sti -= rent;
        this.currentAttentionBank += rent;
      }
    }
  }

  /**
   * Pay wages to productive nodes
   */
  payWages(): void {
    const wageRate = this.config.wagePaymentRate;
    const availableWages = this.currentAttentionBank * wageRate;
    
    // Find nodes that deserve wages (high LTI, positive contribution)
    const wageCandidates = Array.from(this.attentionValues.entries())
      .filter(([_, av]) => av.lti > 1000)
      .sort(([_, a], [__, b]) => b.lti - a.lti);
    
    const wagePerNode = Math.floor(availableWages / Math.max(1, wageCandidates.length));
    
    for (const [nodeId, av] of wageCandidates) {
      if (this.currentAttentionBank >= wagePerNode) {
        av.sti += wagePerNode;
        this.currentAttentionBank -= wagePerNode;
        
        // Ensure STI stays within bounds
        av.sti = Math.min(this.config.maxSTI, av.sti);
      }
    }
  }

  /**
   * Apply attention decay to all nodes
   */
  applyAttentionDecay(): void {
    for (const av of this.attentionValues.values()) {
      av.sti = Math.floor(av.sti * this.config.attentionDecayRate);
      av.lti = Math.floor(av.lti * Math.sqrt(this.config.attentionDecayRate));
    }
  }

  /**
   * Schedule tasks based on priority and resource availability
   */
  scheduleTasks(
    availableTasks: ScheduledTask[], 
    availableResources: ResourceRequirements
  ): TaskSchedulingResult {
    const scheduledTasks: ScheduledTask[] = [];
    let totalCost = 0;
    let attentionBudgetUsed = 0;
    
    // Sort tasks by priority (higher first)
    const sortedTasks = [...availableTasks].sort((a, b) => b.priority - a.priority);
    
    const remainingResources = { ...availableResources };
    
    for (const task of sortedTasks) {
      // Check if we have enough resources
      if (this.canAllocateResources(task.resourceRequirements, remainingResources)) {
        // Check if we have enough attention budget
        const attentionCost = this.calculateAttentionCost(task);
        
        if (attentionBudgetUsed + attentionCost <= this.currentAttentionBank * 0.8) {
          // Schedule the task
          scheduledTasks.push(task);
          totalCost += task.estimatedCost;
          attentionBudgetUsed += attentionCost;
          
          // Update remaining resources
          remainingResources.cpu -= task.resourceRequirements.cpu;
          remainingResources.memory -= task.resourceRequirements.memory;
          remainingResources.bandwidth -= task.resourceRequirements.bandwidth;
          remainingResources.storage -= task.resourceRequirements.storage;
          
          // Create resource allocation record
          this.resourceAllocations.set(task.id, {
            nodeId: task.nodeId,
            allocatedCPU: task.resourceRequirements.cpu,
            allocatedMemory: task.resourceRequirements.memory,
            priority: task.priority,
            timestamp: Date.now()
          });
        }
      }
    }
    
    const resourceUtilization = this.calculateResourceUtilization(availableResources, remainingResources);
    
    return {
      scheduledTasks,
      totalCost,
      attentionBudgetUsed,
      resourceUtilization
    };
  }

  /**
   * Check if resources can be allocated for a task
   */
  private canAllocateResources(required: ResourceRequirements, available: ResourceRequirements): boolean {
    return required.cpu <= available.cpu &&
           required.memory <= available.memory &&
           required.bandwidth <= available.bandwidth &&
           required.storage <= available.storage;
  }

  /**
   * Calculate attention cost for a task based on its complexity and priority
   */
  private calculateAttentionCost(task: ScheduledTask): number {
    const baseCost = task.estimatedCost;
    const priorityMultiplier = task.priority / 100;
    const complexityMultiplier = this.calculateTaskComplexity(task);
    
    return Math.floor(baseCost * priorityMultiplier * complexityMultiplier);
  }

  /**
   * Calculate task complexity based on resource requirements
   */
  private calculateTaskComplexity(task: ScheduledTask): number {
    const req = task.resourceRequirements;
    return 1 + (req.cpu + req.memory + req.bandwidth + req.storage) / 1000;
  }

  /**
   * Calculate resource utilization percentage
   */
  private calculateResourceUtilization(total: ResourceRequirements, remaining: ResourceRequirements): number {
    const totalCapacity = total.cpu + total.memory + total.bandwidth + total.storage;
    const remainingCapacity = remaining.cpu + remaining.memory + remaining.bandwidth + remaining.storage;
    
    if (totalCapacity === 0) return 0;
    
    return ((totalCapacity - remainingCapacity) / totalCapacity) * 100;
  }

  /**
   * Update attention values for a node
   */
  setAttentionValue(nodeId: string, value: ECANAttentionValue): void {
    this.attentionValues.set(nodeId, { ...value });
  }

  /**
   * Get attention value for a node
   */
  getAttentionValue(nodeId: string): ECANAttentionValue | undefined {
    return this.attentionValues.get(nodeId);
  }

  /**
   * Get current attention bank balance
   */
  getAttentionBank(): number {
    return this.currentAttentionBank;
  }

  /**
   * Get resource allocation for a task
   */
  getResourceAllocation(taskId: string): ResourceAllocation | undefined {
    return this.resourceAllocations.get(taskId);
  }

  /**
   * Run a complete ECAN cycle
   */
  async runECANCycle(atomSpace: AtomSpace): Promise<void> {
    // Update attention values for all nodes
    for (const node of atomSpace.nodes.values()) {
      const currentAV = this.attentionValues.get(node.id);
      if (!currentAV) {
        const newAV = this.calculateEconomicAttention(node);
        this.setAttentionValue(node.id, newAV);
      }
    }

    // Spread importance
    await this.spreadImportance(atomSpace);
    
    // Collect rent
    this.collectRent();
    
    // Pay wages
    this.payWages();
    
    // Apply decay
    this.applyAttentionDecay();
    
    // Clean up low-attention nodes
    this.forgetLowAttentionNodes();
  }

  /**
   * Remove nodes with very low STI from consideration
   */
  private forgetLowAttentionNodes(): void {
    for (const [nodeId, av] of this.attentionValues.entries()) {
      if (av.sti < this.config.forgettingThreshold && av.vlti === 0) {
        this.attentionValues.delete(nodeId);
        this.resourceAllocations.delete(nodeId);
      }
    }
  }
}