import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { 
  Palette, 
  Workflow, 
  Play, 
  Save, 
  Download, 
  Settings,
  User,
  FolderOpen
} from 'lucide-react'
import { DesignCanvas } from './DesignCanvas'
import { WorkflowBuilder } from './WorkflowBuilder'
import { PropertiesPanel } from './PropertiesPanel'
import { LayersPanel } from './LayersPanel'
import { blink } from '../blink/client'

interface MainInterfaceProps {
  user: any
}

export function MainInterface({ user }: MainInterfaceProps) {
  const [activeMode, setActiveMode] = useState<'design' | 'workflow'>('design')
  const [selectedElement, setSelectedElement] = useState<any>(null)

  const handleLogout = () => {
    blink.auth.logout()
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Palette className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="font-semibold text-lg">AI Design Studio</h1>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'design' | 'workflow')}>
            <TabsList className="grid w-[300px] grid-cols-2">
              <TabsTrigger value="design" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Design Canvas
              </TabsTrigger>
              <TabsTrigger value="workflow" className="flex items-center gap-2">
                <Workflow className="w-4 h-4" />
                Workflow Builder
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FolderOpen className="w-4 h-4 mr-2" />
            Projects
          </Button>
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <User className="w-4 h-4 mr-2" />
            {user.email}
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Tools & Layers */}
        <aside className="w-64 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {activeMode === 'design' ? 'Design Tools' : 'Node Library'}
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <LayersPanel mode={activeMode} />
          </div>
        </aside>

        {/* Center Canvas Area */}
        <main className="flex-1 flex flex-col">
          <Tabs value={activeMode} className="flex-1 flex flex-col">
            <TabsContent value="design" className="flex-1 m-0">
              <DesignCanvas 
                selectedElement={selectedElement}
                onElementSelect={setSelectedElement}
              />
            </TabsContent>
            <TabsContent value="workflow" className="flex-1 m-0">
              <WorkflowBuilder 
                selectedElement={selectedElement}
                onElementSelect={setSelectedElement}
              />
            </TabsContent>
          </Tabs>
        </main>

        {/* Right Sidebar - Properties */}
        <aside className="w-80 border-l border-border bg-card">
          <PropertiesPanel 
            mode={activeMode}
            selectedElement={selectedElement}
            onElementUpdate={setSelectedElement}
          />
        </aside>
      </div>
    </div>
  )
}