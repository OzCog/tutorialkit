import type { CognitiveNode, TensorKernel, TensorKernelMapper, TensorOperation } from '../entities/cognitive-tensor.js';

/**
 * Tensor Kernel Mapping System for TutorialKit
 * 
 * Maps cognitive nodes to GGML tensor kernels with optimized shapes
 * based on prime factorization and complexity analysis.
 */

export class TutorialKitTensorKernelMapper implements TensorKernelMapper {
  private kernelRegistry = new Map<string, TensorKernel>();
  private shapeCache = new Map<string, number[]>();
  
  async mapNodeToKernel(node: CognitiveNode): Promise<TensorKernel> {
    const shape = this.calculateOptimalShape(node);
    const dtype = this.selectDataType(node);
    const operations = this.generateOperations(node);
    const data = this.initializeKernelData(shape, dtype);
    
    const kernel: TensorKernel = {
      id: `kernel-${node.id}`,
      nodeId: node.id,
      shape,
      dtype,
      data,
      operations
    };
    
    this.kernelRegistry.set(kernel.id, kernel);
    return kernel;
  }
  
  optimizeKernelShapes(kernels: TensorKernel[]): TensorKernel[] {
    const optimizedKernels: TensorKernel[] = [];
    
    for (const kernel of kernels) {
      const optimizedKernel = { ...kernel };
      
      // Apply prime factorization optimization
      optimizedKernel.shape = this.optimizeShapeWithPrimeFactorization(kernel.shape);
      
      // Apply memory alignment optimization
      optimizedKernel.shape = this.applyMemoryAlignment(optimizedKernel.shape);
      
      // Recompute data buffer if shape changed
      if (!this.arraysEqual(kernel.shape, optimizedKernel.shape)) {
        optimizedKernel.data = this.initializeKernelData(optimizedKernel.shape, kernel.dtype);
      }
      
      optimizedKernels.push(optimizedKernel);
    }
    
    return optimizedKernels;
  }
  
  registerKernel(kernel: TensorKernel): void {
    this.kernelRegistry.set(kernel.id, kernel);
  }
  
  getKernel(id: string): TensorKernel | undefined {
    return this.kernelRegistry.get(id);
  }
  
  getAllKernels(): TensorKernel[] {
    return Array.from(this.kernelRegistry.values());
  }
  
  private calculateOptimalShape(node: CognitiveNode): number[] {
    const cacheKey = `${node.id}-${node.complexity}-${node.arity}`;
    
    if (this.shapeCache.has(cacheKey)) {
      return this.shapeCache.get(cacheKey)!;
    }
    
    let shape: number[];
    
    switch (node.type) {
      case 'lesson':
        shape = this.calculateLessonShape(node);
        break;
      case 'chapter':
        shape = this.calculateChapterShape(node);
        break;
      case 'part':
        shape = this.calculatePartShape(node);
        break;
      case 'module':
        shape = this.calculateModuleShape(node);
        break;
      case 'component':
        shape = this.calculateComponentShape(node);
        break;
      case 'function':
        shape = this.calculateFunctionShape(node);
        break;
      default:
        shape = [1, 1];
    }
    
    this.shapeCache.set(cacheKey, shape);
    return shape;
  }
  
  private calculateLessonShape(node: CognitiveNode): number[] {
    // Enhanced 5-dimensional cognitive tensor format: [modality, depth, context, salience, autonomy_index]
    const modality = this.calculateModalityDimension(node);
    const depth = this.calculateDepthDimension(node);
    const context = this.calculateContextDimension(node);
    const salience = this.calculateSalienceDimension(node);
    const autonomyIndex = this.calculateAutonomyIndexDimension(node);
    
    return [modality, depth, context, salience, autonomyIndex];
  }
  
  private calculateChapterShape(node: CognitiveNode): number[] {
    // Enhanced 5-dimensional cognitive tensor format for chapters
    const modality = this.calculateModalityDimension(node);
    const depth = Math.max(1, Math.floor(this.calculateDepthDimension(node) * 0.8)); // Reduced depth for chapters
    const context = this.calculateContextDimension(node);
    const salience = this.calculateSalienceDimension(node);
    const autonomyIndex = this.calculateAutonomyIndexDimension(node);
    
    return [modality, depth, context, salience, autonomyIndex];
  }
  
