import { describe, test, expect, beforeEach } from 'vitest';
import { ECANScheduler } from './ecan-scheduler.js';
import type {
  ECANAttentionValue,
  ScheduledTask,
  ResourceRequirements,
  TaskSchedulingResult
} from './ecan-scheduler.js';
import type {
  AtomSpace,
  HypergraphNode,
  HypergraphEdge
} from '../entities/cognitive-tensor.js';

describe('ECANScheduler', () => {
  let scheduler: ECANScheduler;
  let mockAtomSpace: AtomSpace;

  beforeEach(() => {
    scheduler = new ECANScheduler({
      attentionBank: 100000,
      maxSTI: 32767,
      minSTI: -32768,
      maxLTI: 65535,
      attentionDecayRate: 0.95,
      importanceSpreadingRate: 0.1,
      forgettingThreshold: -1000,
      stimulationThreshold: 1000,
      rentCollectionRate: 0.01,
      wagePaymentRate: 0.05
    });

    // Create mock AtomSpace
    mockAtomSpace = {
      id: 'test-atomspace',
      nodes: new Map(),
      edges: new Map(),
      indices: new Map(),
      metadata: {}
    };

    // Add test nodes
    const testNodes: HypergraphNode[] = [
      {
        id: 'concept-1',
        type: 'concept',
        attributes: {
          activation: 0.8,
          attention: 0.6,
          lastActivation: Date.now() - 5000,
          activationCount: 10,
          systemCritical: true
        },
        embeddings: Array.from({ length: 64 }, (_, i) => Math.sin(i * 0.1))
      },
      {
        id: 'relation-1',
        type: 'relation',
        attributes: {
          activation: 0.5,
          attention: 0.3,
          lastActivation: Date.now() - 10000,
          activationCount: 5
        },
        embeddings: Array.from({ length: 64 }, (_, i) => Math.cos(i * 0.1))
      },
      {
        id: 'context-1',
        type: 'context',
        attributes: {
          activation: 0.2,
          attention: 0.1,
          lastActivation: Date.now() - 30000,
          activationCount: 2
        },
        embeddings: Array.from({ length: 64 }, (_, i) => Math.sin(i * 0.05))
      }
    ];

    for (const node of testNodes) {
      mockAtomSpace.nodes.set(node.id, node);
    }

    // Add test edges
    const testEdges: HypergraphEdge[] = [
      {
        id: 'edge-1',
        nodes: ['concept-1', 'relation-1'],
        type: 'semantic',
        weight: 0.8,
        attributes: {}
      },
      {
        id: 'edge-2',
        nodes: ['relation-1', 'context-1'],
        type: 'structural',
        weight: 0.6,
        attributes: {}
      }
    ];

    for (const edge of testEdges) {
      mockAtomSpace.edges.set(edge.id, edge);
    }
  });

  describe('Economic Attention Calculation', () => {
    test('should calculate correct STI for high-activity node', () => {
      const node = mockAtomSpace.nodes.get('concept-1')!;
      const context = { category: 'cognitive', type: 'concept' };
      
      const attention = scheduler.calculateEconomicAttention(node, context);
      
      expect(attention.sti).toBeGreaterThan(1000);
      expect(attention.sti).toBeLessThanOrEqual(32767);
      expect(attention.lti).toBeGreaterThan(0);
      expect(attention.vlti).toBe(1); // System critical node
    });

    test('should calculate lower STI for low-activity node', () => {
      const node = mockAtomSpace.nodes.get('context-1')!;
      const context = { category: 'semantic', type: 'context' };
      
      const attention = scheduler.calculateEconomicAttention(node, context);
      
      expect(attention.sti).toBeLessThan(2000); // Increased threshold to account for context bonus
      expect(attention.lti).toBeGreaterThan(0);
      expect(attention.vlti).toBe(0); // Not system critical
    });

    test('should respect STI bounds', () => {
      const node = mockAtomSpace.nodes.get('concept-1')!;
      // Create extreme activation values
      node.attributes.activation = 100;
      node.attributes.attention = 100;
      node.attributes.activationCount = 10000;
      
      const attention = scheduler.calculateEconomicAttention(node);
      
      expect(attention.sti).toBeLessThanOrEqual(32767);
      expect(attention.sti).toBeGreaterThanOrEqual(-32768);
    });

    test('should calculate LTI based on node type and history', () => {
      const conceptNode = mockAtomSpace.nodes.get('concept-1')!;
      const relationNode = mockAtomSpace.nodes.get('relation-1')!;
      
      const conceptAttention = scheduler.calculateEconomicAttention(conceptNode);
      const relationAttention = scheduler.calculateEconomicAttention(relationNode);
      
      // Concept nodes should have higher base LTI than relation nodes
      expect(conceptAttention.lti).toBeGreaterThan(relationAttention.lti);
    });
  });

  describe('Importance Spreading', () => {
    test('should spread importance between connected nodes', async () => {
      // Set initial attention values
      scheduler.setAttentionValue('concept-1', { sti: 5000, lti: 2000, vlti: 1 });
      scheduler.setAttentionValue('relation-1', { sti: 1000, lti: 1500, vlti: 0 });
      scheduler.setAttentionValue('context-1', { sti: 500, lti: 800, vlti: 0 });

      const initialConceptSTI = scheduler.getAttentionValue('concept-1')!.sti;
      const initialRelationSTI = scheduler.getAttentionValue('relation-1')!.sti;

      await scheduler.spreadImportance(mockAtomSpace);

      const finalConceptSTI = scheduler.getAttentionValue('concept-1')!.sti;
      const finalRelationSTI = scheduler.getAttentionValue('relation-1')!.sti;

      // High STI node should lose some importance
      expect(finalConceptSTI).toBeLessThan(initialConceptSTI);
      // Connected node should gain some importance
      expect(finalRelationSTI).toBeGreaterThan(initialRelationSTI);
    });

    test('should not spread from nodes with zero or negative STI', async () => {
      scheduler.setAttentionValue('concept-1', { sti: -100, lti: 2000, vlti: 1 });
      scheduler.setAttentionValue('relation-1', { sti: 1000, lti: 1500, vlti: 0 });

      const initialRelationSTI = scheduler.getAttentionValue('relation-1')!.sti;

      await scheduler.spreadImportance(mockAtomSpace);

      const finalRelationSTI = scheduler.getAttentionValue('relation-1')!.sti;

      // Relation node STI should not increase significantly
      expect(Math.abs(finalRelationSTI - initialRelationSTI)).toBeLessThan(10);
    });
  });

  describe('Economic Mechanisms', () => {
    test('should collect rent from nodes with positive STI', () => {
      scheduler.setAttentionValue('concept-1', { sti: 10000, lti: 2000, vlti: 1 });
      scheduler.setAttentionValue('relation-1', { sti: 5000, lti: 1500, vlti: 0 });

      const initialBank = scheduler.getAttentionBank();
      const initialConceptSTI = scheduler.getAttentionValue('concept-1')!.sti;

      scheduler.collectRent();

      const finalBank = scheduler.getAttentionBank();
      const finalConceptSTI = scheduler.getAttentionValue('concept-1')!.sti;

      expect(finalBank).toBeGreaterThan(initialBank);
      expect(finalConceptSTI).toBeLessThan(initialConceptSTI);
    });

    test('should pay wages to high-LTI nodes', () => {
      scheduler.setAttentionValue('concept-1', { sti: 500, lti: 5000, vlti: 1 });
      scheduler.setAttentionValue('relation-1', { sti: 300, lti: 3000, vlti: 0 });

      const initialConceptSTI = scheduler.getAttentionValue('concept-1')!.sti;
      const initialBank = scheduler.getAttentionBank();

      scheduler.payWages();

      const finalConceptSTI = scheduler.getAttentionValue('concept-1')!.sti;
      const finalBank = scheduler.getAttentionBank();

      expect(finalConceptSTI).toBeGreaterThan(initialConceptSTI);
      expect(finalBank).toBeLessThan(initialBank);
    });

    test('should apply attention decay', () => {
      scheduler.setAttentionValue('concept-1', { sti: 10000, lti: 5000, vlti: 1 });

      const initialSTI = scheduler.getAttentionValue('concept-1')!.sti;
      const initialLTI = scheduler.getAttentionValue('concept-1')!.lti;

      scheduler.applyAttentionDecay();

      const finalSTI = scheduler.getAttentionValue('concept-1')!.sti;
      const finalLTI = scheduler.getAttentionValue('concept-1')!.lti;

      expect(finalSTI).toBeLessThan(initialSTI);
      expect(finalLTI).toBeLessThan(initialLTI);
    });
  });

  describe('Task Scheduling', () => {
    test('should schedule high-priority tasks first', () => {
      const availableResources: ResourceRequirements = {
        cpu: 1000,
        memory: 1000,
        bandwidth: 1000,
        storage: 1000
      };

      const tasks: ScheduledTask[] = [
        {
          id: 'task-1',
          nodeId: 'concept-1',
          priority: 50,
          estimatedCost: 100,
          resourceRequirements: { cpu: 100, memory: 100, bandwidth: 50, storage: 50 },
          dependencies: []
        },
        {
          id: 'task-2',
          nodeId: 'relation-1',
          priority: 90,
          estimatedCost: 150,
          resourceRequirements: { cpu: 150, memory: 150, bandwidth: 75, storage: 75 },
          dependencies: []
        },
        {
          id: 'task-3',
          nodeId: 'context-1',
          priority: 20,
          estimatedCost: 80,
          resourceRequirements: { cpu: 80, memory: 80, bandwidth: 40, storage: 40 },
          dependencies: []
        }
      ];

      const result = scheduler.scheduleTasks(tasks, availableResources);

      expect(result.scheduledTasks.length).toBeGreaterThan(0);
      // High priority task should be scheduled first
      expect(result.scheduledTasks[0].priority).toBe(90);
      expect(result.scheduledTasks[0].id).toBe('task-2');
    });

    test('should respect resource constraints', () => {
      const limitedResources: ResourceRequirements = {
        cpu: 200,
        memory: 200,
        bandwidth: 100,
        storage: 100
      };

      const largeTasks: ScheduledTask[] = [
        {
          id: 'large-task-1',
          nodeId: 'concept-1',
          priority: 80,
          estimatedCost: 200,
          resourceRequirements: { cpu: 300, memory: 300, bandwidth: 150, storage: 150 },
          dependencies: []
        },
        {
          id: 'small-task-1',
          nodeId: 'relation-1',
          priority: 70,
          estimatedCost: 100,
          resourceRequirements: { cpu: 100, memory: 100, bandwidth: 50, storage: 50 },
          dependencies: []
        }
      ];

      const result = scheduler.scheduleTasks(largeTasks, limitedResources);

      // Only the small task should be scheduled due to resource constraints
      expect(result.scheduledTasks.length).toBe(1);
      expect(result.scheduledTasks[0].id).toBe('small-task-1');
    });

    test('should calculate resource utilization correctly', () => {
      const availableResources: ResourceRequirements = {
        cpu: 1000,
        memory: 1000,
        bandwidth: 1000,
        storage: 1000
      };

      const tasks: ScheduledTask[] = [
        {
          id: 'task-1',
          nodeId: 'concept-1',
          priority: 80,
          estimatedCost: 100,
          resourceRequirements: { cpu: 500, memory: 400, bandwidth: 300, storage: 200 },
          dependencies: []
        }
      ];

      const result = scheduler.scheduleTasks(tasks, availableResources);

      expect(result.resourceUtilization).toBeGreaterThan(0);
      expect(result.resourceUtilization).toBeLessThanOrEqual(100);
      // Should be around 35% utilization (1400/4000)
      expect(result.resourceUtilization).toBeCloseTo(35, 0);
    });
  });

  describe('ECAN Cycle', () => {
    test('should run complete ECAN cycle without errors', async () => {
      // Initialize some attention values
      for (const [nodeId, node] of mockAtomSpace.nodes) {
        const attention = scheduler.calculateEconomicAttention(node);
        scheduler.setAttentionValue(nodeId, attention);
      }

      const initialBank = scheduler.getAttentionBank();

      await scheduler.runECANCycle(mockAtomSpace);

      const finalBank = scheduler.getAttentionBank();

      // Bank should change due to rent collection and wage payment
      expect(finalBank).not.toBe(initialBank);
      
      // All nodes should still have attention values
      for (const nodeId of mockAtomSpace.nodes.keys()) {
        const attention = scheduler.getAttentionValue(nodeId);
        expect(attention).toBeDefined();
      }
    });

    test('should forget low-attention nodes', async () => {
      // Set a node with very low STI
      scheduler.setAttentionValue('context-1', { sti: -2000, lti: 100, vlti: 0 });
      scheduler.setAttentionValue('concept-1', { sti: 5000, lti: 3000, vlti: 1 });

      await scheduler.runECANCycle(mockAtomSpace);

      // Low attention node should be forgotten
      expect(scheduler.getAttentionValue('context-1')).toBeUndefined();
      // High attention VLTI node should be preserved
      expect(scheduler.getAttentionValue('concept-1')).toBeDefined();
    });
  });

  describe('Performance Benchmarks', () => {
    test('should handle large number of tasks efficiently', () => {
      const startTime = performance.now();
      
      const largeTasks: ScheduledTask[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `task-${i}`,
        nodeId: `node-${i % 3}`,
        priority: Math.floor(Math.random() * 100),
        estimatedCost: Math.floor(Math.random() * 200) + 50,
        resourceRequirements: {
          cpu: Math.floor(Math.random() * 100) + 50,
          memory: Math.floor(Math.random() * 100) + 50,
          bandwidth: Math.floor(Math.random() * 50) + 25,
          storage: Math.floor(Math.random() * 50) + 25
        },
        dependencies: []
      }));

      const availableResources: ResourceRequirements = {
        cpu: 50000,
        memory: 50000,
        bandwidth: 25000,
        storage: 25000
      };

      const result = scheduler.scheduleTasks(largeTasks, availableResources);
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
      expect(result.scheduledTasks.length).toBeGreaterThan(0);
      expect(result.scheduledTasks.length).toBeLessThanOrEqual(largeTasks.length);
    });

    test('should handle ECAN cycle with many nodes efficiently', async () => {
      // Create a large AtomSpace
      const largeAtomSpace: AtomSpace = {
        id: 'large-test-atomspace',
        nodes: new Map(),
        edges: new Map(),
        indices: new Map(),
        metadata: {}
      };

      // Add 1000 nodes
      for (let i = 0; i < 1000; i++) {
        const node: HypergraphNode = {
          id: `node-${i}`,
          type: i % 4 === 0 ? 'concept' : i % 4 === 1 ? 'relation' : i % 4 === 2 ? 'context' : 'state',
          attributes: {
            activation: Math.random(),
            attention: Math.random(),
            lastActivation: Date.now() - Math.random() * 60000,
            activationCount: Math.floor(Math.random() * 100)
          },
          embeddings: Array.from({ length: 64 }, () => Math.random())
        };
        largeAtomSpace.nodes.set(node.id, node);
        
        // Initialize attention values
        const attention = scheduler.calculateEconomicAttention(node);
        scheduler.setAttentionValue(node.id, attention);
      }

      // Add some edges
      for (let i = 0; i < 2000; i++) {
        const edge: HypergraphEdge = {
          id: `edge-${i}`,
          nodes: [`node-${Math.floor(Math.random() * 1000)}`, `node-${Math.floor(Math.random() * 1000)}`],
          type: 'semantic',
          weight: Math.random(),
          attributes: {}
        };
        largeAtomSpace.edges.set(edge.id, edge);
      }

      const startTime = performance.now();
      
      await scheduler.runECANCycle(largeAtomSpace);
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty AtomSpace', async () => {
      const emptyAtomSpace: AtomSpace = {
        id: 'empty-atomspace',
        nodes: new Map(),
        edges: new Map(),
        indices: new Map(),
        metadata: {}
      };

      await expect(scheduler.runECANCycle(emptyAtomSpace)).resolves.not.toThrow();
    });

    test('should handle tasks with zero resource requirements', () => {
      const zeroResourceTask: ScheduledTask = {
        id: 'zero-task',
        nodeId: 'concept-1',
        priority: 50,
        estimatedCost: 0,
        resourceRequirements: { cpu: 0, memory: 0, bandwidth: 0, storage: 0 },
        dependencies: []
      };

      const availableResources: ResourceRequirements = {
        cpu: 1000,
        memory: 1000,
        bandwidth: 1000,
        storage: 1000
      };

      const result = scheduler.scheduleTasks([zeroResourceTask], availableResources);
      
      expect(result.scheduledTasks).toHaveLength(1);
      expect(result.scheduledTasks[0].id).toBe('zero-task');
    });

    test('should handle nodes with missing attributes gracefully', () => {
      const minimalNode: HypergraphNode = {
        id: 'minimal-node',
        type: 'concept',
        attributes: {},
        embeddings: []
      };

      const attention = scheduler.calculateEconomicAttention(minimalNode);
      
      expect(attention.sti).toBeGreaterThanOrEqual(-32768);
      expect(attention.sti).toBeLessThanOrEqual(32767);
      expect(attention.lti).toBeGreaterThanOrEqual(0);
      expect(attention.vlti).toBeGreaterThanOrEqual(0);
      expect(attention.vlti).toBeLessThanOrEqual(1);
    });
  });
});