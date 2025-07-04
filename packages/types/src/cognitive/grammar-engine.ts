import type {
  DistributedGrammarEngine,
  AgenticGrammar,
  AtomSpace,
  PSystemMembrane,
  GrammarPattern,
  AttentionWeight,
  HypergraphNode,
  HypergraphEdge,
  PSystemRule,
  ActivationRule
} from '../entities/cognitive-tensor.js';

/**
 * Distributed Grammar Engine with ECAN-inspired Attention Allocation
 * 
 * Implements agentic grammar processing with hypergraph pattern matching
 * and P-System membrane evolution for cognitive TutorialKit components.
 */

export class TutorialKitDistributedGrammarEngine implements DistributedGrammarEngine {
  public readonly id: string;
  public readonly grammar: AgenticGrammar;
  public readonly atomSpace: AtomSpace;
  public readonly membranes: Map<string, PSystemMembrane>;
  
  private activationHistory = new Map<string, number[]>();
  private attentionDecay = 0.95;
  private activationThreshold = 0.5;
  private membraneEvolutionRate = 0.1;
  
  constructor(
    id: string,
    grammar: AgenticGrammar,
    atomSpace: AtomSpace,
    membranes: Map<string, PSystemMembrane> = new Map()
  ) {
    this.id = id;
    this.grammar = grammar;
    this.atomSpace = atomSpace;
    this.membranes = membranes;
    
    this.initializeDefaultMembranes();
  }
  
  async processPattern(pattern: GrammarPattern, context: unknown): Promise<unknown> {
    // Update pattern activation history
    this.updatePatternActivation(pattern.id, pattern.weight);
    
    // Check pattern conditions
    if (!this.evaluatePatternConditions(pattern, context)) {
      return null;
    }
    
    // Process pattern in appropriate membrane
    const membrane = this.selectMembraneForPattern(pattern);
    const result = await this.processPatternInMembrane(pattern, context, membrane);
    
    // Update hypergraph with pattern activation
    this.updateHypergraphWithPattern(pattern, result);
    
    return result;
  }
  
  async propagateActivation(ruleId: string, intensity: number): Promise<void> {
    const rule = this.grammar.activationRules.find(r => r.id === ruleId);
    if (!rule) return;
    
    // Check rule conditions
    if (!this.evaluateActivationConditions(rule, intensity)) {
      return;
    }
    
    // Apply activation based on rule type
    switch (rule.action.type) {
      case 'propagate':
        await this.propagateToTarget(rule.action.target, intensity * rule.priority);
        break;
      case 'inhibit':
        await this.inhibitTarget(rule.action.target, intensity * rule.priority);
        break;
      case 'amplify':
        await this.amplifyTarget(rule.action.target, intensity * rule.priority);
        break;
      case 'transform':
        await this.transformTarget(rule.action.target, rule.action.parameters);
        break;
    }
    
    // Update activation history
    this.updateActivationHistory(ruleId, intensity);
  }
  
  async allocateAttention(weights: AttentionWeight[]): Promise<void> {
    // Normalize attention weights
    const normalizedWeights = this.normalizeAttentionWeights(weights);
    
    // Apply ECAN-inspired attention allocation
    for (const weight of normalizedWeights) {
      await this.allocateAttentionToNode(weight);
    }
    
    // Apply attention decay
    this.applyAttentionDecay();
    
    // Update hypergraph indices based on attention
    this.updateAttentionIndices();
  }
  
  async evolveMembranes(steps: number): Promise<void> {
    for (let step = 0; step < steps; step++) {
      await this.performMembraneEvolutionStep();
    }
  }
  
