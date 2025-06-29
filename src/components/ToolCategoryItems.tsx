import React from "react";
import { McpServer, Tool, ToolCategory } from "@site/src/lib/tools";
import { ToolList } from "./ToolList";
import { CardLayout } from "@site/src/theme/DocCard";

export const ToolCategoryItems: React.FC<{ rootCategories: ToolCategory[] }> = ({ rootCategories }) => {
  const itemsAreCategoriesOrMcpServers = (items: ToolCategory["items"]) => {
    return items.every((item) => item.type === "category" || item.customProps?.type === "mcp-server");
  }
  return (
    <div>
      {rootCategories.map((category, index) => {
        return (
          <div key={index} style={{ marginBottom: 60 }}>
            <h2>{category.label}</h2>
            
            {/* Check if items are ToolCategories (sub-categories) or Tools */}
            {itemsAreCategoriesOrMcpServers(category.items) ? (
              // Render sub-categories as CardLayout in a grid
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "16px",
                  width: "100%",
                }}
              >
                {(category.items as Array<ToolCategory | McpServer>).map((subCategory, subIndex) => {
                  // TODO: Redo this bit to work with MCP
                  const href = "";  //subCategory.link?.id ? `/${subCategory.link.id}` : `/${subCategory.label.toLowerCase().replace(/\s+/g, '-')}`;
                  
                  return (
                    <CardLayout
                      key={subIndex}
                      href={href}
                      icon={null}
                      title={subCategory.label}
                      description={`Browse ${subCategory.label} tools`}
                    />
                  );
                })}
              </div>
            ) : (
              // Render tools using ToolList
              <ToolList tools={category.items as Tool[]} />
            )}
          </div>
        );
      })}
    </div>
  );
};
