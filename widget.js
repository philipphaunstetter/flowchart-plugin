"use strict";
var WidgetModule = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // widget.tsx
  var widget_exports = {};
  __export(widget_exports, {
    Widget: () => Widget
  });
  var { widget } = figma;
  var { useSyncedState, usePropertyMenu, AutoLayout, Text: WidgetText, SVG, Input } = widget;
  var ICONS = {
    database: {
      name: "Database",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`
    },
    server: {
      name: "Server",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`
    },
    user: {
      name: "User",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
    }
  };
  function Widget() {
    const [iconKey, setIconKey] = useSyncedState("iconKey", "database");
    const [title, setTitle] = useSyncedState("title", "Database");
    const [annotation, setAnnotation] = useSyncedState("annotation", "");
    const [isEditingDetails, setIsEditingDetails] = useSyncedState("isEditingDetails", false);
    const icons = ICONS;
    const iconOptions = Object.keys(icons).map((key) => ({
      option: key,
      label: icons[key].name
    }));
    usePropertyMenu(
      [
        {
          itemType: "dropdown",
          propertyName: "icon",
          tooltip: "Select Icon",
          selectedOption: iconKey,
          options: iconOptions
        },
        {
          itemType: "action",
          propertyName: "editDetails",
          tooltip: "Edit Details"
        }
      ],
      ({ propertyName, propertyValue }) => {
        if (propertyName === "icon" && typeof propertyValue === "string") {
          setIconKey(propertyValue);
          setTitle(icons[propertyValue].name);
        } else if (propertyName === "editDetails") {
          setIsEditingDetails(!isEditingDetails);
        }
      }
    );
    const currentIcon = icons[iconKey];
    const createConnectedNode = (direction) => {
      return new Promise((resolve) => {
        figma.ui.postMessage({
          type: "create-connected-node",
          sourceNodeId: figma.widget.id,
          direction,
          iconKey: "database"
        });
        resolve();
      });
    };
    return /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        direction: "vertical",
        horizontalAlignItems: "center",
        verticalAlignItems: "center",
        spacing: 8,
        padding: 8,
        tooltip: annotation || void 0
      },
      currentIcon && /* @__PURE__ */ figma.widget.h(AutoLayout, { direction: "vertical", spacing: 8, horizontalAlignItems: "center", positioning: "relative" }, /* @__PURE__ */ figma.widget.h(SVG, { src: currentIcon.svg }), /* @__PURE__ */ figma.widget.h(
        Input,
        {
          value: title,
          onTextEditEnd: (e) => setTitle(e.characters),
          fontSize: 14,
          fontWeight: 600,
          fill: "#333",
          width: 150,
          horizontalAlignText: "center"
        }
      ), /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          onClick: () => createConnectedNode("right"),
          positioning: "absolute",
          x: 160,
          y: 32,
          width: 24,
          height: 24,
          cornerRadius: 12,
          fill: "#0D99FF",
          horizontalAlignItems: "center",
          verticalAlignItems: "center",
          hoverStyle: { opacity: 1 },
          opacity: 0.7
        },
        /* @__PURE__ */ figma.widget.h(WidgetText, { fontSize: 12, fill: "#FFFFFF" }, "\u2192")
      ), /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          onClick: () => createConnectedNode("bottom"),
          positioning: "absolute",
          x: 75,
          y: 80,
          width: 24,
          height: 24,
          cornerRadius: 12,
          fill: "#0D99FF",
          horizontalAlignItems: "center",
          verticalAlignItems: "center",
          hoverStyle: { opacity: 1 },
          opacity: 0.7
        },
        /* @__PURE__ */ figma.widget.h(WidgetText, { fontSize: 12, fill: "#FFFFFF" }, "\u2193")
      )),
      isEditingDetails && /* @__PURE__ */ figma.widget.h(
        Input,
        {
          value: annotation,
          onTextEditEnd: (e) => {
            setAnnotation(e.characters);
            setIsEditingDetails(false);
          },
          placeholder: "Add annotation...",
          fontSize: 12,
          fill: "#666",
          width: 200
        }
      )
    );
  }
  widget.register(Widget);
  return __toCommonJS(widget_exports);
})();
