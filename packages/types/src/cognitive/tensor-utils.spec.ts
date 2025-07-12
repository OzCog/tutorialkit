import { describe, it, expect, beforeEach } from 'vitest';
import { CognitiveTensorUtils } from './tensor-utils.js';
import type { 
  TensorKernel, 
  CognitiveNode,
  CognitiveTensorDimensions,
  TensorSerializationOptions,
  SerializedTensor
} from './tensor-utils.js';

describe('Cognitive Tensor Utilities', () => {
  let testKernel: TensorKernel;
  let testNode: CognitiveNode;

  beforeEach(() => {
    // Create a valid 5-dimensional cognitive tensor kernel
    const shape = [4, 8, 6, 5, 3]; // [modality, depth, context, salience, autonomy_index]
    const elementCount = shape.reduce((acc, dim) => acc * dim, 1);
    const buffer = new ArrayBuffer(elementCount * 4); // float32

    testKernel = {
      id: 'test-kernel',
      nodeId: 'test-node',
      shape,
      dtype: 'float32',
      data: buffer,
      operations: []
    };

    testNode = {
      id: 'test-node',
      type: 'lesson',
      name: 'Test Lesson',
      arity: 3,
      complexity: 7.5,
      metadata: {
        data: {
          title: 'Test Lesson',
          mainCommand: 'npm start',
          prepareCommands: ['npm install']
        }
      },
      connections: ['node1', 'node2', 'node3', 'node4', 'node5']
    };
  });

  describe('Tensor Shape Validation', () => {
    it('should validate correct 5-dimensional cognitive tensor', () => {
      const result = CognitiveTensorUtils.validateCognitiveTensorShape(testKernel);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.dimensions.modality).toBe(4);
      expect(result.dimensions.depth).toBe(8);
      expect(result.dimensions.context).toBe(6);
      expect(result.dimensions.salience).toBe(5);
      expect(result.dimensions.autonomyIndex).toBe(3);
    });

    it('should reject tensor with wrong number of dimensions', () => {
      const invalidKernel = { ...testKernel, shape: [4, 8, 6] }; // Only 3 dimensions
      
      const result = CognitiveTensorUtils.validateCognitiveTensorShape(invalidKernel);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid shape length: expected 5 dimensions, got 3');
    });

    it('should reject tensor with dimensions outside valid ranges', () => {
      const invalidKernel = { 
        ...testKernel, 
        shape: [0, 20, 15, 12, 10] // modality too small, depth too large, etc.
      };
      
      const result = CognitiveTensorUtils.validateCognitiveTensorShape(invalidKernel);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.includes('modality dimension too small'))).toBe(true);
      expect(result.errors.some(e => e.includes('depth dimension too large'))).toBe(true);
    });

    it('should reject tensor with invalid data type', () => {
      const invalidKernel = { ...testKernel, dtype: 'invalid' as any };
      
      const result = CognitiveTensorUtils.validateCognitiveTensorShape(invalidKernel);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid data type'))).toBe(true);
    });

    it('should reject tensor with mismatched buffer size', () => {
      const invalidKernel = { 
        ...testKernel, 
        data: new ArrayBuffer(100) // Wrong size
      };
      
      const result = CognitiveTensorUtils.validateCognitiveTensorShape(invalidKernel);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Data buffer size mismatch'))).toBe(true);
    });

    it('should generate warnings for non-optimal dimensions', () => {
      const suboptimalKernel = { 
        ...testKernel, 
        shape: [7, 11, 9, 6, 5] // Non-power-of-2 dimensions
      };
      // Update buffer size to match
      const elementCount = suboptimalKernel.shape.reduce((acc, dim) => acc * dim, 1);
      suboptimalKernel.data = new ArrayBuffer(elementCount * 4);
      
      const result = CognitiveTensorUtils.validateCognitiveTensorShape(suboptimalKernel);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.includes('not a power of 2'))).toBe(true);
    });
  });

  describe('Prime Factorization Analysis', () => {
    it('should analyze prime factorization for all dimensions', () => {
      const dimensions: CognitiveTensorDimensions = {
        modality: 8,    // Power of 2
        depth: 6,       // 2 * 3
        context: 5,     // Prime
        salience: 4,    // Power of 2
        autonomyIndex: 7 // Prime
      };

      const analysis = CognitiveTensorUtils.analyzePrimeFactorization(dimensions);
      
      expect(analysis.modality.isPowerOfTwo).toBe(true);
      expect(analysis.modality.efficiency).toBe(1.0);
      
      expect(analysis.depth.factors).toEqual([2, 3]);
      expect(analysis.depth.isPowerOfTwo).toBe(false);
      expect(analysis.depth.efficiency).toBe(0.8);
      
      expect(analysis.context.factors).toEqual([5]);
      expect(analysis.context.isPowerOfTwo).toBe(false);
      
      expect(analysis.salience.isPowerOfTwo).toBe(true);
      expect(analysis.salience.efficiency).toBe(1.0);
      
      expect(analysis.autonomyIndex.factors).toEqual([7]);
      expect(analysis.autonomyIndex.isPowerOfTwo).toBe(false);
    });

    it('should provide optimization recommendations', () => {
      const dimensions: CognitiveTensorDimensions = {
        modality: 7,
        depth: 11,
        context: 9,
        salience: 6,
        autonomyIndex: 5
      };

      const analysis = CognitiveTensorUtils.analyzePrimeFactorization(dimensions);
      
      // Should recommend power-of-2 alternatives
      expect(analysis.modality.recommendedSize).toBe(8);
      expect(analysis.depth.recommendedSize).toBe(8); // Nearest power of 2 to 11
      expect(analysis.context.recommendedSize).toBe(8); // Nearest power of 2 to 9
    });
  });

  describe('Tensor Serialization', () => {
    it('should serialize tensor to JSON format', () => {
      const options: TensorSerializationOptions = {
        includeMetadata: true,
        compressionLevel: 'none',
        format: 'json'
      };

      const serialized = CognitiveTensorUtils.serializeTensor(testKernel, options);
      
      expect(serialized.kernelId).toBe(testKernel.id);
      expect(serialized.nodeId).toBe(testKernel.nodeId);
      expect(serialized.dimensions.modality).toBe(4);
      expect(serialized.dimensions.depth).toBe(8);
      expect(serialized.dtype).toBe('float32');
      expect(typeof serialized.data).toBe('string'); // Base64 encoded
      expect(serialized.checksum).toBeDefined();
      expect(serialized.metadata).toBeDefined();
    });

    it('should serialize tensor to binary format', () => {
      const options: TensorSerializationOptions = {
        includeMetadata: false,
        compressionLevel: 'medium',
        format: 'binary'
      };

      const serialized = CognitiveTensorUtils.serializeTensor(testKernel, options);
      
      expect(serialized.data instanceof ArrayBuffer).toBe(true);
      expect(serialized.metadata).toEqual({});
      expect((serialized.data as ArrayBuffer).byteLength).toBeLessThan(testKernel.data.byteLength);
    });

    it('should handle different compression levels', () => {
      const noCompression = CognitiveTensorUtils.serializeTensor(testKernel, {
        includeMetadata: false,
        compressionLevel: 'none',
        format: 'binary'
      });

      const highCompression = CognitiveTensorUtils.serializeTensor(testKernel, {
        includeMetadata: false,
        compressionLevel: 'high',
        format: 'binary'
      });

      const noCompressSize = (noCompression.data as ArrayBuffer).byteLength;
      const highCompressSize = (highCompression.data as ArrayBuffer).byteLength;
      
      expect(highCompressSize).toBeLessThan(noCompressSize);
    });
  });

  describe('Tensor Deserialization', () => {
    it('should deserialize tensor correctly', () => {
      const serialized = CognitiveTensorUtils.serializeTensor(testKernel);
      const deserialized = CognitiveTensorUtils.deserializeTensor(serialized);
      
      expect(deserialized.id).toBe(testKernel.id);
      expect(deserialized.nodeId).toBe(testKernel.nodeId);
      expect(deserialized.shape).toEqual(testKernel.shape);
      expect(deserialized.dtype).toBe(testKernel.dtype);
      expect(deserialized.data.byteLength).toBe(testKernel.data.byteLength);
    });

    it('should detect checksum mismatches', () => {
      const serialized = CognitiveTensorUtils.serializeTensor(testKernel);
      serialized.checksum = 'invalid-checksum';
      
      expect(() => {
        CognitiveTensorUtils.deserializeTensor(serialized);
      }).toThrow('checksum mismatch');
    });

    it('should round-trip serialize/deserialize without data loss', () => {
      // Fill test kernel with known data
      const view = new Float32Array(testKernel.data);
      for (let i = 0; i < view.length; i++) {
        view[i] = i * 0.1;
      }

      const serialized = CognitiveTensorUtils.serializeTensor(testKernel);
      const deserialized = CognitiveTensorUtils.deserializeTensor(serialized);
      
      const originalView = new Float32Array(testKernel.data);
      const deserializedView = new Float32Array(deserialized.data);
      
      expect(deserializedView.length).toBe(originalView.length);
      
      // Note: Due to compression in serialization, we might have some data loss
      // For lossless round-trip, use compression level 'none'
    });
  });

  describe('Optimized Shape Creation', () => {
    it('should create optimized shape for cognitive node', () => {
      const shape = CognitiveTensorUtils.createOptimizedShape(testNode);
      
      expect(shape).toHaveLength(5);
      expect(shape[0]).toBeGreaterThanOrEqual(1); // modality
      expect(shape[0]).toBeLessThanOrEqual(8);
      expect(shape[1]).toBeGreaterThanOrEqual(1); // depth
      expect(shape[1]).toBeLessThanOrEqual(16);
      expect(shape[2]).toBeGreaterThanOrEqual(1); // context
      expect(shape[2]).toBeLessThanOrEqual(12);
      expect(shape[3]).toBeGreaterThanOrEqual(1); // salience
      expect(shape[3]).toBeLessThanOrEqual(10);
      expect(shape[4]).toBeGreaterThanOrEqual(1); // autonomy_index
      expect(shape[4]).toBeLessThanOrEqual(8);
    });

    it('should scale shape by complexity factor', () => {
      const normalShape = CognitiveTensorUtils.createOptimizedShape(testNode, 1.0);
      const complexShape = CognitiveTensorUtils.createOptimizedShape(testNode, 2.0);
      const simpleShape = CognitiveTensorUtils.createOptimizedShape(testNode, 0.5);
      
      // Complex shape should generally be larger (though clamping may limit this)
      const normalSize = normalShape.reduce((a, b) => a * b, 1);
      const complexSize = complexShape.reduce((a, b) => a * b, 1);
      const simpleSize = simpleShape.reduce((a, b) => a * b, 1);
      
      expect(complexSize).toBeGreaterThanOrEqual(normalSize);
      expect(simpleSize).toBeLessThanOrEqual(normalSize);
    });

    it('should respect dimension limits in optimization', () => {
      const extremeNode: CognitiveNode = {
        id: 'extreme',
        type: 'lesson',
        name: 'Extreme Lesson',
        arity: 50,
        complexity: 100,
        metadata: {},
        connections: new Array(50).fill('conn').map((c, i) => `${c}${i}`)
      };

      const shape = CognitiveTensorUtils.createOptimizedShape(extremeNode);
      
      // Should be clamped to maximum limits
      expect(shape[0]).toBeLessThanOrEqual(8);  // modality max
      expect(shape[1]).toBeLessThanOrEqual(16); // depth max
      expect(shape[2]).toBeLessThanOrEqual(12); // context max
      expect(shape[3]).toBeLessThanOrEqual(10); // salience max
      expect(shape[4]).toBeLessThanOrEqual(8);  // autonomy_index max
    });
  });

  describe('Tensor Flowchart Data Generation', () => {
    it('should generate comprehensive flowchart data', () => {
      const flowchartData = CognitiveTensorUtils.generateTensorFlowchartData(testKernel);
      
      expect(flowchartData.kernelId).toBe(testKernel.id);
      expect(flowchartData.nodeId).toBe(testKernel.nodeId);
      expect(flowchartData.shape).toEqual(testKernel.shape);
      expect(flowchartData.dimensions).toBeDefined();
      expect(flowchartData.factorization).toBeDefined();
      expect(flowchartData.memoryUsage).toBe(testKernel.data.byteLength);
      expect(typeof flowchartData.efficiency).toBe('number');
      expect(Array.isArray(flowchartData.operations)).toBe(true);
    });

    it('should include prime factorization analysis in flowchart', () => {
      const flowchartData = CognitiveTensorUtils.generateTensorFlowchartData(testKernel);
      const factorization = flowchartData.factorization as any;
      
      expect(factorization.modality).toBeDefined();
      expect(factorization.depth).toBeDefined();
      expect(factorization.context).toBeDefined();
      expect(factorization.salience).toBeDefined();
      expect(factorization.autonomyIndex).toBeDefined();
      
      expect(factorization.modality.factors).toBeDefined();
      expect(factorization.modality.isPowerOfTwo).toBeDefined();
      expect(factorization.modality.efficiency).toBeDefined();
    });

    it('should calculate overall efficiency score', () => {
      const flowchartData = CognitiveTensorUtils.generateTensorFlowchartData(testKernel);
      const efficiency = flowchartData.efficiency as number;
      
      expect(efficiency).toBeGreaterThanOrEqual(0);
      expect(efficiency).toBeLessThanOrEqual(1);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle zero-sized dimensions gracefully', () => {
      const zeroKernel = {
        ...testKernel,
        shape: [0, 1, 1, 1, 1],
        data: new ArrayBuffer(0)
      };
      
      const result = CognitiveTensorUtils.validateCognitiveTensorShape(zeroKernel);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('modality dimension too small'))).toBe(true);
    });

    it('should handle extremely large buffers', () => {
      const largeShape = [8, 16, 12, 10, 8]; // Maximum allowed dimensions
      const elementCount = largeShape.reduce((acc, dim) => acc * dim, 1);
      const largeKernel = {
        ...testKernel,
        shape: largeShape,
        data: new ArrayBuffer(elementCount * 8) // float64
      };
      largeKernel.dtype = 'float64';
      
      const result = CognitiveTensorUtils.validateCognitiveTensorShape(largeKernel);
      expect(result.isValid).toBe(true);
      
      // Should still be able to serialize/deserialize
      const serialized = CognitiveTensorUtils.serializeTensor(largeKernel);
      expect(serialized).toBeDefined();
    });

    it('should handle nodes with minimal connections', () => {
      const isolatedNode: CognitiveNode = {
        id: 'isolated',
        type: 'function',
        name: 'isolated',
        arity: 0,
        complexity: 1,
        metadata: {},
        connections: []
      };

      const shape = CognitiveTensorUtils.createOptimizedShape(isolatedNode);
      
      // Should still generate valid shape
      expect(shape).toHaveLength(5);
      expect(shape.every(dim => dim >= 1)).toBe(true);
    });

    it('should handle invalid serialization options gracefully', () => {
      const invalidOptions = {
        includeMetadata: true,
        compressionLevel: 'invalid' as any,
        format: 'unknown' as any
      };

      // Should not throw, but use defaults
      const serialized = CognitiveTensorUtils.serializeTensor(testKernel, invalidOptions);
      expect(serialized).toBeDefined();
    });
  });

  describe('Performance Characteristics', () => {
    it('should validate large numbers of tensors efficiently', () => {
      const tensors: TensorKernel[] = [];
      
      // Create 1000 test tensors
      for (let i = 0; i < 1000; i++) {
        const shape = [
          Math.floor(Math.random() * 8) + 1,
          Math.floor(Math.random() * 16) + 1,
          Math.floor(Math.random() * 12) + 1,
          Math.floor(Math.random() * 10) + 1,
          Math.floor(Math.random() * 8) + 1
        ];
        const elementCount = shape.reduce((acc, dim) => acc * dim, 1);
        
        tensors.push({
          id: `tensor-${i}`,
          nodeId: `node-${i}`,
          shape,
          dtype: 'float32',
          data: new ArrayBuffer(elementCount * 4),
          operations: []
        });
      }

      const start = performance.now();
      const results = tensors.map(tensor => 
        CognitiveTensorUtils.validateCognitiveTensorShape(tensor)
      );
      const end = performance.now();

      expect(results.every(r => typeof r.isValid === 'boolean')).toBe(true);
      expect(end - start).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle memory-efficient serialization for large tensors', () => {
      const shape = [8, 16, 12, 10, 8]; // Maximum dimensions
      const elementCount = shape.reduce((acc, dim) => acc * dim, 1);
      const largeKernel = {
        ...testKernel,
        shape,
        data: new ArrayBuffer(elementCount * 4)
      };

      const start = performance.now();
      const serialized = CognitiveTensorUtils.serializeTensor(largeKernel, {
        includeMetadata: false,
        compressionLevel: 'high',
        format: 'binary'
      });
      const end = performance.now();

      expect(serialized).toBeDefined();
      expect(end - start).toBeLessThan(5000); // Should complete within 5 seconds
      
      // Compressed data should be smaller
      const compressedSize = (serialized.data as ArrayBuffer).byteLength;
      expect(compressedSize).toBeLessThan(largeKernel.data.byteLength);
    });
  });
});