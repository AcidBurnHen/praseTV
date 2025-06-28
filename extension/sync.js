function flattenBookmarks(nodes, result = []) {
  for (const node of nodes) {
    if (node.children) {
      // Skip top-level placeholder folders (like "Bookmarks Bar", "Other Bookmarks")
      flattenBookmarks(node.children, result);
    }
    else if (node.url || node.title) {
      console.log("Node: ", node)

      result.push({
        id: node.id,
        title: node.title || "",
        url: node.url || null,
      });
    }
  }
  return result;
}

async function syncBookmarks() {
  chrome.bookmarks.getTree(async (tree) => {
    console.log("Tree: ", tree)
    const flat = flattenBookmarks(tree);

    console.log("Flat: ", flat)

    // try {
      const res = await fetch("http://localhost:3000/api/bookmarks/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(flat)
      });

      console.log("Res: ", res)

      if (!res.ok) throw new Error(`Sync failed: ${res.status}`);
      console.log("Bookmarks synced!");
    // } catch (err) {
    //   console.error("Failed to sync bookmarks:", err);
    // }
  });
}
