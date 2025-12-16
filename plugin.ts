// Import the widget
import { Widget } from './widget';

// Show UI for initial setup (can be hidden)
figma.showUI(__html__, { visible: false, width: 1, height: 1 });

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-connected-node') {
    const { sourceNodeId, direction, iconKey } = msg;
    
    // Get the source node
    const sourceNode = figma.getNodeById(sourceNodeId);
    if (!sourceNode || sourceNode.type !== 'WIDGET') return;
    
    // Create new widget instance
    const newWidget = figma.createWidget(Widget);
    
    // Position the new widget
    const spacing = 150;
    if (direction === 'right') {
      newWidget.x = sourceNode.x + sourceNode.width + spacing;
      newWidget.y = sourceNode.y;
    } else {
      newWidget.x = sourceNode.x;
      newWidget.y = sourceNode.y + sourceNode.height + spacing;
    }
    
    // Set the icon if provided
    if (iconKey) {
      newWidget.setWidgetSyncedState({ iconKey });
    }
    
    // Create connector line
    const connector = figma.createConnector();
    connector.connectorStart = {
      endpointNodeId: sourceNode.id,
      magnet: 'AUTO',
    };
    connector.connectorEnd = {
      endpointNodeId: newWidget.id,
      magnet: 'AUTO',
    };
    
    // Select the new widget
    figma.currentPage.selection = [newWidget];
    figma.viewport.scrollAndZoomIntoView([newWidget]);
  }
};

// Register the widget
figma.widget.register(Widget);
