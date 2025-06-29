import sidebars from "@site/sidebars";

export type Tool = {
  id: string;
  label: string;
  title: string;
  type: "doc";
  customProps: {
    description: string;
    category: string;
    categoryLabel: string;
    vendorLabel: string;
  };
};

export type ToolCategory = {
  label: string;
  type: "category";
  items: Array<Tool | ToolCategory>;
  link?: {
    type: string;
    id: string;
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
      }
      return item;
    })
    .flat();
};

const allTools = getLeaves(toolSidebar) as Tool[];

export const getTools = (category: string): Tool[] =>
  category === "root"
    ? allTools
    : allTools.filter((tool) => tool.customProps.category === category);


export const getToolCategories = (): ToolCategory[] => toolSidebar.items as ToolCategory[]
