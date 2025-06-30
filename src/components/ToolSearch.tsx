import React, { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { getTools } from "@site/src/lib/tools";
import { ItemList } from "./ItemList";

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

export const ToolSearch: React.FC<{ category: string }> = ({ category }) => {
  const tools = getTools(category);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTools, setFilteredTools] = useState(tools);

  const showSearch = tools.length > 4;
  const isSearching = searchTerm.trim().length > 0;
  const fuse = useMemo(() => {
    return new Fuse(tools, {
      keys: ["label", "customProps.vendorLabel"],
      threshold: 0.3,
    });
  }, [tools]);

  useEffect(() => {
    if (!isSearching) {
      setFilteredTools(tools);
    } else {
      const results = fuse.search(searchTerm);
      setFilteredTools(
        results.map((result) => result.item),
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
        <ItemList items={tools} />
      )}
    </>
  );
};
