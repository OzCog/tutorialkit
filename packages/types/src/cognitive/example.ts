import type { Lesson, Tutorial } from '../entities/index.js';
import { TutorialKitCognitiveIntegration } from './integration.js';

/**
 * Practical example demonstrating the Distributed GGML Tensor Network
 * for TutorialKit cognitive processing.
 */

// Example lesson data
const exampleLesson: Lesson = {
  id: 'react-intro',
  order: 1,
  data: {
    type: 'lesson',
    title: 'Introduction to React Components',
    mainCommand: 'npm start',
    prepareCommands: ['npm install', 'npm run build'],
    focus: '/src/components/App.jsx',
    previews: [
      { title: 'App', port: 3000, pathname: '/' },
      { title: 'Component Tree', port: 3000, pathname: '/components' }
    ],
    editor: {
      fileTree: { allowEdits: true }
    },
    terminal: {
      panels: ['output']
    }
  },
  part: { id: 'getting-started', title: 'Getting Started with React' },
  chapter: { id: 'components', title: 'React Components' },
  slug: 'react-intro',
  filepath: '/lessons/react-intro.mdx',
  files: ['lesson-files', ['App.jsx', 'index.js', 'package.json']],
  solution: ['solution-files', ['App-solution.jsx', 'index-solution.js']],
  Markdown: null,
  next: { href: '/react-props', title: 'React Props' },
  prev: { href: '/setup', title: 'Environment Setup' }
};

// Example tutorial structure
const exampleTutorial: Tutorial = {
  logoLink: 'https://react.dev',
  parts: {
    'getting-started': {
      id: 'getting-started',
      order: 1,
      slug: 'getting-started',
      data: {
        type: 'part',
        title: 'Getting Started with React'
      },
      chapters: {
        'setup': {
          id: 'setup',
          order: 1,
          slug: 'setup',
          data: {
            type: 'chapter',
            title: 'Environment Setup'
          }
        },
        'components': {
          id: 'components',
          order: 2,
          slug: 'components',
          data: {
            type: 'chapter',
            title: 'React Components'
          }
        }
      }
    },
    'advanced-concepts': {
      id: 'advanced-concepts',
      order: 2,
      slug: 'advanced-concepts',
      data: {
        type: 'part',
        title: 'Advanced React Concepts'
      },
      chapters: {
        'hooks': {
          id: 'hooks',
          order: 1,
          slug: 'hooks',
          data: {
            type: 'chapter',
            title: 'React Hooks'
          }
        },
        'context': {
          id: 'context',
          order: 2,
          slug: 'context',
          data: {
            type: 'chapter',
            title: 'Context API'
          }
        }
      }
    }
  },
  lessons: [
    exampleLesson,
    {
      id: 'react-props',
      order: 2,
      data: {
        type: 'lesson',
        title: 'Understanding React Props',
        mainCommand: 'npm start',
        focus: '/src/components/UserCard.jsx'
      },
      part: { id: 'getting-started', title: 'Getting Started with React' },
      chapter: { id: 'components', title: 'React Components' },
      slug: 'react-props',
      filepath: '/lessons/react-props.mdx',
      files: ['lesson-files', ['UserCard.jsx', 'App.jsx']],
      solution: ['solution-files', ['UserCard-solution.jsx']],
      Markdown: null
    }
  ]
};

/**
 * Demonstrates the complete cognitive tensor network processing pipeline
 */
