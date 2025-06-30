import React from "react";
import { CardLayout } from "@site/src/theme/DocCard";
import { Item } from "@site/src/lib/tools";

export const ItemList: React.FC<{ items: Item[] }> = ({ items = [] }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
        width: "100%",
      }}
    >
      {items.map((item, index) => {
        return (
          <CardLayout
            key={index}
            href={item.type === "doc" ? `/${item.id}` : `/${item.link?.id.replace(/\/index$/, "") || ""}`}
            icon={null}
            title={item.label}
            description={item.type === "doc" && item.customProps.description || ""}
          />
        );
      })}
    </div>
  );
};
