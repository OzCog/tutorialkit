/**
 * Phase 4: Embodiment Layer Interfaces
 * 
 * Provides integration bindings for Unity3D, ROS, and web agents to enable
 * embodied cognition with bi-directional data flow and real-time communication.
 */

import { DistributedCognitiveAPI, CognitiveOperationRequest, CognitiveOperationResponse } from './phase4-cognitive-api';
import { CognitiveWebSocketInterface } from './phase4-websocket-interface';

// Common Embodiment Types
export interface EmbodimentVector3 {
  x: number;
  y: number;
  z: number;
}

export interface EmbodimentQuaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface EmbodimentTransform {
  position: EmbodimentVector3;
  rotation: EmbodimentQuaternion;
  scale: EmbodimentVector3;
}

export interface SensorData {
  timestamp: number;
  sensorId: string;
  type: 'visual' | 'audio' | 'tactile' | 'proprioceptive' | 'environmental';
  data: any;
  confidence: number;
  metadata?: {
    resolution?: [number, number];
    sampleRate?: number;
    units?: string;
  };
}

export interface ActuatorCommand {
  actuatorId: string;
  commandType: 'position' | 'velocity' | 'force' | 'digital';
  value: number | EmbodimentVector3 | boolean;
  duration?: number;
  priority: number;
}

export interface EmbodimentState {
  agentId: string;
  timestamp: number;
  transform: EmbodimentTransform;
  sensorData: SensorData[];
  actuatorStates: Record<string, any>;
  cognitiveState: {
    attentionFocus: string[];
    currentGoals: string[];
    activeProcesses: string[];
  };
}

// Unity3D Integration
export interface Unity3DMessage {
  messageId: string;
  messageType: 'sensor-data' | 'actuator-command' | 'state-update' | 'cognitive-request';
  timestamp: number;
  payload: any;
}

export interface Unity3DGameObject {
  instanceId: number;
  name: string;
  transform: EmbodimentTransform;
  components: string[];
  cognitiveMapping?: {
    nodeId: string;
    cognitiveType: 'agent' | 'environment' | 'target' | 'obstacle';
    semanticTags: string[];
  };
}

export interface Unity3DCognitiveAgent {
  agentId: string;
  gameObjectId: number;
  cognitiveBehaviors: {
    perceptionRadius: number;
    actionLatency: number;
    learningRate: number;
    autonomyLevel: number;
  };
  sensorConfiguration: {
    visualSensors: Array<{
      fieldOfView: number;
      range: number;
      resolution: [number, number];
    }>;
    audioSensors: Array<{
      range: number;
      sensitivity: number;
    }>;
  };
}

/**
 * Unity3D Embodiment Interface
 * 
 * Provides cognitive integration for Unity3D-based agents and environments.
 */
export class Unity3DEmbodimentInterface {
  private cognitiveAPI: DistributedCognitiveAPI;
  private webSocketInterface: CognitiveWebSocketInterface;
  private activeAgents: Map<string, Unity3DCognitiveAgent>;
  private gameObjects: Map<number, Unity3DGameObject>;
  private messageQueue: Unity3DMessage[];
  private isConnected: boolean;

  constructor(cognitiveAPI: DistributedCognitiveAPI, webSocketInterface: CognitiveWebSocketInterface) {
    this.cognitiveAPI = cognitiveAPI;
    this.webSocketInterface = webSocketInterface;
    this.activeAgents = new Map();
    this.gameObjects = new Map();
    this.messageQueue = [];
    this.isConnected = false;
  }

  /**
   * Initialize Unity3D connection and agent registration
   */
  async initializeUnityConnection(unityConfig: {
    projectId: string;
    sceneId: string;
    cognitiveAgents: Unity3DCognitiveAgent[];
  }): Promise<boolean> {
    try {
      // Register cognitive agents
      for (const agent of unityConfig.cognitiveAgents) {
        this.activeAgents.set(agent.agentId, agent);
        
        // Create cognitive node for agent
        const cognitiveRequest: CognitiveOperationRequest = {
          operationId: `unity-agent-init-${agent.agentId}`,
          operationType: 'symbolic-reasoning',
          inputData: {
            agentId: agent.agentId,
            gameObjectId: agent.gameObjectId,
            configuration: agent.cognitiveBehaviors
          },
          context: {
            priority: 0.8,
            timeout: 5000
          }
        };

        await this.cognitiveAPI.processCognitiveOperation(cognitiveRequest);
      }

      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('Unity3D initialization failed:', error);
      return false;
    }
  }

