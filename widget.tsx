const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Text: WidgetText, SVG, Input } = widget;

interface Icon {
  name: string;
  svg: string;
}

interface IconsResponse {
  [key: string]: Icon;
}

// Embedded icons data (fetched from backend)
const ICONS: IconsResponse = {
  database: {
    name: "Database",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
  },
  server: {
    name: "Server",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
  },
  user: {
    name: "User",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  },
};

export function Widget() {
  const [iconKey, setIconKey] = useSyncedState<string>("iconKey", "database");
  const [title, setTitle] = useSyncedState<string>("title", "Database");
  const [annotation, setAnnotation] = useSyncedState<string>("annotation", "");
  const [isEditingDetails, setIsEditingDetails] = useSyncedState<boolean>("isEditingDetails", false);
  // Use embedded icons directly
  const icons = ICONS;

  // Build property menu for icon selection
  const iconOptions = Object.keys(icons).map((key) => ({
    option: key,
    label: icons[key].name,
  }));

  // Property menu for icon selection
  usePropertyMenu(
      [
        {
          itemType: "dropdown",
          propertyName: "icon",
          tooltip: "Select Icon",
          selectedOption: iconKey,
          options: iconOptions,
        },
        {
          itemType: "action",
          propertyName: "editDetails",
          tooltip: "Edit Details",
        },
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

  const createConnectedNode = (direction: 'right' | 'bottom') => {
    return new Promise<void>((resolve) => {
      figma.ui.postMessage({
        type: 'create-connected-node',
        sourceNodeId: figma.widget.id,
        direction,
        iconKey: 'database',
      });
      resolve();
    });
  };

  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      spacing={8}
      padding={8}
      tooltip={annotation || undefined}
    >
      {currentIcon && (
        <AutoLayout direction="vertical" spacing={8} horizontalAlignItems="center" positioning="relative">
          <SVG src={currentIcon.svg} />
          <Input
            value={title}
            onTextEditEnd={(e) => setTitle(e.characters)}
            fontSize={14}
            fontWeight={600}
            fill="#333"
            width={150}
            horizontalAlignText="center"
          />
          
          {/* Right outlet */}
          <AutoLayout
            onClick={() => createConnectedNode('right')}
            positioning="absolute"
            x={160}
            y={32}
            width={24}
            height={24}
            cornerRadius={12}
            fill="#0D99FF"
            horizontalAlignItems="center"
            verticalAlignItems="center"
            hoverStyle={{ opacity: 1 }}
            opacity={0.7}
          >
            <WidgetText fontSize={12} fill="#FFFFFF">→</WidgetText>
          </AutoLayout>
          
          {/* Bottom outlet */}
          <AutoLayout
            onClick={() => createConnectedNode('bottom')}
            positioning="absolute"
            x={75}
            y={80}
            width={24}
            height={24}
            cornerRadius={12}
            fill="#0D99FF"
            horizontalAlignItems="center"
            verticalAlignItems="center"
            hoverStyle={{ opacity: 1 }}
            opacity={0.7}
          >
            <WidgetText fontSize={12} fill="#FFFFFF">↓</WidgetText>
          </AutoLayout>
        </AutoLayout>
      )}

      {isEditingDetails && (
        <Input
          value={annotation}
          onTextEditEnd={(e) => {
            setAnnotation(e.characters);
            setIsEditingDetails(false);
          }}
          placeholder="Add annotation..."
          fontSize={12}
          fill="#666"
          width={200}
        />
      )}
    </AutoLayout>
  );
}

widget.register(Widget);
