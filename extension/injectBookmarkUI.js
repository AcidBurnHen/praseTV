chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "showBookmarkUI") {
    if (document.getElementById("__prasetv_ui")) return;

    const wrapper = document.createElement("div");
    wrapper.id = "__prasetv_ui";
    wrapper.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 14rem;
        width: 420px;
        background: rgba(60, 60, 60, 0.9);
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
        font-family: system-ui, sans-serif;
        font-size: 13px;
        color: white;
        padding: 16px;
        z-index: calc(9999999999 * 100);
        display: flex;
        gap: 16px;
        backdrop-filter: blur(8px);
      ">
        <div style="
          width: 72px;
          height: 72px;
          background: #000;
          border-radius: 8px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <img src='https://www.google.com/s2/favicons?domain=${new URL(msg.url).hostname}&sz=64' style="width: 32px; height: 32px;" />
        </div>
        <div style="flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 15px; font-weight: 500;">Add new bookmark</span>
            <button id="prase_close" style="
              background: none;
              border: none;
              color: #999;
              font-size: 18px;
              cursor: pointer;
            ">&times;</button>
          </div>

          <label style="color: #ccc;">Name</label>
          <input id="prase_title" type="text" value="${msg.title}" style="
            width: 100%;
            background: #2c2c2c;
            border: 1px solid #555;
            border-radius: 8px;
            color: white;
            padding: 8px;
            margin-bottom: 10px;
            outline: none;
            font-size: 13px;
          ">

          <label style="color: #ccc;">Folder</label>
          <select id="prase_folder" style="
            width: 100%;
            background: #2c2c2c;
            border: 1px solid #555;
            border-radius: 8px;
            color: white;
            padding: 8px;
            margin-bottom: 12px;
            font-size: 13px;
          ">
            <option value="1">Other bookmarks</option>
          </select>

          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button id="prase_cancel" style="
              background: none;
              border: 1px solid #555;
              color: #bbb;
              border-radius: 20px;
              padding: 6px 16px;
              font-size: 13px;
              cursor: pointer;
            ">Remove</button>
            <button id="prase_save" style="
              background-color: #1a73e8;
              color: white;
              border: none;
              border-radius: 20px;
              padding: 6px 16px;
              font-size: 13px;
              cursor: pointer;
            ">Done</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper);

    // Event handlers
    document.getElementById("prase_save").onclick = () => {
      const title = document.getElementById("prase_title").value;
      const url = msg.url;
      chrome.runtime.sendMessage({ action: "createBookmark", title, url });
      wrapper.remove();
    };

    document.getElementById("prase_cancel").onclick = () => {
      wrapper.remove(); 
    };

    document.getElementById("prase_close").onclick = () => {
      wrapper.remove();
    };
  }
});
