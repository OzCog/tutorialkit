/**
 * Phase 4: Real-time WebSocket Interface
 * 
 * WebSocket server for real-time cognitive operations and live state synchronization
 * across the distributed mesh network.
 */

import { DistributedCognitiveAPI, CognitiveOperationRequest, CognitiveOperationResponse, DistributedStateSnapshot } from './phase4-cognitive-api';

// WebSocket Message Types
export interface WebSocketMessage {
  messageId: string;
  timestamp: number;
  type: 'request' | 'response' | 'event' | 'state-update' | 'heartbeat';
  payload: any;
}

export interface CognitiveWebSocketRequest extends WebSocketMessage {
  type: 'request';
  payload: {
    operation: CognitiveOperationRequest;
    streaming?: boolean;
    progressUpdates?: boolean;
  };
}

export interface CognitiveWebSocketResponse extends WebSocketMessage {
  type: 'response';
  payload: {
    requestId: string;
    response: CognitiveOperationResponse;
    isComplete: boolean;
    progressData?: {
      stage: string;
      completion: number;
      estimatedTimeRemaining: number;
    };
  };
}

export interface StateUpdateEvent extends WebSocketMessage {
  type: 'state-update';
  payload: {
    updateType: 'topology-change' | 'attention-shift' | 'performance-alert' | 'resource-availability';
    data: any;
    affectedNodes?: string[];
  };
}

export interface RealTimeMetrics {
  connectionCount: number;
  activeOperations: number;
  messagesThroughput: number;
  averageLatency: number;
  errorRate: number;
  bandwidthUsage: {
    incoming: number;
    outgoing: number;
  };
}

/**
 * Connection Manager for WebSocket clients
 */
export class CognitiveWebSocketConnection {
  public readonly id: string;
  public readonly connectedAt: number;
  public isActive: boolean;
  public subscriptions: Set<string>;
  public metrics: {
    messagesSent: number;
    messagesReceived: number;
    bytesTransferred: number;
    lastActivity: number;
  };

  constructor(id: string) {
    this.id = id;
    this.connectedAt = Date.now();
    this.isActive = true;
    this.subscriptions = new Set();
    this.metrics = {
      messagesSent: 0,
      messagesReceived: 0,
      bytesTransferred: 0,
      lastActivity: Date.now()
    };
  }

  subscribe(eventType: string): void {
    this.subscriptions.add(eventType);
  }

  unsubscribe(eventType: string): void {
    this.subscriptions.delete(eventType);
  }

  updateActivity(): void {
    this.metrics.lastActivity = Date.now();
  }

  recordMessage(sent: boolean, bytes: number): void {
    if (sent) {
      this.metrics.messagesSent++;
    } else {
      this.metrics.messagesReceived++;
    }
    this.metrics.bytesTransferred += bytes;
    this.updateActivity();
  }
}

/**
 * Real-time WebSocket Interface for Cognitive Operations
 * 
 * Provides live bidirectional communication for cognitive processing,
 * state synchronization, and performance monitoring.
 */
export class CognitiveWebSocketInterface {
  private cognitiveAPI: DistributedCognitiveAPI;
  private connections: Map<string, CognitiveWebSocketConnection>;
  private activeStreams: Map<string, { connectionId: string; operationId: string }>;
  private eventSubscriptions: Map<string, Set<string>>; // eventType -> connectionIds
  private metrics: RealTimeMetrics;
  private metricsInterval: NodeJS.Timeout | null;

  constructor(cognitiveAPI: DistributedCognitiveAPI) {
    this.cognitiveAPI = cognitiveAPI;
    this.connections = new Map();
    this.activeStreams = new Map();
    this.eventSubscriptions = new Map();
    this.metrics = {
      connectionCount: 0,
      activeOperations: 0,
      messagesThroughput: 0,
      averageLatency: 0,
      errorRate: 0,
      bandwidthUsage: { incoming: 0, outgoing: 0 }
    };
    this.metricsInterval = null;
    this.startMetricsCollection();
  }