  private initializeDefaultMembranes(): void {
    // Create root membrane
    const rootMembrane: PSystemMembrane = {
      id: 'root',
      childrenIds: ['cognitive', 'structural', 'semantic'],
      objects: new Map(),
      rules: [],
      charge: 0,
      thickness: 1
    };
    
    // Create cognitive processing membrane
    const cognitiveMembrane: PSystemMembrane = {
      id: 'cognitive',
      parentId: 'root',
      childrenIds: [],
      objects: new Map([
        ['attention', 1],
        ['focus', 1],
        ['comprehension', 1]
      ]),
      rules: this.createCognitiveRules(),
      charge: 0,
      thickness: 1
    };
    
    // Create structural analysis membrane
    const structuralMembrane: PSystemMembrane = {
      id: 'structural',
      parentId: 'root',
      childrenIds: [],
      objects: new Map([
        ['hierarchy', 1],
        ['connection', 1],
        ['dependency', 1]
      ]),
      rules: this.createStructuralRules(),
      charge: 0,
      thickness: 1
    };
    
    // Create semantic understanding membrane
    const semanticMembrane: PSystemMembrane = {
      id: 'semantic',
      parentId: 'root',
      childrenIds: [],
      objects: new Map([
        ['meaning', 1],
        ['context', 1],
        ['relationship', 1]
      ]),
      rules: this.createSemanticRules(),
      charge: 0,
      thickness: 1
    };
    
    this.membranes.set('root', rootMembrane);
    this.membranes.set('cognitive', cognitiveMembrane);
    this.membranes.set('structural', structuralMembrane);
    this.membranes.set('semantic', semanticMembrane);
  }
  
  private createCognitiveRules(): PSystemRule[] {
    return [
      {
        id: 'attention-focus',
        condition: 'attention > 0.5',
        action: {
          type: 'create',
          objects: ['focus'],
          parameters: { intensity: 'attention * 2' }
        },
        priority: 1,
        context: ['cognitive']
      },
      {
        id: 'comprehension-boost',
        condition: 'focus > 0.8',
        action: {
          type: 'create',
          objects: ['comprehension'],
          parameters: { depth: 'focus * 1.5' }
        },
        priority: 2,
        context: ['cognitive']
      }
    ];
  }
  
  private createStructuralRules(): PSystemRule[] {
    return [
      {
        id: 'hierarchy-analysis',
        condition: 'hierarchy > 0',
        action: {
          type: 'create',
          objects: ['connection'],
          parameters: { strength: 'hierarchy * 0.8' }
        },
        priority: 1,
        context: ['structural']
      },
      {
        id: 'dependency-mapping',
        condition: 'connection > 0.6',
        action: {
          type: 'create',
          objects: ['dependency'],
          parameters: { weight: 'connection * 0.7' }
        },
        priority: 2,
        context: ['structural']
      }
    ];
  }
  
  private createSemanticRules(): PSystemRule[] {
    return [
      {
        id: 'meaning-extraction',
        condition: 'context > 0.4',
        action: {
          type: 'create',
          objects: ['meaning'],
          parameters: { clarity: 'context * 1.2' }
        },
        priority: 1,
        context: ['semantic']
      },
      {
        id: 'relationship-inference',
        condition: 'meaning > 0.7',
        action: {
          type: 'create',
          objects: ['relationship'],
          parameters: { confidence: 'meaning * 0.9' }
        },
        priority: 2,
        context: ['semantic']
      }
    ];
  }
  
  private updatePatternActivation(patternId: string, weight: number): void {
    const history = this.activationHistory.get(patternId) || [];
    history.push(weight);
    
    // Keep only recent history
    if (history.length > 100) {
      history.shift();
    }
    
    this.activationHistory.set(patternId, history);
  }
  
  private evaluatePatternConditions(pattern: GrammarPattern, context: unknown): boolean {
    return pattern.conditions.every(condition => {
      switch (condition.type) {
        case 'context':
          return this.evaluateContextCondition(condition, context);
        case 'state':
          return this.evaluateStateCondition(condition);
        case 'input':
          return this.evaluateInputCondition(condition, context);
        case 'output':
          return this.evaluateOutputCondition(condition, context);
        default:
          return true;
      }
    });
  }
  
  private evaluateContextCondition(condition: any, context: unknown): boolean {
    // Simple context evaluation - can be extended
    return true;
  }
  
  private evaluateStateCondition(condition: any): boolean {
    // Simple state evaluation - can be extended
    return true;
  }
  
  private evaluateInputCondition(condition: any, context: unknown): boolean {
    // Simple input evaluation - can be extended
    return true;
  }
  
  private evaluateOutputCondition(condition: any, context: unknown): boolean {
    // Simple output evaluation - can be extended
    return true;
  }
  
  private selectMembraneForPattern(pattern: GrammarPattern): PSystemMembrane {
    switch (pattern.category) {
      case 'cognitive':
        return this.membranes.get('cognitive')!;
      case 'structural':
        return this.membranes.get('structural')!;
      case 'semantic':
        return this.membranes.get('semantic')!;
      default:
        return this.membranes.get('root')!;
    }
  }
  
