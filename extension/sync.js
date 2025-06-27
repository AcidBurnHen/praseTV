function flattenBookmarks(nodes, parentId = null, result = []) {
  for (const node of nodes) {
    if (node.url || node.title) {
      result.push({
        id: node.id,
        title: node.title || "",
        url: node.url || null,
        parent_id: parentId
      });
    }

    if (node.children) {
      flattenBookmarks(node.children, node.id, result);
    }
  }
  return result;
}

async function syncBookmarks() {
  chrome.bookmarks.getTree(async (tree) => {
    const flat = flattenBookmarks(tree);

    try {
      const res = await fetch("http://localhost:3000/api/bookmarks/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(flat)
      });

      if (!res.ok) throw new Error(`Sync failed: ${res.status}`);
      console.log("Bookmarks synced!");
    } catch (err) {
      console.error("Failed to sync bookmarks:", err);
    }
  });
}
