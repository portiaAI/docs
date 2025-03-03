import React from "react";
import { Tool } from "@site/src/lib/tools";
import { ToolList } from "./ToolList";

export const ToolsByCategory: React.FC<{ tools: Tool[] }> = ({ tools }) => {
  const categories = tools.reduce((acc, tool) => {
    if (!acc[tool.customProps.categoryLabel]) {
      acc[tool.customProps.categoryLabel] = [];
    }
    acc[tool.customProps.categoryLabel].push(tool);
    return acc;
  }, {});

  return (
    <div>
      {Object.keys(categories).map((category, index) => {
        return (
          <div key={index} style={{ marginBottom: 60 }}>
            <h2>{category}</h2>
            <ToolList tools={categories[category]} />
          </div>
        );
      })}
    </div>
  );
};
