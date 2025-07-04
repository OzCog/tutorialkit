import type { Lesson, Chapter, Part, Tutorial } from '../entities/index.js';
import type { CognitiveNode, CognitiveExtractor } from '../entities/cognitive-tensor.js';

/**
 * Cognitive Extraction Layer for TutorialKit
 * 
 * This module extracts cognitive elements from TutorialKit components
 * and represents them as cognitive nodes for tensor processing.
 */

export class TutorialKitCognitiveExtractor implements CognitiveExtractor {
  private complexityCache = new Map<string, number>();
  
  async extractNodes(source: unknown): Promise<CognitiveNode[]> {
    const nodes: CognitiveNode[] = [];
    
    if (this.isTutorial(source)) {
      nodes.push(...await this.extractTutorialNodes(source));
    } else if (this.isLesson(source)) {
      nodes.push(...await this.extractLessonNodes(source));
    } else if (this.isChapter(source)) {
      nodes.push(...await this.extractChapterNodes(source));
    } else if (this.isPart(source)) {
      nodes.push(...await this.extractPartNodes(source));
    }
    
    return nodes;
  }
  
  async extractTutorialNodes(tutorial: Tutorial): Promise<CognitiveNode[]> {
    const nodes: CognitiveNode[] = [];
    
    // Extract tutorial-level cognitive node
    const tutorialNode: CognitiveNode = {
      id: `tutorial-root`,
      type: 'module',
      name: 'Tutorial Root',
      arity: Object.keys(tutorial.parts).length,
      complexity: this.calculateTutorialComplexity(tutorial),
      metadata: {
        partCount: Object.keys(tutorial.parts).length,
        lessonCount: tutorial.lessons.length,
        logoLink: tutorial.logoLink
      },
      connections: Object.keys(tutorial.parts).map(partId => `part-${partId}`)
    };
    
    nodes.push(tutorialNode);
    
    // Extract part nodes
    for (const part of Object.values(tutorial.parts)) {
      nodes.push(...await this.extractPartNodes(part));
    }
    
    // Extract lesson nodes
    for (const lesson of tutorial.lessons) {
      nodes.push(...await this.extractLessonNodes(lesson));
    }
    
    return nodes;
  }
  
  async extractPartNodes(part: Part): Promise<CognitiveNode[]> {
    const nodes: CognitiveNode[] = [];
    
    const partNode: CognitiveNode = {
      id: `part-${part.id}`,
      type: 'part',
      name: part.data.title || part.id,
      arity: Object.keys(part.chapters).length,
      complexity: this.calculatePartComplexity(part),
      metadata: {
        slug: part.slug,
        order: part.order,
        chapterCount: Object.keys(part.chapters).length,
        data: part.data
      },
      connections: Object.keys(part.chapters).map(chapterId => `chapter-${chapterId}`)
    };
    
    nodes.push(partNode);
    
    // Extract chapter nodes
    for (const chapter of Object.values(part.chapters)) {
      nodes.push(...await this.extractChapterNodes(chapter));
    }
    
    return nodes;
  }
  
  async extractChapterNodes(chapter: Chapter): Promise<CognitiveNode[]> {
    const chapterNode: CognitiveNode = {
      id: `chapter-${chapter.id}`,
      type: 'chapter',
      name: chapter.data.title || chapter.id,
      arity: 1, // Chapters typically contain lessons
      complexity: this.calculateChapterComplexity(chapter),
      metadata: {
        slug: chapter.slug,
        order: chapter.order,
        data: chapter.data
      },
      connections: [] // Will be populated by lesson relationships
    };
    
    return [chapterNode];
  }
  
  async extractLessonNodes(lesson: Lesson): Promise<CognitiveNode[]> {
    const nodes: CognitiveNode[] = [];
    
    const lessonNode: CognitiveNode = {
      id: `lesson-${lesson.id}`,
      type: 'lesson',
      name: lesson.data.title || lesson.id,
      arity: this.calculateLessonArity(lesson),
      complexity: this.calculateLessonComplexity(lesson),
      metadata: {
        slug: lesson.slug,
        order: lesson.order,
        filepath: lesson.filepath,
        files: lesson.files,
        solution: lesson.solution,
        data: lesson.data,
        part: lesson.part,
        chapter: lesson.chapter
      },
      connections: this.extractLessonConnections(lesson)
    };
    
    nodes.push(lessonNode);
    
    // Extract component nodes from lesson content
    if (lesson.data.focus) {
      nodes.push(...this.extractFocusNodes(lesson.data.focus, lesson.id));
    }
    
    if (lesson.data.mainCommand) {
      nodes.push(...this.extractCommandNodes(lesson.data.mainCommand, lesson.id));
    }
    
    if (lesson.data.prepareCommands) {
      nodes.push(...this.extractPrepareCommandNodes(lesson.data.prepareCommands, lesson.id));
    }
    
    return nodes;
  }
  
