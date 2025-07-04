import type { Tutorial, Lesson } from '../entities/index.js';
import { TutorialKitTensorNetworkArchitecture } from './tensor-network.js';
import type { CognitiveProcessingResult, TensorNetworkConfig } from '../entities/cognitive-tensor.js';

/**
 * TutorialKit Cognitive Integration Layer
 * 
 * Provides seamless integration between the existing TutorialKit architecture
 * and the new cognitive tensor network capabilities.
 */

export class TutorialKitCognitiveIntegration {
  private tensorNetwork: TutorialKitTensorNetworkArchitecture;
  private processingCache = new Map<string, CognitiveProcessingResult>();
  private config: TensorNetworkConfig;

  constructor(config: Partial<TensorNetworkConfig> = {}) {
    this.config = {
      ggmlBackend: 'cpu',
      maxMemoryMB: 1024,
      attentionMechanism: 'ecan',
      membraneEvolution: true,
      primeFactorization: true,
      recursiveExpansion: true,
      ...config
    };

    this.tensorNetwork = new TutorialKitTensorNetworkArchitecture();
  }

  /**
   * Initialize the cognitive tensor network integration
   */
  async initialize(): Promise<void> {
    await this.tensorNetwork.initialize(this.config);
  }

  /**
   * Process a tutorial through the cognitive tensor network
   */
  async processTutorial(tutorial: Tutorial): Promise<CognitiveProcessingResult> {
    const cacheKey = this.generateCacheKey(tutorial);
    
    if (this.processingCache.has(cacheKey)) {
      return this.processingCache.get(cacheKey)!;
    }

    const result = await this.tensorNetwork.processLessonContent(tutorial);
    this.processingCache.set(cacheKey, result);
    
    return result;
  }

  /**
   * Process a lesson through the cognitive tensor network
   */
  async processLesson(lesson: Lesson): Promise<CognitiveProcessingResult> {
    const cacheKey = this.generateCacheKey(lesson);
    
    if (this.processingCache.has(cacheKey)) {
      return this.processingCache.get(cacheKey)!;
    }

    const result = await this.tensorNetwork.processLessonContent(lesson);
    this.processingCache.set(cacheKey, result);
    
    return result;
  }

  /**
   * Generate cognitive insights for a lesson
   */
  async generateLessonInsights(lesson: Lesson): Promise<LessonInsights> {
    const result = await this.processLesson(lesson);
    
    const insights: LessonInsights = {
      complexityScore: this.calculateComplexityScore(result),
      cognitiveLoad: this.calculateCognitiveLoad(result),
      learningPaths: this.extractLearningPaths(result),
      attentionHotspots: this.identifyAttentionHotspots(result),
      recommendations: this.generateRecommendations(result),
      visualizations: {
        conceptMap: result.diagram,
        attentionFlow: await this.generateAttentionFlowDiagram(result),
        learningProgression: await this.generateLearningProgressionDiagram(result)
      }
    };

    return insights;
  }

  /**
   * Generate cognitive insights for a tutorial
   */
  async generateTutorialInsights(tutorial: Tutorial): Promise<TutorialInsights> {
    const result = await this.processTutorial(tutorial);
    
    const insights: TutorialInsights = {
      overallComplexity: this.calculateComplexityScore(result),
      learningCurve: this.analyzeLearningCurve(result),
      knowledgeGraph: result.diagram,
      bottlenecks: this.identifyLearningBottlenecks(result),
      optimizations: this.suggestOptimizations(result),
      cognitiveFlow: await this.analyzeCognitiveFlow(result)
    };

    return insights;
  }

  /**
   * Get tensor network architecture for advanced operations
   */
  getTensorNetwork(): TutorialKitTensorNetworkArchitecture {
    return this.tensorNetwork;
  }

