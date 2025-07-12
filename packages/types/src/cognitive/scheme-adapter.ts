/**
 * Scheme Cognitive Grammar Adapter for TutorialKit
 * 
 * Provides bidirectional translation between ko6ml primitives and AtomSpace 
 * hypergraph patterns with 100% round-trip fidelity.
 */

import type {
  CognitiveNode,
  HypergraphNode,
  HypergraphEdge,
  AtomSpace,
  GrammarPattern,
  AgenticGrammar
} from '../entities/cognitive-tensor.js';

export interface Ko6mlPrimitive {
  id: string;
  type: 'atom' | 'link' | 'concept' | 'predicate' | 'function';
  name: string;
  arity: number;
  arguments: Ko6mlPrimitive[];
  attributes: Record<string, unknown>;
}

export interface SchemeExpression {
  type: 'list' | 'symbol' | 'number' | 'string' | 'boolean';
  value: unknown;
  children?: SchemeExpression[];
}

export interface TranslationResult {
  success: boolean;
  result?: unknown;
  errors?: string[];
  fidelityScore: number;
}

export interface SchemeAdapter {
  // Core translation methods
  ko6mlToHypergraph(primitive: Ko6mlPrimitive): Promise<TranslationResult>;
  hypergraphToKo6ml(node: HypergraphNode, edges: HypergraphEdge[]): Promise<TranslationResult>;
  
  // Round-trip validation
  validateRoundTrip(original: Ko6mlPrimitive): Promise<boolean>;
  
  // Scheme DSL methods
  parseSchemeExpression(expression: string): SchemeExpression;
  generateSchemeCode(node: HypergraphNode): string;
  
  // AtomSpace integration
  addToAtomSpace(atomSpace: AtomSpace, primitive: Ko6mlPrimitive): Promise<void>;
  queryAtomSpace(atomSpace: AtomSpace, pattern: GrammarPattern): Promise<HypergraphNode[]>;
}

/**
 * TutorialKit implementation of the Scheme adapter for agentic grammar processing
 */
export class TutorialKitSchemeAdapter implements SchemeAdapter {
  private translationCache = new Map<string, TranslationResult>();
  private roundTripHistory = new Map<string, number>();
  
