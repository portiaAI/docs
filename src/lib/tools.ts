import sidebars from "@site/sidebars";

export type Tool = {
  id: string;
  label: string;
  title: string;
  description: string;
  customProps: {
    category: string;
    categoryLabel: string;
    vendorLabel: string;
  };
};

const toolSidebar = sidebars.productSidebar[1];

const getLeaves = (sidebar) => {
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
