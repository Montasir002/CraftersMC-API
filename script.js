async function fetchData() {
    const key = document.getElementById('apiKey').value;
    const user = document.getElementById('username').value;
    const baseUrl = "https://api.craftersmc.net/v1";

    const headers = {
        "X-API-Key": key,
        "Content-Type": "application/json"
    };

    try {
        // 1. Fetch Network Status
        const netRes = await fetch(`${baseUrl}/network/status`, { headers });
        const netData = await netRes.json();
        document.getElementById('playerCount').innerText = netData.playerCount;
        document.getElementById('maxPlayers').innerText = netData.maxPlayerCount;
        document.getElementById('maintenance').innerText = netData.fullMaintenance ? "YES" : "NO";

        // 2. Fetch Player Info
        if (user) {
            const playRes = await fetch(`${baseUrl}/player/${user}`, { headers });
            if (playRes.ok) {
                const playData = await playRes.json();
                document.getElementById('rank').innerText = playData.selectedRank;
                document.getElementById('playtime').innerText = Math.round(playData.totalPlaytime / 3600) + " hrs";
                document.getElementById('language').innerText = playData.language;
            } else {
                alert("Player not found!");
            }
        }
    } catch (err) {
        console.error("Fetch error:", err);
        alert("Check your API key or connection.");
    }
}