  private calculatePartShape(node: CognitiveNode): number[] {
    // Enhanced 5-dimensional cognitive tensor format for parts
    const modality = this.calculateModalityDimension(node);
    const depth = Math.max(1, Math.floor(this.calculateDepthDimension(node) * 0.6)); // Reduced depth for parts
    const context = this.calculateContextDimension(node);
    const salience = this.calculateSalienceDimension(node);
    const autonomyIndex = this.calculateAutonomyIndexDimension(node);
    
    return [modality, depth, context, salience, autonomyIndex];
  }
  
  private calculateModuleShape(node: CognitiveNode): number[] {
    // Enhanced 5-dimensional cognitive tensor format for modules
    const modality = this.calculateModalityDimension(node);
    const depth = this.calculateDepthDimension(node);
    const context = this.calculateContextDimension(node);
    const salience = this.calculateSalienceDimension(node);
    const autonomyIndex = this.calculateAutonomyIndexDimension(node);
    
    return [modality, depth, context, salience, autonomyIndex];
  }
  
  private calculateComponentShape(node: CognitiveNode): number[] {
    // Enhanced 5-dimensional cognitive tensor format for components
    const modality = this.calculateModalityDimension(node);
    const depth = this.calculateDepthDimension(node);
    const context = this.calculateContextDimension(node);
    const salience = this.calculateSalienceDimension(node);
    const autonomyIndex = this.calculateAutonomyIndexDimension(node);
    
    return [modality, depth, context, salience, autonomyIndex];
  }
  
  private calculateFunctionShape(node: CognitiveNode): number[] {
    // Enhanced 5-dimensional cognitive tensor format for functions
    const modality = this.calculateModalityDimension(node);
    const depth = this.calculateDepthDimension(node);
    const context = this.calculateContextDimension(node);
    const salience = this.calculateSalienceDimension(node);
    const autonomyIndex = this.calculateAutonomyIndexDimension(node);
    
    return [modality, depth, context, salience, autonomyIndex];
  }
  
  private calculateAdaptationChannels(node: CognitiveNode): number {
    let channels = 1;
    
    // Add channels based on metadata complexity
    if (node.metadata.data) {
      channels += Object.keys(node.metadata.data).length;
    }
    
    // Add channels based on node connections
    channels += Math.min(4, node.connections.length);
    
    return channels;
  }
  
  /**
   * Calculate modality dimension based on node type and input characteristics
   * Represents different modes of cognitive processing (visual, textual, interactive, etc.)
   */
  private calculateModalityDimension(node: CognitiveNode): number {
    let modality = 1; // Base modality
    
    // Increase modality based on node type
    switch (node.type) {
      case 'lesson':
        modality = 4; // Lessons can have multiple modalities (text, code, output, interaction)
        break;
      case 'chapter':
        modality = 3; // Chapters have structural and content modalities
        break;
      case 'part':
        modality = 2; // Parts have structural modality
        break;
      case 'module':
        modality = 3; // Modules have code and documentation modalities
        break;
      case 'component':
        modality = 2; // Components have code and interface modalities
        break;
      case 'function':
        modality = 1; // Functions have primarily code modality
        break;
    }
    
    // Adjust based on metadata complexity
    if (node.metadata.data) {
      const dataKeys = Object.keys(node.metadata.data);
      if (dataKeys.includes('mainCommand')) modality += 1; // Interactive modality
      if (dataKeys.includes('prepareCommands')) modality += 1; // Setup modality
      if (dataKeys.includes('focus')) modality += 1; // Focus modality
    }
    
    return Math.max(1, Math.min(8, modality)); // Clamp between 1 and 8
  }
  
  /**
   * Calculate depth dimension based on complexity and hierarchical position
   * Represents the cognitive processing depth required
   */
  private calculateDepthDimension(node: CognitiveNode): number {
    let depth = Math.max(1, Math.floor(node.complexity));
    
    // Adjust depth based on node type hierarchy
    switch (node.type) {
      case 'part':
        depth = Math.max(depth, 4); // Parts are at the top level
        break;
      case 'chapter':
        depth = Math.max(depth, 3); // Chapters are mid-level
        break;
      case 'lesson':
        depth = Math.max(depth, 2); // Lessons are detailed level
        break;
      case 'module':
        depth = Math.max(depth, 3); // Modules are complex
        break;
      case 'component':
        depth = Math.max(depth, 2); // Components are moderate
        break;
      case 'function':
        depth = Math.max(depth, 1); // Functions are atomic
        break;
    }
    
    // Adjust based on connection complexity
    depth += Math.floor(node.connections.length / 3);
    
    return Math.max(1, Math.min(16, depth)); // Clamp between 1 and 16
  }
  
