// Icon SVG data
const ICONS = {
  database: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
  server: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
};

type IconKey = keyof typeof ICONS;

// Create a flowchart node using ShapeWithText (has native outlets!)
async function createFlowchartNode(iconKey: IconKey, title: string, x: number, y: number): Promise<ShapeWithTextNode> {
  // Load font first
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  
  // Create ShapeWithText node (FigJam-specific with built-in outlets)
  const node = figma.createShapeWithText();
  node.x = x;
  node.y = y;
  node.resize(200, 150);
  node.shapeType = 'ROUNDED_RECTANGLE';
  
  // Store metadata
  node.setPluginData('nodeType', iconKey);
  node.setPluginData('title', title);
  
  // Set text
  node.text.characters = `${getIconEmoji(iconKey)} ${title}`;
  node.text.fontSize = 16;
  
  // Style
  node.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  node.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
  node.strokeWeight = 2;
  
  figma.currentPage.appendChild(node);
  return node;
}

// Get emoji for icon type
function getIconEmoji(iconKey: IconKey): string {
  const emojis = {
    database: '💾',
    server: '🖥️',
    user: '👤',
  };
  return emojis[iconKey];
}

// Create connected node
async function createConnectedNode(sourceNode: ShapeWithTextNode, direction: 'right' | 'bottom') {
  const sourceType = sourceNode.getPluginData('nodeType') as IconKey || 'database';
  const spacing = 200;
  
  let x = sourceNode.x;
  let y = sourceNode.y;
  
  if (direction === 'right') {
    x += sourceNode.width + spacing;
  } else {
    y += sourceNode.height + spacing;
  }
  
  const newNode = await createFlowchartNode(sourceType, sourceType.charAt(0).toUpperCase() + sourceType.slice(1), x, y);
  
  // Create connector
  const connector = figma.createConnector();
  connector.connectorStart = {
    endpointNodeId: sourceNode.id,
    magnet: 'AUTO',
  };
  connector.connectorEnd = {
    endpointNodeId: newNode.id,
    magnet: 'AUTO',
  };
  
  figma.currentPage.selection = [newNode];
  figma.viewport.scrollAndZoomIntoView([newNode]);
}

// Show UI
figma.showUI(__html__, { width: 240, height: 200 });

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-node') {
    const { iconKey, title } = msg;
    const viewport = figma.viewport.center;
    const node = await createFlowchartNode(iconKey, title, viewport.x - 75, viewport.y - 50);
    figma.currentPage.selection = [node];
    figma.viewport.scrollAndZoomIntoView([node]);
    figma.notify(`Created ${title} node. Select it and press → or ↓ to add connected nodes.`);
  }
  
  if (msg.type === 'create-connected') {
    const { direction } = msg;
    const selection = figma.currentPage.selection;
    
    if (selection.length === 1 && selection[0].type === 'SHAPE_WITH_TEXT' && selection[0].getPluginData('nodeType')) {
      await createConnectedNode(selection[0] as ShapeWithTextNode, direction);
    } else {
      figma.notify('Please select a flowchart node first');
    }
  }
  
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// Add keyboard shortcuts
figma.on('run', ({ command }: RunEvent) => {
  if (command === 'add-right') {
    const selection = figma.currentPage.selection;
    if (selection.length === 1 && selection[0].type === 'SHAPE_WITH_TEXT' && selection[0].getPluginData('nodeType')) {
      createConnectedNode(selection[0] as ShapeWithTextNode, 'right');
    }
  } else if (command === 'add-bottom') {
    const selection = figma.currentPage.selection;
    if (selection.length === 1 && selection[0].type === 'SHAPE_WITH_TEXT' && selection[0].getPluginData('nodeType')) {
      createConnectedNode(selection[0] as ShapeWithTextNode, 'bottom');
    }
  }
});