  /**
   * Handle new WebSocket connection
   */
  async handleConnection(connectionId: string): Promise<CognitiveWebSocketConnection> {
    const connection = new CognitiveWebSocketConnection(connectionId);
    this.connections.set(connectionId, connection);
    this.metrics.connectionCount = this.connections.size;

    // Send welcome message with current state
    const welcomeMessage: WebSocketMessage = {
      messageId: this.generateMessageId(),
      timestamp: Date.now(),
      type: 'event',
      payload: {
        eventType: 'connection-established',
        connectionId,
        capabilities: {
          cognitiveOperations: true,
          realTimeStreaming: true,
          stateSubscription: true,
          performanceMonitoring: true
        },
        currentState: await this.cognitiveAPI.getDistributedState()
      }
    };

    await this.sendMessage(connectionId, welcomeMessage);
    return connection;
  }

  /**
   * Handle WebSocket disconnection
   */
  async handleDisconnection(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    // Cleanup active streams
    for (const [streamId, stream] of this.activeStreams.entries()) {
      if (stream.connectionId === connectionId) {
        this.activeStreams.delete(streamId);
      }
    }

    // Remove from event subscriptions
    for (const [eventType, subscribers] of this.eventSubscriptions.entries()) {
      subscribers.delete(connectionId);
      if (subscribers.size === 0) {
        this.eventSubscriptions.delete(eventType);
      }
    }

    // Remove connection
    this.connections.delete(connectionId);
    this.metrics.connectionCount = this.connections.size;
  }

