import React, { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { CardLayout } from "@site/src/theme/DocCard";
import { getTools } from "@site/src/lib/tools";

export const ToolList: React.FC<{ category: string }> = ({ category }) => {
  const tools = getTools(category).map((tool) => ({
    ...tool,
    title:
      category === "root"
        ? `${tool.customProps.vendorLabel}: ${tool.label}`
        : tool.label,
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTools, setFilteredTools] = useState(tools);
  const showSearch = tools.length > 4;
  const isSearching = searchTerm.trim().length > 0;
  const fuse = useMemo(() => {
    return new Fuse(tools, {
      keys: ["title"],
      threshold: 0.3,
    });
  }, [tools]);

  useEffect(() => {
    if (!isSearching) {
      setFilteredTools(tools);
    } else {
      const results = fuse.search(searchTerm);
      setFilteredTools(results.map((result) => result.item));
    }
  }, [searchTerm]);

  return (
    <>
      {showSearch && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 16px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid var(--ifm-color-emphasis-300)",
              backgroundColor: "var(--ifm-background-color)",
              color: "var(--ifm-font-color-base)",
            }}
          />
        </div>
      )}

      {filteredTools.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
            width: "100%",
          }}
        >
          {filteredTools.map((tool, index) => {
            return (
              <CardLayout
                key={index}
                href={`/${tool.id}`}
                icon={null}
                title={tool.title}
                description={tool.description}
              />
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          No tools match your search
        </div>
      )}
    </>
  );
};
