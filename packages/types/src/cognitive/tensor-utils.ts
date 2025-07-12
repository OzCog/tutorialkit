/**
 * Tensor Fragment Utilities for TutorialKit Cognitive Architecture
 * 
 * Provides validation, serialization, and deserialization for the standardized
 * 5-dimensional cognitive tensor format: [modality, depth, context, salience, autonomy_index]
 */

import type { TensorKernel, CognitiveNode } from '../entities/cognitive-tensor.js';

export interface CognitiveTensorDimensions {
  modality: number;
  depth: number;
  context: number;
  salience: number;
  autonomyIndex: number;
}

export interface TensorValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  dimensions: CognitiveTensorDimensions;
}

export interface TensorSerializationOptions {
  includeMetadata: boolean;
  compressionLevel: 'none' | 'low' | 'medium' | 'high';
  format: 'binary' | 'json' | 'base64';
}

export interface SerializedTensor {
  kernelId: string;
  nodeId: string;
  dimensions: CognitiveTensorDimensions;
  dtype: string;
  data: string | ArrayBuffer;
  metadata: Record<string, unknown>;
  checksum: string;
  serializedAt: number;
}

export interface TensorPrimeFactorization {
  dimension: number;
  factors: number[];
  isPowerOfTwo: boolean;
  efficiency: number;
  recommendedSize: number;
}

/**
 * Tensor Fragment Validator and Serializer
 */
export class CognitiveTensorUtils {
  private static readonly VALID_DTYPES = ['float32', 'float64', 'int32', 'int64'];
  private static readonly DIMENSION_LIMITS = {
    modality: { min: 1, max: 8 },
    depth: { min: 1, max: 16 },
    context: { min: 1, max: 12 },
    salience: { min: 1, max: 10 },
    autonomyIndex: { min: 1, max: 8 }
  };

  /**
   * Validates that a tensor kernel conforms to the 5-dimensional cognitive format
   */
  static validateCognitiveTensorShape(kernel: TensorKernel): TensorValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check that shape has exactly 5 dimensions
    if (kernel.shape.length !== 5) {
      errors.push(`Invalid shape length: expected 5 dimensions, got ${kernel.shape.length}`);
      return {
        isValid: false,
        errors,
        warnings,
        dimensions: this.createEmptyDimensions()
      };
    }

    const [modality, depth, context, salience, autonomyIndex] = kernel.shape;
    const dimensions: CognitiveTensorDimensions = {
      modality,
      depth,
      context,
      salience,
      autonomyIndex
    };

    // Validate each dimension against limits
    this.validateDimension('modality', modality, errors, warnings);
    this.validateDimension('depth', depth, errors, warnings);
    this.validateDimension('context', context, errors, warnings);
    this.validateDimension('salience', salience, errors, warnings);
    this.validateDimension('autonomyIndex', autonomyIndex, errors, warnings);

    // Validate data type
    if (!this.VALID_DTYPES.includes(kernel.dtype)) {
      errors.push(`Invalid data type: ${kernel.dtype}. Must be one of: ${this.VALID_DTYPES.join(', ')}`);
    }

    // Validate data buffer size
    const expectedSize = this.calculateExpectedBufferSize(kernel.shape, kernel.dtype);
    if (kernel.data.byteLength !== expectedSize) {
      errors.push(`Data buffer size mismatch: expected ${expectedSize} bytes, got ${kernel.data.byteLength}`);
    }

