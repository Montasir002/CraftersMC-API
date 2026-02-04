async function fetchData() {
    const key = document.getElementById('apiKey').value.trim();
    const user = document.getElementById('username').value.trim();
    
    if (!key) {
        alert("Please enter your API Key!");
        return;
    }

    // This proxy is better for GitHub Pages as it doesn't require manual activation
    const proxy = "https://corsproxy.io/?";
    const apiBase = "https://api.craftersmc.net/v1";
    
    const networkUrl = proxy + encodeURIComponent(`${apiBase}/network/status`);
    const playerUrl = proxy + encodeURIComponent(`${apiBase}/player/${user}`);

    const requestOptions = {
        method: 'GET',
        headers: {
            'X-API-Key': key,
            'Accept': 'application/json'
        }
    };

    // Show loading state
    document.getElementById('playerCount').innerText = "Loading...";

    try {
        // 1. Get Network Stats (Public Endpoint)
        const netRes = await fetch(networkUrl, requestOptions);
        if (!netRes.ok) throw new Error(`Network Error: ${netRes.status}`);
        
        const netData = await netRes.json();
        document.getElementById('playerCount').innerText = netData.playerCount;
        document.getElementById('maxPlayers').innerText = netData.maxPlayerCount;
        document.getElementById('maintenance').innerText = netData.fullMaintenance ? "YES" : "NO";

        // 2. Get Player Stats (Requires username)
        if (user) {
            const playRes = await fetch(playerUrl, requestOptions);
            if (!playRes.ok) throw new Error(`Player Error: ${playRes.status}`);
            
            const playData = await playRes.json();
            // Fields like selectedRank and language are part of the Player schema
            document.getElementById('rank').innerText = playData.selectedRank || "None";
            document.getElementById('playtime').innerText = playData.totalPlaytime ? Math.round(playData.totalPlaytime / 3600) + "h" : "0h";
            document.getElementById('language').innerText = playData.language || "Unknown";
        }

    } catch (err) {
        console.error("Fetch Details:", err);
        document.getElementById('playerCount').innerText = "Error";
        alert("Fetch failed. This is usually caused by the API server blocking the connection or an invalid API Key.");
    }
}