  /**
   * Clear processing cache
   */
  clearCache(): void {
    this.processingCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): CacheStats {
    return {
      size: this.processingCache.size,
      keys: Array.from(this.processingCache.keys()),
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private generateCacheKey(content: Tutorial | Lesson): string {
    if ('lessons' in content) {
      // Tutorial
      return `tutorial-${content.lessons.length}-${Object.keys(content.parts).length}`;
    } else {
      // Lesson
      return `lesson-${content.id}-${content.order}`;
    }
  }

  private calculateComplexityScore(result: CognitiveProcessingResult): number {
    const totalComplexity = result.nodes.reduce((sum, node) => sum + node.complexity, 0);
    return Math.min(10, totalComplexity / result.nodes.length);
  }

  private calculateCognitiveLoad(result: CognitiveProcessingResult): number {
    const tensorComplexity = result.kernels.reduce((sum, kernel) => {
      return sum + kernel.shape.reduce((prod, dim) => prod * dim, 1);
    }, 0);

    return Math.min(10, Math.log10(tensorComplexity + 1) * 2);
  }

  private extractLearningPaths(result: CognitiveProcessingResult): LearningPath[] {
    const paths: LearningPath[] = [];
    
    // Extract paths from node connections
    const lessonNodes = result.nodes.filter(n => n.type === 'lesson');
    for (const lessonNode of lessonNodes) {
      const path: LearningPath = {
        id: `path-${lessonNode.id}`,
        steps: this.tracePath(lessonNode, result.nodes),
        difficulty: lessonNode.complexity,
        estimatedTime: this.estimatePathTime(lessonNode),
        prerequisites: this.extractPrerequisites(lessonNode, result.nodes)
      };
      paths.push(path);
    }

    return paths;
  }

  private identifyAttentionHotspots(result: CognitiveProcessingResult): AttentionHotspot[] {
    const hotspots: AttentionHotspot[] = [];
    
    for (const [nodeId, activation] of result.activations) {
      if (activation > 0.7) {
        const node = result.nodes.find(n => n.id === nodeId);
        if (node) {
          hotspots.push({
            nodeId: nodeId,
            nodeName: node.name,
            attentionScore: activation,
            type: node.type,
            reason: this.determineAttentionReason(node, activation)
          });
        }
      }
    }

    return hotspots.sort((a, b) => b.attentionScore - a.attentionScore);
  }

  private generateRecommendations(result: CognitiveProcessingResult): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // High complexity nodes
    const highComplexityNodes = result.nodes.filter(n => n.complexity > 8);
    for (const node of highComplexityNodes) {
      recommendations.push({
        type: 'simplification',
        priority: 'high',
        target: node.id,
        suggestion: `Consider breaking down "${node.name}" into smaller, more manageable components`,
        impact: 'Reduces cognitive load and improves comprehension'
      });
    }

    // Low activation nodes
    const lowActivationNodes = result.nodes.filter(n => 
      (result.activations.get(n.id) || 0) < 0.3
    );
    for (const node of lowActivationNodes) {
      recommendations.push({
        type: 'engagement',
        priority: 'medium',
        target: node.id,
        suggestion: `Increase interactivity in "${node.name}" to improve engagement`,
        impact: 'Boosts attention and retention'
      });
    }

    return recommendations;
  }

  private async generateAttentionFlowDiagram(result: CognitiveProcessingResult): Promise<string> {
    let diagram = 'graph LR\n';
    
    // Add nodes with attention levels
    for (const [nodeId, activation] of result.activations) {
      const node = result.nodes.find(n => n.id === nodeId);
      if (node) {
        const color = this.getAttentionColor(activation);
        diagram += `    ${nodeId}[${node.name}]:::${color}\n`;
      }
    }

    // Add attention flow arrows
    for (const node of result.nodes) {
      for (const connectionId of node.connections) {
        const sourceActivation = result.activations.get(node.id) || 0;
        const targetActivation = result.activations.get(connectionId) || 0;
        
        if (sourceActivation > 0.3 && targetActivation > 0.3) {
          diagram += `    ${node.id} --> ${connectionId}\n`;
        }
      }
    }

    // Add style classes
    diagram += '\n    classDef high fill:#ff6b6b,stroke:#333,stroke-width:2px\n';
    diagram += '    classDef medium fill:#ffd93d,stroke:#333,stroke-width:2px\n';
    diagram += '    classDef low fill:#6bcf7f,stroke:#333,stroke-width:2px\n';

    return diagram;
  }

  private async generateLearningProgressionDiagram(result: CognitiveProcessingResult): Promise<string> {
    let diagram = 'graph TD\n';
    
    // Sort nodes by complexity
    const sortedNodes = [...result.nodes].sort((a, b) => a.complexity - b.complexity);
    
    // Add nodes with progression indicators
    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];
      const level = Math.floor(node.complexity / 2) + 1;
      diagram += `    ${node.id}[Level ${level}: ${node.name}]\n`;
      
      // Connect to next node
      if (i < sortedNodes.length - 1) {
        diagram += `    ${node.id} --> ${sortedNodes[i + 1].id}\n`;
      }
    }