    // Check for optimal dimension sizing
    this.checkDimensionEfficiency(dimensions, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      dimensions
    };
  }

  /**
   * Analyzes prime factorization for tensor dimensions to optimize memory access
   */
  static analyzePrimeFactorization(dimensions: CognitiveTensorDimensions): Record<string, TensorPrimeFactorization> {
    const results: Record<string, TensorPrimeFactorization> = {};

    for (const [name, value] of Object.entries(dimensions)) {
      results[name] = this.analyzeHuman(value);
    }

    return results;
  }

  /**
   * Serializes a tensor kernel to the specified format
   */
  static serializeTensor(
    kernel: TensorKernel,
    options: TensorSerializationOptions = {
      includeMetadata: true,
      compressionLevel: 'none',
      format: 'json'
    }
  ): SerializedTensor {
    const validation = this.validateCognitiveTensorShape(kernel);
    if (!validation.isValid) {
      throw new Error(`Cannot serialize invalid tensor: ${validation.errors.join(', ')}`);
    }

    let serializedData: string | ArrayBuffer;
    
    switch (options.format) {
      case 'binary':
        serializedData = this.compressData(kernel.data, options.compressionLevel);
        break;
      case 'base64':
        serializedData = this.arrayBufferToBase64(kernel.data);
        break;
      case 'json':
      default:
        serializedData = this.arrayBufferToBase64(kernel.data);
        break;
    }

    const metadata = options.includeMetadata ? {
      operations: kernel.operations,
      validation: validation,
      serialization: {
        options,
        timestamp: Date.now()
      }
    } : {};

    const serialized: SerializedTensor = {
      kernelId: kernel.id,
      nodeId: kernel.nodeId,
      dimensions: validation.dimensions,
      dtype: kernel.dtype,
      data: serializedData,
      metadata,
      checksum: this.calculateChecksum(kernel),
      serializedAt: Date.now()
    };

    return serialized;
  }

  /**
   * Deserializes a tensor kernel from serialized format
   */
  static deserializeTensor(serialized: SerializedTensor): TensorKernel {
    // Verify checksum
    const tempKernel = this.createKernelFromSerialized(serialized);
    const expectedChecksum = this.calculateChecksum(tempKernel);
    
    if (serialized.checksum !== expectedChecksum) {
      throw new Error('Tensor deserialization failed: checksum mismatch');
    }

    return tempKernel;
  }

  /**
   * Creates an optimized tensor shape based on cognitive requirements
   */
  static createOptimizedShape(
    node: CognitiveNode,
    targetComplexity: number = 1.0
  ): number[] {
    const baseShape = this.calculateBaseCognitiveShape(node);
    const optimized = this.optimizeForPrimeFactorization(baseShape);
    const scaled = this.scaleByComplexity(optimized, targetComplexity);
    
    return this.clampToDimensionLimits(scaled);
  }

  /**
   * Generates tensor fragment documentation for visual flowcharts
   */
  static generateTensorFlowchartData(kernel: TensorKernel): Record<string, unknown> {
    const validation = this.validateCognitiveTensorShape(kernel);
    const factorization = this.analyzePrimeFactorization(validation.dimensions);
    
    return {
      kernelId: kernel.id,
      nodeId: kernel.nodeId,
      shape: kernel.shape,
      dimensions: validation.dimensions,
      factorization,
      memoryUsage: kernel.data.byteLength,
      efficiency: this.calculateOverallEfficiency(factorization),
      operations: kernel.operations.map(op => ({
        id: op.id,
        type: op.type,
        inputCount: op.inputs.length,
        outputCount: op.outputs.length
      }))
    };
  }

  private static validateDimension(
    name: keyof typeof this.DIMENSION_LIMITS,
    value: number,
    errors: string[],
    warnings: string[]
  ): void {
    const limits = this.DIMENSION_LIMITS[name];
    
    if (value < limits.min) {
      errors.push(`${name} dimension too small: ${value} < ${limits.min}`);
    } else if (value > limits.max) {
      errors.push(`${name} dimension too large: ${value} > ${limits.max}`);
    }

    // Check for power-of-2 optimization opportunities
    if (!this.isPowerOfTwo(value) && value > 4) {
      const nearestPowerOf2 = Math.pow(2, Math.round(Math.log2(value)));
      warnings.push(`${name} dimension ${value} is not a power of 2. Consider ${nearestPowerOf2} for better performance.`);
    }
  }

  private static calculateExpectedBufferSize(shape: number[], dtype: string): number {
    const elementSize = this.getElementSize(dtype);
    const elementCount = shape.reduce((acc, dim) => acc * dim, 1);
    return elementCount * elementSize;
  }

  private static getElementSize(dtype: string): number {
    switch (dtype) {
      case 'float32': return 4;
      case 'float64': return 8;
      case 'int32': return 4;
      case 'int64': return 8;
      default: return 4;
    }
  }

  private static checkDimensionEfficiency(
    dimensions: CognitiveTensorDimensions,
    warnings: string[]
  ): void {
    const total = Object.values(dimensions).reduce((sum, val) => sum + val, 0);
    
    if (total > 40) {
      warnings.push('Total dimension size is quite large. Consider reducing complexity for better performance.');
    }

    // Check for imbalanced dimensions
    const values = Object.values(dimensions);
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    if (max / min > 8) {
      warnings.push('Dimension sizes are highly imbalanced. Consider more uniform sizing.');
    }
  }

  private static analyzeHuman(dimension: number): TensorPrimeFactorization {
    const factors = this.getPrimeFactors(dimension);
    const isPowerOfTwo = (dimension & (dimension - 1)) === 0 && dimension > 0;
    
    let efficiency = 1.0;
    if (isPowerOfTwo) {
      efficiency = 1.0;
    } else if (factors.every(f => f <= 7)) {
      efficiency = 0.8;
    } else {
      efficiency = 0.6;
    }

    const recommendedSize = isPowerOfTwo ? dimension : Math.pow(2, Math.round(Math.log2(dimension)));

    return {
      dimension,
      factors,
      isPowerOfTwo,
      efficiency,
      recommendedSize
    };
  }

  private static getPrimeFactors(n: number): number[] {
    const factors: number[] = [];
    let num = n;

    for (let i = 2; i <= Math.sqrt(num); i++) {
      while (num % i === 0) {
        factors.push(i);
        num /= i;
      }
    }

    if (num > 1) {
      factors.push(num);
    }

    return factors;
  }

  private static isPowerOfTwo(n: number): boolean {
    return (n & (n - 1)) === 0 && n > 0;
  }

  private static compressData(data: ArrayBuffer, level: string): ArrayBuffer {
    // Simple compression simulation - in practice would use real compression
    switch (level) {
      case 'high':
        return data.slice(0, Math.floor(data.byteLength * 0.7));
      case 'medium':
        return data.slice(0, Math.floor(data.byteLength * 0.8));
      case 'low':
        return data.slice(0, Math.floor(data.byteLength * 0.9));
      case 'none':
      default:
        return data;
    }
  }

  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private static calculateChecksum(kernel: TensorKernel): string {
    const data = new Uint8Array(kernel.data);
    let checksum = 0;
    
    for (let i = 0; i < data.length; i++) {
      checksum = ((checksum << 5) - checksum + data[i]) & 0xffffffff;
    }
    
    return checksum.toString(16);
  }

  private static createKernelFromSerialized(serialized: SerializedTensor): TensorKernel {
    let data: ArrayBuffer;
    
    if (typeof serialized.data === 'string') {
      data = this.base64ToArrayBuffer(serialized.data);
    } else {
      data = serialized.data;
    }

    const shape = [
      serialized.dimensions.modality,
      serialized.dimensions.depth,
      serialized.dimensions.context,
      serialized.dimensions.salience,
      serialized.dimensions.autonomyIndex
    ];

    return {
      id: serialized.kernelId,
      nodeId: serialized.nodeId,
      shape,
      dtype: serialized.dtype as any,
      data,
      operations: (serialized.metadata as any)?.operations || []
    };
  }

  private static calculateBaseCognitiveShape(node: CognitiveNode): CognitiveTensorDimensions {
    return {
      modality: Math.min(8, Math.max(1, node.arity + 1)),
      depth: Math.min(16, Math.max(1, Math.floor(node.complexity))),
      context: Math.min(12, Math.max(1, node.connections.length + 1)),
      salience: Math.min(10, Math.max(1, Math.floor(node.complexity / 2) + 1)),
      autonomyIndex: Math.min(8, Math.max(1, 5 - Math.min(4, node.connections.length)))
    };
  }

  private static optimizeForPrimeFactorization(dimensions: CognitiveTensorDimensions): CognitiveTensorDimensions {
    const optimized = { ...dimensions };
    
    for (const [key, value] of Object.entries(optimized)) {
      if (!this.isPowerOfTwo(value) && value > 2) {
        const nearestPowerOf2 = Math.pow(2, Math.round(Math.log2(value)));
        const smallPrimeProduct = this.findBestSmallPrimeProduct(value);
        
        // Choose the option that's closest to the original value
        if (Math.abs(nearestPowerOf2 - value) <= Math.abs(smallPrimeProduct - value)) {
          (optimized as any)[key] = nearestPowerOf2;
        } else {
          (optimized as any)[key] = smallPrimeProduct;
        }
      }
    }
    
    return optimized;
  }

  private static findBestSmallPrimeProduct(target: number): number {
    const smallPrimes = [2, 3, 5, 7];
    let best = target;
    let bestDistance = Infinity;
    
    // Try combinations of small primes
    for (let i = 1; i <= 4; i++) {
      this.generateCombinations(smallPrimes, i).forEach(combination => {
        const product = combination.reduce((a, b) => a * b, 1);
        const distance = Math.abs(product - target);
        
        if (distance < bestDistance && product >= target * 0.8 && product <= target * 1.2) {
          best = product;
          bestDistance = distance;
        }
      });
    }
    
    return best;
  }

  private static generateCombinations<T>(arr: T[], size: number): T[][] {
    if (size === 1) return arr.map(item => [item]);
    
    const combinations: T[][] = [];
    for (let i = 0; i < arr.length; i++) {
      const rest = arr.slice(i + 1);
      const smallerCombinations = this.generateCombinations(rest, size - 1);
      smallerCombinations.forEach(combination => {
        combinations.push([arr[i], ...combination]);
      });
    }
    
    return combinations;
  }

  private static scaleByComplexity(
    dimensions: CognitiveTensorDimensions,
    complexity: number
  ): CognitiveTensorDimensions {
    const scaleFactor = Math.max(0.5, Math.min(2.0, complexity));
    
    return {
      modality: Math.round(dimensions.modality * scaleFactor),
      depth: Math.round(dimensions.depth * scaleFactor),
      context: Math.round(dimensions.context * scaleFactor),
      salience: Math.round(dimensions.salience * scaleFactor),
      autonomyIndex: Math.round(dimensions.autonomyIndex * scaleFactor)
    };
  }

  private static clampToDimensionLimits(dimensions: CognitiveTensorDimensions): number[] {
    return [
      Math.max(this.DIMENSION_LIMITS.modality.min, Math.min(this.DIMENSION_LIMITS.modality.max, dimensions.modality)),
      Math.max(this.DIMENSION_LIMITS.depth.min, Math.min(this.DIMENSION_LIMITS.depth.max, dimensions.depth)),
      Math.max(this.DIMENSION_LIMITS.context.min, Math.min(this.DIMENSION_LIMITS.context.max, dimensions.context)),
      Math.max(this.DIMENSION_LIMITS.salience.min, Math.min(this.DIMENSION_LIMITS.salience.max, dimensions.salience)),
      Math.max(this.DIMENSION_LIMITS.autonomyIndex.min, Math.min(this.DIMENSION_LIMITS.autonomyIndex.max, dimensions.autonomyIndex))
    ];
  }

  private static calculateOverallEfficiency(factorization: Record<string, TensorPrimeFactorization>): number {
    const efficiencies = Object.values(factorization).map(f => f.efficiency);
    return efficiencies.reduce((sum, eff) => sum + eff, 0) / efficiencies.length;
  }

  private static createEmptyDimensions(): CognitiveTensorDimensions {
    return {
      modality: 0,
      depth: 0,
      context: 0,
      salience: 0,
      autonomyIndex: 0
    };
  }
}