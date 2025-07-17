import { useState, useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from './ui/button'
import { Play, Square, RotateCcw } from 'lucide-react'

interface WorkflowBuilderProps {
  selectedElement: any
  onElementSelect: (element: any) => void
}

const initialNodes: Node[] = [
  // JML IAM Workflow Nodes
  {
    id: 'trigger',
    type: 'input',
    data: { label: '🚀 User Access Request' },
    position: { x: 50, y: 50 },
    style: {
      background: '#10B981',
      color: 'white',
      border: '1px solid #059669',
      borderRadius: '8px',
      width: 180,
    },
  },
  {
    id: 'validate-user',
    data: { label: '👤 Validate User Identity' },
    position: { x: 300, y: 50 },
    style: {
      background: '#3B82F6',
      color: 'white',
      border: '1px solid #2563EB',
      borderRadius: '8px',
      width: 180,
    },
  },
  {
    id: 'check-permissions',
    data: { label: '🔐 Check Existing Permissions' },
    position: { x: 550, y: 50 },
    style: {
      background: '#8B5CF6',
      color: 'white',
      border: '1px solid #7C3AED',
      borderRadius: '8px',
      width: 180,
    },
  },
  {
    id: 'decision-node',
    data: { label: '❓ Access Decision' },
    position: { x: 800, y: 50 },
    style: {
      background: '#F59E0B',
      color: 'white',
      border: '1px solid #D97706',
      borderRadius: '8px',
      width: 150,
    },
  },
  {
    id: 'grant-access',
    data: { label: '✅ Grant Access' },
    position: { x: 700, y: 200 },
    style: {
      background: '#10B981',
      color: 'white',
      border: '1px solid #059669',
      borderRadius: '8px',
      width: 150,
    },
  },
  {
    id: 'deny-access',
    data: { label: '❌ Deny Access' },
    position: { x: 900, y: 200 },
    style: {
      background: '#EF4444',
      color: 'white',
      border: '1px solid #DC2626',
      borderRadius: '8px',
      width: 150,
    },
  },
  {
    id: 'create-token',
    data: { label: '🎫 Generate JWT Token' },
    position: { x: 550, y: 350 },
    style: {
      background: '#6366F1',
      color: 'white',
      border: '1px solid #4F46E5',
      borderRadius: '8px',
      width: 180,
    },
  },
  {
    id: 'audit-log',
    data: { label: '📝 Log Access Event' },
    position: { x: 800, y: 350 },
    style: {
      background: '#64748B',
      color: 'white',
      border: '1px solid #475569',
      borderRadius: '8px',
      width: 150,
    },
  },
  {
    id: 'notify-admin',
    data: { label: '📧 Notify Admin' },
    position: { x: 1050, y: 350 },
    style: {
      background: '#F97316',
      color: 'white',
      border: '1px solid #EA580C',
      borderRadius: '8px',
      width: 150,
    },
  },
  {
    id: 'session-mgmt',
    data: { label: '⏱️ Session Management' },
    position: { x: 300, y: 500 },
    style: {
      background: '#06B6D4',
      color: 'white',
      border: '1px solid #0891B2',
      borderRadius: '8px',
      width: 180,
    },
  },
  {
    id: 'refresh-token',
    data: { label: '🔄 Token Refresh' },
    position: { x: 550, y: 500 },
    style: {
      background: '#8B5CF6',
      color: 'white',
      border: '1px solid #7C3AED',
      borderRadius: '8px',
      width: 150,
    },
  },
  {
    id: 'logout',
    type: 'output',
    data: { label: '🚪 Logout & Cleanup' },
    position: { x: 800, y: 500 },
    style: {
      background: '#DC2626',
      color: 'white',
      border: '1px solid #B91C1C',
      borderRadius: '8px',
      width: 180,
    },
  },
]

const initialEdges: Edge[] = [
  // Main IAM flow
  { id: 'e1', source: 'trigger', target: 'validate-user', type: 'smoothstep' },
  { id: 'e2', source: 'validate-user', target: 'check-permissions', type: 'smoothstep' },
  { id: 'e3', source: 'check-permissions', target: 'decision-node', type: 'smoothstep' },
  
  // Decision branches
  { 
    id: 'e4', 
    source: 'decision-node', 
    target: 'grant-access', 
    type: 'smoothstep',
    label: 'Approved',
    style: { stroke: '#10B981' }
  },
  { 
    id: 'e5', 
    source: 'decision-node', 
    target: 'deny-access', 
    type: 'smoothstep',
    label: 'Denied',
    style: { stroke: '#EF4444' }
  },
  
  // Grant access flow
  { id: 'e6', source: 'grant-access', target: 'create-token', type: 'smoothstep' },
  { id: 'e7', source: 'create-token', target: 'audit-log', type: 'smoothstep' },
  { id: 'e8', source: 'create-token', target: 'session-mgmt', type: 'smoothstep' },
  
  // Deny access flow
  { id: 'e9', source: 'deny-access', target: 'notify-admin', type: 'smoothstep' },
  { id: 'e10', source: 'deny-access', target: 'audit-log', type: 'smoothstep' },
  
  // Session management
  { id: 'e11', source: 'session-mgmt', target: 'refresh-token', type: 'smoothstep' },
  { id: 'e12', source: 'refresh-token', target: 'logout', type: 'smoothstep' },
  { id: 'e13', source: 'session-mgmt', target: 'logout', type: 'smoothstep' },
]

export function WorkflowBuilder({ selectedElement, onElementSelect }: WorkflowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isRunning, setIsRunning] = useState(false)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onElementSelect(node)
    },
    [onElementSelect]
  )

  const handleRunWorkflow = async () => {
    setIsRunning(true)
    // Simulate workflow execution
    setTimeout(() => {
      setIsRunning(false)
    }, 2000)
  }

  const handleStopWorkflow = () => {
    setIsRunning(false)
  }

  const handleResetWorkflow = () => {
    setNodes(initialNodes)
    setEdges(initialEdges)
    onElementSelect(null)
  }

  return (
    <div className="flex-1 flex flex-col bg-muted/30">
      {/* Workflow Toolbar */}
      <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm">JML IAM Workflow Builder</h3>
          <span className="text-xs text-muted-foreground">
            {nodes.length} nodes, {edges.length} connections
          </span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
            Identity & Access Management
          </span>
        </div>

        <div className="flex items-center gap-1">
          {!isRunning ? (
            <Button variant="default" size="sm" onClick={handleRunWorkflow}>
              <Play className="w-4 h-4 mr-2" />
              Run Workflow
            </Button>
          ) : (
            <Button variant="destructive" size="sm" onClick={handleStopWorkflow}>
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleResetWorkflow}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* ReactFlow Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          className="bg-background"
        >
          <Controls 
            className="bg-card border border-border rounded-lg shadow-sm"
            showInteractive={false}
          />
          <MiniMap 
            className="bg-card border border-border rounded-lg"
            nodeColor={(node) => {
              // Color nodes based on their specific IAM function
              switch (node.id) {
                case 'trigger': return '#10B981'
                case 'validate-user': return '#3B82F6'
                case 'check-permissions': return '#8B5CF6'
                case 'decision-node': return '#F59E0B'
                case 'grant-access': return '#10B981'
                case 'deny-access': return '#EF4444'
                case 'create-token': return '#6366F1'
                case 'audit-log': return '#64748B'
                case 'notify-admin': return '#F97316'
                case 'session-mgmt': return '#06B6D4'
                case 'refresh-token': return '#8B5CF6'
                case 'logout': return '#DC2626'
                default: return '#8B5CF6'
              }
            }}
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            color="#E5E7EB"
          />
        </ReactFlow>
      </div>

      {/* Workflow Status */}
      {isRunning && (
        <div className="h-10 border-t border-border bg-card flex items-center px-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Workflow running...</span>
          </div>
        </div>
      )}
    </div>
  )
}