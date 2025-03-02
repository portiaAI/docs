import sidebars from "@site/sidebars";

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

const allTools = getLeaves(toolSidebar);

export const getTools = (category) =>
  category === "root"
    ? allTools
    : allTools.filter((tool) => tool.customProps.category === category);
