import { useState, useRef, useCallback } from 'react'
import { Button } from './ui/button'
import { 
  Square, 
  Circle, 
  Type, 
  Image, 
  MousePointer,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react'

interface DesignCanvasProps {
  selectedElement: any
  onElementSelect: (element: any) => void
}

interface CanvasElement {
  id: string
  type: 'rectangle' | 'circle' | 'text' | 'image'
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke: string
  strokeWidth: number
  text?: string
  fontSize?: number
  imageUrl?: string
}

export function DesignCanvas({ selectedElement, onElementSelect }: DesignCanvasProps) {
  const [tool, setTool] = useState<'select' | 'rectangle' | 'circle' | 'text' | 'image'>('select')
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (tool === 'select') return
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = (e.clientX - rect.left - pan.x) / zoom
    const y = (e.clientY - rect.top - pan.y) / zoom

    setStartPos({ x, y })
    setIsDrawing(true)
  }, [tool, pan, zoom])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || tool === 'select') return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const currentX = (e.clientX - rect.left - pan.x) / zoom
    const currentY = (e.clientY - rect.top - pan.y) / zoom

    // Update preview element (you would implement this)
  }, [isDrawing, tool, pan, zoom])

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || tool === 'select') return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const endX = (e.clientX - rect.left - pan.x) / zoom
    const endY = (e.clientY - rect.top - pan.y) / zoom

    const width = Math.abs(endX - startPos.x)
    const height = Math.abs(endY - startPos.y)
    const x = Math.min(startPos.x, endX)
    const y = Math.min(startPos.y, endY)

    if (width > 5 && height > 5) {
      const newElement: CanvasElement = {
        id: `element-${Date.now()}`,
        type: tool as 'rectangle' | 'circle' | 'text' | 'image',
        x,
        y,
        width,
        height,
        fill: tool === 'text' ? 'transparent' : '#6366F1',
        stroke: '#374151',
        strokeWidth: 2,
        text: tool === 'text' ? 'Text' : undefined,
        fontSize: tool === 'text' ? 16 : undefined
      }

      setElements(prev => [...prev, newElement])
      onElementSelect(newElement)
    }

    setIsDrawing(false)
    setTool('select')
  }, [isDrawing, tool, startPos, pan, zoom, onElementSelect])

  const handleElementClick = (element: CanvasElement) => {
    onElementSelect(element)
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1))
  const handleResetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  return (
    <div className="flex-1 flex flex-col bg-muted/30">
      {/* Canvas Toolbar */}
      <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-1">
          <Button
            variant={tool === 'select' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTool('select')}
          >
            <MousePointer className="w-4 h-4" />
          </Button>
          <Button
            variant={tool === 'rectangle' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTool('rectangle')}
          >
            <Square className="w-4 h-4" />
          </Button>
          <Button
            variant={tool === 'circle' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTool('circle')}
          >
            <Circle className="w-4 h-4" />
          </Button>
          <Button
            variant={tool === 'text' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTool('text')}
          >
            <Type className="w-4 h-4" />
          </Button>
          <Button
            variant={tool === 'image' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTool('image')}
          >
            <Image className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleResetView}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={canvasRef}
          className="w-full h-full cursor-crosshair relative"
          style={{
            backgroundImage: `
              radial-gradient(circle, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Canvas Elements */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            {elements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-pointer border-2 ${
                  selectedElement?.id === element.id 
                    ? 'border-primary' 
                    : 'border-transparent hover:border-primary/50'
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  backgroundColor: element.fill,
                  borderRadius: element.type === 'circle' ? '50%' : '4px'
                }}
                onClick={() => handleElementClick(element)}
              >
                {element.type === 'text' && (
                  <div
                    className="w-full h-full flex items-center justify-center text-foreground"
                    style={{ fontSize: element.fontSize }}
                  >
                    {element.text}
                  </div>
                )}
                {element.type === 'image' && (
                  <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                    <Image className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}