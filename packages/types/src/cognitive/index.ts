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