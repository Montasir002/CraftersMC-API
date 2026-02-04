async function fetchData() {
    const key = document.getElementById('apiKey').value;
    const user = document.getElementById('username').value;
    
    // We use a CORS proxy to prevent the "Check your api key" error
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const targetUrl = "https://api.craftersmc.net/v1";
    const baseUrl = proxyUrl + targetUrl;

    if (!key) {
        alert("Please enter your API Key!");
        return;
    }

    const headers = {
        "X-API-Key": key,
        "Content-Type": "application/json"
    };

    try {
        // 1. Fetch Network Status
        const netRes = await fetch(`${baseUrl}/network/status`, { headers });
        const netData = await netRes.json();
        
        // Update UI
        document.getElementById('playerCount').innerText = netData.playerCount || 0;
        document.getElementById('maxPlayers').innerText = netData.maxPlayerCount || 0;
        document.getElementById('maintenance').innerText = netData.fullMaintenance ? "YES" : "NO";

        // 2. Fetch Player Info
        if (user) {
            const playRes = await fetch(`${baseUrl}/player/${user}`, { headers });
            const playData = await playRes.json();
            
            if (playRes.ok) {
                document.getElementById('rank').innerText = playData.selectedRank;
                // Convert seconds to hours
                document.getElementById('playtime').innerText = Math.round(playData.totalPlaytime / 3600) + " hrs";
                document.getElementById('language').innerText = playData.language;
            } else {
                alert("Player Error: " + (playData.message || "Not found"));
            }
        }
    } catch (err) {
        console.error("Fetch error:", err);
        alert("Connection blocked. If using the proxy, you may need to visit https://cors-anywhere.herokuapp.com/corsdemo to 'request temporary access'.");
    }
}