export async function demonstrateCognitiveTensorNetwork(): Promise<void> {
  console.log('🧠 Initializing Distributed GGML Tensor Network for TutorialKit...\n');

  // Initialize the cognitive integration system
  const cognitiveSystem = new TutorialKitCognitiveIntegration({
    ggmlBackend: 'cpu',
    maxMemoryMB: 512,
    attentionMechanism: 'ecan',
    membraneEvolution: true,
    primeFactorization: true,
    recursiveExpansion: true
  });

  await cognitiveSystem.initialize();
  console.log('✅ Cognitive tensor network initialized successfully!\n');

  // Process individual lesson
  console.log('📚 Processing individual lesson through cognitive tensor network...');
  const lessonInsights = await cognitiveSystem.generateLessonInsights(exampleLesson);
  
  console.log('\n🔍 Lesson Analysis Results:');
  console.log(`- Complexity Score: ${lessonInsights.complexityScore.toFixed(2)}/10`);
  console.log(`- Cognitive Load: ${lessonInsights.cognitiveLoad.toFixed(2)}/10`);
  console.log(`- Learning Paths: ${lessonInsights.learningPaths.length} identified`);
  console.log(`- Attention Hotspots: ${lessonInsights.attentionHotspots.length} found`);
  console.log(`- Recommendations: ${lessonInsights.recommendations.length} generated`);

  // Display attention hotspots
  if (lessonInsights.attentionHotspots.length > 0) {
    console.log('\n🎯 Top Attention Hotspots:');
    lessonInsights.attentionHotspots.slice(0, 3).forEach((hotspot, index) => {
      console.log(`  ${index + 1}. ${hotspot.nodeName} (${hotspot.attentionScore.toFixed(2)}) - ${hotspot.reason}`);
    });
  }

  // Display recommendations
  if (lessonInsights.recommendations.length > 0) {
    console.log('\n💡 Key Recommendations:');
    lessonInsights.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`  ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.suggestion}`);
      console.log(`     Impact: ${rec.impact}`);
    });
  }

  // Process complete tutorial
  console.log('\n\n📖 Processing complete tutorial through cognitive tensor network...');
  const tutorialInsights = await cognitiveSystem.generateTutorialInsights(exampleTutorial);

  console.log('\n🔍 Tutorial Analysis Results:');
  console.log(`- Overall Complexity: ${tutorialInsights.overallComplexity.toFixed(2)}/10`);
  console.log(`- Learning Curve Steepness: ${tutorialInsights.learningCurve.steepness.toFixed(2)}`);
  console.log(`- Learning Bottlenecks: ${tutorialInsights.bottlenecks.length} identified`);
  console.log(`- Optimization Opportunities: ${tutorialInsights.optimizations.length} found`);

  // Display learning curve analysis
  console.log('\n📈 Learning Curve Analysis:');
  console.log(`- Initial Complexity: ${tutorialInsights.learningCurve.initial.toFixed(2)}`);
  console.log(`- Peak Complexity: ${tutorialInsights.learningCurve.peak.toFixed(2)}`);
  console.log(`- Final Complexity: ${tutorialInsights.learningCurve.final.toFixed(2)}`);
  console.log(`- Average Complexity: ${tutorialInsights.learningCurve.average.toFixed(2)}`);

  // Display cognitive flow analysis
  console.log('\n🌊 Cognitive Flow Analysis:');
  console.log(`- Dominant Category: ${tutorialInsights.cognitiveFlow.dominantCategory}`);
  console.log(`- Flow Efficiency: ${tutorialInsights.cognitiveFlow.flowEfficiency.toFixed(2)}`);
  console.log(`- Pattern Diversity: ${tutorialInsights.cognitiveFlow.patterns.length} patterns`);

  // Generate and display mermaid diagrams
  console.log('\n🎨 Generating Cognitive Visualizations...');
  
  console.log('\n📊 Concept Map (Mermaid):');
  console.log('```mermaid');
  console.log(lessonInsights.visualizations.conceptMap);
  console.log('```');

  console.log('\n🎯 Attention Flow Diagram (Mermaid):');
  console.log('```mermaid');
  console.log(lessonInsights.visualizations.attentionFlow);
  console.log('```');

  // Access tensor network internals
  const tensorNetwork = cognitiveSystem.getTensorNetwork();
  const registry = tensorNetwork.registry;
  
  console.log('\n🧮 Tensor Network Statistics:');
  console.log(`- Cognitive Nodes: ${registry.nodes.size}`);
  console.log(`- Tensor Kernels: ${registry.kernels.size}`);
  console.log(`- Grammar Engines: ${registry.engines.size}`);
  console.log(`- Grammars: ${registry.grammars.size}`);

  // Display cache statistics
  const cacheStats = cognitiveSystem.getCacheStats();
  console.log('\n💾 Processing Cache:');
  console.log(`- Cached Results: ${cacheStats.size}`);
  console.log(`- Memory Usage: ${(cacheStats.memoryUsage / 1024).toFixed(2)} KB`);

  console.log('\n🎉 Cognitive tensor network demonstration completed successfully!');
  console.log('\nThis system provides:');
  console.log('- Advanced tutorial content analysis');
  console.log('- Cognitive load assessment');
  console.log('- Learning path optimization');
  console.log('- Attention-based insights');
  console.log('- Automated recommendations');
  console.log('- Interactive visualizations');
  console.log('- Distributed tensor processing');
}

/**
 * Demonstrates advanced cognitive pattern analysis
 */
export async function demonstratePatternAnalysis(): Promise<void> {
  console.log('\n🔬 Advanced Cognitive Pattern Analysis\n');

  const cognitiveSystem = new TutorialKitCognitiveIntegration();
  await cognitiveSystem.initialize();

  // Process the lesson to extract patterns
  const result = await cognitiveSystem.processLesson(exampleLesson);

  console.log('🧬 Extracted Cognitive Patterns:');
  result.patterns.forEach((pattern, index) => {
    console.log(`  ${index + 1}. ${pattern.pattern}`);
    console.log(`     Category: ${pattern.category}`);
    console.log(`     Weight: ${pattern.weight.toFixed(3)}`);
    console.log(`     Conditions: ${pattern.conditions.length}`);
    console.log('');
  });

  console.log('⚡ Activation Levels:');
  for (const [nodeId, activation] of result.activations) {
    const node = result.nodes.find(n => n.id === nodeId);
    if (node && activation > 0.1) {
      console.log(`  ${node.name}: ${activation.toFixed(3)}`);
    }
  }

  console.log('\n🧠 Cognitive Node Details:');
  result.nodes.forEach(node => {
    console.log(`  Node: ${node.name}`);
    console.log(`    Type: ${node.type}`);
    console.log(`    Complexity: ${node.complexity.toFixed(2)}`);
    console.log(`    Arity: ${node.arity}`);
    console.log(`    Connections: ${node.connections.length}`);
    console.log('');
  });

  console.log('🔧 Tensor Kernel Specifications:');
  result.kernels.forEach(kernel => {
    console.log(`  Kernel: ${kernel.id}`);
    console.log(`    Shape: [${kernel.shape.join(', ')}]`);
    console.log(`    Data Type: ${kernel.dtype}`);
    console.log(`    Operations: ${kernel.operations.length}`);
    console.log('');
  });
}

/**
 * Entry point for running the demonstrations
 */
export async function runDemonstrations() {
  try {
    await demonstrateCognitiveTensorNetwork();
    await demonstratePatternAnalysis();
  } catch (error) {
    console.error('Error running demonstrations:', error);
  }
}