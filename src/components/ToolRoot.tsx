import React, { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { allToolsAndMcpServers, getToolCategories, getTools, McpServer, Tool, ToolCategory } from "@site/src/lib/tools";
import { ItemList } from "./ItemList";


const ToolCategoryItems: React.FC<{ rootCategories: ToolCategory[] }> = ({ rootCategories }) => {
  return (
    <div>
      {rootCategories.map((category, index) => {
        return (
          <div key={index} style={{ marginBottom: 60 }}>
            <h2>{category.label}</h2>
            <ItemList items={category.items} />
          </div>
        );
      })}
    </div>
  );
};


const SearchResults = ({ tools }) => {
  if (tools.length > 0) {
    return <ItemList items={tools} />;
  }
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      No tools match your search
    </div>
  );
};

export const ToolRoot = () => {
  const categories = getToolCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTools, setFilteredTools] = useState(allToolsAndMcpServers);

  const showSearch = allToolsAndMcpServers.length > 4;
  const isSearching = searchTerm.trim().length > 0;
  const fuse = useMemo(() => {
    return new Fuse(allToolsAndMcpServers, {
      keys: ["label", "customProps.categoryLabel", "customProps.searchKeywords"],
      threshold: 0.3,
    });
  }, [allToolsAndMcpServers]);

  const filteredLabel = (toolOrMcp: Tool | McpServer) => {
    switch (toolOrMcp.customProps.type) {
      case "tool":
        return `${toolOrMcp.customProps.vendorLabel} ${toolOrMcp.label}`;
      case "mcp-server":
        return `${toolOrMcp.customProps.categoryLabel}: ${toolOrMcp.label}`;
    }
  }

  useEffect(() => {
    if (!isSearching) {
      setFilteredTools(allToolsAndMcpServers);
    } else {
      const results = fuse.search(searchTerm);
      setFilteredTools(
        results.map((result) => {
          const toolOrMcp = result.item;
          return {
            ...toolOrMcp,
            label: filteredLabel(toolOrMcp)
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
      ) : (
        <ToolCategoryItems rootCategories={categories} />
      )}
    </>
  );
};
