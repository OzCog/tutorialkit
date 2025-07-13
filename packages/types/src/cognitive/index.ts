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

// Phase 4: Distributed Cognitive Mesh API & Embodiment Layer
export * from './phase4-cognitive-api.js';
export * from './phase4-websocket-interface.js';
export * from './phase4-embodiment-interfaces.js';
export * from './phase4-testing-framework.js';
export * from './phase4-integration.js';

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

// Phase 4: Distributed Cognitive Mesh API & Embodiment Layer types
export type {
  CognitiveOperationRequest,
  CognitiveOperationResponse,
  DistributedStateSnapshot,
  TaskOrchestrationConfig
} from './phase4-cognitive-api.js';

export type {
  WebSocketMessage,
  CognitiveWebSocketRequest,
  CognitiveWebSocketResponse,
  StateUpdateEvent,
  RealTimeMetrics,
  CognitiveWebSocketConnection
} from './phase4-websocket-interface.js';

export type {
  EmbodimentVector3,
  EmbodimentQuaternion,
  EmbodimentTransform,
  SensorData,
  ActuatorCommand,
  EmbodimentState,
  Unity3DMessage,
  Unity3DGameObject,
  Unity3DCognitiveAgent,
  ROSNode,
  ROSMessage,
  ROSServiceRequest,
  WebAgent,
  WebAgentInteraction
} from './phase4-embodiment-interfaces.js';

export type {
  TestMetrics,
  LoadTestConfig,
  EmbodimentTestScenario
} from './phase4-testing-framework.js';

export type {
  Phase4Configuration,
  EmbodimentFlowchartNode,
  RecursiveEmbodimentPath
} from './phase4-integration.js';

// Phase 5: Recursive Meta-Cognition & Evolutionary Optimization
export * from './phase5-meta-cognitive.js';
export * from './phase5-evolutionary.js';
export * from './phase5-recursive.js';
export * from './phase5-integration.js';

// Phase 5 types
export type {
  MetaCognitiveMetrics,
  SelfAnalysisReport,
  FeedbackLoop,
  EvolutionaryParameters,
  CognitiveGenome,
  EvolutionaryFitness,
  EvolutionCycle,
  FitnessLandscape,
  RecursiveLayer,
  SelfImprovementCycle,
  RecursiveOptimizationPlan,
  MetaLearningMetrics,
  Phase5SystemConfig,
  Phase5SystemState,
  Phase5Metrics,
  EvolutionaryTrajectory
} from './phase5-meta-cognitive.js';

export type {
  EvolutionaryParameters as Phase5EvolutionaryParameters,
  CognitiveGenome as Phase5CognitiveGenome,
  EvolutionaryFitness as Phase5EvolutionaryFitness,
  EvolutionCycle as Phase5EvolutionCycle,
  FitnessLandscape as Phase5FitnessLandscape
} from './phase5-evolutionary.js';

export type {
  RecursiveLayer as Phase5RecursiveLayer,
  SelfImprovementCycle as Phase5SelfImprovementCycle,
  RecursiveOptimizationPlan as Phase5RecursiveOptimizationPlan,
  MetaLearningMetrics as Phase5MetaLearningMetrics
} from './phase5-recursive.js';

export type {
  Phase5SystemConfig as Phase5Config,
  Phase5SystemState as Phase5State,
  Phase5Metrics as Phase5SystemMetrics,
  EvolutionaryTrajectory as Phase5EvolutionaryTrajectory
} from './phase5-integration.js';