  /**
   * Process incoming WebSocket message
   */
  async processMessage(connectionId: string, message: WebSocketMessage): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.isActive) {
      return;
    }

    connection.recordMessage(false, JSON.stringify(message).length);

    try {
      switch (message.type) {
        case 'request':
          await this.handleCognitiveRequest(connectionId, message as CognitiveWebSocketRequest);
          break;

        case 'event':
          await this.handleEventMessage(connectionId, message);
          break;

        case 'heartbeat':
          await this.handleHeartbeat(connectionId, message);
          break;

        default:
          await this.sendErrorResponse(connectionId, message.messageId, `Unknown message type: ${message.type}`);
      }
    } catch (error) {
      await this.sendErrorResponse(connectionId, message.messageId, error.message);
    }
  }

  /**
   * Handle cognitive operation request
   */
  private async handleCognitiveRequest(connectionId: string, message: CognitiveWebSocketRequest): Promise<void> {
    const { operation, streaming, progressUpdates } = message.payload;
    this.metrics.activeOperations++;

    try {
      if (streaming || progressUpdates) {
        // Handle streaming response
        await this.handleStreamingOperation(connectionId, message.messageId, operation, progressUpdates || false);
      } else {
        // Handle standard request-response
        const startTime = performance.now();
        const response = await this.cognitiveAPI.processCognitiveOperation(operation);
        const latency = performance.now() - startTime;
        
        this.updateLatencyMetrics(latency);
        
        const responseMessage: CognitiveWebSocketResponse = {
          messageId: this.generateMessageId(),
          timestamp: Date.now(),
          type: 'response',
          payload: {
            requestId: message.messageId,
            response,
            isComplete: true
          }
        };

        await this.sendMessage(connectionId, responseMessage);
      }
    } catch (error) {
      await this.sendErrorResponse(connectionId, message.messageId, error.message);
    } finally {
      this.metrics.activeOperations--;
    }
  }

  /**
   * Handle streaming cognitive operation with progress updates
   */
  private async handleStreamingOperation(
    connectionId: string,
    requestId: string,
    operation: CognitiveOperationRequest,
    progressUpdates: boolean
  ): Promise<void> {
    const streamId = this.generateMessageId();
    this.activeStreams.set(streamId, { connectionId, operationId: operation.operationId });

    try {
      // Send operation start notification
      if (progressUpdates) {
        await this.sendProgressUpdate(connectionId, requestId, 'initialization', 0, 1000);
      }

      // Simulate processing stages with progress updates
      const stages = ['parsing', 'tensor-mapping', 'neural-processing', 'synthesis', 'finalization'];
      const stageProgress = 100 / stages.length;

      let currentProgress = 0;
      
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        
        if (progressUpdates) {
          await this.sendProgressUpdate(
            connectionId, 
            requestId, 
            stage, 
            currentProgress, 
            (stages.length - i) * 200
          );
        }

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
        currentProgress += stageProgress;
      }

      // Execute actual operation
      const response = await this.cognitiveAPI.processCognitiveOperation(operation);

      // Send final response
      const responseMessage: CognitiveWebSocketResponse = {
        messageId: this.generateMessageId(),
        timestamp: Date.now(),
        type: 'response',
        payload: {
          requestId,
          response,
          isComplete: true,
          progressData: {
            stage: 'completed',
            completion: 100,
            estimatedTimeRemaining: 0
          }
        }
      };

      await this.sendMessage(connectionId, responseMessage);

    } finally {
      this.activeStreams.delete(streamId);
    }
  }

  /**
   * Handle event subscription/unsubscription
   */
  private async handleEventMessage(connectionId: string, message: WebSocketMessage): Promise<void> {
    const { eventType, action } = message.payload;

    if (action === 'subscribe') {
      this.subscribeToEvent(connectionId, eventType);
    } else if (action === 'unsubscribe') {
      this.unsubscribeFromEvent(connectionId, eventType);
    }

    // Send acknowledgment
    const ackMessage: WebSocketMessage = {
      messageId: this.generateMessageId(),
      timestamp: Date.now(),
      type: 'event',
      payload: {
        eventType: 'subscription-confirmed',
        action,
        eventType: eventType
      }
    };

    await this.sendMessage(connectionId, ackMessage);
  }

  /**
   * Handle heartbeat message
   */
  private async handleHeartbeat(connectionId: string, message: WebSocketMessage): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.updateActivity();
      
      // Send heartbeat response
      const heartbeatResponse: WebSocketMessage = {
        messageId: this.generateMessageId(),
        timestamp: Date.now(),
        type: 'heartbeat',
        payload: {
          connectionId,
          serverTime: Date.now(),
          metrics: {
            uptime: Date.now() - connection.connectedAt,
            messagesSent: connection.metrics.messagesSent,
            messagesReceived: connection.metrics.messagesReceived
          }
        }
      };

      await this.sendMessage(connectionId, heartbeatResponse);
    }
  }

  /**
   * Broadcast state update to subscribed connections
   */
  async broadcastStateUpdate(updateType: string, data: any, affectedNodes?: string[]): Promise<void> {
    const subscribers = this.eventSubscriptions.get(updateType) || new Set();
    
    const stateUpdate: StateUpdateEvent = {
      messageId: this.generateMessageId(),
      timestamp: Date.now(),
      type: 'state-update',
      payload: {
        updateType: updateType as any,
        data,
        affectedNodes
      }
    };

    const broadcastPromises = Array.from(subscribers).map(connectionId =>
      this.sendMessage(connectionId, stateUpdate)
    );

    await Promise.all(broadcastPromises);
  }

  /**
   * Send periodic distributed state snapshots
   */
  async sendStateSnapshot(): Promise<void> {
    const state = await this.cognitiveAPI.getDistributedState();
    await this.broadcastStateUpdate('state-snapshot', state);
  }

  /**
   * Get real-time metrics
   */
  getRealTimeMetrics(): RealTimeMetrics {
    return { ...this.metrics };
  }

  /**
   * Get connection statistics
   */
  getConnectionStatistics(): {
    totalConnections: number;
    activeConnections: number;
    averageConnectionAge: number;
    totalBytesTransferred: number;
  } {
    const activeConnections = Array.from(this.connections.values()).filter(c => c.isActive);
    const now = Date.now();
    
    const totalConnectionAge = activeConnections.reduce((sum, conn) => sum + (now - conn.connectedAt), 0);
    const averageConnectionAge = activeConnections.length > 0 ? totalConnectionAge / activeConnections.length : 0;
    
    const totalBytesTransferred = activeConnections.reduce((sum, conn) => sum + conn.metrics.bytesTransferred, 0);

    return {
      totalConnections: this.connections.size,
      activeConnections: activeConnections.length,
      averageConnectionAge,
      totalBytesTransferred
    };
  }

  // Private helper methods

  private subscribeToEvent(connectionId: string, eventType: string): void {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    connection.subscribe(eventType);
    
    if (!this.eventSubscriptions.has(eventType)) {
      this.eventSubscriptions.set(eventType, new Set());
    }
    this.eventSubscriptions.get(eventType)!.add(connectionId);
  }

  private unsubscribeFromEvent(connectionId: string, eventType: string): void {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    connection.unsubscribe(eventType);
    
    const subscribers = this.eventSubscriptions.get(eventType);
    if (subscribers) {
      subscribers.delete(connectionId);
      if (subscribers.size === 0) {
        this.eventSubscriptions.delete(eventType);
      }
    }
  }

  private async sendMessage(connectionId: string, message: WebSocketMessage): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.isActive) {
      return;
    }

    // In real implementation, this would use actual WebSocket.send()
    // For now, we simulate the message sending
    const messageSize = JSON.stringify(message).length;
    connection.recordMessage(true, messageSize);
    this.metrics.bandwidthUsage.outgoing += messageSize;
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5 + 1));
  }

  private async sendProgressUpdate(
    connectionId: string,
    requestId: string,
    stage: string,
    completion: number,
    estimatedTimeRemaining: number
  ): Promise<void> {
    const progressMessage: CognitiveWebSocketResponse = {
      messageId: this.generateMessageId(),
      timestamp: Date.now(),
      type: 'response',
      payload: {
        requestId,
        response: {
          operationId: requestId,
          status: 'processing',
          metrics: {
            processingTime: 0,
            memoryUsage: process.memoryUsage().heapUsed
          }
        },
        isComplete: false,
        progressData: {
          stage,
          completion,
          estimatedTimeRemaining
        }
      }
    };

    await this.sendMessage(connectionId, progressMessage);
  }

  private async sendErrorResponse(connectionId: string, requestId: string, error: string): Promise<void> {
    const errorMessage: WebSocketMessage = {
      messageId: this.generateMessageId(),
      timestamp: Date.now(),
      type: 'response',
      payload: {
        requestId,
        error,
        status: 'error'
      }
    };

    await this.sendMessage(connectionId, errorMessage);
    this.metrics.errorRate = (this.metrics.errorRate * 0.9) + 0.1; // Exponential moving average
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateLatencyMetrics(latency: number): void {
    // Exponential moving average for latency
    this.metrics.averageLatency = (this.metrics.averageLatency * 0.9) + (latency * 0.1);
  }

  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      // Update throughput metrics
      const connections = Array.from(this.connections.values());
      const totalMessages = connections.reduce((sum, conn) => sum + conn.metrics.messagesSent + conn.metrics.messagesReceived, 0);
      this.metrics.messagesThroughput = totalMessages / 60; // Messages per minute

      // Update bandwidth usage
      const totalBytes = connections.reduce((sum, conn) => sum + conn.metrics.bytesTransferred, 0);
      this.metrics.bandwidthUsage.incoming = totalBytes * 0.4; // Estimate
      this.metrics.bandwidthUsage.outgoing = totalBytes * 0.6; // Estimate

      // Clean up inactive connections
      this.cleanupInactiveConnections();
    }, 5000); // Update every 5 seconds
  }

  private cleanupInactiveConnections(): void {
    const now = Date.now();
    const timeoutThreshold = 5 * 60 * 1000; // 5 minutes

    for (const [connectionId, connection] of this.connections.entries()) {
      if (now - connection.metrics.lastActivity > timeoutThreshold) {
        connection.isActive = false;
        this.handleDisconnection(connectionId);
      }
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
    
    this.connections.clear();
    this.activeStreams.clear();
    this.eventSubscriptions.clear();
  }
}