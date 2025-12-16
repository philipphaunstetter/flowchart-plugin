const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Text: WidgetText, SVG, Input } = widget;

interface Icon {
  name: string;
  svg: string;
}

interface IconsResponse {
  [key: string]: Icon;
}

function Widget() {
  const [iconKey, setIconKey] = useSyncedState<string>("iconKey", "database");
  const [title, setTitle] = useSyncedState<string>("title", "Database");
  const [annotation, setAnnotation] = useSyncedState<string>("annotation", "");
  const [isEditingDetails, setIsEditingDetails] = useSyncedState<boolean>("isEditingDetails", false);
  const [icons, setIcons] = useSyncedState<IconsResponse | null>("icons", null);
  const [isLoading, setIsLoading] = useSyncedState<boolean>("isLoading", false);

  // Fetch icons from API on mount
  if (icons === null && !isLoading) {
    setIsLoading(true);
    const apiBaseUrl = "https://flowchart-backend.vercel.app";
    
    fetch(`${apiBaseUrl}/api/icons`)
      .then((res) => res.json())
      .then((data: IconsResponse) => {
        setIcons(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch icons:", err);
        setIsLoading(false);
      });
  }

  // Build property menu for icon selection
  const iconOptions = icons
    ? Object.keys(icons).map((key) => ({
        option: key,
        label: icons[key].name,
      }))
    : [];

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
        if (icons) {
          setTitle(icons[propertyValue].name);
        }
      } else if (propertyName === "editDetails") {
        setIsEditingDetails(!isEditingDetails);
      }
    }
  );

  const currentIcon = icons ? icons[iconKey] : null;

  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      spacing={12}
      padding={16}
      fill="#FFFFFF"
      cornerRadius={8}
      stroke="#E0E0E0"
      strokeWidth={1}
      tooltip={annotation || undefined}
    >
      {isLoading && (
        <WidgetText fontSize={14} fill="#666">
          Loading...
        </WidgetText>
      )}

      {!isLoading && currentIcon && (
        <AutoLayout direction="vertical" spacing={8} horizontalAlignItems="center">
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
        </AutoLayout>
      )}

      {isEditingDetails && (
        <Input
          value={annotation}
          onTextEditEnd={(e) => setAnnotation(e.characters)}
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