  /**
   * Calculate context dimension based on connections and environmental factors
   * Represents the contextual information required for processing
   */
  private calculateContextDimension(node: CognitiveNode): number {
    let context = Math.max(1, node.connections.length);
    
    // Adjust based on node arity (input complexity)
    context += node.arity;
    
    // Adjust based on metadata richness
    if (node.metadata.data) {
      context += Object.keys(node.metadata.data).length;
    }
    
    // Add contextual factors for specific node types
    switch (node.type) {
      case 'lesson':
        context += 2; // Lessons need pedagogical context
        break;
      case 'chapter':
        context += 1; // Chapters need structural context
        break;
      case 'part':
        context += 1; // Parts need organizational context
        break;
    }
    
    return Math.max(1, Math.min(12, context)); // Clamp between 1 and 12
  }
  
  /**
   * Calculate salience dimension based on importance and attention requirements
   * Represents how much cognitive attention this node should receive
   */
  private calculateSalienceDimension(node: CognitiveNode): number {
    let salience = Math.max(1, Math.floor(node.complexity / 2));
    
    // Increase salience for critical node types
    switch (node.type) {
      case 'lesson':
        salience += 3; // Lessons are highly salient for learning
        break;
      case 'chapter':
        salience += 2; // Chapters are important for structure
        break;
      case 'part':
        salience += 1; // Parts provide organization
        break;
      case 'function':
        salience += 1; // Functions are specific and important
        break;
    }
    
    // Adjust based on connections (well-connected nodes are more salient)
    salience += Math.floor(node.connections.length / 2);
    
    // Adjust based on metadata indicators
    if (node.metadata.data) {
      const data = node.metadata.data as any;
      if (data.mainCommand) salience += 1; // Executable content is more salient
      if (data.focus) salience += 1; // Focused content is more salient
    }
    
    return Math.max(1, Math.min(10, salience)); // Clamp between 1 and 10
  }
  
  /**
   * Calculate autonomy index based on self-sufficiency and independence
   * Represents how autonomously this node can be processed
   */
  private calculateAutonomyIndexDimension(node: CognitiveNode): number {
    let autonomy = 1; // Base autonomy
    
    // Decrease autonomy based on dependencies (connections)
    autonomy += Math.max(0, 5 - node.connections.length);
    
    // Adjust based on node type
    switch (node.type) {
      case 'function':
        autonomy += 2; // Functions are typically autonomous
        break;
      case 'component':
        autonomy += 1; // Components have some autonomy
        break;
      case 'module':
        autonomy += 1; // Modules are somewhat autonomous
        break;
      case 'lesson':
        autonomy -= 1; // Lessons depend on context
        break;
      case 'chapter':
        autonomy -= 2; // Chapters are highly dependent on structure
        break;
      case 'part':
        autonomy -= 2; // Parts are organizational and dependent
        break;
    }
    
    // Adjust based on metadata self-sufficiency
    if (node.metadata.data) {
      const data = node.metadata.data as any;
      if (data.prepareCommands && data.prepareCommands.length > 0) {
        autonomy += 1; // Self-setup increases autonomy
      }
      if (data.mainCommand) {
        autonomy += 1; // Self-execution increases autonomy
      }
    }
    
    return Math.max(1, Math.min(8, autonomy)); // Clamp between 1 and 8
  }
  
  private selectDataType(node: CognitiveNode): 'float32' | 'float64' | 'int32' | 'int64' {
    // High complexity nodes use higher precision
    if (node.complexity > 10) {
      return 'float64';
    }
    
    // Integer operations for discrete components
    if (node.type === 'function' || node.type === 'component') {
      return 'int32';
    }
    
    // Default to float32 for most operations
    return 'float32';
  }
  
