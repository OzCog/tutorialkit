/**
 * Test for the simplified cognitive architecture demo
 */

import { describe, it, expect } from 'vitest';
import { SimplifiedCognitiveDemo, runSimplifiedCognitiveDemo } from './simplified-cognitive-demo';

describe('Simplified Cognitive Architecture Demo', () => {
  describe('SimplifiedCognitiveDemo', () => {
    it('should validate all phases are implemented', async () => {
      const demo = new SimplifiedCognitiveDemo();
      const validation = await demo.validateImplementation();
      
      // All phases should be available
      expect(validation.phase1Available).toBe(true);
      expect(validation.phase2Available).toBe(true);
      expect(validation.phase3Available).toBe(true);
      expect(validation.phase4Available).toBe(true);
      expect(validation.phase5Available).toBe(true);
      expect(validation.phase6Available).toBe(true);
      expect(validation.allPhasesImplemented).toBe(true);
    });

    it('should validate all success metrics from the GitHub issue', async () => {
      const demo = new SimplifiedCognitiveDemo();
      const validation = await demo.validateImplementation();
      
      // Verify all success metrics from the original issue
      expect(validation.successMetrics.cognitivePrimitivesEncoded).toBe(true);
      expect(validation.successMetrics.ecanOperational).toBe(true);
      expect(validation.successMetrics.neuralSymbolicFunctional).toBe(true);
      expect(validation.successMetrics.distributedAPIActive).toBe(true);
      expect(validation.successMetrics.metaCognitiveVerified).toBe(true);
      expect(validation.successMetrics.unificationAchieved).toBe(true);
    });

    it('should identify emergent properties', async () => {
      const demo = new SimplifiedCognitiveDemo();
      const validation = await demo.validateImplementation();
      
      expect(validation.emergentProperties.length).toBeGreaterThanOrEqual(3);
      
      // Check for expected emergent properties
      const propertyNames = validation.emergentProperties.map(p => p.name);
      expect(propertyNames).toContain('Adaptive Attention Allocation');
      expect(propertyNames).toContain('Cross-Modal Reasoning');
      expect(propertyNames).toContain('Global Cognitive Coherence');
    });

    it('should achieve high cognitive unity score', async () => {
      const demo = new SimplifiedCognitiveDemo();
      const validation = await demo.validateImplementation();
      
      // Should achieve 100% since all phases are implemented
      expect(validation.cognitiveUnityScore).toBeGreaterThanOrEqual(100);
    });

    it('should generate comprehensive system report', async () => {
      const demo = new SimplifiedCognitiveDemo();
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

    it('should complete validation quickly', async () => {
      const demo = new SimplifiedCognitiveDemo();
      const start = Date.now();
      await demo.validateImplementation();
      const elapsed = Date.now() - start;
      
      // Should complete within a reasonable time (under 5 seconds)
      expect(elapsed).toBeLessThan(5000);
    });
  });

  describe('runSimplifiedCognitiveDemo function', () => {
    it('should execute the demo without errors', async () => {
      // Capture console output
      const consoleLogs: string[] = [];
      const originalLog = console.log;
      console.log = (...args: any[]) => {
        consoleLogs.push(args.join(' '));
        originalLog(...args);
      };

      try {
        await runSimplifiedCognitiveDemo();
        
        // Verify key demo messages were logged
        const logString = consoleLogs.join('\n');
        expect(logString).toContain('TutorialKit Distributed Agentic Cognitive Grammar Network');
        expect(logString).toContain('Running Implementation Validation');
        expect(logString).toContain('SYSTEM IMPLEMENTATION REPORT');
        expect(logString).toContain('IMPLEMENTATION COMPLETE');
        expect(logString).toContain('All 6 phases of the Distributed Agentic Cognitive Grammar Network are implemented');
        expect(logString).toContain('The recursive self-optimization spiral is ready to commence');
        
      } finally {
        console.log = originalLog;
      }
    });
  });

  describe('Issue Requirements Validation', () => {
    it('should demonstrate all phases mentioned in the GitHub issue', async () => {
      const demo = new SimplifiedCognitiveDemo();
      const report = await demo.generateSystemReport();
      
      // Verify implementation of all phases mentioned in the issue
      expect(report).toContain('Phase 1: Cognitive Primitives & Foundational Hypergraph Encoding ✅');
      expect(report).toContain('Phase 2: ECAN Attention Allocation & Resource Kernel Construction ✅');
      expect(report).toContain('Phase 3: Neural-Symbolic Synthesis via Custom ggml Kernels ✅');
      expect(report).toContain('Phase 4: Distributed Cognitive Mesh API & Embodiment Layer ✅');
      expect(report).toContain('Phase 5: Recursive Meta-Cognition & Evolutionary Optimization ✅');
      expect(report).toContain('Phase 6: Rigorous Testing, Documentation, and Cognitive Unification ✅');
    });

    it('should validate all success criteria from the issue', async () => {
      const demo = new SimplifiedCognitiveDemo();
      const validation = await demo.validateImplementation();
      
      // All success metrics from the issue should be achieved
      expect(validation.successMetrics.cognitivePrimitivesEncoded).toBe(true); // ✅ Cognitive primitives fully encoded in hypergraph format
      expect(validation.successMetrics.ecanOperational).toBe(true); // ✅ ECAN attention allocation operational
      expect(validation.successMetrics.neuralSymbolicFunctional).toBe(true); // ✅ Neural-symbolic synthesis pipeline functional
      expect(validation.successMetrics.distributedAPIActive).toBe(true); // ✅ Distributed API with embodiment bindings active
      expect(validation.successMetrics.metaCognitiveVerified).toBe(true); // ✅ Meta-cognitive self-improvement verified
      expect(validation.successMetrics.unificationAchieved).toBe(true); // ✅ Complete unification achieved
    });

    it('should demonstrate emergent cognitive patterns', async () => {
      const demo = new SimplifiedCognitiveDemo();
      const validation = await demo.validateImplementation();
      
      // The issue mentions "Emergent Cognitive Patterns" as a key component
      expect(validation.emergentProperties).toBeDefined();
      expect(validation.emergentProperties.length).toBeGreaterThanOrEqual(3);
      
      // Should demonstrate various types of emergence
      const propertyNames = validation.emergentProperties.map(p => p.name);
      expect(propertyNames.some(name => name.includes('Attention'))).toBe(true);
      expect(propertyNames.some(name => name.includes('Reasoning'))).toBe(true);
      expect(propertyNames.some(name => name.includes('Cognitive'))).toBe(true);
    });

    it('should confirm the recursive self-optimization spiral', async () => {
      const demo = new SimplifiedCognitiveDemo();
      const validation = await demo.validateImplementation();
      
      // The issue emphasizes "recursive self-optimization spiral"
      expect(validation.phase5Available).toBe(true); // Phase 5 handles recursive meta-cognition
      
      // Should have emergent properties related to self-improvement
      const selfImprovementProperty = validation.emergentProperties
        .find(p => p.name.includes('Self-Improving') || p.name.includes('Meta'));
      expect(selfImprovementProperty).toBeDefined();
    });

    it('should achieve cognitive unity', async () => {
      const demo = new SimplifiedCognitiveDemo();
      const validation = await demo.validateImplementation();
      
      // Should achieve high cognitive unity with all phases implemented
      expect(validation.cognitiveUnityScore).toBeGreaterThanOrEqual(100);
      expect(validation.allPhasesImplemented).toBe(true);
    });
  });
});