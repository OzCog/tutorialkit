/**
 * Cognitive Tensor Network types for TutorialKit
 * 
 * This module defines the foundational types and interfaces for implementing
 * a distributed GGML tensor network with agentic cognitive grammar.
 */

export interface CognitiveNode {
  id: string;
  type: 'function' | 'module' | 'component' | 'lesson' | 'chapter' | 'part';
  name: string;
  arity: number;
  complexity: number;
  metadata: Record<string, unknown>;
  connections: string[];
}

export interface TensorKernel {
  id: string;
  nodeId: string;
  shape: number[];
  dtype: 'float32' | 'float64' | 'int32' | 'int64';
  data: ArrayBuffer;
  operations: TensorOperation[];
}

export interface TensorOperation {
  id: string;
  type: 'matmul' | 'add' | 'activation' | 'attention' | 'embedding';
  inputs: string[];
  outputs: string[];
  parameters: Record<string, unknown>;
}

export interface AgenticGrammar {
  id: string;
  patterns: GrammarPattern[];
  activationRules: ActivationRule[];
  attentionWeights: AttentionWeight[];
}

export interface GrammarPattern {
  id: string;
  pattern: string;
  category: 'structural' | 'semantic' | 'cognitive' | 'behavioral';
  weight: number;
  conditions: PatternCondition[];
}

export interface PatternCondition {
  type: 'context' | 'state' | 'input' | 'output';
  operator: 'equals' | 'contains' | 'matches' | 'greater' | 'less';
  value: unknown;
}

export interface ActivationRule {
  id: string;
  trigger: string;
  action: ActivationAction;
  priority: number;
  conditions: ActivationCondition[];
}

export interface ActivationAction {
  type: 'propagate' | 'inhibit' | 'amplify' | 'transform';
  target: string;
  parameters: Record<string, unknown>;
}

export interface ActivationCondition {
  type: 'threshold' | 'pattern' | 'time' | 'context';
  operator: 'greater' | 'less' | 'equals' | 'matches';
  value: unknown;
}

export interface AttentionWeight {
  sourceId: string;
  targetId: string;
  weight: number;
  type: 'excitatory' | 'inhibitory';
  decay: number;
}

export interface HypergraphNode {
  id: string;
  type: 'concept' | 'relation' | 'context' | 'state';
  attributes: Record<string, unknown>;
  embeddings: number[];
}

export interface HypergraphEdge {
  id: string;
  nodes: string[];
  type: 'structural' | 'semantic' | 'temporal' | 'causal';
  weight: number;
  attributes: Record<string, unknown>;
}

export interface AtomSpace {
  id: string;
  nodes: Map<string, HypergraphNode>;
  edges: Map<string, HypergraphEdge>;
  indices: Map<string, Set<string>>;
  metadata: Record<string, unknown>;
}

export interface PSystemMembrane {
  id: string;
  parentId?: string;
  childrenIds: string[];
  objects: Map<string, number>;
  rules: PSystemRule[];
  charge: number;
  thickness: number;
}

export interface PSystemRule {
  id: string;
  condition: string;
  action: PSystemAction;
  priority: number;
  context: string[];
}

export interface PSystemAction {
  type: 'create' | 'destroy' | 'move' | 'transform' | 'communicate';
  objects: string[];
  parameters: Record<string, unknown>;
}

export interface CognitiveExtractor {
  extractNodes(source: unknown): Promise<CognitiveNode[]>;
  analyzeComplexity(node: CognitiveNode): number;
  buildConnectionGraph(nodes: CognitiveNode[]): Map<string, string[]>;
}

export interface TensorKernelMapper {
  mapNodeToKernel(node: CognitiveNode): Promise<TensorKernel>;
  optimizeKernelShapes(kernels: TensorKernel[]): TensorKernel[];
  registerKernel(kernel: TensorKernel): void;
}

export interface DistributedGrammarEngine {
  id: string;
  grammar: AgenticGrammar;
  atomSpace: AtomSpace;
  membranes: Map<string, PSystemMembrane>;
  
  processPattern(pattern: GrammarPattern, context: unknown): Promise<unknown>;
  propagateActivation(ruleId: string, intensity: number): Promise<void>;
  allocateAttention(weights: AttentionWeight[]): Promise<void>;
  evolveMembranes(steps: number): Promise<void>;
}

export interface CognitiveRegistry {
  nodes: Map<string, CognitiveNode>;
  kernels: Map<string, TensorKernel>;
  grammars: Map<string, AgenticGrammar>;
  engines: Map<string, DistributedGrammarEngine>;
  
  register(item: CognitiveNode | TensorKernel | AgenticGrammar | DistributedGrammarEngine): void;
  lookup(id: string): unknown;
  query(criteria: Record<string, unknown>): unknown[];
}

export interface TensorNetworkArchitecture {
  registry: CognitiveRegistry;
  extractor: CognitiveExtractor;
  mapper: TensorKernelMapper;
  engines: Map<string, DistributedGrammarEngine>;
  
  initialize(config: TensorNetworkConfig): Promise<void>;
  processLessonContent(lesson: unknown): Promise<CognitiveProcessingResult>;
  generateMermaidDiagram(scope: string): Promise<string>;
}

export interface TensorNetworkConfig {
  ggmlBackend: 'cpu' | 'cuda' | 'opencl' | 'metal';
  maxMemoryMB: number;
  attentionMechanism: 'ecan' | 'simple' | 'hierarchical';
  membraneEvolution: boolean;
  primeFactorization: boolean;
  recursiveExpansion: boolean;
}

export interface CognitiveProcessingResult {
  nodes: CognitiveNode[];
  kernels: TensorKernel[];
  activations: Map<string, number>;
  patterns: GrammarPattern[];
  diagram: string;
  metadata: Record<string, unknown>;
}