  private async processPatternInMembrane(
    pattern: GrammarPattern,
    context: unknown,
    membrane: PSystemMembrane
  ): Promise<unknown> {
    // Apply membrane rules to process pattern
    const result = {
      patternId: pattern.id,
      membraneId: membrane.id,
      activation: pattern.weight,
      context: context,
      timestamp: Date.now()
    };
    
    // Update membrane objects based on pattern
    this.updateMembraneObjects(membrane, pattern);
    
    return result;
  }
  
  private updateMembraneObjects(membrane: PSystemMembrane, pattern: GrammarPattern): void {
    // Simple object update based on pattern activation
    const objectName = pattern.category;
    const currentValue = membrane.objects.get(objectName) || 0;
    membrane.objects.set(objectName, currentValue + pattern.weight * 0.1);
  }
  
  private updateHypergraphWithPattern(pattern: GrammarPattern, result: unknown): void {
    // Create or update hypergraph node for pattern
    const nodeId = `pattern-${pattern.id}`;
    
    if (!this.atomSpace.nodes.has(nodeId)) {
      const node: HypergraphNode = {
        id: nodeId,
        type: 'concept',
        attributes: {
          pattern: pattern.pattern,
          category: pattern.category,
          weight: pattern.weight
        },
        embeddings: this.generateNodeEmbeddings(pattern)
      };
      
      this.atomSpace.nodes.set(nodeId, node);
    }
    
    // Update node attributes
    const node = this.atomSpace.nodes.get(nodeId)!;
    node.attributes.lastActivation = Date.now();
    node.attributes.activationCount = (node.attributes.activationCount as number || 0) + 1;
  }
  
  private generateNodeEmbeddings(pattern: GrammarPattern): number[] {
    // Generate simple embeddings based on pattern characteristics
    const embeddings = new Array(64).fill(0);
    
    // Encode pattern category
    const categoryHash = this.hashString(pattern.category);
    embeddings[0] = (categoryHash % 100) / 100;
    
    // Encode pattern weight
    embeddings[1] = Math.min(1, pattern.weight);
    
    // Encode pattern complexity
    embeddings[2] = Math.min(1, pattern.pattern.length / 100);
    
    // Fill remaining with random values based on pattern
    for (let i = 3; i < embeddings.length; i++) {
      embeddings[i] = (Math.sin(categoryHash * i) + 1) / 2;
    }
    
    return embeddings;
  }
  
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  private evaluateActivationConditions(rule: ActivationRule, intensity: number): boolean {
    return rule.conditions.every(condition => {
      switch (condition.type) {
        case 'threshold':
          return intensity >= (condition.value as number);
        case 'pattern':
          return this.matchesPattern(condition.value as string, intensity);
        case 'time':
          return this.checkTimeCondition(condition.value as number);
        case 'context':
          return this.checkContextCondition(condition.value);
        default:
          return true;
      }
    });
  }
  
  private matchesPattern(pattern: string, intensity: number): boolean {
    // Simple pattern matching - can be extended
    return true;
  }
  
  private checkTimeCondition(timeValue: number): boolean {
    // Simple time condition - can be extended
    return true;
  }
  
  private checkContextCondition(contextValue: unknown): boolean {
    // Simple context condition - can be extended
    return true;
  }
  
  private async propagateToTarget(targetId: string, intensity: number): Promise<void> {
    const node = this.atomSpace.nodes.get(targetId);
    if (node) {
      node.attributes.activation = (node.attributes.activation as number || 0) + intensity;
    }
  }
  
  private async inhibitTarget(targetId: string, intensity: number): Promise<void> {
    const node = this.atomSpace.nodes.get(targetId);
    if (node) {
      node.attributes.activation = Math.max(0, (node.attributes.activation as number || 0) - intensity);
    }
  }
  
  private async amplifyTarget(targetId: string, intensity: number): Promise<void> {
    const node = this.atomSpace.nodes.get(targetId);
    if (node) {
      node.attributes.activation = (node.attributes.activation as number || 0) * (1 + intensity);
    }
  }
  
  private async transformTarget(targetId: string, parameters: Record<string, unknown>): Promise<void> {
    const node = this.atomSpace.nodes.get(targetId);
    if (node) {
      // Apply transformation based on parameters
      Object.assign(node.attributes, parameters);
    }
  }
  
