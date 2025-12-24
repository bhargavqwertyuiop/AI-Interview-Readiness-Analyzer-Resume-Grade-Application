import { useLocalStorage } from '../hooks/useLocalStorage'

/**
 * Topic descriptions for interview preparation
 */
const TOPIC_DESCRIPTIONS = {
  'Linux Fundamentals': 'Core concepts of Linux operating system, file permissions, and system architecture',
  'Shell Scripting': 'Bash scripting for automation, loops, functions, and advanced shell programming',
  'File System': 'Linux file system hierarchy, inodes, partitioning, and file management',
  'Process Management': 'Process lifecycle, signals, job control, and process monitoring',
  'System Administration': 'User management, package installation, system configuration, and maintenance',
  'Git Basics': 'Git fundamentals, commits, branches, and basic workflow',
  'Branching & Merging': 'Creating branches, merging strategies, and conflict resolution',
  'Git Workflows': 'Git flow, GitHub flow, and collaborative development patterns',
  'Git Hooks': 'Pre-commit hooks, post-commit hooks, and automation with hooks',
  'Version Control Best Practices': 'Commit messages, code review, and version control strategies',
  'Jenkins': 'Jenkins setup, pipelines, plugins, and CI/CD orchestration',
  'GitLab CI': 'GitLab CI/CD, runners, and pipeline configuration',
  'GitHub Actions': 'GitHub Actions workflows, events, and automation',
  'CI/CD Pipelines': 'Pipeline design, testing stages, and deployment strategies',
  'Automated Testing': 'Unit tests, integration tests, and test automation in CI/CD',
  'Docker Basics': 'Docker concepts, images, containers, and the Docker ecosystem',
  'Dockerfile': 'Writing Dockerfiles, optimization, and best practices',
  'Docker Compose': 'Multi-container applications and Docker Compose configuration',
  'Container Orchestration': 'Container runtime concepts and orchestration basics',
  'Docker Networking': 'Docker network types and inter-container communication',
  'K8s Fundamentals': 'Kubernetes concepts, architecture, and components',
  'Pods & Deployments': 'Pod lifecycle, Deployments, and replicas',
  'Services & Ingress': 'Service types, DNS, Ingress controllers, and networking',
  'ConfigMaps & Secrets': 'Configuration management and secret handling in Kubernetes',
  'Helm Charts': 'Helm templating, package management, and application deployment',
  'AWS Services': 'EC2, S3, Lambda, RDS, and other core AWS services',
  'Azure Services': 'VMs, Storage, Functions, and Azure service ecosystem',
  'GCP Services': 'Compute, Storage, Functions, and Google Cloud services',
  'Cloud Architecture': 'Scalability, high availability, and cloud design patterns',
  'Infrastructure as Code': 'Terraform, CloudFormation, and IaC best practices',
  'Prometheus': 'Metrics collection, time-series database, and monitoring',
  'Grafana': 'Dashboards, visualization, and alerting with Grafana',
  'ELK Stack': 'Elasticsearch, Logstash, Kibana, and log management',
  'Logging': 'Log levels, structured logging, and log aggregation',
  'Alerting': 'Alert rules, notifications, and incident response',
  'Security Best Practices': 'Network security, encryption, and security hardening',
  'Secrets Management': 'Secret storage, rotation, and access control',
  'Network Security': 'Firewalls, VPNs, and network segmentation',
  'Compliance': 'Regulatory requirements, audit logs, and compliance frameworks',
  'Vulnerability Scanning': 'Container scanning, vulnerability assessment, and remediation',
  'Java': 'Core Java, OOP, collections, and advanced features',
  'Python': 'Python syntax, libraries, frameworks, and best practices',
  'Go': 'Go syntax, concurrency, and systems programming',
  'Node.js': 'JavaScript runtime, npm, and async programming',
  'C++': 'C++ fundamentals, STL, and performance optimization',
  'Database Design': 'Schema design, normalization, and optimization',
  'SQL': 'Query writing, indexes, and database performance',
  'NoSQL': 'Document stores, key-value stores, and distributed databases',
  'API Design': 'REST principles, API versioning, and standards',
  'Web Frameworks': 'Framework architecture, routing, and middleware',
  'Concurrency': 'Threads, async/await, and parallel programming',
  'REST APIs': 'HTTP methods, status codes, and API best practices',
  'GraphQL': 'Query language, resolvers, and schema design',
  'Caching': 'Cache strategies, Redis, and performance optimization',
  'Message Queues': 'RabbitMQ, Kafka, and asynchronous processing',
  'Microservices': 'Service design, communication, and architecture patterns',
  'Testing': 'Unit tests, integration tests, and test pyramids',
  'React': 'React fundamentals, hooks, and component lifecycle',
  'Vue': 'Vue basics, components, and state management',
  'Angular': 'Angular framework, modules, and dependency injection',
  'CSS': 'Selectors, layout, and responsive design',
  'Responsive Design': 'Media queries, flexbox, grid, and mobile-first design',
  'DOM Manipulation': 'DOM API, events, and jQuery basics',
  'Fetch API': 'HTTP requests, promises, and async/await',
  'LocalStorage': 'Client-side storage and data persistence',
  'Web Workers': 'Background threads and parallel execution',
  'Service Workers': 'Offline support and progressive web apps',
  'Jest': 'JavaScript testing framework and unit testing',
  'React Testing Library': 'Testing React components and user interactions',
  'E2E Testing': 'End-to-end testing with Cypress or Selenium',
  'Unit Testing': 'Unit test design and coverage',
  'Test Coverage': 'Coverage metrics and analysis',
  'EC2': 'Elastic Compute Cloud and instance management',
  'S3': 'Simple Storage Service and object storage',
  'Lambda': 'Serverless functions and event-driven architecture',
  'VPC': 'Virtual Private Cloud and network configuration',
  'IAM': 'Identity and Access Management and permissions',
  'Virtual Machines': 'Azure VM creation and management',
  'Storage Accounts': 'Azure storage services and blob storage',
  'Functions': 'Azure Functions and serverless computing',
  'Networking': 'Virtual networks and connectivity',
  'Active Directory': 'User management and identity services',
  'Compute Engine': 'Google Compute Engine and VM instances',
  'Cloud Storage': 'Google Cloud Storage and object management',
  'Cloud Functions': 'Google Cloud Functions and serverless',
  'Terraform': 'Terraform syntax, modules, and state management',
  'CloudFormation': 'AWS CloudFormation and IaC templates',
  'ARM Templates': 'Azure Resource Manager templates',
  'Ansible': 'Configuration management and automation',
  'Infrastructure Automation': 'Infrastructure provisioning and management',
  'Load Balancers': 'Load balancing and traffic distribution',
  'CDN': 'Content Delivery Networks and edge caching',
  'DNS': 'Domain Name System and DNS resolution',
  'VPN': 'Virtual Private Networks and secure connectivity',
  'Identity & Access': 'Authentication and authorization patterns',
  'Encryption': 'Data encryption and cryptography',
  'Security Groups': 'Firewall rules and network segmentation',
}

