import { useState } from 'react'
import { ScrollArea } from './ui/scroll-area'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Separator } from './ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { 
  Settings, 
  Palette, 
  Type, 
  Move, 
  RotateCw,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react'

interface PropertiesPanelProps {
  mode: 'design' | 'workflow'
  selectedElement: any
  onElementUpdate: (element: any) => void
}

export function PropertiesPanel({ mode, selectedElement, onElementUpdate }: PropertiesPanelProps) {
  const [elementProps, setElementProps] = useState({
    x: selectedElement?.x || 0,
    y: selectedElement?.y || 0,
    width: selectedElement?.width || 100,
    height: selectedElement?.height || 100,
    fill: selectedElement?.fill || '#6366F1',
    stroke: selectedElement?.stroke || '#374151',
    strokeWidth: selectedElement?.strokeWidth || 2,
    text: selectedElement?.text || '',
    fontSize: selectedElement?.fontSize || 16,
    visible: true,
  })

  const handlePropertyChange = (property: string, value: any) => {
    const updated = { ...elementProps, [property]: value }
    setElementProps(updated)
    if (selectedElement) {
      onElementUpdate({ ...selectedElement, ...updated })
    }
  }

  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Properties
          </h3>
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Palette className="w-4 h-4 mr-2" />
                  Add Rectangle
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Type className="w-4 h-4 mr-2" />
                  Add Text
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Move className="w-4 h-4 mr-2" />
                  Add Node
                </Button>
              </CardContent>
            </Card>

            {/* Workflow Info */}
            {mode === 'workflow' && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Workflow Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Nodes:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connections:</span>
                      <span className="font-medium">13</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">IAM Workflow</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Canvas Info */}
            {mode === 'design' && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Canvas Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Elements:</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Layers:</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zoom:</span>
                      <span className="font-medium">100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Help */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Click on any {mode === 'workflow' ? 'node' : 'element'} to select it</p>
                  <p>• Use the toolbar to add new elements</p>
                  <p>• Properties will appear here when selected</p>
                  {mode === 'workflow' && <p>• Connect nodes by dragging from handles</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'design') {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Design Properties
          </h3>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Element Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Element
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Type</Label>
                  <div className="text-sm font-medium capitalize">{selectedElement.type}</div>
                </div>
                <div>
                  <Label className="text-xs">ID</Label>
                  <div className="text-sm text-muted-foreground font-mono">{selectedElement.id}</div>
                </div>
              </CardContent>
            </Card>

            {/* Position & Size */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Move className="w-4 h-4" />
                  Position & Size
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="x" className="text-xs">X</Label>
                    <Input
                      id="x"
                      type="number"
                      value={elementProps.x}
                      onChange={(e) => handlePropertyChange('x', Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="y" className="text-xs">Y</Label>
                    <Input
                      id="y"
                      type="number"
                      value={elementProps.y}
                      onChange={(e) => handlePropertyChange('y', Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="width" className="text-xs">Width</Label>
                    <Input
                      id="width"
                      type="number"
                      value={elementProps.width}
                      onChange={(e) => handlePropertyChange('width', Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs">Height</Label>
                    <Input
                      id="height"
                      type="number"
                      value={elementProps.height}
                      onChange={(e) => handlePropertyChange('height', Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="fill" className="text-xs">Fill Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fill"
                      type="color"
                      value={elementProps.fill}
                      onChange={(e) => handlePropertyChange('fill', e.target.value)}
                      className="h-8 w-16 p-1"
                    />
                    <Input
                      value={elementProps.fill}
                      onChange={(e) => handlePropertyChange('fill', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="stroke" className="text-xs">Stroke Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="stroke"
                      type="color"
                      value={elementProps.stroke}
                      onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                      className="h-8 w-16 p-1"
                    />
                    <Input
                      value={elementProps.stroke}
                      onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                      className="h-8 flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="strokeWidth" className="text-xs">Stroke Width</Label>
                  <Input
                    id="strokeWidth"
                    type="number"
                    min="0"
                    value={elementProps.strokeWidth}
                    onChange={(e) => handlePropertyChange('strokeWidth', Number(e.target.value))}
                    className="h-8"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Text Properties */}
            {selectedElement.type === 'text' && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Text
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="text" className="text-xs">Content</Label>
                    <Textarea
                      id="text"
                      value={elementProps.text}
                      onChange={(e) => handlePropertyChange('text', e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fontSize" className="text-xs">Font Size</Label>
                    <Input
                      id="fontSize"
                      type="number"
                      min="8"
                      max="72"
                      value={elementProps.fontSize}
                      onChange={(e) => handlePropertyChange('fontSize', Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    {elementProps.visible ? 'Hide' : 'Show'}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    )
  }

  // Workflow mode
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Node Properties
        </h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Node Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Node Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Node Type</Label>
                <div className="text-sm font-medium">{selectedElement.type || 'Unknown'}</div>
              </div>
              <div>
                <Label className="text-xs">Node ID</Label>
                <div className="text-sm text-muted-foreground font-mono">{selectedElement.id}</div>
              </div>
              <div>
                <Label htmlFor="nodeLabel" className="text-xs">Label</Label>
                <Input
                  id="nodeLabel"
                  value={selectedElement.data?.label || ''}
                  onChange={(e) => {
                    const updated = {
                      ...selectedElement,
                      data: { ...selectedElement.data, label: e.target.value }
                    }
                    onElementUpdate(updated)
                  }}
                  className="h-8"
                />
              </div>
            </CardContent>
          </Card>

          {/* Node-specific configuration would go here */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Node-specific configuration options will appear here based on the selected node type.
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}