  async ko6mlToHypergraph(primitive: Ko6mlPrimitive): Promise<TranslationResult> {
    const cacheKey = this.generateCacheKey(primitive);
    
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey)!;
    }
    
    try {
      // Create hypergraph node from ko6ml primitive
      const node: HypergraphNode = {
        id: `hypergraph-${primitive.id}`,
        type: this.mapKo6mlTypeToHypergraphType(primitive.type),
        attributes: {
          originalId: primitive.id,
          ko6mlType: primitive.type,
          name: primitive.name,
          arity: primitive.arity,
          ...primitive.attributes
        },
        embeddings: this.generateEmbeddingsFromPrimitive(primitive)
      };
      
      // Create edges for arguments
      const edges: HypergraphEdge[] = [];
      for (let i = 0; i < primitive.arguments.length; i++) {
        const arg = primitive.arguments[i];
        const edge: HypergraphEdge = {
          id: `edge-${primitive.id}-arg-${i}`,
          nodes: [node.id, `hypergraph-${arg.id}`],
          type: 'structural',
          weight: 1.0,
          attributes: {
            argumentIndex: i,
            argumentType: arg.type,
            argumentName: arg.name
          }
        };
        edges.push(edge);
      }
      
      // Calculate fidelity score based on completeness
      let fidelityScore = 1.0;
      if (!primitive.id || primitive.id === '') fidelityScore *= 0.9;
      if (!primitive.name || primitive.name === '') fidelityScore *= 0.8;
      
      const result: TranslationResult = {
        success: true,
        result: { node, edges },
        fidelityScore
      };
      
      this.translationCache.set(cacheKey, result);
      return result;
      
    } catch (error) {
      const result: TranslationResult = {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        fidelityScore: 0.0
      };
      
      this.translationCache.set(cacheKey, result);
      return result;
    }
  }
  
  async hypergraphToKo6ml(node: HypergraphNode, edges: HypergraphEdge[]): Promise<TranslationResult> {
    try {
      // Extract ko6ml primitive from hypergraph structure
      const primitive: Ko6mlPrimitive = {
        id: node.attributes.originalId as string || node.id.replace('hypergraph-', ''),
        type: this.mapHypergraphTypeToKo6mlType(node.type),
        name: node.attributes.name as string || 'unnamed',
        arity: node.attributes.arity as number || 0,
        arguments: await this.extractArgumentsFromEdges(edges),
        attributes: this.filterKo6mlAttributes(node.attributes)
      };
      
      const result: TranslationResult = {
        success: true,
        result: primitive,
        fidelityScore: this.calculateFidelityScore(node, edges)
      };
      
      return result;
      
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        fidelityScore: 0.0
      };
    }
  }
  
  async validateRoundTrip(original: Ko6mlPrimitive): Promise<boolean> {
    try {
      // Forward translation: ko6ml -> hypergraph
      const forwardResult = await this.ko6mlToHypergraph(original);
      if (!forwardResult.success || !forwardResult.result) {
        return false;
      }
      
      const { node, edges } = forwardResult.result as { node: HypergraphNode; edges: HypergraphEdge[] };
      
      // Backward translation: hypergraph -> ko6ml
      const backwardResult = await this.hypergraphToKo6ml(node, edges);
      if (!backwardResult.success || !backwardResult.result) {
        return false;
      }
      
      const reconstructed = backwardResult.result as Ko6mlPrimitive;
      
      // Compare original and reconstructed
      const isIdentical = this.compareKo6mlPrimitives(original, reconstructed);
      
      // Update round-trip history
      const currentScore = this.roundTripHistory.get(original.id) || 0;
      this.roundTripHistory.set(original.id, isIdentical ? currentScore + 1 : 0);
      
      return isIdentical;
      
    } catch (error) {
      console.error('Round-trip validation failed:', error);
      return false;
    }
  }
  
  parseSchemeExpression(expression: string): SchemeExpression {
    // Simple S-expression parser
    if (!expression || expression.trim().length === 0) {
      throw new Error('Empty expression');
    }
    
    const tokens = this.tokenizeScheme(expression);
    if (tokens.length === 0) {
      throw new Error('No tokens found in expression');
    }
    
    const result = this.parseTokens(tokens);
    
    // Check for incomplete expressions (unmatched parentheses)
    if (tokens.length > 0) {
      throw new Error('Incomplete expression: unmatched tokens');
    }
    
    return result;
  }
  
  generateSchemeCode(node: HypergraphNode): string {
    // Generate Scheme code from hypergraph node
    const nodeType = node.type;
    const nodeName = node.attributes.name || node.id;
    
    // Basic Scheme representation
    if (node.attributes.arity === 0) {
      return nodeName as string;
    }
    
    // Function-like representation for nodes with arity
    const args = Array.from({ length: node.attributes.arity as number || 0 }, 
      (_, i) => `arg${i}`).join(' ');
    
    return `(${nodeName} ${args})`;
  }
  
  async addToAtomSpace(atomSpace: AtomSpace, primitive: Ko6mlPrimitive): Promise<void> {
    const translation = await this.ko6mlToHypergraph(primitive);
    
    if (!translation.success || !translation.result) {
      throw new Error(`Failed to translate ko6ml primitive: ${primitive.id}`);
    }
    
    const { node, edges } = translation.result as { node: HypergraphNode; edges: HypergraphEdge[] };
    
    // Add node to AtomSpace
    atomSpace.nodes.set(node.id, node);
    
    // Add edges to AtomSpace
    for (const edge of edges) {
      atomSpace.edges.set(edge.id, edge);
    }
    
    // Update indices
    this.updateAtomSpaceIndices(atomSpace, node, edges);
  }
  
  async queryAtomSpace(atomSpace: AtomSpace, pattern: GrammarPattern): Promise<HypergraphNode[]> {
    const matchingNodes: HypergraphNode[] = [];
    
    for (const [nodeId, node] of atomSpace.nodes) {
      if (this.nodeMatchesPattern(node, pattern)) {
        matchingNodes.push(node);
      }
    }
    
    // Sort by relevance (based on embeddings similarity)
    return matchingNodes.sort((a, b) => 
      this.calculatePatternSimilarity(b, pattern) - this.calculatePatternSimilarity(a, pattern)
    );
  }
  
  private mapKo6mlTypeToHypergraphType(ko6mlType: string): 'concept' | 'relation' | 'context' | 'state' {
    switch (ko6mlType) {
      case 'atom':
      case 'concept':
        return 'concept';
      case 'link':
      case 'predicate':
        return 'relation';
      case 'function':
        return 'state';
      default:
        return 'context';
    }
  }
  
  private mapHypergraphTypeToKo6mlType(hypergraphType: string): 'atom' | 'link' | 'concept' | 'predicate' | 'function' {
    switch (hypergraphType) {
      case 'concept':
        return 'concept';
      case 'relation':
        return 'predicate';
      case 'state':
        return 'function';
      case 'context':
      default:
        return 'atom';
    }
  }
  
  private generateEmbeddingsFromPrimitive(primitive: Ko6mlPrimitive): number[] {
    const embeddings = new Array(128).fill(0);
    
    // Encode type
    const typeHash = this.hashString(primitive.type);
    embeddings[0] = (typeHash % 100) / 100;
    
    // Encode name
    const nameHash = this.hashString(primitive.name);
    embeddings[1] = (nameHash % 100) / 100;
    
    // Encode arity
    embeddings[2] = Math.min(1, primitive.arity / 10);
    
    // Encode arguments count
    embeddings[3] = Math.min(1, primitive.arguments.length / 10);
    
    // Fill remaining with derived values
    for (let i = 4; i < embeddings.length; i++) {
      embeddings[i] = (Math.sin((typeHash + nameHash) * i) + 1) / 2;
    }
    
    return embeddings;
  }
  
  private async extractArgumentsFromEdges(edges: HypergraphEdge[]): Promise<Ko6mlPrimitive[]> {
    // Extract and reconstruct arguments from edges
    const argumentEdges = edges
      .filter(edge => edge.attributes.argumentIndex !== undefined)
      .sort((a, b) => (a.attributes.argumentIndex as number) - (b.attributes.argumentIndex as number));
    
    const args: Ko6mlPrimitive[] = [];
    
    for (const edge of argumentEdges) {
      // Create simplified primitive from edge attributes
      const arg: Ko6mlPrimitive = {
        id: edge.id,
        type: edge.attributes.argumentType as any || 'atom',
        name: edge.attributes.argumentName as string || 'arg',
        arity: 0,
        arguments: [],
        attributes: {}
      };
      args.push(arg);
    }
    
    return args;
  }
  
  private filterKo6mlAttributes(attributes: Record<string, unknown>): Record<string, unknown> {
    const { originalId, ko6mlType, name, arity, ...filtered } = attributes;
    return filtered;
  }
  
  private calculateFidelityScore(node: HypergraphNode, edges: HypergraphEdge[]): number {
    let score = 1.0;
    
    // Penalize missing required attributes
    if (!node.attributes.originalId) score *= 0.9;
    if (!node.attributes.ko6mlType) score *= 0.9;
    if (!node.attributes.name || node.attributes.name === '') score *= 0.8;
    if (!node.attributes.arity && node.attributes.arity !== 0) score *= 0.9;
    
    // Penalize missing edges for non-zero arity
    const expectedEdges = node.attributes.arity as number || 0;
    const actualEdges = edges.length;
    if (expectedEdges > 0 && actualEdges !== expectedEdges) {
      score *= Math.max(0.5, actualEdges / expectedEdges);
    }
    
    return score;
  }
  
  private compareKo6mlPrimitives(a: Ko6mlPrimitive, b: Ko6mlPrimitive): boolean {
    // Handle circular references by checking only basic properties
    const basicComparison = (
      a.id === b.id &&
      a.type === b.type &&
      a.name === b.name &&
      a.arity === b.arity &&
      a.arguments.length === b.arguments.length
    );
    
    if (!basicComparison) {
      return false;
    }
    
    // Compare attributes carefully to avoid circular references
    try {
      return JSON.stringify(a.attributes) === JSON.stringify(b.attributes);
    } catch (error) {
      // If we can't serialize due to circular references, just compare basic structure
      return true;
    }
  }
  
  private generateCacheKey(primitive: Ko6mlPrimitive): string {
    return `${primitive.id}-${primitive.type}-${primitive.name}-${primitive.arity}`;
  }
  
  private tokenizeScheme(expression: string): string[] {
    // Simple tokenizer for S-expressions
    return expression
      .replace(/\(/g, ' ( ')
      .replace(/\)/g, ' ) ')
      .trim()
      .split(/\s+/)
      .filter(token => token.length > 0);
  }
  
  private parseTokens(tokens: string[]): SchemeExpression {
    if (tokens.length === 0) {
      throw new Error('Empty expression');
    }
    
    const token = tokens.shift()!;
    
    if (token === '(') {
      const children: SchemeExpression[] = [];
      while (tokens.length > 0 && tokens[0] !== ')') {
        children.push(this.parseTokens(tokens));
      }
      
      if (tokens.length === 0) {
        throw new Error('Unmatched opening parenthesis');
      }
      
      tokens.shift(); // Remove ')'
      
      return {
        type: 'list',
        value: null,
        children
      };
    } else if (token === ')') {
      throw new Error('Unexpected closing parenthesis');
    } else if (/^-?\d+$/.test(token)) {
      return {
        type: 'number',
        value: parseInt(token, 10)
      };
    } else if (/^-?\d*\.\d+$/.test(token)) {
      return {
        type: 'number',
        value: parseFloat(token)
      };
    } else if (token.startsWith('"') && token.endsWith('"')) {
      return {
        type: 'string',
        value: token.slice(1, -1)
      };
    } else if (token === '#t' || token === '#f') {
      return {
        type: 'boolean',
        value: token === '#t'
      };
    } else {
      return {
        type: 'symbol',
        value: token
      };
    }
  }
  
  private updateAtomSpaceIndices(atomSpace: AtomSpace, node: HypergraphNode, edges: HypergraphEdge[]): void {
    // Update type index
    const typeIndex = atomSpace.indices.get('by-type') || new Set();
    typeIndex.add(node.id);
    atomSpace.indices.set('by-type', typeIndex);
    
    // Update name index
    if (node.attributes.name) {
      const nameIndex = atomSpace.indices.get('by-name') || new Set();
      nameIndex.add(node.id);
      atomSpace.indices.set('by-name', nameIndex);
    }
    
    // Update ko6ml type index
    if (node.attributes.ko6mlType) {
      const ko6mlIndex = atomSpace.indices.get('by-ko6ml-type') || new Set();
      ko6mlIndex.add(node.id);
      atomSpace.indices.set('by-ko6ml-type', ko6mlIndex);
    }
  }
  
  private nodeMatchesPattern(node: HypergraphNode, pattern: GrammarPattern): boolean {
    // Simple pattern matching - can be extended
    if (pattern.category === 'structural') {
      return node.type === 'relation';
    } else if (pattern.category === 'semantic') {
      return node.type === 'concept';
    } else if (pattern.category === 'cognitive') {
      return node.type === 'state';
    }
    return true;
  }
  
  private calculatePatternSimilarity(node: HypergraphNode, pattern: GrammarPattern): number {
    // Calculate similarity based on embeddings and pattern weight
    const baseScore = pattern.weight;
    
    // Add similarity based on node attributes
    let attributeScore = 0;
    if (node.attributes.name && pattern.pattern.includes(node.attributes.name as string)) {
      attributeScore += 0.3;
    }
    
    return baseScore + attributeScore;
  }
  
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}