import React from "react";
import { Tool, ToolCategory } from "@site/src/lib/tools";
import { ToolList } from "./ToolList";
import { CardLayout } from "@site/src/theme/DocCard";

export const ToolCategoryItems: React.FC<{ rootCategories: ToolCategory[] }> = ({ rootCategories }) => {
  return (
    <div>
      {rootCategories.map((category, index) => {
        return (
          <div key={index} style={{ marginBottom: 60 }}>
            <h2>{category.label}</h2>
            
            {/* Check if items are ToolCategories (sub-categories) or Tools */}
            {category.items.length > 0 && category.items[0].type === "category" ? (
              // Render sub-categories as CardLayout in a grid
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "16px",
                  width: "100%",
                }}
              >
                {(category.items as ToolCategory[]).map((subCategory, subIndex) => {
                  // Construct href from the link.id or fallback to a default pattern
                  const href = subCategory.link?.id ? `/${subCategory.link.id}` : `/${subCategory.label.toLowerCase().replace(/\s+/g, '-')}`;
                  
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