  private updateActivationHistory(ruleId: string, intensity: number): void {
    const history = this.activationHistory.get(ruleId) || [];
    history.push(intensity);
    
    if (history.length > 50) {
      history.shift();
    }
    
    this.activationHistory.set(ruleId, history);
  }
  
  private normalizeAttentionWeights(weights: AttentionWeight[]): AttentionWeight[] {
    const totalWeight = weights.reduce((sum, w) => sum + Math.abs(w.weight), 0);
    
    if (totalWeight === 0) return weights;
    
    return weights.map(w => ({
      ...w,
      weight: w.weight / totalWeight
    }));
  }
  
  private async allocateAttentionToNode(weight: AttentionWeight): Promise<void> {
    const sourceNode = this.atomSpace.nodes.get(weight.sourceId);
    const targetNode = this.atomSpace.nodes.get(weight.targetId);
    
    if (sourceNode && targetNode) {
      // Transfer attention based on weight
      const attentionTransfer = weight.weight * (weight.type === 'excitatory' ? 1 : -1);
      
      sourceNode.attributes.attention = (sourceNode.attributes.attention as number || 0) - Math.abs(attentionTransfer);
      targetNode.attributes.attention = (targetNode.attributes.attention as number || 0) + attentionTransfer;
      
      // Ensure attention values stay within bounds
      sourceNode.attributes.attention = Math.max(0, sourceNode.attributes.attention as number);
      targetNode.attributes.attention = Math.max(0, targetNode.attributes.attention as number);
    }
  }
  
  private applyAttentionDecay(): void {
    for (const node of this.atomSpace.nodes.values()) {
      if (typeof node.attributes.attention === 'number') {
        node.attributes.attention *= this.attentionDecay;
      }
    }
  }
  
  private updateAttentionIndices(): void {
    // Update indices for fast attention-based queries
    const highAttentionNodes = new Set<string>();
    
    for (const [nodeId, node] of this.atomSpace.nodes) {
      if ((node.attributes.attention as number || 0) > this.activationThreshold) {
        highAttentionNodes.add(nodeId);
      }
    }
    
    this.atomSpace.indices.set('high-attention', highAttentionNodes);
  }
  
  private async performMembraneEvolutionStep(): Promise<void> {
    for (const membrane of this.membranes.values()) {
      await this.evolveMembrane(membrane);
    }
  }
  
  private async evolveMembrane(membrane: PSystemMembrane): Promise<void> {
    // Apply membrane rules
    for (const rule of membrane.rules) {
      if (this.evaluateRuleCondition(rule, membrane)) {
        await this.applyMembraneRule(rule, membrane);
      }
    }
    
    // Update membrane charge based on objects
    membrane.charge = this.calculateMembraneCharge(membrane);
    
    // Evolve membrane thickness
    membrane.thickness *= (1 + this.membraneEvolutionRate * (Math.random() - 0.5));
    membrane.thickness = Math.max(0.1, Math.min(5, membrane.thickness));
  }
  
  private evaluateRuleCondition(rule: PSystemRule, membrane: PSystemMembrane): boolean {
    // Simple rule condition evaluation
    return true;
  }
  
  private async applyMembraneRule(rule: PSystemRule, membrane: PSystemMembrane): Promise<void> {
    switch (rule.action.type) {
      case 'create':
        for (const obj of rule.action.objects) {
          const currentCount = membrane.objects.get(obj) || 0;
          membrane.objects.set(obj, currentCount + 1);
        }
        break;
      case 'destroy':
        for (const obj of rule.action.objects) {
          const currentCount = membrane.objects.get(obj) || 0;
          membrane.objects.set(obj, Math.max(0, currentCount - 1));
        }
        break;
      case 'move':
        // Move objects between membranes
        break;
      case 'transform':
        // Transform objects
        break;
      case 'communicate':
        // Communicate with other membranes
        break;
    }
  }
  
  private calculateMembraneCharge(membrane: PSystemMembrane): number {
    let charge = 0;
    
    for (const [obj, count] of membrane.objects) {
      charge += count * this.getObjectCharge(obj);
    }
    
    return charge;
  }
  
  private getObjectCharge(obj: string): number {
    // Simple charge calculation based on object type
    switch (obj) {
      case 'attention': return 1;
      case 'focus': return 2;
      case 'comprehension': return 3;
      case 'meaning': return 2;
      case 'relationship': return 1;
      default: return 1;
    }
  }
}