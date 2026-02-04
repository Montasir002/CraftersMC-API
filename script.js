async function fetchData() {
    const key = document.getElementById('apiKey').value.trim();
    const user = document.getElementById('username').value.trim();
    
    if (!key) {
        alert("Please enter your API Key!");
        return;
    }

    // We use a proxy that handles the "handshake" for us
    const proxy = "https://api.allorigins.win/raw?url=";
    const apiBase = "https://api.craftersmc.net/v1";
    
    const networkUrl = `${proxy}${encodeURIComponent(apiBase + '/network/status')}`;
    const playerUrl = `${proxy}${encodeURIComponent(apiBase + '/player/' + user)}`;

    // Show loading
    document.getElementById('playerCount').innerText = "Connecting...";

    try {
        // Fetch Network Status
        const netRes = await fetch(networkUrl, {
            headers: { "X-API-Key": key }
        });

        if (!netRes.ok) throw new Error(`Server returned ${netRes.status}`);
        
        const netData = await netRes.json();
        document.getElementById('playerCount').innerText = netData.playerCount;
        document.getElementById('maxPlayers').innerText = netData.maxPlayerCount;
        document.getElementById('maintenance').innerText = netData.fullMaintenance ? "YES" : "NO";

        // Fetch Player Stats
        if (user) {
            const playRes = await fetch(playerUrl, {
                headers: { "X-API-Key": key }
            });
            const playData = await playRes.json();
            
            document.getElementById('rank').innerText = playData.selectedRank || "None";
            document.getElementById('playtime').innerText = Math.round(playData.totalPlaytime / 3600) + "h";
            document.getElementById('language').innerText = playData.language || "English";
        }
    } catch (err) {
        console.error("Critical Error:", err);
        document.getElementById('playerCount').innerText = "Blocked";
        alert("The API is blocking the browser request. \n\nReason: CORS Policy. \n\nTo fix this for good, you would need a small backend (Node.js) instead of just a static HTML file.");
    }
}
