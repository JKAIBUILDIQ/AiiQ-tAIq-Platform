export type TemplateShape = {
  type: 'rectangle' | 'circle' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
  lineWidth: number;
  content?: string;
};

export type Template = {
  name: string;
  description: string;
  shapes: TemplateShape[];
};

const createOrgChartNode = (
  x: number, 
  y: number, 
  title: string, 
  width = 200, 
  height = 80
): TemplateShape[] => [
  {
    type: 'rectangle',
    x,
    y,
    width,
    height,
    color: '#FFFFFF',
    lineWidth: 2
  },
  {
    type: 'text',
    x: x + width/2,
    y: y + height/2,
    color: '#FFFFFF',
    lineWidth: 1,
    content: title
  }
];

export const templates: Template[] = [
  {
    name: 'Basic Org Chart',
    description: 'A simple organizational chart with CEO and direct reports',
    shapes: [
      // CEO
      ...createOrgChartNode(400, 50, 'CEO'),
      
      // Direct Reports
      ...createOrgChartNode(200, 200, 'CTO'),
      ...createOrgChartNode(400, 200, 'CFO'),
      ...createOrgChartNode(600, 200, 'COO'),
      
      // Connecting lines
      {
        type: 'rectangle',
        x: 500,
        y: 130,
        width: 2,
        height: 70,
        color: '#FFFFFF',
        lineWidth: 2
      },
      {
        type: 'rectangle',
        x: 300,
        y: 200,
        width: 400,
        height: 2,
        color: '#FFFFFF',
        lineWidth: 2
      }
    ]
  },
  {
    name: 'System Architecture',
    description: 'Basic system architecture diagram template',
    shapes: [
      // Frontend
      {
        type: 'rectangle',
        x: 100,
        y: 100,
        width: 150,
        height: 80,
        color: '#4CAF50',
        lineWidth: 2
      },
      {
        type: 'text',
        x: 175,
        y: 140,
        color: '#FFFFFF',
        lineWidth: 1,
        content: 'Frontend'
      },
      
      // API Gateway
      {
        type: 'rectangle',
        x: 350,
        y: 100,
        width: 150,
        height: 80,
        color: '#2196F3',
        lineWidth: 2
      },
      {
        type: 'text',
        x: 425,
        y: 140,
        color: '#FFFFFF',
        lineWidth: 1,
        content: 'API Gateway'
      },
      
      // Database
      {
        type: 'circle',
        x: 600,
        y: 140,
        radius: 40,
        color: '#FFC107',
        lineWidth: 2
      },
      {
        type: 'text',
        x: 600,
        y: 140,
        color: '#FFFFFF',
        lineWidth: 1,
        content: 'Database'
      },
      
      // Connecting arrows
      {
        type: 'rectangle',
        x: 250,
        y: 140,
        width: 100,
        height: 2,
        color: '#FFFFFF',
        lineWidth: 2
      },
      {
        type: 'rectangle',
        x: 500,
        y: 140,
        width: 60,
        height: 2,
        color: '#FFFFFF',
        lineWidth: 2
      }
    ]
  },
  {
    name: 'Network Diagram',
    description: 'Basic network topology diagram',
    shapes: [
      // Cloud
      {
        type: 'circle',
        x: 400,
        y: 100,
        radius: 50,
        color: '#03A9F4',
        lineWidth: 2
      },
      {
        type: 'text',
        x: 400,
        y: 100,
        color: '#FFFFFF',
        lineWidth: 1,
        content: 'Cloud'
      },
      
      // Servers
      {
        type: 'rectangle',
        x: 200,
        y: 250,
        width: 120,
        height: 60,
        color: '#4CAF50',
        lineWidth: 2
      },
      {
        type: 'text',
        x: 260,
        y: 280,
        color: '#FFFFFF',
        lineWidth: 1,
        content: 'Server 1'
      },
      
      {
        type: 'rectangle',
        x: 400,
        y: 250,
        width: 120,
        height: 60,
        color: '#4CAF50',
        lineWidth: 2
      },
      {
        type: 'text',
        x: 460,
        y: 280,
        color: '#FFFFFF',
        lineWidth: 1,
        content: 'Server 2'
      },
      
      {
        type: 'rectangle',
        x: 600,
        y: 250,
        width: 120,
        height: 60,
        color: '#4CAF50',
        lineWidth: 2
      },
      {
        type: 'text',
        x: 660,
        y: 280,
        color: '#FFFFFF',
        lineWidth: 1,
        content: 'Server 3'
      },
      
      // Connecting lines
      {
        type: 'rectangle',
        x: 400,
        y: 150,
        width: 2,
        height: 50,
        color: '#FFFFFF',
        lineWidth: 2
      },
      {
        type: 'rectangle',
        x: 260,
        y: 200,
        width: 400,
        height: 2,
        color: '#FFFFFF',
        lineWidth: 2
      },
      {
        type: 'rectangle',
        x: 260,
        y: 200,
        width: 2,
        height: 50,
        color: '#FFFFFF',
        lineWidth: 2
      },
      {
        type: 'rectangle',
        x: 460,
        y: 200,
        width: 2,
        height: 50,
        color: '#FFFFFF',
        lineWidth: 2
      },
      {
        type: 'rectangle',
        x: 660,
        y: 200,
        width: 2,
        height: 50,
        color: '#FFFFFF',
        lineWidth: 2
      }
    ]
  }
]; 