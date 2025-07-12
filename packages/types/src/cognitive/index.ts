/**
 * Cognitive Tensor Network Module for TutorialKit
 * 
 * This module provides the complete implementation of a distributed GGML tensor network
 * with agentic cognitive grammar for advanced tutorial content processing.
 */

export * from './extractor.js';
export * from './tensor-mapper.js';
export * from './grammar-engine.js';
export * from './tensor-network.js';
export * from './integration.js';
export * from './scheme-adapter.js';
export * from './tensor-utils.js';
export * from './ecan-scheduler.js';
export * from './mesh-topology.js';
export * from './attention-visualizer.js';
export * from './phase2-integration.js';
// Phase 3: Neural-Symbolic Synthesis via Custom GGML Kernels
export * from './ggml-kernels.js';
export * from './neural-symbolic-synthesis.js';
export * from './tensor-profiling.js';

// Re-export key types from entities
export type {
  CognitiveNode,
  TensorKernel,
  AgenticGrammar,
  DistributedGrammarEngine,
  TensorNetworkArchitecture,
  TensorNetworkConfig,
  CognitiveProcessingResult,
  AtomSpace,
  HypergraphNode,
  HypergraphEdge,
  PSystemMembrane,
  GrammarPattern,
  AttentionWeight
} from '../entities/cognitive-tensor.js';

// Re-export new types from modules
export type {
  Ko6mlPrimitive,
  SchemeExpression,
  TranslationResult,
  SchemeAdapter
} from './scheme-adapter.js';

export type {
  CognitiveTensorDimensions,
  TensorValidationResult,
  TensorSerializationOptions,
  SerializedTensor,
  TensorPrimeFactorization
} from './tensor-utils.js';

// ECAN Scheduler types
export type {
  ECANAttentionValue,
  ECANConfig,
  ResourceAllocation,
  TaskSchedulingResult,
  ScheduledTask,
  ResourceRequirements
} from './ecan-scheduler.js';

// Mesh Topology types
export type {
  MeshNode,
  MeshTopology,
  LoadBalancingStrategy,
  AttentionFlowMetrics,
  MeshPerformanceMetrics,
  ResourceUtilization,
  LoadBalancer,
  RebalancingResult
} from './mesh-topology.js';

// Attention Visualizer types
export type {
  AttentionFlowVisualization,
  VisualizationMetadata,
  FlowAnalysisResult,
  CriticalPath,
  FlowBottleneck,
  AttentionCluster,
  EfficiencyMetrics,
  FlowRecommendation,
  ResourceAllocationChart,
  ChartDataPoint,
  ChartConfig
} from './attention-visualizer.js';

// Phase 2 Integration types
export type {
  Phase2SystemConfig,
  Phase2SystemState,
  TaskProcessingResult
} from './phase2-integration.js';

// Phase 3: Neural-Symbolic Synthesis types
export type {
  GGMLOperation,
  GGMLKernel,
  SymbolicTensorOperation,
  NeuralInferenceHook,
  KernelRegistry,
  PerformanceMetrics,
  OptimizationResult
} from './ggml-kernels.js';

export type {
  NeuralSymbolicPipeline,
  SymbolicRepresentation,
  NeuralRepresentation,
  SynthesisResult,
  HybridRepresentation,
  BridgeMapping,
  BenchmarkData,
  TestCase,
  ValidationCriteria,
  BenchmarkResult,
  TestCaseResult
} from './neural-symbolic-synthesis.js';

export type {
  TensorOperationProfile,
  ProfilingSession,
  AggregateMetrics,
  OptimizationRecommendation,
  RealTimeMonitor,
  Alert,
  PerformanceThresholds,
  BenchmarkSuite,
  BenchmarkTestCase,
  RegressionTestResult
} from './tensor-profiling.js';