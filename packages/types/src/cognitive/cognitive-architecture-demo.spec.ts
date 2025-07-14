/**
 * Integration test for the complete cognitive architecture demo
 */

import { describe, it, expect } from 'vitest';
import { CognitiveArchitectureDemo, runCognitiveArchitectureDemo } from './cognitive-architecture-demo';

describe('Cognitive Architecture Integration', () => {
  describe('CognitiveArchitectureDemo', () => {
    it('should initialize all phases successfully', async () => {
      const demo = new CognitiveArchitectureDemo();
      await demo.initialize();
      
      // Demo should initialize without throwing errors
      expect(demo).toBeDefined();
    });

    it('should demonstrate full system integration', async () => {
      const demo = new CognitiveArchitectureDemo();
      const result = await demo.demonstrateFullSystem();
      
      // Verify all success metrics are achieved
      expect(result.successMetrics.cognitivePrimitivesEncoded).toBe(true);
      expect(result.successMetrics.ecanOperational).toBe(true);
      expect(result.successMetrics.neuralSymbolicFunctional).toBe(true);
      expect(result.successMetrics.distributedAPIActive).toBe(true);
      expect(result.successMetrics.metaCognitiveVerified).toBe(true);
      expect(result.successMetrics.unificationAchieved).toBe(true);
      
      // Verify integration metrics
      expect(result.integrationMetrics.totalProcessingTime).toBeGreaterThan(0);
      expect(result.integrationMetrics.cognitiveUnityScore).toBeGreaterThanOrEqual(80);
      expect(result.integrationMetrics.emergentProperties.length).toBeGreaterThanOrEqual(3);
      expect(result.integrationMetrics.systemEfficiency).toBeGreaterThan(50);
    });

    it('should generate comprehensive system report', async () => {
      const demo = new CognitiveArchitectureDemo();
      const report = await demo.generateSystemReport();
      
      expect(report).toContain('Distributed Agentic Cognitive Grammar Network');
      expect(report).toContain('Success Metrics Validation');
      expect(report).toContain('Phase Implementation Status');
      expect(report).toContain('Emergent Properties');
      expect(report).toContain('Cognitive Flowchart');
      
      // Check that all phases are marked as implemented
      expect(report).toContain('Phase 1: Cognitive Primitives & Foundational Hypergraph Encoding ✅');
      expect(report).toContain('Phase 2: ECAN Attention Allocation & Resource Kernel Construction ✅');
      expect(report).toContain('Phase 3: Neural-Symbolic Synthesis via Custom ggml Kernels ✅');
      expect(report).toContain('Phase 4: Distributed Cognitive Mesh API & Embodiment Layer ✅');
      expect(report).toContain('Phase 5: Recursive Meta-Cognition & Evolutionary Optimization ✅');
      expect(report).toContain('Phase 6: Rigorous Testing, Documentation, and Cognitive Unification ✅');
    });

    it('should identify emergent properties correctly', async () => {
      const demo = new CognitiveArchitectureDemo();
      const result = await demo.demonstrateFullSystem();
      
      const emergentProperties = result.integrationMetrics.emergentProperties;
      expect(emergentProperties.length).toBeGreaterThanOrEqual(3);
      
      // Check for expected emergent properties
      const propertyNames = emergentProperties.map(p => p.name);
      expect(propertyNames).toContain('Adaptive Attention Allocation');
      expect(propertyNames).toContain('Cross-Modal Reasoning');
      expect(propertyNames).toContain('Self-Improving Cognitive Unity');
      
      // Verify property structure
      for (const property of emergentProperties) {
        expect(property).toHaveProperty('name');
        expect(property).toHaveProperty('description');
        expect(property).toHaveProperty('strength');
        expect(property).toHaveProperty('stability');
        expect(property).toHaveProperty('category');
        
        expect(property.strength).toBeGreaterThan(0);
        expect(property.strength).toBeLessThanOrEqual(1);
        expect(property.stability).toBeGreaterThan(0);
        expect(property.stability).toBeLessThanOrEqual(1);
      }
    });

    it('should achieve high cognitive unity score', async () => {
      const demo = new CognitiveArchitectureDemo();
      const result = await demo.demonstrateFullSystem();
      
      // Cognitive unity should be high since all phases are operational
      expect(result.integrationMetrics.cognitiveUnityScore).toBeGreaterThanOrEqual(80);
      expect(result.integrationMetrics.cognitiveUnityScore).toBeLessThanOrEqual(100);
    });

    it('should complete processing within reasonable time', async () => {
      const demo = new CognitiveArchitectureDemo();
      const start = Date.now();
      const result = await demo.demonstrateFullSystem();
      const elapsed = Date.now() - start;
      
      // Should complete within 30 seconds for a demo
      expect(elapsed).toBeLessThan(30000);
      expect(result.integrationMetrics.totalProcessingTime).toBeLessThan(30000);
    });
  });

  describe('runCognitiveArchitectureDemo function', () => {
    it('should execute the complete demo without errors', async () => {
      // Capture console output
      const consoleLogs: string[] = [];
      const originalLog = console.log;
      console.log = (...args: any[]) => {
        consoleLogs.push(args.join(' '));
        originalLog(...args);
      };

      try {
        await runCognitiveArchitectureDemo();
        
        // Verify key demo messages were logged
        const logString = consoleLogs.join('\n');
        expect(logString).toContain('TutorialKit Distributed Agentic Cognitive Grammar Network');
        expect(logString).toContain('Initializing Distributed Agentic Cognitive Grammar Network');
        expect(logString).toContain('Cognitive Architecture Successfully Initialized');
        expect(logString).toContain('Starting Full System Demonstration');
        expect(logString).toContain('Full System Demonstration Complete');
        expect(logString).toContain('COGNITIVE ARCHITECTURE DEMO COMPLETE');
        expect(logString).toContain('The recursive self-optimization spiral has commenced');
        
      } finally {
        console.log = originalLog;
      }
    });
  });

  describe('Issue Requirements Validation', () => {
    it('should validate all success metrics from the GitHub issue', async () => {
      const demo = new CognitiveArchitectureDemo();
      const result = await demo.demonstrateFullSystem();
      
      // Check all success metrics from the original issue
      expect(result.successMetrics.cognitivePrimitivesEncoded).toBe(true); // ✅ Cognitive primitives fully encoded in hypergraph format
      expect(result.successMetrics.ecanOperational).toBe(true); // ✅ ECAN attention allocation operational
      expect(result.successMetrics.neuralSymbolicFunctional).toBe(true); // ✅ Neural-symbolic synthesis pipeline functional
      expect(result.successMetrics.distributedAPIActive).toBe(true); // ✅ Distributed API with embodiment bindings active
      expect(result.successMetrics.metaCognitiveVerified).toBe(true); // ✅ Meta-cognitive self-improvement verified
      expect(result.successMetrics.unificationAchieved).toBe(true); // ✅ Complete unification achieved
    });

    it('should demonstrate all 6 phases are implemented', async () => {
      const demo = new CognitiveArchitectureDemo();
      const report = await demo.generateSystemReport();
      
      // Verify implementation of all phases mentioned in the issue
      expect(report).toContain('Phase 1: Cognitive Primitives & Foundational Hypergraph Encoding ✅');
      expect(report).toContain('Phase 2: ECAN Attention Allocation & Resource Kernel Construction ✅');
      expect(report).toContain('Phase 3: Neural-Symbolic Synthesis via Custom ggml Kernels ✅');
      expect(report).toContain('Phase 4: Distributed Cognitive Mesh API & Embodiment Layer ✅');
      expect(report).toContain('Phase 5: Recursive Meta-Cognition & Evolutionary Optimization ✅');
      expect(report).toContain('Phase 6: Rigorous Testing, Documentation, and Cognitive Unification ✅');
    });

    it('should demonstrate emergent cognitive patterns', async () => {
      const demo = new CognitiveArchitectureDemo();
      const result = await demo.demonstrateFullSystem();
      
      // The issue mentions "Emergent Cognitive Patterns" as a key component
      expect(result.integrationMetrics.emergentProperties).toBeDefined();
      expect(result.integrationMetrics.emergentProperties.length).toBeGreaterThanOrEqual(3);
      
      // Should include various categories of emergence
      const categories = result.integrationMetrics.emergentProperties.map(p => p.category);
      expect(categories).toContain('attention-emergence');
      expect(categories).toContain('reasoning-emergence');
      expect(categories).toContain('meta-emergence');
    });

    it('should achieve recursive self-optimization', async () => {
      const demo = new CognitiveArchitectureDemo();
      const result = await demo.demonstrateFullSystem();
      
      // The issue emphasizes "recursive self-optimization spiral"
      expect(result.phase5Results).toBeDefined();
      expect(result.phase5Results.cycles).toBeGreaterThan(0);
      expect(result.phase5Results.optimizationScore).toBeGreaterThan(50);
      
      // Should have emergent properties related to self-improvement
      const selfImprovementProperty = result.integrationMetrics.emergentProperties
        .find(p => p.name.includes('Self-Improving'));
      expect(selfImprovementProperty).toBeDefined();
    });
  });
});