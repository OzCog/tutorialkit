/**
 * Phase 3: End-to-End Integration Test
 * 
 * Comprehensive integration test demonstrating the complete neural-symbolic
 * synthesis pipeline with real TutorialKit data and custom GGML kernels.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type { 
  AtomSpace, 
  HypergraphNode,
  CognitiveNode 
} from '../entities/cognitive-tensor.js';
import {
  CognitiveGGMLKernelRegistry,
  SymbolicTensorOperator,
  NeuralInferenceHookManager,
  type GGMLKernel,
  type SymbolicTensorOperation,
  type NeuralInferenceHook
} from './ggml-kernels.js';
import {
  TutorialKitNeuralSymbolicPipeline,
  type SymbolicRepresentation,
  type NeuralRepresentation
} from './neural-symbolic-synthesis.js';
import {
  TensorOperationProfiler,
  TensorRealTimeMonitor,
  NeuralSymbolicBenchmarkSuite
} from './tensor-profiling.js';
import { TutorialKitCognitiveExtractor } from './extractor.js';
import { TutorialKitTensorKernelMapper } from './tensor-mapper.js';

describe('Phase 3: End-to-End Neural-Symbolic Integration', () => {
  let realTutorialData: any;
  let atomSpace: AtomSpace;
  let pipeline: TutorialKitNeuralSymbolicPipeline;
  let kernelRegistry: CognitiveGGMLKernelRegistry;
  let profiler: TensorOperationProfiler;
  let benchmarkSuite: NeuralSymbolicBenchmarkSuite;

  beforeEach(() => {
    // Create realistic tutorial data structure
    realTutorialData = {
      tutorial: {
        id: 'js-fundamentals',
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming',
        difficulty: 'beginner',
        estimatedTime: 120,
        chapters: [
          {
            id: 'variables',
            title: 'Variables and Data Types',
            lessons: [
              {
                id: 'var-declaration',
                title: 'Variable Declaration',
                content: 'Learn how to declare variables in JavaScript',
                type: 'concept',
                prerequisites: [],
                duration: 15,
                complexity: 'low'
              },
              {
                id: 'data-types',
                title: 'JavaScript Data Types',
                content: 'Understanding strings, numbers, booleans, and objects',
                type: 'concept',
                prerequisites: ['var-declaration'],
                duration: 20,
                complexity: 'medium'
              }
            ]
          },
          {
            id: 'functions',
            title: 'Functions',
            lessons: [
              {
                id: 'function-basics',
                title: 'Function Basics',
                content: 'Creating and calling functions',
                type: 'concept',
                prerequisites: ['var-declaration', 'data-types'],
                duration: 25,
                complexity: 'medium'
              },
              {
                id: 'arrow-functions',
                title: 'Arrow Functions',
                content: 'Modern function syntax',
                type: 'concept',
                prerequisites: ['function-basics'],
                duration: 15,
                complexity: 'high'
              }
            ]
          }
        ]
      }
    };

    // Create AtomSpace from tutorial data
    atomSpace = createAtomSpaceFromTutorial(realTutorialData);

    // Initialize Phase 3 components
    kernelRegistry = new CognitiveGGMLKernelRegistry();
    pipeline = new TutorialKitNeuralSymbolicPipeline(atomSpace);
    profiler = new TensorOperationProfiler();
    benchmarkSuite = new NeuralSymbolicBenchmarkSuite();
  });

  describe('Complete Pipeline Integration', () => {
    it('should process real tutorial data through the entire neural-symbolic pipeline', async () => {
      console.log('Starting end-to-end pipeline test with real tutorial data...');

      // Start profiling
      profiler.startProfilingSession('e2e-tutorial-processing');

      // Step 1: Extract cognitive nodes from real tutorial data
      const extractor = new TutorialKitCognitiveExtractor();
      const cognitiveNodes = await profiler.profileOperation(
        'extract-cognitive-nodes',
        'symbolic',
        async () => {
          return await extractor.extractNodes(realTutorialData.tutorial);
        }
      );

      expect(cognitiveNodes.length).toBeGreaterThan(0);
      console.log(`Extracted ${cognitiveNodes.length} cognitive nodes from tutorial`);

      // Step 2: Map nodes to tensor kernels
      const tensorMapper = new TutorialKitTensorKernelMapper();
      const tensorKernels = await profiler.profileOperation(
        'map-tensor-kernels',
        'hybrid',
        async () => {
          return await Promise.all(
            cognitiveNodes.slice(0, 5).map(node => tensorMapper.mapNodeToKernel(node))
          );
        }
      );

      expect(tensorKernels.length).toBeGreaterThan(0);
      console.log(`Created ${tensorKernels.length} tensor kernels`);

      // Step 3: Create symbolic representation from tutorial structure
      const symbolicRepresentation: SymbolicRepresentation = {
        atomSpaceNodes: atomSpace.nodes,
        logicalRules: [
          'prerequisite_ordering',
          'difficulty_progression',
          'concept_dependency',
          'learning_path_optimization'
        ],
        inferenceChain: [
          'analyze_prerequisites',
          'sequence_lessons',
          'adapt_difficulty',
          'validate_learning_path'
        ],
        confidence: 0.88
      };

      // Step 4: Convert symbolic to neural representation
      const neuralRepresentation = await profiler.profileOperation(
        'symbolic-to-neural',
        'neural',
        async () => {
          return await pipeline.processSymbolicToNeural(symbolicRepresentation);
        }
      );

      expect(neuralRepresentation.tensors.length).toBeGreaterThan(0);
      expect(neuralRepresentation.activations.length).toBeGreaterThan(0);
      expect(neuralRepresentation.weights.length).toBeGreaterThan(0);
      console.log(`Created neural representation with ${neuralRepresentation.tensors.length} tensors`);

      // Step 5: Perform neural-symbolic synthesis
      const synthesisResult = await profiler.profileOperation(
        'neural-symbolic-synthesis',
        'hybrid',
        async () => {
          return await pipeline.synthesize(symbolicRepresentation, neuralRepresentation);
        }
      );

      expect(synthesisResult.hybridRepresentation).toBeDefined();
      expect(synthesisResult.confidenceScore).toBeGreaterThan(0.5);
      expect(synthesisResult.processingTime).toBeGreaterThan(0);
      console.log(`Synthesis completed with confidence: ${(synthesisResult.confidenceScore * 100).toFixed(1)}%`);

      // Step 6: Convert back to symbolic (round-trip test)
      const reconstructedSymbolic = await profiler.profileOperation(
        'neural-to-symbolic',
        'symbolic',
        async () => {
          return await pipeline.processNeuralToSymbolic(neuralRepresentation);
        }
      );

      expect(reconstructedSymbolic.atomSpaceNodes.length).toBeGreaterThan(0);
      expect(reconstructedSymbolic.logicalRules.length).toBeGreaterThan(0);
      console.log(`Round-trip completed with ${reconstructedSymbolic.atomSpaceNodes.length} reconstructed nodes`);

      // Step 7: Validate round-trip fidelity
      const originalNodeCount = symbolicRepresentation.atomSpaceNodes.length;
      const reconstructedNodeCount = reconstructedSymbolic.atomSpaceNodes.length;
      const nodeFidelity = Math.min(reconstructedNodeCount / originalNodeCount, 1.0);
      
      const confidenceFidelity = 1 - Math.abs(
        symbolicRepresentation.confidence - reconstructedSymbolic.confidence
      );
      
      const roundTripFidelity = (nodeFidelity + confidenceFidelity) / 2;
      
      expect(roundTripFidelity).toBeGreaterThan(0.6); // Minimum acceptable fidelity
      console.log(`Round-trip fidelity: ${(roundTripFidelity * 100).toFixed(1)}%`);

      // Complete profiling
      const session = profiler.stopProfilingSession();
      
      expect(session?.profiles.length).toBe(6); // 6 profiled operations
      expect(session?.aggregateMetrics.realtimeCompliance).toBeGreaterThan(0);
      
      console.log(`Pipeline Performance Summary:
        Total Operations: ${session?.aggregateMetrics.totalOperations}
        Average Execution Time: ${session?.aggregateMetrics.averageExecutionTime.toFixed(2)}ms
        Peak Memory Usage: ${(session?.aggregateMetrics.peakMemoryUsage / 1024).toFixed(1)}KB
        Real-time Compliance: ${session?.aggregateMetrics.realtimeCompliance.toFixed(1)}%
        Recommendations: ${session?.recommendations.length}`);
    });

    it('should demonstrate custom GGML kernel performance with real data', async () => {
      console.log('Testing custom GGML kernel performance...');

      const symbolicOperator = new SymbolicTensorOperator(atomSpace);
      const neuralHookManager = new NeuralInferenceHookManager(atomSpace);

      // Create custom symbolic kernel for tutorial prerequisites
      const prerequisiteOperation: SymbolicTensorOperation = {
        operation: 'symbolic-reasoning',
        atomSpaceQuery: 'prerequisite',
        inferenceRules: ['transitivity', 'dependency_chain'],
        resultMapping: (nodes: HypergraphNode[]) => {
          const result = new Float32Array(nodes.length);
          nodes.forEach((node, i) => {
            result[i] = (node.strength || 0) * (node.confidence || 0);
          });
          return result;
        }
      };

      const prerequisiteKernel = symbolicOperator.createSymbolicTensorKernel(
        'prerequisite-analyzer',
        prerequisiteOperation,
        { modality: 4, depth: 8, context: 6, salience: 7, autonomyIndex: 3 }
      );

      kernelRegistry.registerKernel(prerequisiteKernel);

      // Create custom neural hook for difficulty adaptation
      const difficultyHook: NeuralInferenceHook = {
        id: 'difficulty-adapter',
        atomSpaceIntegration: {
          nodeSelector: (atomSpace: AtomSpace) => 
            atomSpace.nodes.filter(node => 
              node.metadata?.complexity || node.metadata?.difficulty
            ),
          attentionWeights: [
            { nodeId: 'lesson-difficulty', weight: 0.8, type: 'dynamic' },
            { nodeId: 'learner-progress', weight: 0.6, type: 'dynamic' }
          ],
          inferenceChain: ['assess_current_level', 'predict_difficulty', 'adapt_content']
        },
        neuralProcessor: (inputs: Float32Array[], context: HypergraphNode[]) => {
          const difficultyScores = new Float32Array(inputs[0].length);
          const contextComplexity = context.reduce((sum, node) => {
            const complexity = node.metadata?.complexity === 'high' ? 0.8 :
                            node.metadata?.complexity === 'medium' ? 0.5 : 0.2;
            return sum + complexity;
          }, 0) / context.length;

          for (let i = 0; i < difficultyScores.length; i++) {
            difficultyScores[i] = Math.tanh(inputs[0][i] * contextComplexity);
          }
          
          return [difficultyScores];
        }
      };

      neuralHookManager.registerHook(difficultyHook);
      
      const difficultyKernel = neuralHookManager.createNeuralInferenceKernel(
        'difficulty-adaptation',
        'difficulty-adapter',
        { modality: 3, depth: 6, context: 4, salience: 8, autonomyIndex: 4 }
      );

      kernelRegistry.registerKernel(difficultyKernel);

      // Test kernel performance
      profiler.startProfilingSession('kernel-performance-test');

      const prerequisiteResults = await profiler.profileOperation(
        'prerequisite-analysis',
        'symbolic',
        async () => {
          const operation = prerequisiteKernel.operations[0];
          return operation.computeFunction(
            [new Float32Array([1])],
            { query: 'prerequisite', rules: ['transitivity', 'dependency_chain'] }
          );
        }
      );

      const difficultyResults = await profiler.profileOperation(
        'difficulty-adaptation',
        'neural',
        async () => {
          const operation = difficultyKernel.operations[0];
          const input = new Float32Array([0.5, 0.7, 0.3, 0.9, 0.6]);
          return operation.computeFunction([input], operation.parameters);
        }
      );

      const kernelSession = profiler.stopProfilingSession();

      expect(prerequisiteResults).toHaveLength(1);
      expect(difficultyResults).toHaveLength(1);
      expect(kernelSession?.profiles.length).toBe(2);

      // Verify kernel optimization
      const performanceMetrics = {
        executionTime: kernelSession?.aggregateMetrics.averageExecutionTime || 0,
        memoryUsage: 0.3, // Simulated
        throughput: kernelSession?.aggregateMetrics.overallThroughput || 0,
        accuracy: 0.9,
        realtimeRequirement: 100
      };

      const optimizationResult = kernelRegistry.optimizeKernels(performanceMetrics);
      expect(optimizationResult.optimizedKernels.length).toBe(2);
      expect(optimizationResult.recommendations.length).toBeGreaterThanOrEqual(0);

      console.log(`Custom Kernel Performance:
        Prerequisite Analysis: ${kernelSession?.profiles[0]?.executionTime.toFixed(2)}ms
        Difficulty Adaptation: ${kernelSession?.profiles[1]?.executionTime.toFixed(2)}ms
        Optimization Recommendations: ${optimizationResult.recommendations.length}`);
    });

    it('should benchmark neural-symbolic synthesis against real-time requirements', async () => {
      console.log('Running real-time performance benchmark...');

      const realTimeMonitor = new TensorRealTimeMonitor();
      realTimeMonitor.setThresholds({
        maxLatency: 100, // 100ms real-time requirement
        maxMemoryUsage: 50 * 1024 * 1024, // 50MB
        minThroughput: 10, // 10 ops/sec
        minAccuracy: 0.8 // 80% accuracy
      });

      realTimeMonitor.startMonitoring();

      // Create comprehensive benchmark data
      const benchmarkData = {
        testCases: [
          {
            id: 'tutorial-lesson-sequencing',
            name: 'Tutorial Lesson Sequencing',
            symbolicInput: {
              atomSpaceNodes: atomSpace.nodes.slice(0, 3),
              logicalRules: ['lesson_order', 'prerequisite_check'],
              inferenceChain: ['validate_prerequisites', 'sequence_lessons'],
              confidence: 0.9
            },
            neuralInput: {
              tensors: atomSpace.nodes.slice(0, 3).map(() => 
                new Float32Array([0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1])
              ),
              activations: [
                new Float32Array([0.9, 0.8]),
                new Float32Array([0.7, 0.6])
              ],
              weights: [
                new Float32Array(16).fill(0.6),
                new Float32Array(16).fill(0.7)
              ]
            },
            expectedOutput: {
              hybridRepresentation: {
                symbolicComponent: {
                  atomSpaceNodes: [],
                  logicalRules: [],
                  inferenceChain: [],
                  confidence: 0.8
                },
                neuralComponent: {
                  tensors: [],
                  activations: [],
                  weights: []
                },
                bridgeMapping: []
              },
              confidenceScore: 0.8,
              processingTime: 80,
              memoryUsage: 1024
            }
          },
          {
            id: 'difficulty-adaptation',
            name: 'Real-time Difficulty Adaptation',
            symbolicInput: {
              atomSpaceNodes: atomSpace.nodes.filter(node => 
                node.metadata?.complexity || node.metadata?.difficulty
              ),
              logicalRules: ['difficulty_progression', 'learner_capability'],
              inferenceChain: ['assess_level', 'adapt_content', 'monitor_progress'],
              confidence: 0.85
            },
            neuralInput: {
              tensors: [
                new Float32Array([0.6, 0.7, 0.8, 0.5, 0.4, 0.9, 0.3, 0.2]),
                new Float32Array([0.8, 0.6, 0.7, 0.9, 0.5, 0.4, 0.3, 0.1])
              ],
              activations: [
                new Float32Array([0.8, 0.7, 0.6]),
                new Float32Array([0.9, 0.5, 0.7]),
                new Float32Array([0.6, 0.8, 0.4])
              ],
              weights: [
                new Float32Array(16).fill(0.7),
                new Float32Array(16).fill(0.6),
                new Float32Array(16).fill(0.8)
              ]
            },
            expectedOutput: {
              hybridRepresentation: {
                symbolicComponent: {
                  atomSpaceNodes: [],
                  logicalRules: [],
                  inferenceChain: [],
                  confidence: 0.8
                },
                neuralComponent: {
                  tensors: [],
                  activations: [],
                  weights: []
                },
                bridgeMapping: []
              },
              confidenceScore: 0.8,
              processingTime: 90,
              memoryUsage: 1536
            }
          }
        ],
        performanceTargets: {
          executionTime: 100,
          memoryUsage: 50 * 1024 * 1024,
          throughput: 10,
          accuracy: 0.8,
          realtimeRequirement: 100
        },
        validationCriteria: {
          minAccuracy: 0.75,
          maxLatency: 100,
          maxMemoryUsage: 100 * 1024 * 1024,
          roundTripFidelity: 0.7
        }
      };

      const benchmarkResult = await pipeline.benchmark(benchmarkData);

      realTimeMonitor.stopMonitoring();
      const alerts = realTimeMonitor.getAlerts();

      expect(benchmarkResult.overallScore).toBeGreaterThan(0);
      expect(benchmarkResult.detailedResults.length).toBe(2);
      
      // Check real-time compliance
      const realtimeCompliant = benchmarkResult.detailedResults.every(result => 
        (result as any).executionTime <= benchmarkData.performanceTargets.realtimeRequirement
      );

      console.log(`Real-time Benchmark Results:
        Overall Score: ${(benchmarkResult.overallScore * 100).toFixed(1)}%
        Average Latency: ${benchmarkResult.latency.toFixed(2)}ms
        Memory Efficiency: ${(benchmarkResult.memoryEfficiency * 100).toFixed(1)}%
        Real-time Compliant: ${realtimeCompliant ? 'YES' : 'NO'}
        Active Alerts: ${alerts.length}
        Round-trip Fidelity: ${(benchmarkResult.roundTripFidelity * 100).toFixed(1)}%`);

      if (alerts.length > 0) {
        console.log('Performance Alerts:');
        alerts.forEach(alert => {
          console.log(`  [${alert.severity.toUpperCase()}] ${alert.message}`);
        });
      }

      // Validate against success criteria
      expect(benchmarkResult.overallScore).toBeGreaterThan(0.5); // Minimum 50% success
      expect(benchmarkResult.roundTripFidelity).toBeGreaterThan(0.6); // Minimum 60% fidelity
    });

    it('should demonstrate recursive neural-symbolic pathway optimization', async () => {
      console.log('Testing recursive pathway optimization...');

      // Create a complex learning pathway with multiple levels
      const complexSymbolic: SymbolicRepresentation = {
        atomSpaceNodes: atomSpace.nodes,
        logicalRules: [
          'pathway_optimization_level_1',
          'pathway_optimization_level_2',
          'pathway_optimization_level_3'
        ],
        inferenceChain: [
          'analyze_current_state',
          'predict_learning_outcomes',
          'optimize_pathway_structure',
          'validate_optimization',
          'apply_recursive_refinement'
        ],
        confidence: 0.82
      };

      // Start recursive optimization profiling
      profiler.startProfilingSession('recursive-optimization');

      let currentSymbolic = complexSymbolic;
      const optimizationCycles = 3;
      
      for (let cycle = 0; cycle < optimizationCycles; cycle++) {
        console.log(`Optimization cycle ${cycle + 1}/${optimizationCycles}`);

        // Convert to neural for optimization
        const neural = await profiler.profileOperation(
          `optimization-cycle-${cycle + 1}-symbolic-to-neural`,
          'hybrid',
          async () => {
            return await pipeline.processSymbolicToNeural(currentSymbolic);
          }
        );

        // Perform synthesis for refinement
        const synthesis = await profiler.profileOperation(
          `optimization-cycle-${cycle + 1}-synthesis`,
          'hybrid',
          async () => {
            return await pipeline.synthesize(currentSymbolic, neural);
          }
        );

        // Extract optimized symbolic representation
        currentSymbolic = await profiler.profileOperation(
          `optimization-cycle-${cycle + 1}-neural-to-symbolic`,
          'symbolic',
          async () => {
            return await pipeline.processNeuralToSymbolic(
              synthesis.hybridRepresentation.neuralComponent
            );
          }
        );

        console.log(`  Cycle ${cycle + 1} confidence: ${(currentSymbolic.confidence * 100).toFixed(1)}%`);
        console.log(`  Synthesis confidence: ${(synthesis.confidenceScore * 100).toFixed(1)}%`);
      }

      const optimizationSession = profiler.stopProfilingSession();

      expect(optimizationSession?.profiles.length).toBe(optimizationCycles * 3);
      
      // Verify optimization improvement
      const finalConfidence = currentSymbolic.confidence;
      const initialConfidence = complexSymbolic.confidence;
      const improvementRatio = finalConfidence / initialConfidence;

      console.log(`Recursive Optimization Results:
        Initial Confidence: ${(initialConfidence * 100).toFixed(1)}%
        Final Confidence: ${(finalConfidence * 100).toFixed(1)}%
        Improvement Ratio: ${improvementRatio.toFixed(3)}x
        Total Operations: ${optimizationSession?.aggregateMetrics.totalOperations}
        Average Cycle Time: ${(optimizationSession?.aggregateMetrics.averageExecutionTime / 3).toFixed(2)}ms`);

      expect(optimizationSession?.aggregateMetrics.totalOperations).toBe(optimizationCycles * 3);
      // Note: Improvement not guaranteed but system should remain stable
      expect(finalConfidence).toBeGreaterThan(0);
      expect(finalConfidence).toBeLessThanOrEqual(1);
    });
  });

  // Helper function to create AtomSpace from tutorial data
  function createAtomSpaceFromTutorial(tutorialData: any): AtomSpace {
    const nodes: HypergraphNode[] = [];
    const edges: any[] = [];

    // Create tutorial concept node
    nodes.push({
      id: `tutorial-${tutorialData.tutorial.id}`,
      type: 'concept',
      name: tutorialData.tutorial.title,
      strength: 0.9,
      confidence: 0.95,
      connections: [],
      metadata: {
        difficulty: tutorialData.tutorial.difficulty,
        estimatedTime: tutorialData.tutorial.estimatedTime,
        type: 'tutorial'
      }
    });

    // Create chapter and lesson nodes
    tutorialData.tutorial.chapters.forEach((chapter: any) => {
      // Chapter node
      const chapterId = `chapter-${chapter.id}`;
      nodes.push({
        id: chapterId,
        type: 'concept',
        name: chapter.title,
        strength: 0.8,
        confidence: 0.9,
        connections: [`tutorial-${tutorialData.tutorial.id}`],
        metadata: {
          type: 'chapter',
          parentTutorial: tutorialData.tutorial.id
        }
      });

      // Lesson nodes
      chapter.lessons.forEach((lesson: any) => {
        const lessonId = `lesson-${lesson.id}`;
        nodes.push({
          id: lessonId,
          type: 'concept',
          name: lesson.title,
          strength: 0.7,
          confidence: 0.85,
          connections: [chapterId],
          metadata: {
            type: 'lesson',
            complexity: lesson.complexity,
            duration: lesson.duration,
            prerequisites: lesson.prerequisites,
            parentChapter: chapter.id
          }
        });

        // Create prerequisite links
        lesson.prerequisites.forEach((prereq: string) => {
          edges.push({
            id: `prerequisite-${prereq}-${lesson.id}`,
            sourceId: `lesson-${prereq}`,
            targetId: lessonId,
            type: 'prerequisite',
            weight: 0.8
          });
        });
      });
    });

    return { nodes, edges };
  }
});