  private generateOperations(node: CognitiveNode): TensorOperation[] {
    const operations: TensorOperation[] = [];
    
    // Add embedding operation for all nodes
    operations.push({
      id: `embed-${node.id}`,
      type: 'embedding',
      inputs: ['input'],
      outputs: ['embedded'],
      parameters: {
        embeddingDim: this.calculateEmbeddingDim(node),
        vocabSize: 1000 // Default vocabulary size
      }
    });
    
    // Add attention operation for complex nodes
    if (node.complexity > 3) {
      operations.push({
        id: `attention-${node.id}`,
        type: 'attention',
        inputs: ['embedded'],
        outputs: ['attended'],
        parameters: {
          numHeads: Math.min(8, Math.max(1, Math.floor(node.complexity / 2))),
          headDim: 64
        }
      });
    }
    
    // Add matrix multiplication for connected nodes
    if (node.connections.length > 0) {
      operations.push({
        id: `matmul-${node.id}`,
        type: 'matmul',
        inputs: ['attended', 'weights'],
        outputs: ['transformed'],
        parameters: {
          transposeA: false,
          transposeB: true
        }
      });
    }
    
    // Add activation function
    operations.push({
      id: `activation-${node.id}`,
      type: 'activation',
      inputs: ['transformed'],
      outputs: ['activated'],
      parameters: {
        function: this.selectActivationFunction(node)
      }
    });
    
    return operations;
  }
  
  private calculateEmbeddingDim(node: CognitiveNode): number {
    return Math.max(32, Math.min(512, Math.floor(node.complexity * 16)));
  }
  
  private selectActivationFunction(node: CognitiveNode): string {
    switch (node.type) {
      case 'lesson':
        return 'relu';
      case 'chapter':
        return 'gelu';
      case 'part':
        return 'tanh';
      case 'function':
        return 'sigmoid';
      default:
        return 'relu';
    }
  }
  
  private optimizeShapeWithPrimeFactorization(shape: number[]): number[] {
    return shape.map(dim => this.findOptimalDimension(dim));
  }
  
  private findOptimalDimension(dim: number): number {
    // Find the closest power of 2 or product of small primes
    const powerOf2 = Math.pow(2, Math.round(Math.log2(dim)));
    const primeFactors = this.getSmallPrimeFactorization(dim);
    
    // Choose the more efficient representation
    if (Math.abs(powerOf2 - dim) < Math.abs(primeFactors - dim)) {
      return powerOf2;
    }
    
    return primeFactors;
  }
  
  private getSmallPrimeFactorization(n: number): number {
    const primes = [2, 3, 5, 7, 11, 13];
    let result = 1;
    let remaining = n;
    
    for (const prime of primes) {
      while (remaining % prime === 0) {
        result *= prime;
        remaining /= prime;
      }
    }
    
    // If there's a remainder, multiply by the closest small prime
    if (remaining > 1) {
      result *= primes.find(p => p >= remaining) || primes[primes.length - 1];
    }
    
    return result;
  }
  
  private applyMemoryAlignment(shape: number[]): number[] {
    // Align dimensions to multiples of 8 for better memory access
    return shape.map(dim => Math.ceil(dim / 8) * 8);
  }
  
  private initializeKernelData(shape: number[], dtype: string): ArrayBuffer {
    const elementSize = this.getElementSize(dtype);
    const totalElements = shape.reduce((acc, dim) => acc * dim, 1);
    const buffer = new ArrayBuffer(totalElements * elementSize);
    
    // Initialize with small random values
    const view = this.getTypedArrayView(buffer, dtype);
    for (let i = 0; i < view.length; i++) {
      view[i] = (Math.random() - 0.5) * 0.1;
    }
    
    return buffer;
  }
  
  private getElementSize(dtype: string): number {
    switch (dtype) {
      case 'float32': return 4;
      case 'float64': return 8;
      case 'int32': return 4;
      case 'int64': return 8;
      default: return 4;
    }
  }
  
  private getTypedArrayView(buffer: ArrayBuffer, dtype: string): Float32Array | Float64Array | Int32Array | BigInt64Array {
    switch (dtype) {
      case 'float32': return new Float32Array(buffer);
      case 'float64': return new Float64Array(buffer);
      case 'int32': return new Int32Array(buffer);
      case 'int64': return new BigInt64Array(buffer);
      default: return new Float32Array(buffer);
    }
  }
  
  private arraysEqual(a: number[], b: number[]): boolean {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }
}