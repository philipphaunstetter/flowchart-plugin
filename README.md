# Smart Flowchart Nodes - Figma Widget

A polymorphic Figma Widget that dynamically loads and displays different flowchart node icons from a backend API.

## Features

- **Polymorphic Nodes**: Single widget that switches between multiple icon types
- **Property Menu**: Dropdown to select different icons (Database, Server, User, etc.)
- **Editable Title**: Click text to rename the node
- **Annotations**: Add hidden tooltip annotations via "Edit Details" action
- **API Integration**: Fetches icons from the backend API

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the widget:
   ```bash
   npm run build
   ```

3. In Figma:
   - Go to Menu → Widgets → Development → Import widget from manifest
   - Select the `manifest.json` file from this directory

## Development

- `npm run build` - Build the widget
- `npm run typecheck` - Run TypeScript type checking

## Environment Variables

The API base URL defaults to `https://flowchart-backend.vercel.app`. To override, create a `.env` file:

```
API_BASE_URL=http://localhost:3000
```

## Usage

1. Open a FigJam board
2. Add the "Smart Flowchart Nodes" widget
3. Right-click → Select icon from dropdown
4. Click title text to rename
5. Right-click → Edit Details to add annotations (shown on hover)