/**
 * Roadmap data for each role
 * Defines skill categories and topics for each role
 */
export const ROADMAPS = {
  'DevOps Engineer': {
    categories: [
      {
        name: 'Linux',
        topics: [
          'Linux Fundamentals',
          'Shell Scripting',
          'File System',
          'Process Management',
          'System Administration',
        ],
      },
      {
        name: 'Git',
        topics: [
          'Git Basics',
          'Branching & Merging',
          'Git Workflows',
          'Git Hooks',
          'Version Control Best Practices',
        ],
      },
      {
        name: 'CI/CD',
        topics: [
          'Jenkins',
          'GitLab CI',
          'GitHub Actions',
          'CI/CD Pipelines',
          'Automated Testing',
        ],
      },
      {
        name: 'Docker',
        topics: [
          'Docker Basics',
          'Dockerfile',
          'Docker Compose',
          'Container Orchestration',
          'Docker Networking',
        ],
      },
      {
        name: 'Kubernetes',
        topics: [
          'K8s Fundamentals',
          'Pods & Deployments',
          'Services & Ingress',
          'ConfigMaps & Secrets',
          'Helm Charts',
        ],
      },
      {
        name: 'Cloud',
        topics: [
          'AWS Services',
          'Azure Services',
          'GCP Services',
          'Cloud Architecture',
          'Infrastructure as Code',
        ],
      },
      {
        name: 'Monitoring',
        topics: [
          'Prometheus',
          'Grafana',
          'ELK Stack',
          'Logging',
          'Alerting',
        ],
      },
      {
        name: 'Security',
        topics: [
          'Security Best Practices',
          'Secrets Management',
          'Network Security',
          'Compliance',
          'Vulnerability Scanning',
        ],
      },
    ],
  },
  'Backend Engineer': {
    categories: [
      {
        name: 'Programming Languages',
        topics: [
          'Java',
          'Python',
          'Go',
          'Node.js',
          'C#',
        ],
      },
      {
        name: 'Databases',
        topics: [
          'SQL',
          'NoSQL',
          'Database Design',
          'Query Optimization',
          'Transactions',
        ],
      },
      {
        name: 'APIs',
        topics: [
          'REST APIs',
          'GraphQL',
          'API Design',
          'Authentication',
          'Rate Limiting',
        ],
      },
      {
        name: 'System Design',
        topics: [
          'Scalability',
          'Load Balancing',
          'Caching',
          'Message Queues',
          'Microservices',
        ],
      },
      {
        name: 'Testing',
        topics: [
          'Unit Testing',
          'Integration Testing',
          'Test-Driven Development',
          'Mocking',
          'Test Coverage',
        ],
      },
      {
        name: 'DevOps',
        topics: [
          'Docker',
          'CI/CD',
          'Monitoring',
          'Logging',
          'Deployment',
        ],
      },
    ],
  },
  'Frontend Engineer': {
    categories: [
      {
        name: 'JavaScript',
        topics: [
          'ES6+ Features',
          'Async/Await',
          'Promises',
          'Closures',
          'Event Loop',
        ],
      },
      {
        name: 'React',
        topics: [
          'Components',
          'Hooks',
          'State Management',
          'Performance',
          'Testing',
        ],
      },
      {
        name: 'CSS',
        topics: [
          'Flexbox',
          'Grid',
          'Animations',
          'Responsive Design',
          'CSS Preprocessors',
        ],
      },
      {
        name: 'Build Tools',
        topics: [
          'Webpack',
          'Vite',
          'Babel',
          'NPM/Yarn',
          'Module Bundling',
        ],
      },
      {
        name: 'Browser APIs',
        topics: [
          'DOM Manipulation',
          'Fetch API',
          'LocalStorage',
          'Web Workers',
          'Service Workers',
        ],
      },
      {
        name: 'Testing',
        topics: [
          'Jest',
          'React Testing Library',
          'E2E Testing',
          'Unit Testing',
          'Test Coverage',
        ],
      },
    ],
  },
  'Cloud Engineer': {
    categories: [
      {
        name: 'AWS',
        topics: [
          'EC2',
          'S3',
          'Lambda',
          'VPC',
          'IAM',
        ],
      },
      {
        name: 'Azure',
        topics: [
          'Virtual Machines',
          'Storage Accounts',
          'Functions',
          'Networking',
          'Active Directory',
        ],
      },
      {
        name: 'GCP',
        topics: [
          'Compute Engine',
          'Cloud Storage',
          'Cloud Functions',
          'VPC',
          'IAM',
        ],
      },
      {
        name: 'Infrastructure as Code',
        topics: [
          'Terraform',
          'CloudFormation',
          'ARM Templates',
          'Ansible',
          'Infrastructure Automation',
        ],
      },
      {
        name: 'Networking',
        topics: [
          'VPC/VNet',
          'Load Balancers',
          'CDN',
          'DNS',
          'VPN',
        ],
      },
      {
        name: 'Security',
        topics: [
          'Identity & Access',
          'Encryption',
          'Compliance',
          'Security Groups',
          'Network Security',
        ],
      },
    ],
  },
}