  /**
   * Process incoming sensor data from Unity3D
   */
  async processSensorData(agentId: string, sensorData: SensorData[]): Promise<CognitiveOperationResponse> {
    if (!this.activeAgents.has(agentId)) {
      throw new Error(`Unknown agent: ${agentId}`);
    }

    // Create cognitive operation for sensor processing
    const cognitiveRequest: CognitiveOperationRequest = {
      operationId: `unity-sensor-${agentId}-${Date.now()}`,
      operationType: 'neural-inference',
      inputData: {
        agentId,
        sensorData,
        processingType: 'perception'
      },
      context: {
        priority: 0.7,
        timeout: 1000 // Real-time constraint
      }
    };

    return await this.cognitiveAPI.processCognitiveOperation(cognitiveRequest);
  }

  /**
   * Generate actuator commands based on cognitive processing
   */
  async generateActuatorCommands(agentId: string, cognitiveState: any): Promise<ActuatorCommand[]> {
    const agent = this.activeAgents.get(agentId);
    if (!agent) {
      return [];
    }

    // Process cognitive state to generate actions
    const cognitiveRequest: CognitiveOperationRequest = {
      operationId: `unity-action-${agentId}-${Date.now()}`,
      operationType: 'hybrid-synthesis',
      inputData: {
        symbolic: cognitiveState,
        neural: {
          actionPlanning: true,
          environmentContext: cognitiveState.environment
        }
      },
      context: {
        priority: 0.9,
        timeout: 500 // Quick action response
      }
    };

    const response = await this.cognitiveAPI.processCognitiveOperation(cognitiveRequest);
    
    // Convert cognitive response to actuator commands
    return this.convertToActuatorCommands(response.result);
  }

  /**
   * Update GameObject cognitive mapping
   */
  async updateGameObjectMapping(gameObject: Unity3DGameObject): Promise<void> {
    this.gameObjects.set(gameObject.instanceId, gameObject);
    
    if (gameObject.cognitiveMapping) {
      // Create state propagation for updated mapping
      await this.cognitiveAPI.propagateStateChange({
        nodeId: gameObject.cognitiveMapping.nodeId,
        operation: 'update',
        data: {
          transform: gameObject.transform,
          semanticTags: gameObject.cognitiveMapping.semanticTags
        },
        priority: 0.6
      });
    }
  }

  private convertToActuatorCommands(cognitiveResult: any): ActuatorCommand[] {
    // Simulated conversion from cognitive output to Unity actuator commands
    const commands: ActuatorCommand[] = [];
    
    if (cognitiveResult.movement) {
      commands.push({
        actuatorId: 'movement-controller',
        commandType: 'velocity',
        value: cognitiveResult.movement.velocity || { x: 0, y: 0, z: 0 },
        priority: 0.8
      });
    }

    if (cognitiveResult.rotation) {
      commands.push({
        actuatorId: 'rotation-controller',
        commandType: 'position',
        value: cognitiveResult.rotation.target || { x: 0, y: 0, z: 0 },
        priority: 0.7
      });
    }

    return commands;
  }
}

// ROS Integration Types
export interface ROSNode {
  nodeId: string;
  nodeName: string;
  namespace: string;
  topics: {
    subscribed: string[];
    published: string[];
  };
  services: {
    provided: string[];
    required: string[];
  };
}

export interface ROSMessage {
  topic: string;
  messageType: string;
  timestamp: number;
  data: any;
  header?: {
    seq: number;
    stamp: number;
    frameId: string;
  };
}

export interface ROSServiceRequest {
  serviceName: string;
  requestType: string;
  parameters: any;
  timeout: number;
}

/**
 * ROS (Robot Operating System) Embodiment Interface
 * 
 * Provides cognitive integration for ROS-based robotic systems.
 */
export class ROSEmbodimentInterface {
  private cognitiveAPI: DistributedCognitiveAPI;
  private webSocketInterface: CognitiveWebSocketInterface;
  private rosNodes: Map<string, ROSNode>;
  private topicSubscriptions: Map<string, Set<string>>; // topic -> nodeIds
  private serviceProviders: Map<string, string>; // service -> nodeId
  private messageQueue: ROSMessage[];