  analyzeComplexity(node: CognitiveNode): number {
    if (this.complexityCache.has(node.id)) {
      return this.complexityCache.get(node.id)!;
    }
    
    let complexity = 0;
    
    // Base complexity from node type
    switch (node.type) {
      case 'lesson':
        complexity = 5;
        break;
      case 'chapter':
        complexity = 3;
        break;
      case 'part':
        complexity = 2;
        break;
      case 'module':
        complexity = 1;
        break;
      case 'component':
        complexity = 4;
        break;
      case 'function':
        complexity = 6;
        break;
    }
    
    // Add complexity based on arity
    complexity += Math.log2(node.arity + 1);
    
    // Add complexity based on connections
    complexity += Math.log2(node.connections.length + 1);
    
    // Add complexity based on metadata
    complexity += Object.keys(node.metadata).length * 0.1;
    
    this.complexityCache.set(node.id, complexity);
    return complexity;
  }
  
  buildConnectionGraph(nodes: CognitiveNode[]): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    
    for (const node of nodes) {
      graph.set(node.id, [...node.connections]);
    }
    
    // Add bidirectional connections based on hierarchy
    for (const node of nodes) {
      for (const connectionId of node.connections) {
        const targetConnections = graph.get(connectionId) || [];
        if (!targetConnections.includes(node.id)) {
          targetConnections.push(node.id);
          graph.set(connectionId, targetConnections);
        }
      }
    }
    
    return graph;
  }
  
  private isTutorial(source: unknown): source is Tutorial {
    return typeof source === 'object' && source !== null && 'parts' in source && 'lessons' in source;
  }
  
  private isLesson(source: unknown): source is Lesson {
    return typeof source === 'object' && source !== null && 'data' in source && 'slug' in source && 'files' in source;
  }
  
  private isChapter(source: unknown): source is Chapter {
    return typeof source === 'object' && source !== null && 'data' in source && 'slug' in source && !('files' in source);
  }
  
  private isPart(source: unknown): source is Part {
    return typeof source === 'object' && source !== null && 'chapters' in source && 'data' in source;
  }
  
  private calculateTutorialComplexity(tutorial: Tutorial): number {
    return Object.keys(tutorial.parts).length * 2 + tutorial.lessons.length * 1.5;
  }
  
  private calculatePartComplexity(part: Part): number {
    return Object.keys(part.chapters).length * 1.5 + part.order * 0.1;
  }
  
  private calculateChapterComplexity(chapter: Chapter): number {
    return chapter.order * 0.1 + (chapter.data.title?.length || 0) * 0.01;
  }
  
  private calculateLessonComplexity(lesson: Lesson): number {
    let complexity = lesson.order * 0.1;
    
    // Add complexity based on lesson data
    if (lesson.data.mainCommand) complexity += 2;
    if (lesson.data.prepareCommands) complexity += lesson.data.prepareCommands.length * 0.5;
    if (lesson.data.focus) complexity += 1;
    if (lesson.data.editor) complexity += 1;
    if (lesson.data.terminal) complexity += 1;
    if (lesson.data.previews && Array.isArray(lesson.data.previews)) {
      complexity += lesson.data.previews.length * 0.5;
    }
    
    return complexity;
  }
  
  private calculateLessonArity(lesson: Lesson): number {
    let arity = 1; // Base arity
    
    if (lesson.data.prepareCommands) arity += lesson.data.prepareCommands.length;
    if (lesson.data.previews && Array.isArray(lesson.data.previews)) {
      arity += lesson.data.previews.length;
    }
    if (lesson.files[1]) arity += lesson.files[1].length;
    
    return arity;
  }
  
  private extractLessonConnections(lesson: Lesson): string[] {
    const connections: string[] = [];
    
    if (lesson.part) {
      connections.push(`part-${lesson.part.id}`);
    }
    
    if (lesson.chapter) {
      connections.push(`chapter-${lesson.chapter.id}`);
    }
    
    if (lesson.next) {
      connections.push(`lesson-next-${lesson.next.href}`);
    }
    
    if (lesson.prev) {
      connections.push(`lesson-prev-${lesson.prev.href}`);
    }
    
    return connections;
  }
  
  private extractFocusNodes(focus: unknown, lessonId: string): CognitiveNode[] {
    if (typeof focus === 'string') {
      return [{
        id: `focus-${lessonId}-${focus}`,
        type: 'component',
        name: `Focus: ${focus}`,
        arity: 1,
        complexity: 2,
        metadata: { focus, lessonId },
        connections: [`lesson-${lessonId}`]
      }];
    }
    
    return [];
  }
  
  private extractCommandNodes(command: unknown, lessonId: string): CognitiveNode[] {
    if (typeof command === 'string') {
      return [{
        id: `command-${lessonId}-main`,
        type: 'function',
        name: `Command: ${command}`,
        arity: 1,
        complexity: 3,
        metadata: { command, lessonId, type: 'main' },
        connections: [`lesson-${lessonId}`]
      }];
    }
    
    return [];
  }
  
  private extractPrepareCommandNodes(commands: unknown, lessonId: string): CognitiveNode[] {
    if (Array.isArray(commands)) {
      return commands.map((command, index) => ({
        id: `command-${lessonId}-prepare-${index}`,
        type: 'function',
        name: `Prepare: ${command}`,
        arity: 1,
        complexity: 2,
        metadata: { command, lessonId, type: 'prepare', index },
        connections: [`lesson-${lessonId}`]
      }));
    }
    
    return [];
  }
}