/**
 * Get all topics for a specific role
 * @param {string} role - The role name
 * @returns {Array} - Flat array of all topics with category info
 */
export function getTopicsByRole(role) {
  const roadmap = ROADMAPS[role]
  if (!roadmap) return []

  const topics = []
  roadmap.categories.forEach((category) => {
    category.topics.forEach((topicName) => {
      topics.push({
        id: `${category.name}-${topicName}`.toLowerCase().replace(/\s+/g, '-'),
        name: topicName,
        category: category.name,
        description: TOPIC_DESCRIPTIONS[topicName] || 'Master this essential skill for your role',
        status: 'Not Started',
        confidence: 1,
        notes: '',
        lastUpdated: null,
      })
    })
  })

  return topics
}

/**
 * Initialize role data in localStorage
 * Creates topic entries if they don't exist
 * @param {string} role - The role to initialize
 */
export function initializeRoleData(role) {
  try {
    const existingTopics = JSON.parse(localStorage.getItem('topics') || '{}')

    // If role data doesn't exist, initialize it
    if (!existingTopics[role]) {
      const roleTopics = getTopicsByRole(role)
      existingTopics[role] = roleTopics
      localStorage.setItem('topics', JSON.stringify(existingTopics))
    }
  } catch (error) {
    console.error('Error initializing role data:', error)
  }
}