  constructor(cognitiveAPI: DistributedCognitiveAPI, webSocketInterface: CognitiveWebSocketInterface) {
    this.cognitiveAPI = cognitiveAPI;
    this.webSocketInterface = webSocketInterface;
    this.rosNodes = new Map();
    this.topicSubscriptions = new Map();
    this.serviceProviders = new Map();
    this.messageQueue = [];
  }

  /**
   * Register ROS node with cognitive capabilities
   */
  async registerROSNode(node: ROSNode): Promise<boolean> {
    try {
      this.rosNodes.set(node.nodeId, node);
      
      // Register subscriptions
      for (const topic of node.topics.subscribed) {
        if (!this.topicSubscriptions.has(topic)) {
          this.topicSubscriptions.set(topic, new Set());
        }
        this.topicSubscriptions.get(topic)!.add(node.nodeId);
      }

      // Register service providers
      for (const service of node.services.provided) {
        this.serviceProviders.set(service, node.nodeId);
      }

      // Create cognitive representation of ROS node
      const cognitiveRequest: CognitiveOperationRequest = {
        operationId: `ros-node-init-${node.nodeId}`,
        operationType: 'symbolic-reasoning',
        inputData: {
          nodeId: node.nodeId,
          nodeName: node.nodeName,
          capabilities: {
            topics: node.topics,
            services: node.services
          }
        },
        context: {
          priority: 0.7,
          timeout: 3000
        }
      };

      await this.cognitiveAPI.processCognitiveOperation(cognitiveRequest);
      return true;
    } catch (error) {
      console.error(`ROS node registration failed for ${node.nodeId}:`, error);
      return false;
    }
  }

  /**
   * Process incoming ROS message with cognitive analysis
   */
  async processROSMessage(message: ROSMessage): Promise<CognitiveOperationResponse | null> {
    // Check if any cognitive nodes are subscribed to this topic
    const subscribers = this.topicSubscriptions.get(message.topic);
    if (!subscribers || subscribers.size === 0) {
      return null;
    }

    // Create cognitive operation for message processing
    const cognitiveRequest: CognitiveOperationRequest = {
      operationId: `ros-msg-${message.topic}-${message.timestamp}`,
      operationType: 'neural-inference',
      inputData: {
        topic: message.topic,
        messageType: message.messageType,
        data: message.data,
        subscribers: Array.from(subscribers)
      },
      context: {
        priority: 0.6,
        timeout: 2000
      }
    };

    return await this.cognitiveAPI.processCognitiveOperation(cognitiveRequest);
  }

  /**
   * Handle ROS service request with cognitive processing
   */
  async processServiceRequest(request: ROSServiceRequest): Promise<any> {
    const provider = this.serviceProviders.get(request.serviceName);
    if (!provider) {
      throw new Error(`No provider found for service: ${request.serviceName}`);
    }

    // Create cognitive operation for service processing
    const cognitiveRequest: CognitiveOperationRequest = {
      operationId: `ros-service-${request.serviceName}-${Date.now()}`,
      operationType: 'hybrid-synthesis',
      inputData: {
        symbolic: {
          serviceName: request.serviceName,
          requestType: request.requestType,
          provider: provider
        },
        neural: {
          parameters: request.parameters,
          semanticContext: await this.extractSemanticContext(request)
        }
      },
      context: {
        priority: 0.8,
        timeout: request.timeout
      }
    };

    const response = await this.cognitiveAPI.processCognitiveOperation(cognitiveRequest);
    return this.formatServiceResponse(response.result);
  }

  /**
   * Publish ROS message based on cognitive decision
   */
  async publishCognitiveMessage(nodeId: string, cognitiveOutput: any): Promise<ROSMessage[]> {
    const node = this.rosNodes.get(nodeId);
    if (!node) {
      throw new Error(`ROS node not found: ${nodeId}`);
    }

    const messages: ROSMessage[] = [];

    // Convert cognitive output to ROS messages
    for (const topic of node.topics.published) {
      const messageData = this.convertCognitiveToROSMessage(topic, cognitiveOutput);
      if (messageData) {
        const message: ROSMessage = {
          topic,
          messageType: this.getMessageType(topic),
          timestamp: Date.now(),
          data: messageData,
          header: {
            seq: this.generateSequenceNumber(),
            stamp: Date.now(),
            frameId: `cognitive_${nodeId}`
          }
        };
        messages.push(message);
      }
    }

    return messages;
  }

