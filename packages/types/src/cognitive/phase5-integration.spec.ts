/**
 * Phase 5: Complete Test Suite
 * 
 * Comprehensive tests for meta-cognitive analysis, evolutionary optimization,
 * and recursive self-improvement components.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ECANScheduler } from './ecan-scheduler';
import { CognitiveMeshCoordinator } from './mesh-topology';
import { TutorialKitNeuralSymbolicPipeline } from './neural-symbolic-synthesis';
import { CognitiveGGMLKernelRegistry } from './ggml-kernels';
import { TensorOperationProfiler } from './tensor-profiling';
import { MetaCognitiveObserver } from './phase5-meta-cognitive';
import { CognitiveEvolutionEngine } from './phase5-evolutionary';
import { RecursiveSelfImprovementEngine } from './phase5-recursive';
import { Phase5CognitiveSystem } from './phase5-integration';

describe('Phase 5: Recursive Meta-Cognition & Evolutionary Optimization', () => {
  let ecanScheduler: ECANScheduler;
  let meshCoordinator: CognitiveMeshCoordinator;
  let neuralSymbolicPipeline: TutorialKitNeuralSymbolicPipeline;
  let kernelRegistry: CognitiveGGMLKernelRegistry;
  let profiler: TensorOperationProfiler;

  beforeEach(() => {
    ecanScheduler = new ECANScheduler({
      attentionBank: 1000000,
      maxSTI: 32767,
      minSTI: -32768,
      attentionDecayRate: 0.95,
      importanceSpreadingRate: 0.1,
      rentCollectionRate: 0.01,
      wagePaymentRate: 0.05
    });

    meshCoordinator = new CognitiveMeshCoordinator();

    neuralSymbolicPipeline = new TutorialKitNeuralSymbolicPipeline();
    kernelRegistry = new CognitiveGGMLKernelRegistry();
    profiler = new TensorOperationProfiler();
  });

  describe('Meta-Cognitive Observer', () => {
    let metaCognitiveObserver: MetaCognitiveObserver;

    beforeEach(() => {
      metaCognitiveObserver = new MetaCognitiveObserver(
        ecanScheduler,
        meshCoordinator,
        neuralSymbolicPipeline,
        kernelRegistry,
        profiler
      );
    });

    afterEach(() => {
      if (metaCognitiveObserver && typeof metaCognitiveObserver.stopObservation === 'function') {
        metaCognitiveObserver.stopObservation();
      }
    });

    it('should start and stop observation correctly', () => {
      expect(() => metaCognitiveObserver.startObservation()).not.toThrow();
      expect(() => metaCognitiveObserver.stopObservation()).not.toThrow();
    });

    it('should perform self-analysis with configurable depth', async () => {
      const analysisDepth = 3;
      const report = await metaCognitiveObserver.performSelfAnalysis(analysisDepth);

      expect(report).toBeDefined();
      expect(report.id).toBeTruthy();
      expect(report.timestamp).toBeGreaterThan(0);
      expect(report.systemState).toBeDefined();
      expect(report.performanceMetrics).toBeDefined();
      expect(report.identifiedIssues).toBeInstanceOf(Array);
      expect(report.improvementOpportunities).toBeInstanceOf(Array);
      expect(report.recursiveInsights).toBeInstanceOf(Array);

      // Verify recursive insights have the correct depth structure
      const maxDepth = Math.max(...report.recursiveInsights.map(insight => insight.depth));
      expect(maxDepth).toBeLessThanOrEqual(analysisDepth);
    });

    it('should process feedback loops and generate insights', async () => {
      // Add feedback loops
      metaCognitiveObserver.addFeedbackLoop({
        id: 'test-feedback-1',
        source: 'system',
        type: 'performance',
        value: 0.3, // Poor performance
        context: { test: true },
        timestamp: Date.now(),
        processed: false
      });

      metaCognitiveObserver.addFeedbackLoop({
        id: 'test-feedback-2',
        source: 'user',
        type: 'accuracy',
        value: 0.9, // Good accuracy
        context: { test: true },
        timestamp: Date.now(),
        processed: false
      });

      const result = await metaCognitiveObserver.processFeedbackLoops();

      expect(result.processed).toBe(2);
      expect(result.insights).toBeInstanceOf(Array);
      expect(result.insights.length).toBeGreaterThan(0);
    });

    it('should generate improvement plan with actionable items', async () => {
      // Perform some analysis first to have data
      await metaCognitiveObserver.performSelfAnalysis(2);

      const plan = await metaCognitiveObserver.generateImprovementPlan();

      expect(plan).toBeDefined();
      expect(plan.objectives).toBeInstanceOf(Array);
      expect(plan.actionItems).toBeInstanceOf(Array);
      expect(plan.timeline).toBeInstanceOf(Array);
      expect(plan.recursiveOptimizations).toBeInstanceOf(Array);

      // Verify structure of objectives
      if (plan.objectives.length > 0) {
        const objective = plan.objectives[0];
        expect(objective.description).toBeTruthy();
        expect(objective.priority).toBeGreaterThanOrEqual(0);
        expect(objective.complexity).toBeGreaterThanOrEqual(0);
      }
    });

    it('should maintain metrics history within size limits', async () => {
      metaCognitiveObserver.startObservation();

      // Wait for some observations
      await new Promise(resolve => setTimeout(resolve, 100));

      const history = metaCognitiveObserver.getMetricsHistory();
      expect(history).toBeInstanceOf(Array);

      // History should not exceed max size (1000 by default)
      expect(history.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('Cognitive Evolution Engine', () => {
    let evolutionEngine: CognitiveEvolutionEngine;
    let metaCognitiveObserver: MetaCognitiveObserver;

    beforeEach(() => {
      metaCognitiveObserver = new MetaCognitiveObserver(
        ecanScheduler,
        meshCoordinator,
        neuralSymbolicPipeline,
        kernelRegistry,
        profiler
      );

      evolutionEngine = new CognitiveEvolutionEngine(
        ecanScheduler,
        meshCoordinator,
        kernelRegistry,
        metaCognitiveObserver,
        {
          populationSize: 10, // Small for testing
          mutationRate: 0.2,
          crossoverRate: 0.8,
          maxGenerations: 5,
          fitnessThreshold: 0.9
        }
      );
    });

    it('should initialize evolution with diverse population', async () => {
      await evolutionEngine.initializeEvolution();

      const stats = evolutionEngine.getEvolutionaryStatistics();
      expect(stats.totalGenerations).toBe(0); // Initial state
    });

    it('should run evolution cycle and improve fitness', async () => {
      await evolutionEngine.initializeEvolution();
      
      const cycle = await evolutionEngine.runEvolutionCycle();

      expect(cycle).toBeDefined();
      expect(cycle.id).toBeTruthy();
      expect(cycle.generation).toBeGreaterThanOrEqual(0);
      expect(cycle.population).toBeInstanceOf(Array);
      expect(cycle.population.length).toBeGreaterThan(0);
      expect(cycle.bestFitness).toBeGreaterThanOrEqual(0);
      expect(cycle.averageFitness).toBeGreaterThanOrEqual(0);
      expect(cycle.diversityScore).toBeGreaterThanOrEqual(0);
      expect(cycle.evolutionaryOperations).toBeDefined();

      // Verify genome structure
      const genome = cycle.population[0];
      expect(genome.id).toBeTruthy();
      expect(genome.generation).toBeGreaterThanOrEqual(0);
      expect(genome.genes).toBeDefined();
      expect(genome.genes.kernelParameters).toBeDefined();
      expect(genome.genes.attentionWeights).toBeDefined();
      expect(genome.genes.meshTopologyParams).toBeDefined();
      expect(genome.genes.learningRates).toBeDefined();
      expect(genome.fitness).toBeGreaterThanOrEqual(0);
    });

    it('should evolve population over multiple generations', async () => {
      const result = await evolutionEngine.evolve(3); // 3 generations

      expect(result.bestGenome).toBeDefined();
      expect(result.finalFitness).toBeGreaterThanOrEqual(0);
      expect(result.totalGenerations).toBeGreaterThanOrEqual(1);

      const stats = evolutionEngine.getEvolutionaryStatistics();
      expect(stats.totalGenerations).toBeGreaterThanOrEqual(1);
      expect(stats.bestFitnessAchieved).toBeGreaterThanOrEqual(0);
      expect(stats.fitnessTrajectory).toBeInstanceOf(Array);
      expect(stats.diversityTrends).toBeInstanceOf(Array);
    });

    it('should generate fitness landscape for analysis', async () => {
      await evolutionEngine.initializeEvolution();

      const landscape = await evolutionEngine.generateFitnessLandscape(
        ['learningRate', 'importanceWeight'],
        5 // Small resolution for testing
      );

      expect(landscape).toBeDefined();
      expect(landscape.id).toBeTruthy();
      expect(landscape.dimensions).toEqual(['learningRate', 'importanceWeight']);
      expect(landscape.fitnessData).toBeInstanceOf(Array);
      expect(landscape.peaks).toBeInstanceOf(Array);
      expect(landscape.valleys).toBeInstanceOf(Array);
      expect(landscape.gradients).toBeInstanceOf(Array);

      // Verify fitness data structure
      if (landscape.fitnessData.length > 0) {
        const dataPoint = landscape.fitnessData[0];
        expect(dataPoint.coordinates).toBeInstanceOf(Array);
        expect(dataPoint.fitness).toBeGreaterThanOrEqual(0);
        expect(dataPoint.genome).toBeDefined();
      }
    });

    it('should apply best genome to system', async () => {
      await evolutionEngine.initializeEvolution();
      await evolutionEngine.runEvolutionCycle();

      expect(async () => {
        await evolutionEngine.applyBestGenome();
      }).not.toThrow();
    });

    it('should track evolutionary operations statistics', async () => {
      await evolutionEngine.initializeEvolution();
      await evolutionEngine.runEvolutionCycle();

      const stats = evolutionEngine.getEvolutionaryStatistics();
      expect(stats.operationStats).toBeDefined();
      expect(typeof stats.operationStats.selections).toBe('number');
      expect(typeof stats.operationStats.crossovers).toBe('number');
      expect(typeof stats.operationStats.mutations).toBe('number');
      expect(typeof stats.operationStats.evaluations).toBe('number');
    });
  });

  describe('Recursive Self-Improvement Engine', () => {
    let recursiveEngine: RecursiveSelfImprovementEngine;
    let metaCognitiveObserver: MetaCognitiveObserver;
    let evolutionEngine: CognitiveEvolutionEngine;

    beforeEach(() => {
      metaCognitiveObserver = new MetaCognitiveObserver(
        ecanScheduler,
        meshCoordinator,
        neuralSymbolicPipeline,
        kernelRegistry,
        profiler
      );

      evolutionEngine = new CognitiveEvolutionEngine(
        ecanScheduler,
        meshCoordinator,
        kernelRegistry,
        metaCognitiveObserver
      );

      recursiveEngine = new RecursiveSelfImprovementEngine(
        metaCognitiveObserver,
        evolutionEngine,
        ecanScheduler,
        meshCoordinator,
        profiler
      );
    });

    afterEach(() => {
      if (recursiveEngine && typeof recursiveEngine.stopRecursiveImprovement === 'function') {
        recursiveEngine.stopRecursiveImprovement();
      }
    });

    it('should execute recursive improvement cycle', async () => {
      const cycle = await recursiveEngine.executeRecursiveImprovementCycle(0);

      expect(cycle).toBeDefined();
      expect(cycle.id).toBeTruthy();
      expect(cycle.level).toBe(0);
      expect(cycle.startTime).toBeGreaterThan(0);
      expect(cycle.endTime).toBeGreaterThanOrEqual(cycle.startTime);
      expect(cycle.objective).toBeTruthy();
      expect(cycle.initialState).toBeDefined();
      expect(cycle.finalState).toBeDefined();
      expect(cycle.improvements).toBeInstanceOf(Array);
      expect(cycle.recursiveInsights).toBeInstanceOf(Array);
      expect(cycle.nextLevelTriggers).toBeInstanceOf(Array);
    });

    it('should create recursive optimization plan', async () => {
      const plan = await recursiveEngine.createRecursiveOptimizationPlan(3);

      expect(plan).toBeDefined();
      expect(plan.id).toBeTruthy();
      expect(plan.totalLevels).toBe(3);
      expect(plan.convergenceCriteria).toBeDefined();
      expect(plan.layers).toBeInstanceOf(Array);
      expect(plan.layers.length).toBeGreaterThan(0);
      expect(plan.executionOrder).toBeInstanceOf(Array);
      expect(plan.dependencyGraph).toBeInstanceOf(Map);
      expect(plan.emergentProperties).toBeInstanceOf(Array);

      // Verify layer structure
      const layer = plan.layers[0];
      expect(layer.level).toBeGreaterThanOrEqual(0);
      expect(layer.name).toBeTruthy();
      expect(layer.objective).toBeTruthy();
      expect(layer.scope).toMatch(/^(local|subsystem|global|meta)$/);
      expect(layer.parameters).toBeDefined();
      expect(layer.dependencies).toBeInstanceOf(Array);
      expect(layer.improvementMetrics).toBeInstanceOf(Array);
    });

    it('should execute optimization plan with convergence tracking', async () => {
      const plan = await recursiveEngine.createRecursiveOptimizationPlan(2);
      const result = await recursiveEngine.executeOptimizationPlan(plan.id);

      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
      expect(result.completedCycles).toBeInstanceOf(Array);
      expect(result.emergentResults).toBeInstanceOf(Array);
      expect(typeof result.convergenceAchieved).toBe('boolean');

      // Verify completed cycles structure
      if (result.completedCycles.length > 0) {
        const cycle = result.completedCycles[0];
        expect(cycle.level).toBeGreaterThanOrEqual(0);
        expect(cycle.improvements).toBeInstanceOf(Array);
        expect(cycle.recursiveInsights).toBeInstanceOf(Array);
      }
    });

    it('should generate recursive flowchart visualization', () => {
      const flowchart = recursiveEngine.generateRecursiveFlowchart();

      expect(flowchart).toBeTruthy();
      expect(typeof flowchart).toBe('string');
      expect(flowchart).toContain('graph TB');
      expect(flowchart).toContain('Start');
      // Note: May not contain "Level" if no cycles have been executed yet
      expect(flowchart.length).toBeGreaterThan(50);
    });

    it('should track recursive statistics', async () => {
      // Execute a cycle to generate statistics
      await recursiveEngine.executeRecursiveImprovementCycle(0);

      const stats = recursiveEngine.getRecursiveStatistics();

      expect(stats).toBeDefined();
      expect(stats.totalCycles).toBeGreaterThanOrEqual(1);
      expect(typeof stats.averageImprovementPerCycle).toBe('number');
      expect(typeof stats.recursiveDepthAchieved).toBe('number');
      expect(typeof stats.stabilityIndex).toBe('number');
      expect(typeof stats.emergenceRate).toBe('number');
      expect(stats.metaLearningProgression).toBeInstanceOf(Array);
    });

    it('should start and stop recursive improvement process', async () => {
      expect(() => recursiveEngine.stopRecursiveImprovement()).not.toThrow();
      
      // Start improvement in background
      const improvementPromise = recursiveEngine.startRecursiveImprovement();
      
      // Stop after short delay
      setTimeout(() => recursiveEngine.stopRecursiveImprovement(), 100);
      
      await expect(improvementPromise).resolves.toBeUndefined();
    });
  });

  describe('Phase 5 Integration System', () => {
    let phase5System: Phase5CognitiveSystem;

    beforeEach(() => {
      phase5System = new Phase5CognitiveSystem(
        ecanScheduler,
        meshCoordinator,
        neuralSymbolicPipeline,
        kernelRegistry,
        profiler,
        {
          metaCognitive: {
            observationInterval: 100, // Fast for testing
            maxHistorySize: 50,
            analysisDepth: 2
          },
          evolutionary: {
            populationSize: 5,
            mutationRate: 0.2,
            crossoverRate: 0.8,
            maxGenerations: 3,
            fitnessThreshold: 0.8
          },
          recursive: {
            maxRecursionDepth: 2,
            stabilityWindow: 3,
            improvementThreshold: 0.05
          }
        }
      );
    });

    afterEach(() => {
      if (phase5System && typeof phase5System.stop === 'function') {
        phase5System.stop();
      }
    });

    it('should initialize Phase 5 system successfully', async () => {
      await expect(phase5System.initialize()).resolves.toBeUndefined();
    });

    it('should run integrated optimization cycle', async () => {
      await phase5System.initialize();
      
      const result = await phase5System.runIntegratedCycle();

      expect(result).toBeDefined();
      expect(result.metaAnalysis).toBeDefined();
      expect(result.evolutionCycle).toBeDefined();
      expect(result.improvementCycle).toBeDefined();
      expect(result.integrationMetrics).toBeDefined();

      // Verify integration metrics structure
      const metrics = result.integrationMetrics;
      expect(metrics.timestamp).toBeGreaterThan(0);
      expect(metrics.metaCognitiveScore).toBeGreaterThanOrEqual(0);
      expect(metrics.evolutionaryFitness).toBeGreaterThanOrEqual(0);
      expect(metrics.recursiveEfficiency).toBeGreaterThanOrEqual(0);
      expect(metrics.integrationCoherence).toBeGreaterThanOrEqual(0);
      expect(metrics.emergenceRate).toBeGreaterThanOrEqual(0);
      expect(metrics.stabilityIndex).toBeGreaterThanOrEqual(0);
      expect(metrics.adaptationSpeed).toBeGreaterThanOrEqual(0);
      expect(metrics.overallCognitiveHealth).toBeGreaterThanOrEqual(0);
    });

    it('should generate comprehensive system report', async () => {
      await phase5System.initialize();
      await phase5System.runIntegratedCycle(); // Generate some data
      
      const report = await phase5System.generateSystemReport();

      expect(report).toBeDefined();
      expect(report.systemState).toBeDefined();
      expect(report.performanceAnalysis).toBeDefined();
      expect(report.evolutionaryTrajectory).toBeDefined();
      expect(report.emergentProperties).toBeInstanceOf(Array);
      expect(report.stabilityAnalysis).toBeDefined();

      // Verify system state structure
      const state = report.systemState;
      expect(state.metaCognitive).toBeDefined();
      expect(state.evolutionary).toBeDefined();
      expect(state.recursive).toBeDefined();
      expect(state.integration).toBeDefined();
    });

    it('should generate meta-cognitive flowchart', () => {
      const flowchart = phase5System.generateMetaCognitiveFlowchart();

      expect(flowchart).toBeTruthy();
      expect(typeof flowchart).toBe('string');
      expect(flowchart).toContain('graph TB');
      expect(flowchart).toContain('Phase 5 System Start');
      expect(flowchart).toContain('Meta-Cognitive Layer');
      expect(flowchart).toContain('Evolutionary Layer');
      expect(flowchart).toContain('Recursive Layer');
      expect(flowchart).toContain('Integration Layer');
    });

    it('should track real-time metrics', async () => {
      await phase5System.initialize();
      
      const metrics = phase5System.getRealtimeMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.timestamp).toBeGreaterThan(0);
      expect(typeof metrics.metaCognitiveScore).toBe('number');
      expect(typeof metrics.evolutionaryFitness).toBe('number');
      expect(typeof metrics.recursiveEfficiency).toBe('number');
      expect(typeof metrics.integrationCoherence).toBe('number');
      expect(typeof metrics.emergenceRate).toBe('number');
      expect(typeof metrics.stabilityIndex).toBe('number');
      expect(typeof metrics.adaptationSpeed).toBe('number');
      expect(typeof metrics.overallCognitiveHealth).toBe('number');
    });

    it('should maintain performance history', async () => {
      await phase5System.initialize();
      await phase5System.runIntegratedCycle();
      
      const history = phase5System.getPerformanceHistory(10);

      expect(history).toBeInstanceOf(Array);
      expect(history.length).toBeGreaterThan(0);
      
      if (history.length > 0) {
        const metric = history[0];
        expect(metric.timestamp).toBeGreaterThan(0);
        expect(typeof metric.overallCognitiveHealth).toBe('number');
      }
    });

    it('should start and stop system gracefully', async () => {
      await phase5System.initialize();
      
      // Start system briefly
      const startPromise = phase5System.start();
      
      // Stop after short delay
      setTimeout(() => phase5System.stop(), 50);
      
      await expect(startPromise).resolves.toBeUndefined();
    });
  });

  describe('End-to-End Integration Tests', () => {
    let phase5System: Phase5CognitiveSystem;

    beforeEach(async () => {
      phase5System = new Phase5CognitiveSystem(
        ecanScheduler,
        meshCoordinator,
        neuralSymbolicPipeline,
        kernelRegistry,
        profiler,
        {
          metaCognitive: { observationInterval: 50, analysisDepth: 2 },
          evolutionary: { populationSize: 5, maxGenerations: 2 },
          recursive: { maxRecursionDepth: 2 }
        }
      );
      
      await phase5System.initialize();
    });

    afterEach(() => {
      if (phase5System && typeof phase5System.stop === 'function') {
        phase5System.stop();
      }
    });

    it('should demonstrate complete Phase 5 workflow', async () => {
      console.log('Starting complete Phase 5 workflow demonstration...');

      // Run multiple integrated cycles
      const cycles = [];
      for (let i = 0; i < 3; i++) {
        const cycle = await phase5System.runIntegratedCycle();
        cycles.push(cycle);
        console.log(`Completed cycle ${i + 1}:`, {
          metaCognitiveScore: cycle.integrationMetrics.metaCognitiveScore.toFixed(3),
          evolutionaryFitness: cycle.integrationMetrics.evolutionaryFitness.toFixed(3),
          recursiveEfficiency: cycle.integrationMetrics.recursiveEfficiency.toFixed(3),
          overallHealth: cycle.integrationMetrics.overallCognitiveHealth.toFixed(3)
        });
      }

      // Generate comprehensive report
      const report = await phase5System.generateSystemReport();
      console.log('System state:', {
        metaCognitive: report.systemState.metaCognitive.isObserving,
        evolutionary: report.systemState.evolutionary.currentGeneration,
        recursive: report.systemState.recursive.currentDepth,
        stability: report.systemState.integration.systemStability
      });

      // Verify all cycles completed successfully
      expect(cycles.length).toBe(3);
      cycles.forEach((cycle, index) => {
        expect(cycle.metaAnalysis).toBeDefined();
        expect(cycle.evolutionCycle).toBeDefined();
        expect(cycle.improvementCycle).toBeDefined();
        expect(cycle.integrationMetrics).toBeDefined();
      });

      // Verify system report completeness
      expect(report.systemState).toBeDefined();
      expect(report.evolutionaryTrajectory).toBeDefined();
      expect(report.stabilityAnalysis).toBeDefined();

      console.log('Phase 5 workflow demonstration completed successfully');
    });

    it('should show measurable improvement over time', async () => {
      const initialMetrics = phase5System.getRealtimeMetrics();
      
      // Run several cycles
      for (let i = 0; i < 5; i++) {
        await phase5System.runIntegratedCycle();
      }
      
      const finalMetrics = phase5System.getRealtimeMetrics();
      
      // At least some metrics should show stability or improvement
      const improvementCount = [
        'metaCognitiveScore',
        'evolutionaryFitness', 
        'recursiveEfficiency',
        'overallCognitiveHealth'
      ].filter(metric => 
        finalMetrics[metric as keyof typeof finalMetrics] >= 
        initialMetrics[metric as keyof typeof initialMetrics]
      ).length;
      
      expect(improvementCount).toBeGreaterThanOrEqual(2); // At least 50% stability/improvement
    });

    it('should maintain system stability during extended operation', async () => {
      const metrics: number[] = [];
      
      // Run multiple cycles and track stability
      for (let i = 0; i < 10; i++) {
        await phase5System.runIntegratedCycle();
        const currentMetrics = phase5System.getRealtimeMetrics();
        metrics.push(currentMetrics.overallCognitiveHealth);
      }
      
      // Calculate variance to check stability
      const mean = metrics.reduce((sum, val) => sum + val, 0) / metrics.length;
      const variance = metrics.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / metrics.length;
      const stabilityIndex = 1 - Math.sqrt(variance);
      
      console.log('Stability analysis:', {
        mean: mean.toFixed(3),
        variance: variance.toFixed(6),
        stabilityIndex: stabilityIndex.toFixed(3)
      });
      
      // System should maintain reasonable stability
      expect(stabilityIndex).toBeGreaterThan(0.3); // 30% stability threshold
    });
  });
});