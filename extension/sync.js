function flattenBookmarks(nodes, result = []) {
  for (const node of nodes) {
    if (node.children) {
      // Skip top-level placeholder folders (like "Bookmarks Bar", "Other Bookmarks")
      flattenBookmarks(node.children, result);
    }
    else if (node.url || node.title) {
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
    console.log("Tree:", tree);
    const flat = flattenBookmarks(tree);

    const endpoints = [
      'http://prase.tv/api/bookmarks/import',
      'http://localhost:3000/api/bookmarks/import'
    ];

    for (const url of endpoints) {
      console.log("Pinging url: ", url)
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(flat)
        });

        if (!res.ok) throw new Error(`Sync failed: ${res.status}`);
        console.log(`Bookmarks synced via ${url}`);
        return;
      } catch (err) {
        console.warn(`Sync failed at ${url}:`, err.message);
      }
    }

    console.error("All sync attempts failed.");
  });
}