    return diagram;
  }

  private analyzeLearningCurve(result: CognitiveProcessingResult): LearningCurve {
    const lessonNodes = result.nodes.filter(n => n.type === 'lesson');
    const complexities = lessonNodes.map(n => n.complexity);
    
    return {
      initial: complexities[0] || 0,
      peak: Math.max(...complexities),
      final: complexities[complexities.length - 1] || 0,
      average: complexities.reduce((sum, c) => sum + c, 0) / complexities.length,
      progression: complexities,
      steepness: this.calculateSteepness(complexities)
    };
  }

  private identifyLearningBottlenecks(result: CognitiveProcessingResult): Bottleneck[] {
    const bottlenecks: Bottleneck[] = [];
    
    // Find nodes with high complexity but low activation
    for (const node of result.nodes) {
      const activation = result.activations.get(node.id) || 0;
      if (node.complexity > 6 && activation < 0.4) {
        bottlenecks.push({
          nodeId: node.id,
          nodeName: node.name,
          type: 'complexity',
          severity: 'high',
          description: `High complexity (${node.complexity.toFixed(1)}) with low engagement (${activation.toFixed(2)})`,
          suggestion: 'Consider adding interactive elements or breaking into smaller sections'
        });
      }
    }

    return bottlenecks;
  }

  private suggestOptimizations(result: CognitiveProcessingResult): Optimization[] {
    const optimizations: Optimization[] = [];
    
    // Tensor shape optimizations
    for (const kernel of result.kernels) {
      const totalSize = kernel.shape.reduce((prod, dim) => prod * dim, 1);
      if (totalSize > 10000) {
        optimizations.push({
          type: 'tensor-optimization',
          target: kernel.id,
          description: `Large tensor shape [${kernel.shape.join(', ')}] detected`,
          suggestion: 'Consider dimensionality reduction or sparse tensor representation',
          expectedBenefit: 'Reduced memory usage and faster processing'
        });
      }
    }

    return optimizations;
  }

  private async analyzeCognitiveFlow(result: CognitiveProcessingResult): Promise<CognitiveFlow> {
    const flowPatterns = result.patterns.map(p => ({
      pattern: p.pattern,
      category: p.category,
      strength: p.weight
    }));

    return {
      patterns: flowPatterns,
      dominantCategory: this.findDominantCategory(result.patterns),
      flowEfficiency: this.calculateFlowEfficiency(result),
      bottlenecks: this.identifyFlowBottlenecks(result),
      recommendations: this.generateFlowRecommendations(result)
    };
  }

  private tracePath(startNode: any, allNodes: any[]): string[] {
    // Simple path tracing - can be enhanced
    return [startNode.id, ...startNode.connections.slice(0, 3)];
  }

  private estimatePathTime(node: any): number {
    return Math.max(5, node.complexity * 2); // Minutes
  }

  private extractPrerequisites(node: any, allNodes: any[]): string[] {
    return node.connections.filter((id: string) => {
      const targetNode = allNodes.find(n => n.id === id);
      return targetNode && targetNode.complexity < node.complexity;
    });
  }

  private determineAttentionReason(node: any, activation: number): string {
    if (activation > 0.9) return 'Critical learning component';
    if (activation > 0.7) return 'High engagement element';
    if (node.complexity > 7) return 'Complex concept requiring focus';
    return 'Important learning step';
  }

  private getAttentionColor(activation: number): string {
    if (activation > 0.7) return 'high';
    if (activation > 0.4) return 'medium';
    return 'low';
  }

  private calculateSteepness(complexities: number[]): number {
    if (complexities.length < 2) return 0;
    
    let totalChange = 0;
    for (let i = 1; i < complexities.length; i++) {
      totalChange += Math.abs(complexities[i] - complexities[i - 1]);
    }
    
    return totalChange / (complexities.length - 1);
  }

  private findDominantCategory(patterns: any[]): string {
    const categories = patterns.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + p.weight;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'structural';
  }

  private calculateFlowEfficiency(result: CognitiveProcessingResult): number {
    const totalActivation = Array.from(result.activations.values()).reduce((sum, a) => sum + a, 0);
    const nodeCount = result.nodes.length;
    return nodeCount > 0 ? totalActivation / nodeCount : 0;
  }

  private identifyFlowBottlenecks(result: CognitiveProcessingResult): string[] {
    return result.nodes
      .filter(n => n.connections.length === 0 && n.complexity > 5)
      .map(n => n.id);
  }

  private generateFlowRecommendations(result: CognitiveProcessingResult): string[] {
    const recommendations: string[] = [];
    
    if (result.nodes.length > 20) {
      recommendations.push('Consider grouping related concepts to reduce cognitive overhead');
    }
    
    const highComplexityCount = result.nodes.filter(n => n.complexity > 8).length;
    if (highComplexityCount > 3) {
      recommendations.push('Distribute complex concepts more evenly throughout the tutorial');
    }
    
    return recommendations;
  }

  private estimateMemoryUsage(): number {
    // Simple estimation based on cache size
    return this.processingCache.size * 1024; // Rough estimate in bytes
  }
}