  private async extractSemanticContext(request: ROSServiceRequest): Promise<any> {
    // Extract semantic meaning from service request
    return {
      intent: this.inferIntent(request.serviceName),
      urgency: this.calculateUrgency(request.timeout),
      complexity: this.assessComplexity(request.parameters)
    };
  }

  private formatServiceResponse(cognitiveResult: any): any {
    // Format cognitive response for ROS service
    return {
      success: true,
      result: cognitiveResult.output || {},
      confidence: cognitiveResult.confidence || 0.5,
      processingTime: cognitiveResult.processingTime || 0
    };
  }

  private convertCognitiveToROSMessage(topic: string, cognitiveOutput: any): any | null {
    // Convert cognitive output to appropriate ROS message format
    if (topic.includes('cmd_vel') && cognitiveOutput.movement) {
      return {
        linear: cognitiveOutput.movement.linear || { x: 0, y: 0, z: 0 },
        angular: cognitiveOutput.movement.angular || { x: 0, y: 0, z: 0 }
      };
    }

    if (topic.includes('goal') && cognitiveOutput.planning) {
      return {
        target_pose: cognitiveOutput.planning.targetPose || {},
        tolerance: cognitiveOutput.planning.tolerance || 0.1
      };
    }

    return null;
  }

  private getMessageType(topic: string): string {
    // Infer ROS message type from topic name
    if (topic.includes('cmd_vel')) return 'geometry_msgs/Twist';
    if (topic.includes('pose')) return 'geometry_msgs/PoseStamped';
    if (topic.includes('image')) return 'sensor_msgs/Image';
    if (topic.includes('scan')) return 'sensor_msgs/LaserScan';
    return 'std_msgs/String';
  }

  private generateSequenceNumber(): number {
    return Math.floor(Math.random() * 1000000);
  }

  private inferIntent(serviceName: string): string {
    if (serviceName.includes('move')) return 'navigation';
    if (serviceName.includes('grasp')) return 'manipulation';
    if (serviceName.includes('detect')) return 'perception';
    return 'general';
  }

  private calculateUrgency(timeout: number): number {
    return Math.max(0, Math.min(1, (5000 - timeout) / 5000));
  }

  private assessComplexity(parameters: any): number {
    const paramCount = Object.keys(parameters || {}).length;
    return Math.min(1, paramCount / 10);
  }
}

// Web Agent Integration
export interface WebAgent {
  agentId: string;
  agentType: 'browser' | 'mobile' | 'iot' | 'service';
  capabilities: {
    userInterface: boolean;
    dataCollection: boolean;
    actuation: boolean;
    learning: boolean;
  };
  configuration: {
    updateFrequency: number;
    maxLatency: number;
    privacyLevel: 'low' | 'medium' | 'high';
  };
}

export interface WebAgentInteraction {
  interactionId: string;
  agentId: string;
  timestamp: number;
  interactionType: 'user-input' | 'sensor-reading' | 'system-event' | 'cognitive-request';
  data: any;
  context: {
    sessionId?: string;
    userId?: string;
    location?: {
      url?: string;
      coordinates?: EmbodimentVector3;
    };
  };
}

/**
 * Web Agent Embodiment Interface
 * 
 * Provides cognitive integration for web-based agents including browsers,
 * mobile apps, and IoT devices.
 */
export class WebAgentEmbodimentInterface {
  private cognitiveAPI: DistributedCognitiveAPI;
  private webSocketInterface: CognitiveWebSocketInterface;
  private webAgents: Map<string, WebAgent>;
  private activeInteractions: Map<string, WebAgentInteraction>;
  private interactionHistory: WebAgentInteraction[];

  constructor(cognitiveAPI: DistributedCognitiveAPI, webSocketInterface: CognitiveWebSocketInterface) {
    this.cognitiveAPI = cognitiveAPI;
    this.webSocketInterface = webSocketInterface;
    this.webAgents = new Map();
    this.activeInteractions = new Map();
    this.interactionHistory = [];
  }

