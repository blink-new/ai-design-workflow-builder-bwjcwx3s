import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { 
  Square, 
  Circle, 
  Type, 
  Image, 
  Layers,
  Bot,
  Database,
  Mail,
  MessageSquare,
  Zap,
  Code,
  FileText,
  Palette
} from 'lucide-react'

interface LayersPanelProps {
  mode: 'design' | 'workflow'
}

const designTools = [
  { id: 'rectangle', label: 'Rectangle', icon: Square },
  { id: 'circle', label: 'Circle', icon: Circle },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'image', label: 'Image', icon: Image },
]

const workflowNodes = [
  { 
    id: 'ai-text', 
    label: 'AI Text Generation', 
    icon: Bot, 
    category: 'AI',
    description: 'Generate text using AI models'
  },
  { 
    id: 'ai-image', 
    label: 'AI Image Generation', 
    icon: Palette, 
    category: 'AI',
    description: 'Create images with AI'
  },
  { 
    id: 'database', 
    label: 'Database Query', 
    icon: Database, 
    category: 'Data',
    description: 'Read/write to database'
  },
  { 
    id: 'email', 
    label: 'Send Email', 
    icon: Mail, 
    category: 'Communication',
    description: 'Send email notifications'
  },
  { 
    id: 'webhook', 
    label: 'Webhook', 
    icon: Zap, 
    category: 'Integration',
    description: 'HTTP requests and webhooks'
  },
  { 
    id: 'code', 
    label: 'Custom Code', 
    icon: Code, 
    category: 'Logic',
    description: 'Execute custom JavaScript'
  },
  { 
    id: 'transform', 
    label: 'Data Transform', 
    icon: FileText, 
    category: 'Data',
    description: 'Transform and filter data'
  },
]

export function LayersPanel({ mode }: LayersPanelProps) {
  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  if (mode === 'design') {
    return (
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Design Tools */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Tools
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {designTools.map((tool) => (
                <Button
                  key={tool.id}
                  variant="outline"
                  size="sm"
                  className="h-12 flex flex-col items-center justify-center gap-1 text-xs"
                >
                  <tool.icon className="w-4 h-4" />
                  {tool.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Layers */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Layers
            </h4>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground p-2 text-center">
                No layers yet. Create elements on the canvas to see them here.
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    )
  }

  // Workflow mode
  const categories = [...new Set(workflowNodes.map(node => node.category))]

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {categories.map((category) => (
          <div key={category}>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Bot className="w-4 h-4" />
              {category}
            </h4>
            <div className="space-y-2">
              {workflowNodes
                .filter(node => node.category === category)
                .map((node) => (
                  <div
                    key={node.id}
                    className="p-3 border border-border rounded-lg cursor-grab hover:bg-muted/50 transition-colors"
                    draggable
                    onDragStart={(event) => handleDragStart(event, node.id)}
                  >
                    <div className="flex items-start gap-2">
                      <node.icon className="w-4 h-4 mt-0.5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{node.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {node.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {category !== categories[categories.length - 1] && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}