// Type definitions for insights and analytics
export interface LessonInsights {
  complexityScore: number;
  cognitiveLoad: number;
  learningPaths: LearningPath[];
  attentionHotspots: AttentionHotspot[];
  recommendations: Recommendation[];
  visualizations: {
    conceptMap: string;
    attentionFlow: string;
    learningProgression: string;
  };
}

export interface TutorialInsights {
  overallComplexity: number;
  learningCurve: LearningCurve;
  knowledgeGraph: string;
  bottlenecks: Bottleneck[];
  optimizations: Optimization[];
  cognitiveFlow: CognitiveFlow;
}

export interface LearningPath {
  id: string;
  steps: string[];
  difficulty: number;
  estimatedTime: number;
  prerequisites: string[];
}

export interface AttentionHotspot {
  nodeId: string;
  nodeName: string;
  attentionScore: number;
  type: string;
  reason: string;
}

export interface Recommendation {
  type: 'simplification' | 'engagement' | 'structure' | 'content';
  priority: 'low' | 'medium' | 'high';
  target: string;
  suggestion: string;
  impact: string;
}

export interface LearningCurve {
  initial: number;
  peak: number;
  final: number;
  average: number;
  progression: number[];
  steepness: number;
}

export interface Bottleneck {
  nodeId: string;
  nodeName: string;
  type: 'complexity' | 'engagement' | 'flow';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
}

export interface Optimization {
  type: 'tensor-optimization' | 'attention-optimization' | 'flow-optimization';
  target: string;
  description: string;
  suggestion: string;
  expectedBenefit: string;
}

export interface CognitiveFlow {
  patterns: Array<{
    pattern: string;
    category: string;
    strength: number;
  }>;
  dominantCategory: string;
  flowEfficiency: number;
  bottlenecks: string[];
  recommendations: string[];
}

export interface CacheStats {
  size: number;
  keys: string[];
  memoryUsage: number;
}