  /**
   * Register web agent with cognitive capabilities
   */
  async registerWebAgent(agent: WebAgent): Promise<boolean> {
    try {
      this.webAgents.set(agent.agentId, agent);

      // Create cognitive representation
      const cognitiveRequest: CognitiveOperationRequest = {
        operationId: `web-agent-init-${agent.agentId}`,
        operationType: 'symbolic-reasoning',
        inputData: {
          agentId: agent.agentId,
          agentType: agent.agentType,
          capabilities: agent.capabilities,
          configuration: agent.configuration
        },
        context: {
          priority: 0.6,
          timeout: 2000
        }
      };

      await this.cognitiveAPI.processCognitiveOperation(cognitiveRequest);
      return true;
    } catch (error) {
      console.error(`Web agent registration failed for ${agent.agentId}:`, error);
      return false;
    }
  }

  /**
   * Process web agent interaction with cognitive analysis
   */
  async processWebAgentInteraction(interaction: WebAgentInteraction): Promise<CognitiveOperationResponse> {
    const agent = this.webAgents.get(interaction.agentId);
    if (!agent) {
      throw new Error(`Unknown web agent: ${interaction.agentId}`);
    }

    // Store interaction
    this.activeInteractions.set(interaction.interactionId, interaction);
    this.interactionHistory.push(interaction);

    // Limit history size
    if (this.interactionHistory.length > 1000) {
      this.interactionHistory = this.interactionHistory.slice(-500);
    }

    // Create cognitive operation for interaction processing
    const cognitiveRequest: CognitiveOperationRequest = {
      operationId: `web-interaction-${interaction.interactionId}`,
      operationType: this.selectProcessingType(interaction),
      inputData: {
        interaction,
        agent,
        context: await this.buildInteractionContext(interaction)
      },
      context: {
        priority: this.calculateInteractionPriority(interaction),
        timeout: agent.configuration.maxLatency
      }
    };

    const response = await this.cognitiveAPI.processCognitiveOperation(cognitiveRequest);
    
    // Cleanup
    this.activeInteractions.delete(interaction.interactionId);
    
    return response;
  }

  /**
   * Generate web agent response based on cognitive processing
   */
  async generateWebAgentResponse(agentId: string, cognitiveResult: any): Promise<{
    responseType: 'ui-update' | 'data-request' | 'action-command' | 'notification';
    data: any;
    metadata: {
      confidence: number;
      suggestedActions?: string[];
      learningFeedback?: any;
    };
  }> {
    const agent = this.webAgents.get(agentId);
    if (!agent) {
      throw new Error(`Unknown web agent: ${agentId}`);
    }

    // Convert cognitive result to web agent response
    const responseType = this.determineResponseType(cognitiveResult, agent);
    const responseData = this.formatResponseData(cognitiveResult, responseType, agent);

    return {
      responseType,
      data: responseData,
      metadata: {
        confidence: cognitiveResult.confidence || 0.5,
        suggestedActions: this.generateSuggestedActions(cognitiveResult, agent),
        learningFeedback: this.extractLearningFeedback(cognitiveResult)
      }
    };
  }

