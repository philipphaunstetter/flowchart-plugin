"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // code.ts
  var require_code = __commonJS({
    "code.ts"() {
      var ICONS = {
        database: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
        server: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
        user: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
      };
      function createFlowchartNode(iconKey, title, x, y) {
        const frame = figma.createFrame();
        frame.name = `${title} Node`;
        frame.x = x;
        frame.y = y;
        frame.resize(150, 100);
        frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
        frame.cornerRadius = 8;
        frame.strokes = [{ type: "SOLID", color: { r: 0.88, g: 0.88, b: 0.88 } }];
        frame.strokeWeight = 1;
        frame.setPluginData("nodeType", iconKey);
        frame.setPluginData("title", title);
        const icon = figma.createNodeFromSvg(ICONS[iconKey]);
        icon.x = 43;
        icon.y = 10;
        icon.resize(64, 64);
        frame.appendChild(icon);
        const text = figma.createText();
        text.characters = title;
        text.fontSize = 14;
        text.fontName = { family: "Inter", style: "Semi Bold" };
        text.x = 0;
        text.y = 80;
        text.resize(150, 20);
        text.textAlignHorizontal = "CENTER";
        frame.appendChild(text);
        figma.currentPage.appendChild(frame);
        return frame;
      }
      function createConnectedNode(sourceNode, direction) {
        const sourceType = sourceNode.getPluginData("nodeType") || "database";
        const spacing = 200;
        let x = sourceNode.x;
        let y = sourceNode.y;
        if (direction === "right") {
          x += sourceNode.width + spacing;
        } else {
          y += sourceNode.height + spacing;
        }
        const newNode = createFlowchartNode(sourceType, sourceType.charAt(0).toUpperCase() + sourceType.slice(1), x, y);
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
      figma.showUI(__html__, { width: 300, height: 400 });
      figma.ui.onmessage = (msg) => {
        if (msg.type === "create-node") {
          const { iconKey, title } = msg;
          const viewport = figma.viewport.center;
          const node = createFlowchartNode(iconKey, title, viewport.x - 75, viewport.y - 50);
          figma.currentPage.selection = [node];
          figma.viewport.scrollAndZoomIntoView([node]);
        }
        if (msg.type === "create-connected") {
          const { direction } = msg;
          const selection = figma.currentPage.selection;
          if (selection.length === 1 && selection[0].type === "FRAME" && selection[0].getPluginData("nodeType")) {
            createConnectedNode(selection[0], direction);
          } else {
            figma.notify("Please select a flowchart node first");
          }
        }
        if (msg.type === "cancel") {
          figma.closePlugin();
        }
      };
    }
  });
  require_code();
})();
