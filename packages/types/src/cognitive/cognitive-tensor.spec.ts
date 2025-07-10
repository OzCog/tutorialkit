import { describe, it, expect, beforeEach } from 'vitest';
import { TutorialKitCognitiveExtractor } from '../cognitive/extractor.js';
import { TutorialKitTensorKernelMapper } from '../cognitive/tensor-mapper.js';
import { TutorialKitDistributedGrammarEngine } from '../cognitive/grammar-engine.js';
import { TutorialKitTensorNetworkArchitecture } from '../cognitive/tensor-network.js';
import type { 
  Tutorial, 
  Lesson, 
  Chapter, 
  Part,
  CognitiveNode,
  TensorKernel,
  AgenticGrammar,
  AtomSpace,
  HypergraphNode
} from '../index.js';

describe('Cognitive Tensor Network', () => {
  let extractor: TutorialKitCognitiveExtractor;
  let mapper: TutorialKitTensorKernelMapper;
  let architecture: TutorialKitTensorNetworkArchitecture;

  beforeEach(() => {
    extractor = new TutorialKitCognitiveExtractor();
    mapper = new TutorialKitTensorKernelMapper();
    architecture = new TutorialKitTensorNetworkArchitecture();
  });

  describe('CognitiveExtractor', () => {
    it('should extract cognitive nodes from lesson data', async () => {
      const lesson: Lesson = {
        id: 'test-lesson',
        order: 1,
        data: {
          type: 'lesson',
          title: 'Test Lesson',
          mainCommand: 'npm start',
          prepareCommands: ['npm install', 'npm build'],
          focus: '/src/index.js'
        },
        slug: 'test-lesson',
        filepath: '/lessons/test-lesson.md',
        files: ['', []],
        solution: ['', []],
        Markdown: null
      };

      const nodes = await extractor.extractNodes(lesson);
      
      expect(nodes).toBeDefined();
      expect(nodes.length).toBeGreaterThan(0);
      
      const lessonNode = nodes.find(n => n.id === 'lesson-test-lesson');
      expect(lessonNode).toBeDefined();
      expect(lessonNode!.type).toBe('lesson');
      expect(lessonNode!.name).toBe('Test Lesson');
      expect(lessonNode!.complexity).toBeGreaterThan(0);
    });

    it('should extract command nodes from lesson data', async () => {
      const lesson: Lesson = {
        id: 'command-test',
        order: 1,
        data: {
          type: 'lesson',
          title: 'Command Test',
          mainCommand: 'npm start',
          prepareCommands: ['npm install']
        },
        slug: 'command-test',
        filepath: '/lessons/command-test.md',
        files: ['', []],
        solution: ['', []],
        Markdown: null
      };

      const nodes = await extractor.extractNodes(lesson);
      
      const commandNodes = nodes.filter(n => n.type === 'function');
      expect(commandNodes.length).toBe(2); // main command + prepare command
      
      const mainCommandNode = commandNodes.find(n => n.id === 'command-command-test-main');
      expect(mainCommandNode).toBeDefined();
      expect(mainCommandNode!.metadata.command).toBe('npm start');
    });

    it('should calculate complexity correctly', () => {
      const node: CognitiveNode = {
        id: 'test-node',
        type: 'lesson',
        name: 'Test Node',
        arity: 3,
        complexity: 0,
        metadata: { data: { title: 'Test' } },
        connections: ['conn1', 'conn2']
      };

      const complexity = extractor.analyzeComplexity(node);
      expect(complexity).toBeGreaterThan(0);
      expect(complexity).toBeLessThan(20); // Reasonable upper bound
    });
  });

  describe('TensorKernelMapper', () => {
    it('should map cognitive nodes to tensor kernels', async () => {
      const node: CognitiveNode = {
        id: 'test-node',
        type: 'lesson',
        name: 'Test Node',
        arity: 2,
        complexity: 5,
        metadata: { data: { title: 'Test' } },
        connections: ['conn1']
      };

      const kernel = await mapper.mapNodeToKernel(node);
      
      expect(kernel).toBeDefined();
      expect(kernel.id).toBe('kernel-test-node');
      expect(kernel.nodeId).toBe('test-node');
      expect(kernel.shape).toBeDefined();
      expect(kernel.shape.length).toBeGreaterThan(0);
      expect(kernel.dtype).toBeDefined();
      expect(kernel.data).toBeInstanceOf(ArrayBuffer);
    });

    it('should optimize kernel shapes', async () => {
      const node1: CognitiveNode = {
        id: 'node1',
        type: 'lesson',
        name: 'Node 1',
        arity: 3,
        complexity: 4,
        metadata: {},
        connections: []
      };

      const node2: CognitiveNode = {
        id: 'node2',
        type: 'chapter',
        name: 'Node 2',
        arity: 2,
        complexity: 3,
        metadata: {},
        connections: []
      };

      const kernel1 = await mapper.mapNodeToKernel(node1);
      const kernel2 = await mapper.mapNodeToKernel(node2);
      
      const optimizedKernels = mapper.optimizeKernelShapes([kernel1, kernel2]);
      
      expect(optimizedKernels).toHaveLength(2);
      expect(optimizedKernels[0].shape).toBeDefined();
      expect(optimizedKernels[1].shape).toBeDefined();
    });
  });

  describe('TensorNetworkArchitecture', () => {
    it('should initialize with default configuration', async () => {
      await architecture.initialize({
        ggmlBackend: 'cpu',
        maxMemoryMB: 512,
        attentionMechanism: 'ecan',
        membraneEvolution: true,
        primeFactorization: true,
        recursiveExpansion: true
      });

      expect(architecture.registry).toBeDefined();
      expect(architecture.extractor).toBeDefined();
      expect(architecture.mapper).toBeDefined();
      expect(architecture.engines.size).toBeGreaterThan(0);
    });

    it('should process lesson content and return cognitive processing result', async () => {
      const lesson: Lesson = {
        id: 'process-test',
        order: 1,
        data: {
          type: 'lesson',
          title: 'Process Test',
          mainCommand: 'npm test'
        },
        slug: 'process-test',
        filepath: '/lessons/process-test.md',
        files: ['', []],
        solution: ['', []],
        Markdown: null
      };

      const result = await architecture.processLessonContent(lesson);
      
      expect(result).toBeDefined();
      expect(result.nodes).toBeDefined();
      expect(result.kernels).toBeDefined();
      expect(result.activations).toBeDefined();
      expect(result.patterns).toBeDefined();
      expect(result.diagram).toBeDefined();
      expect(result.metadata).toBeDefined();
      
      expect(result.nodes.length).toBeGreaterThan(0);
      expect(result.kernels.length).toBeGreaterThan(0);
      expect(result.diagram).toContain('graph TD');
    });

    it('should generate mermaid diagrams', async () => {
      await architecture.initialize({
        ggmlBackend: 'cpu',
        maxMemoryMB: 256,
        attentionMechanism: 'simple',
        membraneEvolution: false,
        primeFactorization: false,
        recursiveExpansion: false
      });

      const diagram = await architecture.generateMermaidDiagram('test');
      
      expect(diagram).toBeDefined();
      expect(diagram).toContain('graph TD');
      expect(diagram).toContain('subgraph');
    });
  });

  describe('DistributedGrammarEngine', () => {
    it('should process patterns and allocate attention', async () => {
      const grammar: AgenticGrammar = {
        id: 'test-grammar',
        patterns: [{
          id: 'test-pattern',
          pattern: 'test -> result',
          category: 'structural',
          weight: 0.8,
          conditions: []
        }],
        activationRules: [],
        attentionWeights: []
      };

      const atomSpace: AtomSpace = {
        id: 'test-space',
        nodes: new Map<string, HypergraphNode>(),
        edges: new Map(),
        indices: new Map(),
        metadata: {}
      };

      const engine = new TutorialKitDistributedGrammarEngine(
        'test-engine',
        grammar,
        atomSpace
      );

      const result = await engine.processPattern(grammar.patterns[0], { test: 'data' });
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('patternId');
      expect(result).toHaveProperty('activation');
    });
  });

  describe('Integration Tests', () => {
    it('should process a complete tutorial structure', async () => {
      const tutorial: Tutorial = {
        parts: {
          'part1': {
            id: 'part1',
            order: 1,
            slug: 'getting-started',
            data: { type: 'part', title: 'Getting Started' },
            chapters: {
              'chapter1': {
                id: 'chapter1',
                order: 1,
                slug: 'introduction',
                data: { type: 'chapter', title: 'Introduction' }
              }
            }
          }
        },
        lessons: [{
          id: 'lesson1',
          order: 1,
          data: {
            type: 'lesson',
            title: 'First Lesson',
            mainCommand: 'npm start'
          },
          part: { id: 'part1', title: 'Getting Started' },
          chapter: { id: 'chapter1', title: 'Introduction' },
          slug: 'first-lesson',
          filepath: '/lessons/first-lesson.md',
          files: ['', []],
          solution: ['', []],
          Markdown: null
        }]
      };

      const result = await architecture.processLessonContent(tutorial);
      
      expect(result).toBeDefined();
      expect(result.nodes.length).toBeGreaterThan(3); // Should have tutorial, part, chapter, and lesson nodes
      expect(result.kernels.length).toBeGreaterThan(0);
      expect(result.diagram).toContain('tutorial-root');
    });
  });
});