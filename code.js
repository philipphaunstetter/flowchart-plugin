"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // code.ts
  var require_code = __commonJS({
    "code.ts"() {
      async function createFlowchartNode(iconKey, title, x, y) {
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        const node = figma.createShapeWithText();
        node.x = x;
        node.y = y;
        node.resize(200, 150);
        node.shapeType = "ROUNDED_RECTANGLE";
        node.setPluginData("nodeType", iconKey);
        node.setPluginData("title", title);
        node.text.characters = `${getIconEmoji(iconKey)} ${title}`;
        node.text.fontSize = 16;
        node.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
        node.strokes = [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 } }];
        node.strokeWeight = 2;
        figma.currentPage.appendChild(node);
        return node;
      }
      function getIconEmoji(iconKey) {
        const emojis = {
          database: "\u{1F4BE}",
          server: "\u{1F5A5}\uFE0F",
          user: "\u{1F464}"
        };
        return emojis[iconKey];
      }
      async function createConnectedNode(sourceNode, direction) {
        const sourceType = sourceNode.getPluginData("nodeType") || "database";
        const spacing = 200;
        let x = sourceNode.x;
        let y = sourceNode.y;
        if (direction === "right") {
          x += sourceNode.width + spacing;
        } else {
          y += sourceNode.height + spacing;
        }
        const newNode = await createFlowchartNode(sourceType, sourceType.charAt(0).toUpperCase() + sourceType.slice(1), x, y);
        const connector = figma.createConnector();
        connector.connectorStart = {
          endpointNodeId: sourceNode.id,
          magnet: "AUTO"
        };
        connector.connectorEnd = {
          endpointNodeId: newNode.id,
          magnet: "AUTO"
        };
        figma.currentPage.selection = [newNode];
        figma.viewport.scrollAndZoomIntoView([newNode]);
      }
      figma.showUI(__html__, { width: 240, height: 200 });
      figma.ui.onmessage = async (msg) => {
        if (msg.type === "create-node") {
          const { iconKey, title } = msg;
          const viewport = figma.viewport.center;
          const node = await createFlowchartNode(iconKey, title, viewport.x - 75, viewport.y - 50);
          figma.currentPage.selection = [node];
          figma.viewport.scrollAndZoomIntoView([node]);
          figma.notify(`Created ${title} node. Select it and press \u2192 or \u2193 to add connected nodes.`);
        }
        if (msg.type === "create-connected") {
          const { direction } = msg;
          const selection = figma.currentPage.selection;
          if (selection.length === 1 && selection[0].type === "SHAPE_WITH_TEXT" && selection[0].getPluginData("nodeType")) {
            await createConnectedNode(selection[0], direction);
          } else {
            figma.notify("Please select a flowchart node first");
          }
        }
        if (msg.type === "cancel") {
          figma.closePlugin();
        }
      };
      figma.on("run", ({ command }) => {
        if (command === "add-right") {
          const selection = figma.currentPage.selection;
          if (selection.length === 1 && selection[0].type === "SHAPE_WITH_TEXT" && selection[0].getPluginData("nodeType")) {
            createConnectedNode(selection[0], "right");
          }
        } else if (command === "add-bottom") {
          const selection = figma.currentPage.selection;
          if (selection.length === 1 && selection[0].type === "SHAPE_WITH_TEXT" && selection[0].getPluginData("nodeType")) {
            createConnectedNode(selection[0], "bottom");
          }
        }
      });
    }
  });
  require_code();
})();
