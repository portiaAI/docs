import sidebars from "@site/sidebars";

export type Tool = {
  id: string;
  label: string;
  title: string;
  type: "doc";
  customProps: {
    type: "tool";
    description: string;
    category: string;
    categoryLabel: string;
    vendorLabel: string;
  };
};

export type McpServer = {
  id: string;
  label: string;
  title: string;
  type: "doc";
  customProps: {
    type: "mcp-server";
    description: string;
    categoryLabel: string;
  };
};

export type Item = ToolCategory | Tool | McpServer;

export type ToolCategory = {
  label: string;
  type: "category";
  items: Array<Item>;
  link?: {
    type: string;
    id: string;
  };
  customProps: {
    type: "category";
    description: string;
  };
};

const toolSidebar = sidebars.toolsSidebar[0];

const getLeaves = (sidebar) => {
  if (!sidebar) {
    return [];
  }
  return sidebar.items
    .map((item) => {
      if (item.type === "category") {
        return getLeaves(item);
      } else if (item.customProps.type === "tool" || item.customProps.type === "mcp-server") {
        return item;
      } else {
        return [];
      }
    })
    .flat();
};

export const getItems = (category: string) => {
  const findCategory = (sidebar) => {
    if (sidebar.label === category) {
      return [sidebar];
    } else if (sidebar.items) {
      return sidebar.items.map(findCategory).flat();
    } else {
      return [];
    }
  };

  const categorySidebar = findCategory(toolSidebar);
  return categorySidebar.length > 0 ? categorySidebar[0].items as Array<Item> : [];
};

export const allToolsAndMcpServers = getLeaves(toolSidebar) as Array<Tool | McpServer>;


export const getToolCategories = (): ToolCategory[] => toolSidebar.items as ToolCategory[]
