import React from "react";
import { CardLayout } from "@site/src/theme/DocCard";
import { Tool } from "@site/src/lib/tools";

export const ToolList: React.FC<{ tools: Tool[] }> = ({ tools = [] }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
        width: "100%",
      }}
    >
      {tools.map((tool, index) => {
        return (
          <CardLayout
            key={index}
            href={`/${tool.id}`}
            icon={null}
            title={tool.title}
            description={tool.customProps.description}
          />
        );
      })}
    </div>
  );
};
