import type { 
  TutorialKitCognitiveIntegration,
  LessonInsights,
  TutorialInsights 
} from '@tutorialkit/types';

/**
 * Astro Integration for Cognitive Tensor Network
 * 
 * Provides seamless integration of the cognitive tensor network
 * into Astro-based TutorialKit applications.
 */

declare global {
  namespace App {
    interface Locals {
      cognitiveSystem?: TutorialKitCognitiveIntegration;
    }
  }
}

export interface CognitiveAstroConfig {
  enabled?: boolean;
  ggmlBackend?: 'cpu' | 'cuda' | 'opencl' | 'metal';
  maxMemoryMB?: number;
  attentionMechanism?: 'ecan' | 'simple' | 'hierarchical';
  membraneEvolution?: boolean;
  primeFactorization?: boolean;
  recursiveExpansion?: boolean;
  cacheResults?: boolean;
  generateDiagrams?: boolean;
}

/**
 * Astro middleware for cognitive processing
 */
export function cognitiveMiddleware(config: CognitiveAstroConfig = {}) {
  return async (context: any, next: any) => {
    if (config.enabled !== false) {
      try {
        // Lazy import to avoid loading cognitive system unless needed
        const { TutorialKitCognitiveIntegration } = await import('@tutorialkit/types');
        
        if (!context.locals.cognitiveSystem) {
          const cognitiveSystem = new TutorialKitCognitiveIntegration({
            ggmlBackend: config.ggmlBackend || 'cpu',
            maxMemoryMB: config.maxMemoryMB || 512,
            attentionMechanism: config.attentionMechanism || 'ecan',
            membraneEvolution: config.membraneEvolution !== false,
            primeFactorization: config.primeFactorization !== false,
            recursiveExpansion: config.recursiveExpansion !== false
          });
          
          await cognitiveSystem.initialize();
          context.locals.cognitiveSystem = cognitiveSystem;
        }
      } catch (error) {
        console.warn('Failed to initialize cognitive system:', error);
      }
    }
    
    return next();
  };
}

/**
 * Astro component helper for accessing cognitive insights
 */
export async function getLessonCognitiveInsights(
  lesson: any,
  cognitiveSystem?: TutorialKitCognitiveIntegration
): Promise<LessonInsights | null> {
  if (!cognitiveSystem) {
    return null;
  }
  
  try {
    return await cognitiveSystem.generateLessonInsights(lesson);
  } catch (error) {
    console.warn('Failed to generate lesson insights:', error);
    return null;
  }
}

/**
 * Astro component helper for accessing tutorial insights
 */
export async function getTutorialCognitiveInsights(
  tutorial: any,
  cognitiveSystem?: TutorialKitCognitiveIntegration
): Promise<TutorialInsights | null> {
  if (!cognitiveSystem) {
    return null;
  }
  
  try {
    return await cognitiveSystem.generateTutorialInsights(tutorial);
  } catch (error) {
    console.warn('Failed to generate tutorial insights:', error);
    return null;
  }
}

/**
 * Astro utility for generating cognitive mermaid diagrams
 */
export async function generateCognitiveDiagram(
  content: any,
  type: 'lesson' | 'tutorial' = 'lesson',
  cognitiveSystem?: TutorialKitCognitiveIntegration
): Promise<string | null> {
  if (!cognitiveSystem) {
    return null;
  }
  
  try {
    const tensorNetwork = cognitiveSystem.getTensorNetwork();
    await tensorNetwork.processLessonContent(content);
    return await tensorNetwork.generateMermaidDiagram(type);
  } catch (error) {
    console.warn('Failed to generate cognitive diagram:', error);
    return null;
  }
}

/**
 * Astro page props enhancement with cognitive insights
 */
export async function enhancePagePropsWithCognitive(
  props: any,
  cognitiveSystem?: TutorialKitCognitiveIntegration
): Promise<any> {
  if (!cognitiveSystem || !props.lesson) {
    return props;
  }
  
  try {
    const insights = await cognitiveSystem.generateLessonInsights(props.lesson);
    
    return {
      ...props,
      cognitiveInsights: insights,
      cognitiveEnabled: true
    };
  } catch (error) {
    console.warn('Failed to enhance props with cognitive insights:', error);
    return {
      ...props,
      cognitiveEnabled: false
    };
  }
}

/**
 * React component props for cognitive-enhanced lessons
 */
export interface CognitiveLessonProps {
  lesson: any;
  insights?: LessonInsights;
  showComplexity?: boolean;
  showAttentionHotspots?: boolean;
  showRecommendations?: boolean;
  showDiagrams?: boolean;
}

/**
 * Utility for cognitive-aware navigation
 */
export function createCognitiveNavigation(
  lessons: any[],
  insights: LessonInsights[]
) {
  return lessons.map((lesson, index) => {
    const lessonInsights = insights[index];
    
    return {
      ...lesson,
      cognitiveMetadata: {
        complexity: lessonInsights?.complexityScore || 0,
        cognitiveLoad: lessonInsights?.cognitiveLoad || 0,
        estimatedTime: lessonInsights?.learningPaths[0]?.estimatedTime || 10,
        difficulty: lessonInsights?.learningPaths[0]?.difficulty || 1,
        recommendations: lessonInsights?.recommendations?.length || 0
      }
    };
  });
}

/**
 * Development helper for cognitive system status
 */
export function getCognitiveSystemStatus(
  cognitiveSystem?: TutorialKitCognitiveIntegration
): {
  enabled: boolean;
  cacheSize: number;
  memoryUsage: number;
  nodeCount: number;
  kernelCount: number;
} {
  if (!cognitiveSystem) {
    return {
      enabled: false,
      cacheSize: 0,
      memoryUsage: 0,
      nodeCount: 0,
      kernelCount: 0
    };
  }
  
  const cacheStats = cognitiveSystem.getCacheStats();
  const tensorNetwork = cognitiveSystem.getTensorNetwork();
  
  return {
    enabled: true,
    cacheSize: cacheStats.size,
    memoryUsage: cacheStats.memoryUsage,
    nodeCount: tensorNetwork.registry.nodes.size,
    kernelCount: tensorNetwork.registry.kernels.size
  };
}