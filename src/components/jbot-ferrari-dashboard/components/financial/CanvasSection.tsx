import React, { useRef, useState, useEffect } from 'react';
import { Image, Type, Square, Circle, MousePointer, Layout, Eraser, Undo, Copy, Trash2, Edit3 } from 'lucide-react';
import { templates, Template } from './canvasTemplates';
import Tooltip from '@mui/material/Tooltip';

type Tool = 'draw' | 'text' | 'image' | 'rectangle' | 'circle' | 'select' | 'eraser';

interface TextBox {
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  isEditing: boolean;
  fontSize: number;
}

interface SelectedItem {
  index: number;
  type: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface ContextMenu {
  x: number;
  y: number;
  visible: boolean;
}

const CanvasSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [selectedTool, setSelectedTool] = useState<Tool>('draw');
  const [text, setText] = useState('');
  const [shapes, setShapes] = useState<any[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [history, setHistory] = useState<any[][]>([]);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [activeTextBox, setActiveTextBox] = useState<TextBox | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu>({ x: 0, y: 0, visible: false });
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setContext(ctx);
      }
    }
  }, [backgroundColor]);

  const addToHistory = () => {
    setHistory(prev => [...prev, [...shapes]]);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousShapes = history[history.length - 1];
      setShapes(previousShapes);
      setHistory(prev => prev.slice(0, -1));
      redrawShapes();
    }
  };

  const handleTextBoxClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || selectedTool !== 'text') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newTextBox: TextBox = {
      x,
      y,
      width: 200,
      height: 100,
      content: '',
      isEditing: true,
      fontSize
    };

    addToHistory();
    setTextBoxes(prev => [...prev, newTextBox]);
    setActiveTextBox(newTextBox);
  };

  const handleTextChange = (content: string) => {
    if (!activeTextBox) return;
    
    const updatedTextBox = {
      ...activeTextBox,
      content: content
    };
    
    setActiveTextBox(updatedTextBox);
    setTextBoxes(prev => prev.map(box => 
      box === activeTextBox ? updatedTextBox : box
    ));
  };

  const drawTextBox = (box: TextBox) => {
    if (!context) return;
    context.font = `${box.fontSize}px Arial`;
    
    if (backgroundColor === '#000000') {
      context.strokeStyle = '#FFFFFF';
      context.lineWidth = 2;
      context.lineJoin = 'round';
    }
    
    context.fillStyle = '#000000';
    
    const words = box.content.split(' ');
    let line = '';
    let y = box.y;
    
    words.forEach(word => {
      const testLine = line + word + ' ';
      const metrics = context.measureText(testLine);
      
      if (metrics.width > box.width) {
        if (backgroundColor === '#000000') {
          context.strokeText(line, box.x, y);
        }
        context.fillText(line, box.x, y);
        line = word + ' ';
        y += box.fontSize * 1.2;
      } else {
        line = testLine;
      }
    });
    if (backgroundColor === '#000000') {
      context.strokeText(line, box.x, y);
    }
    context.fillText(line, box.x, y);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;

    if (selectedTool === 'text') {
      handleTextBoxClick(e);
      return;
    }

    setIsDrawing(true);
    addToHistory();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const pos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      lastPos.current = pos;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const currentPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    if (selectedTool === 'eraser') {
      context.save();
      context.beginPath();
      context.arc(currentPos.x, currentPos.y, lineWidth * 2, 0, Math.PI * 2);
      context.fillStyle = backgroundColor;
      context.fill();
      context.restore();
    } else if (selectedTool === 'draw') {
      context.beginPath();
      context.moveTo(lastPos.current.x, lastPos.current.y);
      context.lineTo(currentPos.x, currentPos.y);
      context.stroke();
    } else if (selectedTool === 'rectangle' || selectedTool === 'circle') {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      redrawShapes();
      
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      
      if (selectedTool === 'rectangle') {
        const width = currentPos.x - lastPos.current.x;
        const height = currentPos.y - lastPos.current.y;
        
        const startX = width < 0 ? currentPos.x : lastPos.current.x;
        const startY = height < 0 ? currentPos.y : lastPos.current.y;
        const absWidth = Math.abs(width);
        const absHeight = Math.abs(height);
        
        context.strokeRect(startX, startY, absWidth, absHeight);
      } else {
        const radius = Math.sqrt(
          Math.pow(currentPos.x - lastPos.current.x, 2) + 
          Math.pow(currentPos.y - lastPos.current.y, 2)
        );
        
        context.beginPath();
        context.arc(lastPos.current.x, lastPos.current.y, radius, 0, Math.PI * 2);
        context.stroke();
      }
    }

    setTooltipPosition({ x: e.clientX, y: e.clientY });
    
    if (selectedTool === 'rectangle') {
      const width = Math.abs(currentPos.x - lastPos.current.x);
      const height = Math.abs(currentPos.y - lastPos.current.y);
      setTooltipContent(`Width: ${width.toFixed(0)}px, Height: ${height.toFixed(0)}px`);
    } else if (selectedTool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(currentPos.x - lastPos.current.x, 2) + 
        Math.pow(currentPos.y - lastPos.current.y, 2)
      );
      setTooltipContent(`Radius: ${radius.toFixed(0)}px`);
    }

    lastPos.current = currentPos;
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const currentPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    if (selectedTool === 'rectangle') {
      const width = currentPos.x - lastPos.current.x;
      const height = currentPos.y - lastPos.current.y;
      
      const startX = width < 0 ? currentPos.x : lastPos.current.x;
      const startY = height < 0 ? currentPos.y : lastPos.current.y;
      const absWidth = Math.abs(width);
      const absHeight = Math.abs(height);
      
      setShapes([...shapes, { 
        type: 'rectangle', 
        x: startX,
        y: startY,
        width: absWidth,
        height: absHeight,
        color,
        lineWidth
      }]);
    } else if (selectedTool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(currentPos.x - lastPos.current.x, 2) + 
        Math.pow(currentPos.y - lastPos.current.y, 2)
      );
      setShapes([...shapes, { 
        type: 'circle', 
        x: lastPos.current.x, 
        y: lastPos.current.y, 
        radius, 
        color,
        lineWidth
      }]);
    }

    setIsDrawing(false);
  };

  const redrawShapes = () => {
    if (!context || !canvasRef.current) return;
    
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    shapes.forEach((shape, index) => {
      const isSelected = selectedItem?.index === index;
      
      if (shape.type === 'text') {
        context.font = `${shape.fontSize}px Arial`;
        context.fillStyle = '#000000';
        
        if (backgroundColor === '#000000') {
          context.strokeStyle = '#FFFFFF';
          context.lineWidth = 2;
          context.lineJoin = 'round';
          context.strokeText(shape.content, shape.x, shape.y);
        }
        
        context.fillText(shape.content, shape.x, shape.y);
        
        if (isSelected) {
          context.strokeStyle = '#0066ff';
          context.setLineDash([5, 5]);
          const metrics = context.measureText(shape.content);
          context.strokeRect(
            shape.x,
            shape.y - shape.fontSize,
            metrics.width,
            shape.fontSize * 1.2
          );
          context.setLineDash([]);
        }
      } else {
        context.strokeStyle = shape.color;
        context.lineWidth = shape.lineWidth || lineWidth;
        
        if (isSelected) {
          context.save();
          context.strokeStyle = '#0066ff';
          context.setLineDash([5, 5]);
        }

        if (shape.type === 'rectangle') {
          context.strokeRect(shape.x, shape.y, shape.width, shape.height);
          if (isSelected) {
            const handles = [
              { x: shape.x, y: shape.y },
              { x: shape.x + shape.width, y: shape.y },
              { x: shape.x, y: shape.y + shape.height },
              { x: shape.x + shape.width, y: shape.y + shape.height }
            ];
            handles.forEach(handle => {
              context.fillStyle = '#0066ff';
              context.fillRect(handle.x - 4, handle.y - 4, 8, 8);
            });
          }
        } else if (shape.type === 'circle') {
          context.beginPath();
          context.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
          context.stroke();
          if (isSelected) {
            context.fillStyle = '#0066ff';
            context.fillRect(shape.x - 4, shape.y - shape.radius - 4, 8, 8);
            context.fillRect(shape.x - 4, shape.y + shape.radius - 4, 8, 8);
            context.fillRect(shape.x - shape.radius - 4, shape.y - 4, 8, 8);
            context.fillRect(shape.x + shape.radius - 4, shape.y - 4, 8, 8);
          }
        } else if (shape.type === 'image') {
          const img = new window.Image();
          img.src = shape.src;
          img.onload = () => {
            context.drawImage(img, shape.x, shape.y, shape.width, shape.height);
          };
        }
      }

      if (isSelected) {
        context.restore();
      }
    });

    textBoxes.forEach(box => {
      if (!box.isEditing) {
        context.font = `${box.fontSize}px Arial`;
        context.fillStyle = '#000000';
        
        if (backgroundColor === '#000000') {
          context.strokeStyle = '#FFFFFF';
          context.lineWidth = 2;
          context.lineJoin = 'round';
          context.strokeText(box.content, box.x, box.y + box.fontSize);
        }
        
        context.fillText(box.content, box.x, box.y + box.fontSize);
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && context && canvasRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const maxWidth = canvasRef.current!.width * 0.8;
          const maxHeight = canvasRef.current!.height * 0.8;
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (maxWidth * height) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (maxHeight * width) / height;
            height = maxHeight;
          }

          const x = (canvasRef.current!.width - width) / 2;
          const y = (canvasRef.current!.height - height) / 2;
          
          context.drawImage(img, x, y, width, height);
          setShapes([...shapes, { 
            type: 'image', 
            src: event.target?.result as string,
            x,
            y,
            width,
            height
          }]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setShapes([]);
      localStorage.removeItem('canvasState');
    }
  };

  const loadTemplate = (template: Template) => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setShapes(template.shapes);
      setSelectedTemplate(template);
    }
  };

  useEffect(() => {
    if (selectedTemplate) {
      redrawShapes();
    }
  }, [selectedTemplate]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === 'text') {
      e.preventDefault();
      e.stopPropagation();
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newTextBox: TextBox = {
        x,
        y,
        width: 200,
        height: 100,
        content: '',
        isEditing: true,
        fontSize
      };

      setTextBoxes(prev => [...prev, newTextBox]);
      setActiveTextBox(newTextBox);
    } else if (selectedTool === 'select') {
      handleItemSelection(e);
    }
  };

  const handleItemSelection = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || selectedTool !== 'select') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      let bounds;

      if (shape.type === 'rectangle') {
        bounds = {
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height
        };
      } else if (shape.type === 'circle') {
        bounds = {
          x: shape.x - shape.radius,
          y: shape.y - shape.radius,
          width: shape.radius * 2,
          height: shape.radius * 2
        };
      } else if (shape.type === 'text') {
        const metrics = context?.measureText(shape.content);
        bounds = {
          x: shape.x,
          y: shape.y - shape.fontSize,
          width: metrics?.width || 0,
          height: shape.fontSize
        };
      }

      if (bounds && 
          x >= bounds.x && 
          x <= bounds.x + bounds.width && 
          y >= bounds.y && 
          y <= bounds.y + bounds.height) {
        setSelectedItem({ index: i, type: shape.type, bounds });
        setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
        return;
      }
    }

    setSelectedItem(null);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleContextMenuAction = (action: 'duplicate' | 'delete' | 'edit') => {
    if (!selectedItem) return;

    const shape = shapes[selectedItem.index];
    
    switch (action) {
      case 'duplicate':
        const duplicate = { ...shape, x: shape.x + 20, y: shape.y + 20 };
        setShapes([...shapes, duplicate]);
        break;
      
      case 'delete':
        addToHistory();
        setShapes(shapes.filter((_, i) => i !== selectedItem.index));
        break;
      
      case 'edit':
        if (shape.type === 'text') {
          const newTextBox: TextBox = {
            x: shape.x,
            y: shape.y - shape.fontSize,
            width: 200,
            height: 100,
            content: shape.content,
            isEditing: true,
            fontSize: shape.fontSize
          };
          setTextBoxes(prev => [...prev, newTextBox]);
          setActiveTextBox(newTextBox);
          setShapes(shapes.filter((_, i) => i !== selectedItem.index));
        }
        break;
    }
    
    setContextMenu({ ...contextMenu, visible: false });
    setSelectedItem(null);
    redrawShapes();
  };

  const saveCanvasState = () => {
    const state = {
      shapes,
      backgroundColor,
      color,
      lineWidth,
      fontSize
    };
    localStorage.setItem('canvasState', JSON.stringify(state));
  };

  const loadCanvasState = () => {
    const savedState = localStorage.getItem('canvasState');
    if (savedState) {
      const state = JSON.parse(savedState);
      setShapes(state.shapes);
      setBackgroundColor(state.backgroundColor);
      setColor(state.color);
      setLineWidth(state.lineWidth);
      setFontSize(state.fontSize);
    }
  };

  useEffect(() => {
    loadCanvasState();
  }, []);

  useEffect(() => {
    saveCanvasState();
  }, [shapes, backgroundColor, color, lineWidth, fontSize]);

  const handleDragStart = (e: React.MouseEvent, box: TextBox) => {
    e.stopPropagation();
    setActiveTextBox(box);
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setDragOffset({
      x: e.clientX - (box.x + rect.left),
      y: e.clientY - (box.y + rect.top)
    });
  };

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging || !activeTextBox || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    setTextBoxes(prev => prev.map(box => 
      box === activeTextBox ? { ...box, x: newX, y: newY } : box
    ));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDrag(e);
      }
    };

    const handleMouseUp = () => {
      handleDragEnd();
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, activeTextBox]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Tooltip title="Free-hand drawing">
            <button
              onClick={() => setSelectedTool('draw')}
              className={`p-2 rounded ${selectedTool === 'draw' ? 'bg-ferrari-red text-white' : 'hover:bg-ferrari-red/10'}`}
            >
              <MousePointer className="w-4 h-4" />
            </button>
          </Tooltip>
          
          <Tooltip title="Click to add text box">
            <button
              onClick={() => setSelectedTool('text')}
              className={`p-2 rounded flex items-center gap-2 ${selectedTool === 'text' ? 'bg-ferrari-red text-white' : 'hover:bg-ferrari-red/10'}`}
            >
              <Type className="w-4 h-4" />
              <span className="text-sm">Create Text Box</span>
            </button>
          </Tooltip>

          <Tooltip title="Upload image">
            <button
              onClick={() => imageInput.current?.click()}
              className={`p-2 rounded hover:bg-ferrari-red/10`}
            >
              <Image className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip title="Draw rectangle">
            <button
              onClick={() => setSelectedTool('rectangle')}
              className={`p-2 rounded ${selectedTool === 'rectangle' ? 'bg-ferrari-red text-white' : 'hover:bg-ferrari-red/10'}`}
            >
              <Square className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip title="Draw circle">
            <button
              onClick={() => setSelectedTool('circle')}
              className={`p-2 rounded ${selectedTool === 'circle' ? 'bg-ferrari-red text-white' : 'hover:bg-ferrari-red/10'}`}
            >
              <Circle className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip title="Erase">
            <button
              onClick={() => setSelectedTool('eraser')}
              className={`p-2 rounded ${selectedTool === 'eraser' ? 'bg-ferrari-red text-white' : 'hover:bg-ferrari-red/10'}`}
            >
              <Eraser className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip title="Select and edit items">
            <button
              onClick={() => setSelectedTool('select')}
              className={`p-2 rounded ${selectedTool === 'select' ? 'bg-ferrari-red text-white' : 'hover:bg-ferrari-red/10'}`}
            >
              <MousePointer className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip title="Undo last action">
            <span>
              <button
                onClick={handleUndo}
                className="p-2 rounded hover:bg-ferrari-red/10 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={history.length === 0}
              >
                <Undo className="w-4 h-4" />
              </button>
            </span>
          </Tooltip>

          <div className="h-6 w-px bg-ferrari-red/20" />
          <select
            value={selectedTemplate?.name || ''}
            onChange={(e) => {
              const template = templates.find(t => t.name === e.target.value);
              if (template) loadTemplate(template);
            }}
            className="bg-black/20 border border-ferrari-red/10 rounded-lg px-3 py-1 text-sm"
          >
            <option value="">Select Template</option>
            {templates.map(template => (
              <option key={template.name} value={template.name}>
                {template.name}
              </option>
            ))}
          </select>
          <div className="h-6 w-px bg-ferrari-red/20" />
          <div className="flex items-center gap-2">
            <span className="text-sm">Color:</span>
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                if (context) context.strokeStyle = e.target.value;
              }}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Background:</span>
            <button
              onClick={() => {
                const newColor = backgroundColor === '#FFFFFF' ? '#000000' : '#FFFFFF';
                setBackgroundColor(newColor);
              }}
              className={`px-3 py-1 rounded flex items-center gap-2 ${
                backgroundColor === '#FFFFFF' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black'
              } border border-gray-400`}
            >
              {backgroundColor === '#FFFFFF' ? 'Switch to Black' : 'Switch to White'}
            </button>
          </div>

          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => {
              setLineWidth(Number(e.target.value));
              if (context) context.lineWidth = Number(e.target.value);
            }}
            className="w-32"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm">Font Size:</span>
            <input
              type="number"
              min="8"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-16 px-2 py-1 bg-black/20 border border-ferrari-red/10 rounded"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={saveCanvasState}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            title="Save current state"
          >
            Save
          </button>
          <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-ferrari-red text-white rounded-lg hover:bg-ferrari-red/90"
          >
            Clear Canvas
          </button>
        </div>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseDown={selectedTool !== 'text' ? startDrawing : undefined}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          style={{ 
            cursor: selectedTool === 'text' ? 'text' : 
                    selectedTool === 'select' ? 'pointer' :
                    selectedTool === 'draw' ? 'crosshair' :
                    selectedTool === 'eraser' ? 'cell' : 'crosshair',
            backgroundColor: backgroundColor
          }}
          className="w-full h-[calc(100vh-200px)] rounded-lg border border-ferrari-red/10"
        />
        
        {contextMenu.visible && (
          <div
            style={{
              position: 'fixed',
              left: contextMenu.x,
              top: contextMenu.y,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '4px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              zIndex: 1000
            }}
          >
            <button
              onClick={() => handleContextMenuAction('duplicate')}
              className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 w-full text-left"
            >
              <Copy className="w-4 h-4" /> Duplicate
            </button>
            <button
              onClick={() => handleContextMenuAction('delete')}
              className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 w-full text-left text-red-600"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            {selectedItem?.type === 'text' && (
              <button
                onClick={() => handleContextMenuAction('edit')}
                className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 w-full text-left"
              >
                <Edit3 className="w-4 h-4" /> Edit Text
              </button>
            )}
          </div>
        )}

        {textBoxes.map((box, index) => (
          <div 
            key={`text-box-container-${index}`} 
            style={{ 
              position: 'absolute', 
              left: box.x, 
              top: box.y,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              pointerEvents: 'none'
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              pointerEvents: 'auto',
              position: 'relative'
            }}>
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '-10px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#0066ff',
                  borderRadius: '50%',
                  cursor: 'move',
                  zIndex: 1001,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseDown={(e) => handleDragStart(e, box)}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#fff',
                    borderRadius: '50%'
                  }}
                />
              </div>
              <textarea
                style={{
                  width: box.width + 'px',
                  height: box.height + 'px',
                  fontSize: box.fontSize + 'px',
                  padding: '8px',
                  border: '2px solid #0066ff',
                  borderRadius: '4px 4px 0 0',
                  backgroundColor: backgroundColor,
                  color: '#000000',
                  textShadow: backgroundColor === '#000000' ? '0 0 2px #FFFFFF' : 'none',
                  resize: 'both',
                  zIndex: 1000,
                  outline: 'none',
                  fontFamily: 'Arial',
                  lineHeight: '1.5',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }}
                value={box.content}
                onChange={(e) => handleTextChange(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Escape') {
                    setTextBoxes(prev => prev.filter(b => b !== box));
                    setActiveTextBox(null);
                  }
                }}
                spellCheck="false"
                placeholder="Type your text here..."
                autoFocus
              />
              <div style={{
                display: 'flex',
                gap: '4px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => {
                    setTextBoxes(prev => prev.filter(b => b !== box));
                    setActiveTextBox(null);
                  }}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#ff4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (box.content.trim()) {
                      const textShape = {
                        type: 'text',
                        content: box.content,
                        x: box.x,
                        y: box.y + box.fontSize,
                        fontSize: box.fontSize,
                        color: '#000000'
                      };
                      addToHistory();
                      setShapes(prev => [...prev, textShape]);
                    }
                    setTextBoxes(prev => prev.filter(b => b !== box));
                    setActiveTextBox(null);
                  }}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#0066ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ))}

        {selectedTemplate && (
          <div className="text-sm text-gray-400">
            {selectedTemplate.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasSection; 