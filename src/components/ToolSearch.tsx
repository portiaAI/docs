import React, { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { getTools } from "@site/src/lib/tools";
import { ToolList } from "./ToolList";
import { ToolsByCategory } from "./ToolsByCategory";

const SearchResults = ({ tools }) => {
  if (tools.length > 0) {
    return <ToolList tools={tools} />;
  }
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      No tools match your search
    </div>
  );
};

export const ToolSearch: React.FC<{ category: string }> = ({ category }) => {
  const isRoot = category === "root";
  const tools = getTools(category).map((tool) => ({
    ...tool,
    title: tool.label,
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTools, setFilteredTools] = useState(tools);

  const showSearch = tools.length > 4;
  const isSearching = searchTerm.trim().length > 0;
  const fuse = useMemo(() => {
    return new Fuse(tools, {
      keys: ["title", isRoot ? "customProps.categoryLabel" : undefined].filter(
        (x) => x,
      ),
      threshold: 0.3,
    });
  }, [tools]);

  useEffect(() => {
    if (!isSearching) {
      setFilteredTools(tools);
    } else {
      const results = fuse.search(searchTerm);
      setFilteredTools(
        results.map((result) => {
          const tool = result.item;
          return {
            ...tool,
            title: isRoot
              ? `${tool.customProps.vendorLabel}: ${tool.label}`
              : tool.title,
          };
        }),
      );
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
      {isSearching ? (
        <SearchResults tools={filteredTools} />
      ) : isRoot ? (
        <ToolsByCategory tools={tools} />
      ) : (
        <ToolList tools={tools} />
      )}
    </>
  );
};
