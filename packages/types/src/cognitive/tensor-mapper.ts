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
    const inputDim = node.arity;
    const outputDim = Math.max(1, Math.floor(node.complexity));
    const stateDim = node.connections.length;
    const adaptationDim = this.calculateAdaptationChannels(node);
    
    return [inputDim, outputDim, stateDim, adaptationDim];
  }
  
  private calculateChapterShape(node: CognitiveNode): number[] {
    const inputDim = node.arity;
    const outputDim = Math.max(1, Math.floor(node.complexity / 2));
    const contextDim = Math.max(1, node.connections.length);
    
    return [inputDim, outputDim, contextDim];
  }
  
  private calculatePartShape(node: CognitiveNode): number[] {
    const inputDim = node.arity;
    const outputDim = Math.max(1, Math.floor(node.complexity / 3));
    
    return [inputDim, outputDim];
  }
  
  private calculateModuleShape(node: CognitiveNode): number[] {
    const dimensions = Math.max(2, Math.floor(Math.sqrt(node.arity * node.complexity)));
    return [dimensions, dimensions];
  }
  
  private calculateComponentShape(node: CognitiveNode): number[] {
    const inputDim = Math.max(1, node.arity);
    const outputDim = Math.max(1, Math.floor(node.complexity));
    
    return [inputDim, outputDim];
  }
  
  private calculateFunctionShape(node: CognitiveNode): number[] {
    const inputDim = node.arity;
    const outputDim = 1;
    const paramDim = Math.max(1, Math.floor(node.complexity));
    
    return [inputDim, outputDim, paramDim];
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