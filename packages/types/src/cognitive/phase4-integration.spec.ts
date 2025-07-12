/**
 * Phase 4: Distributed Cognitive Mesh API & Embodiment Layer - Tests
 * 
 * Comprehensive test suite for all Phase 4 components including API endpoints,
 * WebSocket communication, embodiment interfaces, and integration tests.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Phase4IntegrationManager } from './phase4-integration';
import { DistributedCognitiveAPI, CognitiveOperationRequest } from './phase4-cognitive-api';
import { CognitiveWebSocketInterface, WebSocketMessage } from './phase4-websocket-interface';
import { Unity3DEmbodimentInterface, ROSEmbodimentInterface, WebAgentEmbodimentInterface } from './phase4-embodiment-interfaces';
import { Phase4TestingFramework } from './phase4-testing-framework';

// Test setup and mocks
import { ECANScheduler } from './ecan-scheduler';
import { CognitiveMeshCoordinator } from './mesh-topology';
import { TutorialKitNeuralSymbolicPipeline } from './neural-symbolic-synthesis';
import { CognitiveGGMLKernelRegistry } from './ggml-kernels';

describe('Phase 4: Distributed Cognitive Mesh API & Embodiment Layer', () => {
  let integrationManager: Phase4IntegrationManager;
  let cognitiveAPI: DistributedCognitiveAPI;
  let webSocketInterface: CognitiveWebSocketInterface;
  let testingFramework: Phase4TestingFramework;
  
  // Cognitive architecture dependencies
  let ecanScheduler: ECANScheduler;
  let meshTopology: CognitiveMeshCoordinator;
  let neuralSymbolicPipeline: TutorialKitNeuralSymbolicPipeline;
  let kernelRegistry: CognitiveGGMLKernelRegistry;

  beforeEach(async () => {
    // Initialize cognitive architecture components
    ecanScheduler = new ECANScheduler({
      attentionBank: 100000,
      maxSTI: 1000,
      minSTI: -1000,
      attentionDecayRate: 0.95,
      importanceSpreadingRate: 0.1
    });

    meshTopology = new CognitiveMeshCoordinator('test-phase4-mesh');
    
    // Add test nodes to mesh
    meshTopology.addNode({
      id: 'test-node-1',
      endpoint: 'http://localhost:8001',
      capabilities: ['general-processing'],
      currentLoad: 30,
      maxCapacity: { cpu: 1000, memory: 2000, bandwidth: 500, storage: 1000 },
      availableResources: { cpu: 700, memory: 1400, bandwidth: 350, storage: 700 },
      status: 'active',
      lastHeartbeat: Date.now()
    });
    meshTopology.addNode({
      id: 'test-node-2',
      endpoint: 'http://localhost:8002',
      capabilities: ['general-processing'],
      currentLoad: 50,
      maxCapacity: { cpu: 1500, memory: 3000, bandwidth: 750, storage: 1500 },
      availableResources: { cpu: 750, memory: 1500, bandwidth: 375, storage: 750 },
      status: 'active',
      lastHeartbeat: Date.now()
    });

    neuralSymbolicPipeline = new TutorialKitNeuralSymbolicPipeline(null);
    kernelRegistry = new CognitiveGGMLKernelRegistry();

    // Initialize Phase 4 components
    integrationManager = new Phase4IntegrationManager({
      api: {
        maxConcurrentOperations: 100,
        defaultTimeout: 5000,
        resourceLimits: {
          memoryPerOperation: 10 * 1024 * 1024, // 10MB for tests
          cpuPerOperation: 0.5
        }
      },
      embodiment: {
        unity3d: { enabled: true, maxAgents: 10, updateFrequency: 30 },
        ros: { enabled: true, maxNodes: 5, messageQueueSize: 100 },
        webAgent: { enabled: true, maxAgents: 20, sessionTimeout: 60000 }
      }
    });

    const initSuccess = await integrationManager.initialize(
      ecanScheduler,
      meshTopology,
      neuralSymbolicPipeline,
      kernelRegistry
    );

    expect(initSuccess).toBe(true);

    // Get initialized components for direct testing
    cognitiveAPI = new DistributedCognitiveAPI(
      ecanScheduler,
      meshTopology,
      neuralSymbolicPipeline,
      kernelRegistry
    );

    webSocketInterface = new CognitiveWebSocketInterface(cognitiveAPI);
    testingFramework = new Phase4TestingFramework();
  });

  afterEach(() => {
    // Cleanup resources
    if (webSocketInterface) {
      webSocketInterface.destroy();
    }
  });

  describe('Phase 4 Integration Manager', () => {
    it('should initialize all components successfully', async () => {
      const status = integrationManager.getSystemStatus();
      
      expect(status.phase4Status).toBe('initialized');
      expect(status.components.cognitiveAPI).toBe(true);
      expect(status.components.webSocketInterface).toBe(true);
      expect(status.components.unity3DInterface).toBe(true);
      expect(status.components.rosInterface).toBe(true);
      expect(status.components.webAgentInterface).toBe(true);
    });

    it('should provide comprehensive system status', async () => {
      const status = integrationManager.getSystemStatus();
      
      expect(status.performance).toBeDefined();
      expect(status.performance.totalOperations).toBeGreaterThanOrEqual(0);
      expect(status.performance.averageLatency).toBeGreaterThanOrEqual(0);
      expect(status.performance.currentLoad).toBeGreaterThanOrEqual(0);
      expect(status.performance.memoryUsage).toBeGreaterThan(0);
      
      expect(status.connections).toBeDefined();
      expect(status.connections.webSocketConnections).toBeGreaterThanOrEqual(0);
    });

    it('should validate multi-platform compatibility', async () => {
      const compatibility = integrationManager.getMultiPlatformCompatibility();
      
      expect(compatibility.platforms.unity3d.supported).toBe(true);
      expect(compatibility.platforms.ros.supported).toBe(true);
      expect(compatibility.platforms.web.supported).toBe(true);
      
      expect(compatibility.compatibility.crossPlatformMessaging).toBe(true);
      expect(compatibility.compatibility.sharedCognitiveState).toBe(true);
      expect(compatibility.compatibility.unifiedAPI).toBe(true);
    });

    it('should generate embodiment interface recursion flowchart', async () => {
      const flowchart = await integrationManager.generateEmbodimentFlowchart();
      
      expect(flowchart.nodes).toHaveLength.greaterThan(0);
      expect(flowchart.recursivePaths).toHaveLength.greaterThan(0);
      expect(flowchart.mermaidDiagram).toContain('flowchart TD');
      
      // Validate node structure
      const apiNode = flowchart.nodes.find(n => n.id === 'cognitive-api');
      expect(apiNode).toBeDefined();
      expect(apiNode?.type).toBe('api-endpoint');
      expect(apiNode?.performance.avgLatency).toBeGreaterThanOrEqual(0);
      
      // Validate recursive paths
      const attentionPath = flowchart.recursivePaths.find(p => p.pathId === 'attention-feedback-loop');
      expect(attentionPath).toBeDefined();
      expect(attentionPath?.recursionPoints).toHaveLength.greaterThan(0);
    });
  });

  describe('Distributed Cognitive API', () => {
    it('should process symbolic reasoning operations', async () => {
      const request: CognitiveOperationRequest = {
        operationId: 'test-symbolic-1',
        operationType: 'symbolic-reasoning',
        inputData: {
          query: 'What are the prerequisites for learning React?',
          context: 'tutorial-navigation',
          complexity: 'medium'
        },
        context: {
          priority: 0.8,
          timeout: 3000
        }
      };

      const response = await cognitiveAPI.processCognitiveOperation(request);
      
      expect(response.operationId).toBe(request.operationId);
      expect(response.status).toBe('success');
      expect(response.result).toBeDefined();
      expect(response.metrics.processingTime).toBeGreaterThan(0);
      expect(response.metrics.memoryUsage).toBeGreaterThan(0);
      expect(response.metrics.accuracy).toBeGreaterThan(0.5);
    });

    it('should process neural inference operations', async () => {
      const request: CognitiveOperationRequest = {
        operationId: 'test-neural-1',
        operationType: 'neural-inference',
        inputData: {
          tensor: new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5]),
          context: 'pattern-recognition',
          targetOutput: 'classification'
        },
        context: {
          priority: 0.7,
          timeout: 2000
        }
      };

      const response = await cognitiveAPI.processCognitiveOperation(request);
      
      expect(response.operationId).toBe(request.operationId);
      expect(response.status).toBe('success');
      expect(response.result).toBeDefined();
      expect(response.metrics.accuracy).toBeGreaterThan(0.6);
      expect(response.metrics.confidence).toBeGreaterThan(0.5);
    });

    it('should process hybrid synthesis operations', async () => {
      const request: CognitiveOperationRequest = {
        operationId: 'test-hybrid-1',
        operationType: 'hybrid-synthesis',
        inputData: {
          symbolic: {
            rules: ['if beginner then start-with-basics', 'if experienced then advanced-topics'],
            concepts: ['tutorial-sequencing', 'user-profiling']
          },
          neural: {
            userBehaviorPattern: new Float32Array([0.8, 0.2, 0.6, 0.4]),
            learningProgress: new Float32Array([0.3, 0.7, 0.5])
          }
        },
        context: {
          priority: 0.9,
          timeout: 5000
        }
      };

      const response = await cognitiveAPI.processCognitiveOperation(request);
      
      expect(response.operationId).toBe(request.operationId);
      expect(response.status).toBe('success');
      expect(response.result).toBeDefined();
      expect(response.result.confidenceScore).toBeGreaterThan(0.4);
    });

    it('should handle attention allocation operations', async () => {
      const request: CognitiveOperationRequest = {
        operationId: 'test-attention-1',
        operationType: 'attention-allocation',
        inputData: {
          attentionWeights: [
            { nodeId: 'tutorial-step-1', weight: 0.8, type: 'dynamic' },
            { nodeId: 'tutorial-step-2', weight: 0.6, type: 'static' },
            { nodeId: 'user-progress', weight: 0.9, type: 'dynamic' }
          ]
        },
        context: {
          priority: 0.7,
          timeout: 2000
        }
      };

      const response = await cognitiveAPI.processCognitiveOperation(request);
      
      expect(response.operationId).toBe(request.operationId);
      expect(response.status).toBe('success');
      expect(response.result.allocated).toBe(3);
      expect(response.result.totalAttention).toBeGreaterThan(0);
    });

    it('should get distributed state snapshot', async () => {
      const state = await cognitiveAPI.getDistributedState();
      
      expect(state.timestamp).toBeGreaterThan(0);
      expect(state.topology).toBeDefined();
      expect(state.topology.nodeCount).toBeGreaterThanOrEqual(0);
      expect(state.topology.activeConnections).toBeGreaterThanOrEqual(0);
      
      expect(state.attentionBank).toBeDefined();
      expect(state.attentionBank.totalAttention).toBeGreaterThan(0);
      
      expect(state.performance).toBeDefined();
      expect(state.performance.averageLatency).toBeGreaterThanOrEqual(0);
      expect(state.performance.throughput).toBeGreaterThanOrEqual(0);
      expect(state.performance.errorRate).toBeGreaterThanOrEqual(0);
    });

    it('should orchestrate multiple tasks with priority scheduling', async () => {
      const tasks: CognitiveOperationRequest[] = [
        {
          operationId: 'task-1',
          operationType: 'symbolic-reasoning',
          inputData: { query: 'task 1' },
          context: { priority: 0.9, timeout: 3000 }
        },
        {
          operationId: 'task-2',
          operationType: 'neural-inference',
          inputData: { tensor: new Float32Array([1, 2, 3]) },
          context: { priority: 0.5, timeout: 2000 }
        },
        {
          operationId: 'task-3',
          operationType: 'hybrid-synthesis',
          inputData: { symbolic: { test: true }, neural: { weights: new Float32Array([0.1]) } },
          context: { priority: 0.7, timeout: 4000 }
        }
      ];

      const results = await cognitiveAPI.orchestrateTasks(tasks);
      
      expect(results.size).toBe(tasks.length);
      
      for (const task of tasks) {
        const result = results.get(task.operationId);
        expect(result).toBeDefined();
        expect(result?.operationId).toBe(task.operationId);
        expect(['success', 'error']).toContain(result?.status);
      }
    });

    it('should propagate state changes across distributed mesh', async () => {
      const stateUpdate = {
        nodeId: 'test-node-1',
        operation: 'update' as const,
        data: {
          newState: 'cognitive-processing',
          priority: 'high',
          timestamp: Date.now()
        },
        priority: 0.8
      };

      const success = await cognitiveAPI.propagateStateChange(stateUpdate);
      
      expect(success).toBe(true);
    });
  });

  describe('WebSocket Interface', () => {
    it('should handle connection establishment', async () => {
      const connectionId = 'test-connection-1';
      const connection = await webSocketInterface.handleConnection(connectionId);
      
      expect(connection.id).toBe(connectionId);
      expect(connection.isActive).toBe(true);
      expect(connection.connectedAt).toBeGreaterThan(0);
      expect(connection.subscriptions).toBeDefined();
      
      // Cleanup
      await webSocketInterface.handleDisconnection(connectionId);
    });

    it('should process cognitive operation requests via WebSocket', async () => {
      const connectionId = 'test-connection-2';
      await webSocketInterface.handleConnection(connectionId);

      const message: WebSocketMessage = {
        messageId: 'ws-msg-1',
        timestamp: Date.now(),
        type: 'request',
        payload: {
          operation: {
            operationId: 'ws-cognitive-test-1',
            operationType: 'symbolic-reasoning',
            inputData: { query: 'WebSocket test query' },
            context: { priority: 0.8, timeout: 3000 }
          },
          streaming: false,
          progressUpdates: false
        }
      };

      // Process message (would normally send response via WebSocket)
      await expect(webSocketInterface.processMessage(connectionId, message)).resolves.not.toThrow();
      
      // Cleanup
      await webSocketInterface.handleDisconnection(connectionId);
    });

    it('should handle event subscription and broadcasting', async () => {
      const connectionId = 'test-connection-3';
      await webSocketInterface.handleConnection(connectionId);

      // Subscribe to state updates
      const subscriptionMessage: WebSocketMessage = {
        messageId: 'ws-msg-2',
        timestamp: Date.now(),
        type: 'event',
        payload: {
          eventType: 'state-snapshot',
          action: 'subscribe'
        }
      };

      await webSocketInterface.processMessage(connectionId, subscriptionMessage);

      // Broadcast state update
      await webSocketInterface.broadcastStateUpdate(
        'state-snapshot',
        { test: 'broadcast data' },
        ['test-node-1']
      );

      // Cleanup
      await webSocketInterface.handleDisconnection(connectionId);
    });

    it('should provide real-time metrics', async () => {
      const metrics = webSocketInterface.getRealTimeMetrics();
      
      expect(metrics.connectionCount).toBeGreaterThanOrEqual(0);
      expect(metrics.activeOperations).toBeGreaterThanOrEqual(0);
      expect(metrics.messagesThroughput).toBeGreaterThanOrEqual(0);
      expect(metrics.averageLatency).toBeGreaterThanOrEqual(0);
      expect(metrics.errorRate).toBeGreaterThanOrEqual(0);
      expect(metrics.bandwidthUsage).toBeDefined();
      expect(metrics.bandwidthUsage.incoming).toBeGreaterThanOrEqual(0);
      expect(metrics.bandwidthUsage.outgoing).toBeGreaterThanOrEqual(0);
    });

    it('should handle heartbeat messages', async () => {
      const connectionId = 'test-connection-4';
      await webSocketInterface.handleConnection(connectionId);

      const heartbeatMessage: WebSocketMessage = {
        messageId: 'heartbeat-1',
        timestamp: Date.now(),
        type: 'heartbeat',
        payload: {}
      };

      await expect(webSocketInterface.processMessage(connectionId, heartbeatMessage)).resolves.not.toThrow();
      
      // Cleanup
      await webSocketInterface.handleDisconnection(connectionId);
    });
  });

  describe('Embodiment Interfaces', () => {
    let unity3DInterface: Unity3DEmbodimentInterface;
    let rosInterface: ROSEmbodimentInterface;
    let webAgentInterface: WebAgentEmbodimentInterface;

    beforeEach(() => {
      unity3DInterface = new Unity3DEmbodimentInterface(cognitiveAPI, webSocketInterface);
      rosInterface = new ROSEmbodimentInterface(cognitiveAPI, webSocketInterface);
      webAgentInterface = new WebAgentEmbodimentInterface(cognitiveAPI, webSocketInterface);
    });

    describe('Unity3D Interface', () => {
      it('should initialize Unity3D connection with cognitive agents', async () => {
        const unityConfig = {
          projectId: 'test-project-1',
          sceneId: 'test-scene-1',
          cognitiveAgents: [
            {
              agentId: 'unity-agent-1',
              gameObjectId: 12345,
              cognitiveBehaviors: {
                perceptionRadius: 10.0,
                actionLatency: 100,
                learningRate: 0.01,
                autonomyLevel: 0.8
              },
              sensorConfiguration: {
                visualSensors: [{ fieldOfView: 90, range: 15, resolution: [640, 480] }],
                audioSensors: [{ range: 20, sensitivity: 0.5 }]
              }
            }
          ]
        };

        const success = await unity3DInterface.initializeUnityConnection(unityConfig);
        expect(success).toBe(true);
      });

      it('should process sensor data from Unity3D agents', async () => {
        const agentId = 'unity-agent-1';
        const sensorData = [
          {
            timestamp: Date.now(),
            sensorId: 'visual-sensor-1',
            type: 'visual' as const,
            data: {
              objectsDetected: ['obstacle', 'target'],
              distances: [5.2, 12.8],
              confidence: 0.87
            },
            confidence: 0.87
          },
          {
            timestamp: Date.now(),
            sensorId: 'audio-sensor-1', 
            type: 'audio' as const,
            data: {
              soundLevel: 45.3,
              frequency: 440,
              direction: 135
            },
            confidence: 0.72
          }
        ];

        // First initialize with the agent
        await unity3DInterface.initializeUnityConnection({
          projectId: 'test-project',
          sceneId: 'test-scene',
          cognitiveAgents: [{
            agentId,
            gameObjectId: 12345,
            cognitiveBehaviors: { perceptionRadius: 10, actionLatency: 100, learningRate: 0.01, autonomyLevel: 0.8 },
            sensorConfiguration: { visualSensors: [], audioSensors: [] }
          }]
        });

        const response = await unity3DInterface.processSensorData(agentId, sensorData);
        
        expect(response.operationId).toContain('unity-sensor');
        expect(response.status).toBe('success');
        expect(response.metrics.processingTime).toBeGreaterThan(0);
      });

      it('should generate actuator commands for Unity3D agents', async () => {
        const agentId = 'unity-agent-1';
        const cognitiveState = {
          currentGoal: 'navigate-to-target',
          environment: {
            obstacles: [{ x: 5, y: 0, z: 3 }],
            target: { x: 10, y: 0, z: 10 }
          },
          agentState: {
            position: { x: 0, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 0 }
          }
        };

        // Initialize agent first
        await unity3DInterface.initializeUnityConnection({
          projectId: 'test-project',
          sceneId: 'test-scene',
          cognitiveAgents: [{
            agentId,
            gameObjectId: 12345,
            cognitiveBehaviors: { perceptionRadius: 10, actionLatency: 100, learningRate: 0.01, autonomyLevel: 0.8 },
            sensorConfiguration: { visualSensors: [], audioSensors: [] }
          }]
        });

        const commands = await unity3DInterface.generateActuatorCommands(agentId, cognitiveState);
        
        expect(commands).toBeInstanceOf(Array);
        // Commands may be empty if no actions are needed, so we just check it's an array
      });
    });

    describe('ROS Interface', () => {
      it('should register ROS node with cognitive capabilities', async () => {
        const rosNode = {
          nodeId: 'test-ros-node-1',
          nodeName: '/cognitive_test_node',
          namespace: '/tutorialkit',
          topics: {
            subscribed: ['/cmd_vel', '/sensor_data', '/camera/image'],
            published: ['/cognitive_output', '/status', '/goal']
          },
          services: {
            provided: ['/process_cognitive_request', '/get_plan'],
            required: ['/navigation_service', '/perception_service']
          }
        };

        const success = await rosInterface.registerROSNode(rosNode);
        expect(success).toBe(true);
      });

      it('should process ROS messages with cognitive analysis', async () => {
        // First register a node
        const rosNode = {
          nodeId: 'test-ros-node-2',
          nodeName: '/test_node',
          namespace: '/test',
          topics: { subscribed: ['/test_topic'], published: [] },
          services: { provided: [], required: [] }
        };
        await rosInterface.registerROSNode(rosNode);

        const rosMessage = {
          topic: '/test_topic',
          messageType: 'geometry_msgs/Twist',
          timestamp: Date.now(),
          data: {
            linear: { x: 1.0, y: 0.0, z: 0.0 },
            angular: { x: 0.0, y: 0.0, z: 0.5 }
          },
          header: {
            seq: 123,
            stamp: Date.now(),
            frameId: 'base_link'
          }
        };

        const response = await rosInterface.processROSMessage(rosMessage);
        
        if (response) {
          expect(response.operationId).toContain('ros-msg');
          expect(response.status).toBe('success');
          expect(response.metrics.processingTime).toBeGreaterThan(0);
        } else {
          // No subscribers for this topic is also valid
          expect(response).toBeNull();
        }
      });

      it('should handle ROS service requests', async () => {
        // Register a service provider first
        const rosNode = {
          nodeId: 'service-provider-1',
          nodeName: '/service_provider',
          namespace: '/test',
          topics: { subscribed: [], published: [] },
          services: { provided: ['/test_service'], required: [] }
        };
        await rosInterface.registerROSNode(rosNode);

        const serviceRequest = {
          serviceName: '/test_service',
          requestType: 'nav_msgs/GetPlan',
          parameters: {
            start: { x: 0, y: 0, z: 0 },
            goal: { x: 10, y: 10, z: 0 },
            tolerance: 0.1
          },
          timeout: 5000
        };

        const response = await rosInterface.processServiceRequest(serviceRequest);
        
        expect(response).toBeDefined();
        expect(response.success).toBe(true);
        expect(response.result).toBeDefined();
      });
    });

    describe('Web Agent Interface', () => {
      it('should register web agent with cognitive capabilities', async () => {
        const webAgent = {
          agentId: 'web-agent-1',
          agentType: 'browser' as const,
          capabilities: {
            userInterface: true,
            dataCollection: true,
            actuation: false,
            learning: true
          },
          configuration: {
            updateFrequency: 1000,
            maxLatency: 500,
            privacyLevel: 'medium' as const
          }
        };

        const success = await webAgentInterface.registerWebAgent(webAgent);
        expect(success).toBe(true);
      });

      it('should process web agent interactions', async () => {
        // Register agent first
        const webAgent = {
          agentId: 'web-agent-2',
          agentType: 'browser' as const,
          capabilities: { userInterface: true, dataCollection: true, actuation: false, learning: true },
          configuration: { updateFrequency: 1000, maxLatency: 500, privacyLevel: 'medium' as const }
        };
        await webAgentInterface.registerWebAgent(webAgent);

        const interaction = {
          interactionId: 'interaction-1',
          agentId: 'web-agent-2',
          timestamp: Date.now(),
          interactionType: 'user-input' as const,
          data: {
            inputType: 'click',
            element: 'next-button',
            value: 'proceed-to-step-2'
          },
          context: {
            sessionId: 'session-123',
            userId: 'user-456',
            location: {
              url: 'https://tutorial.example.com/step1'
            }
          }
        };

        const response = await webAgentInterface.processWebAgentInteraction(interaction);
        
        expect(response.operationId).toBe('web-interaction-interaction-1');
        expect(response.status).toBe('success');
        expect(response.metrics.processingTime).toBeGreaterThan(0);
      });

      it('should generate web agent responses', async () => {
        const agentId = 'web-agent-3';
        
        // Register agent first
        await webAgentInterface.registerWebAgent({
          agentId,
          agentType: 'browser' as const,
          capabilities: { userInterface: true, dataCollection: true, actuation: false, learning: true },
          configuration: { updateFrequency: 1000, maxLatency: 500, privacyLevel: 'medium' as const }
        });

        const cognitiveResult = {
          confidence: 0.85,
          uiChanges: [
            { elementId: 'progress-bar', property: 'width', value: '75%' },
            { elementId: 'next-step', property: 'disabled', value: false }
          ],
          recommendations: ['Consider reviewing previous step', 'Practice more examples'],
          learningMetrics: {
            comprehension: 0.78,
            engagement: 0.92
          }
        };

        const response = await webAgentInterface.generateWebAgentResponse(agentId, cognitiveResult);
        
        expect(response.responseType).toBe('ui-update');
        expect(response.data).toBeDefined();
        expect(response.metadata.confidence).toBe(0.85);
      });

      it('should provide interaction analytics', async () => {
        const analytics = webAgentInterface.getInteractionAnalytics();
        
        expect(analytics.totalInteractions).toBeGreaterThanOrEqual(0);
        expect(analytics.interactionTypes).toBeDefined();
        expect(analytics.averageProcessingTime).toBeGreaterThanOrEqual(0);
        expect(analytics.userSatisfactionScore).toBeGreaterThanOrEqual(0);
        expect(analytics.learningProgress).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Testing Framework', () => {
    it('should run comprehensive API endpoint tests', async () => {
      const results = await testingFramework.testCognitiveAPIEndpoints();
      
      expect(results.totalRequests).toBeGreaterThan(0);
      expect(results.successfulRequests).toBeGreaterThanOrEqual(0);
      expect(results.failedRequests).toBeGreaterThanOrEqual(0);
      expect(results.averageLatency).toBeGreaterThanOrEqual(0);
      expect(results.memoryUsage).toBeDefined();
      expect(results.memoryUsage.initial).toBeGreaterThan(0);
    });

    it('should run WebSocket interface tests', async () => {
      const results = await testingFramework.testWebSocketInterface();
      
      expect(results.totalRequests).toBeGreaterThan(0);
      expect(results.successfulRequests).toBeGreaterThanOrEqual(0);
      expect(results.averageLatency).toBeGreaterThanOrEqual(0);
    });

    it('should run embodiment interface tests', async () => {
      const results = await testingFramework.testEmbodimentInterfaces();
      
      expect(results.unity3d).toBeDefined();
      expect(results.ros).toBeDefined();
      expect(results.webAgent).toBeDefined();
      
      expect(results.unity3d.totalRequests).toBeGreaterThanOrEqual(0);
      expect(results.ros.totalRequests).toBeGreaterThanOrEqual(0);
      expect(results.webAgent.totalRequests).toBeGreaterThanOrEqual(0);
    });

    it('should run load testing with concurrent requests', async () => {
      const loadTestConfig = {
        concurrentUsers: 10,
        requestsPerUser: 5,
        testDuration: 5000,
        rampUpTime: 1000,
        operationTypes: ['symbolic-reasoning', 'neural-inference'] as const,
        targetLatency: 200,
        maxErrorRate: 0.1
      };

      const results = await testingFramework.runLoadTest(loadTestConfig);
      
      expect(results.totalRequests).toBeGreaterThan(0);
      expect(results.throughput).toBeGreaterThanOrEqual(0);
      expect(results.memoryUsage.peak).toBeGreaterThan(results.memoryUsage.initial);
    });

    it('should generate comprehensive performance report', async () => {
      // Run minimal tests to get data
      const apiTests = await testingFramework.testCognitiveAPIEndpoints();
      const webSocketTests = await testingFramework.testWebSocketInterface();
      const embodimentTests = await testingFramework.testEmbodimentInterfaces();
      const loadTest = await testingFramework.runLoadTest({
        concurrentUsers: 5,
        requestsPerUser: 2,
        testDuration: 2000,
        rampUpTime: 500,
        operationTypes: ['symbolic-reasoning'],
        targetLatency: 100,
        maxErrorRate: 0.05
      });

      const report = testingFramework.generatePerformanceReport({
        apiTests,
        webSocketTests,
        embodimentTests,
        loadTests: [loadTest]
      });
      
      expect(report).toContain('Phase 4: Distributed Cognitive Mesh API & Embodiment Layer - Performance Report');
      expect(report).toContain('API Endpoint Performance');
      expect(report).toContain('WebSocket Interface Performance');
      expect(report).toContain('Embodiment Interface Performance');
      expect(report).toContain('Load Testing Results');
      expect(report).toContain('Performance Summary');
      expect(report).toContain('Recommendations');
    });
  });

  describe('Integration Tests', () => {
    it('should run full Phase 4 validation', async () => {
      const validation = await integrationManager.runPhase4Validation();
      
      expect(validation.success).toBeDefined();
      expect(validation.results).toBeDefined();
      expect(validation.results.apiTests).toBeDefined();
      expect(validation.results.webSocketTests).toBeDefined();
      expect(validation.results.embodimentTests).toBeDefined();
      expect(validation.results.integrationTests).toBeDefined();
      expect(validation.results.performanceTests).toBeDefined();
      expect(validation.report).toContain('Phase 4');
    });

    it('should demonstrate end-to-end cognitive processing flow', async () => {
      // 1. Create a cognitive operation request
      const request: CognitiveOperationRequest = {
        operationId: 'e2e-test-1',
        operationType: 'hybrid-synthesis',
        inputData: {
          symbolic: {
            userIntent: 'learn-javascript-basics',
            currentLevel: 'beginner',
            preferences: ['interactive', 'visual']
          },
          neural: {
            learningPattern: new Float32Array([0.7, 0.3, 0.8, 0.5]),
            engagementHistory: new Float32Array([0.6, 0.8, 0.7])
          }
        },
        context: {
          priority: 0.8,
          timeout: 5000
        }
      };

      // 2. Process through cognitive API
      const cognitiveResponse = await cognitiveAPI.processCognitiveOperation(request);
      expect(cognitiveResponse.status).toBe('success');

      // 3. Simulate WebSocket communication
      const connectionId = 'e2e-connection';
      await webSocketInterface.handleConnection(connectionId);

      const wsMessage: WebSocketMessage = {
        messageId: 'e2e-ws-1',
        timestamp: Date.now(),
        type: 'request',
        payload: {
          operation: request,
          streaming: false
        }
      };

      await webSocketInterface.processMessage(connectionId, wsMessage);

      // 4. Test state propagation
      const stateUpdate = {
        nodeId: 'e2e-test-node',
        operation: 'update' as const,
        data: cognitiveResponse.result,
        priority: 0.8
      };

      const propagationSuccess = await cognitiveAPI.propagateStateChange(stateUpdate);
      expect(propagationSuccess).toBe(true);

      // 5. Get final system state
      const finalState = await cognitiveAPI.getDistributedState();
      expect(finalState.timestamp).toBeGreaterThan(0);

      // Cleanup
      await webSocketInterface.handleDisconnection(connectionId);
    });

    it('should validate real-time performance under load', async () => {
      const startTime = Date.now();
      const operations: Promise<any>[] = [];

      // Create 20 concurrent operations
      for (let i = 0; i < 20; i++) {
        const request: CognitiveOperationRequest = {
          operationId: `load-test-${i}`,
          operationType: i % 2 === 0 ? 'symbolic-reasoning' : 'neural-inference',
          inputData: i % 2 === 0 ? 
            { query: `test query ${i}` } : 
            { tensor: new Float32Array(Array.from({length: 5}, () => Math.random())) },
          context: {
            priority: Math.random(),
            timeout: 2000
          }
        };

        operations.push(cognitiveAPI.processCognitiveOperation(request));
      }

      // Wait for all operations to complete
      const results = await Promise.allSettled(operations);
      const totalTime = Date.now() - startTime;

      // Validate performance
      const successfulOperations = results.filter(r => r.status === 'fulfilled').length;
      const successRate = successfulOperations / operations.length;
      const averageLatency = totalTime / operations.length;

      expect(successRate).toBeGreaterThan(0.8); // 80% success rate
      expect(averageLatency).toBeLessThan(1000); // Under 1 second average
      expect(totalTime).toBeLessThan(10000); // Complete within 10 seconds
    });

    it('should validate cross-platform embodiment communication', async () => {
      // Initialize all embodiment interfaces
      const unity3DInterface = new Unity3DEmbodimentInterface(cognitiveAPI, webSocketInterface);
      const rosInterface = new ROSEmbodimentInterface(cognitiveAPI, webSocketInterface);
      const webAgentInterface = new WebAgentEmbodimentInterface(cognitiveAPI, webSocketInterface);

      // Register test agents/nodes on each platform
      const unitySuccess = await unity3DInterface.initializeUnityConnection({
        projectId: 'cross-platform-test',
        sceneId: 'test-scene',
        cognitiveAgents: [{
          agentId: 'unity-agent-cross-test',
          gameObjectId: 99999,
          cognitiveBehaviors: { perceptionRadius: 5, actionLatency: 50, learningRate: 0.02, autonomyLevel: 0.7 },
          sensorConfiguration: { visualSensors: [], audioSensors: [] }
        }]
      });

      const rosSuccess = await rosInterface.registerROSNode({
        nodeId: 'ros-node-cross-test',
        nodeName: '/cross_test_node',
        namespace: '/test',
        topics: { subscribed: ['/cross_test'], published: ['/cross_response'] },
        services: { provided: [], required: [] }
      });

      const webAgentSuccess = await webAgentInterface.registerWebAgent({
        agentId: 'web-agent-cross-test',
        agentType: 'browser',
        capabilities: { userInterface: true, dataCollection: true, actuation: false, learning: true },
        configuration: { updateFrequency: 500, maxLatency: 300, privacyLevel: 'low' }
      });

      expect(unitySuccess).toBe(true);
      expect(rosSuccess).toBe(true);
      expect(webAgentSuccess).toBe(true);

      // Test cross-platform state sharing
      const sharedState = {
        globalContext: 'cross-platform-test',
        timestamp: Date.now(),
        participants: ['unity', 'ros', 'web']
      };

      const propagationSuccess = await cognitiveAPI.propagateStateChange({
        nodeId: 'cross-platform-state',
        operation: 'add',
        data: sharedState,
        priority: 0.9
      });

      expect(propagationSuccess).toBe(true);
    });
  });
});