  /**
   * Get interaction analytics for web agents
   */
  getInteractionAnalytics(agentId?: string): {
    totalInteractions: number;
    interactionTypes: Record<string, number>;
    averageProcessingTime: number;
    userSatisfactionScore: number;
    learningProgress: number;
  } {
    const relevantInteractions = agentId 
      ? this.interactionHistory.filter(i => i.agentId === agentId)
      : this.interactionHistory;

    const interactionTypes = relevantInteractions.reduce((acc, interaction) => {
      acc[interaction.interactionType] = (acc[interaction.interactionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalInteractions: relevantInteractions.length,
      interactionTypes,
      averageProcessingTime: this.calculateAverageProcessingTime(relevantInteractions),
      userSatisfactionScore: this.calculateSatisfactionScore(relevantInteractions),
      learningProgress: this.calculateLearningProgress(relevantInteractions)
    };
  }

  // Private helper methods

  private selectProcessingType(interaction: WebAgentInteraction): 'symbolic-reasoning' | 'neural-inference' | 'hybrid-synthesis' {
    switch (interaction.interactionType) {
      case 'user-input':
        return 'hybrid-synthesis'; // Combine symbolic understanding with neural processing
      case 'sensor-reading':
        return 'neural-inference'; // Process sensor data with neural networks
      case 'system-event':
        return 'symbolic-reasoning'; // Logical processing of system events
      case 'cognitive-request':
        return 'hybrid-synthesis'; // Complex cognitive processing
      default:
        return 'symbolic-reasoning';
    }
  }

  private async buildInteractionContext(interaction: WebAgentInteraction): Promise<any> {
    // Build context from interaction history and agent capabilities
    const recentInteractions = this.interactionHistory
      .filter(i => i.agentId === interaction.agentId)
      .slice(-5); // Last 5 interactions

    return {
      recentHistory: recentInteractions,
      sessionContext: interaction.context,
      temporalContext: {
        timeOfDay: new Date().getHours(),
        dayOfWeek: new Date().getDay(),
        timeSinceLastInteraction: this.getTimeSinceLastInteraction(interaction.agentId)
      }
    };
  }

  private calculateInteractionPriority(interaction: WebAgentInteraction): number {
    // Calculate priority based on interaction type and context
    const basePriority = {
      'cognitive-request': 0.9,
      'user-input': 0.8,
      'sensor-reading': 0.6,
      'system-event': 0.5
    };

    return basePriority[interaction.interactionType] || 0.5;
  }

  private determineResponseType(cognitiveResult: any, agent: WebAgent): 'ui-update' | 'data-request' | 'action-command' | 'notification' {
    if (agent.capabilities.userInterface && cognitiveResult.uiChanges) {
      return 'ui-update';
    }
    if (agent.capabilities.dataCollection && cognitiveResult.dataNeeded) {
      return 'data-request';
    }
    if (agent.capabilities.actuation && cognitiveResult.actions) {
      return 'action-command';
    }
    return 'notification';
  }

  private formatResponseData(cognitiveResult: any, responseType: string, agent: WebAgent): any {
    switch (responseType) {
      case 'ui-update':
        return {
          elements: cognitiveResult.uiChanges || [],
          animation: cognitiveResult.animation || 'none',
          priority: cognitiveResult.priority || 'normal'
        };
      case 'data-request':
        return {
          dataTypes: cognitiveResult.dataNeeded || [],
          urgency: cognitiveResult.urgency || 'low',
          privacy: agent.configuration.privacyLevel
        };
      case 'action-command':
        return {
          actions: cognitiveResult.actions || [],
          sequence: cognitiveResult.sequence || 'parallel',
          timeout: cognitiveResult.timeout || 5000
        };
      case 'notification':
        return {
          message: cognitiveResult.message || 'Processing complete',
          type: cognitiveResult.notificationType || 'info',
          duration: cognitiveResult.duration || 3000
        };
      default:
        return cognitiveResult;
    }
  }

  private generateSuggestedActions(cognitiveResult: any, agent: WebAgent): string[] {
    const suggestions: string[] = [];
    
    if (agent.capabilities.learning && cognitiveResult.learningOpportunity) {
      suggestions.push('Enable adaptive learning for better personalization');
    }
    
    if (agent.capabilities.userInterface && cognitiveResult.efficiency < 0.7) {
      suggestions.push('Optimize user interface based on interaction patterns');
    }
    
    return suggestions;
  }

  private extractLearningFeedback(cognitiveResult: any): any {
    return {
      patternRecognition: cognitiveResult.patterns || [],
      performanceMetrics: cognitiveResult.performance || {},
      improvementAreas: cognitiveResult.improvements || []
    };
  }

  private calculateAverageProcessingTime(interactions: WebAgentInteraction[]): number {
    // Simulated processing time calculation
    return interactions.length > 0 ? Math.random() * 100 + 50 : 0;
  }

  private calculateSatisfactionScore(interactions: WebAgentInteraction[]): number {
    // Simulated satisfaction score
    return Math.random() * 0.3 + 0.7; // 70-100%
  }

  private calculateLearningProgress(interactions: WebAgentInteraction[]): number {
    // Simulated learning progress
    return Math.min(1.0, interactions.length / 100);
  }

  private getTimeSinceLastInteraction(agentId: string): number {
    const lastInteraction = this.interactionHistory
      .filter(i => i.agentId === agentId)
      .pop();
    
    return lastInteraction ? Date.now() - lastInteraction.timestamp : 0;
  }
}