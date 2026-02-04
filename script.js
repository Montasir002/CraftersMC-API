async function fetchData() {
    const key = document.getElementById('apiKey').value.trim();
    const user = document.getElementById('username').value.trim();
    const statusText = document.getElementById('playerCount');

    if (!key) {
        alert("Please enter your API Key first!");
        return;
    }

    statusText.innerText = "Loading...";

    // We use a different public proxy that is often more reliable
    const proxy = "https://corsproxy.io/?";
    const apiBase = "https://api.craftersmc.net/v1";
    
    // The full URL through the proxy
    const networkUrl = proxy + encodeURIComponent(`${apiBase}/network/status`);
    const playerUrl = proxy + encodeURIComponent(`${apiBase}/player/${user}`);

    const requestOptions = {
        method: 'GET',
        headers: {
            'X-API-Key': key,
            'Accept': 'application/json'
        }
    };

    try {
        // 1. Get Network Stats
        const netRes = await fetch(networkUrl, requestOptions);
        
        if (netRes.status === 401 || netRes.status === 403) {
            throw new Error("Invalid API Key");
        }

        const netData = await netRes.json();
        document.getElementById('playerCount').innerText = netData.playerCount;
        document.getElementById('maxPlayers').innerText = netData.maxPlayerCount;
        document.getElementById('maintenance').innerText = netData.fullMaintenance ? "YES" : "NO";

        // 2. Get Player Stats (if username is provided)
        if (user) {
            const playRes = await fetch(playerUrl, requestOptions);
            const playData = await playRes.json();

            if (playRes.ok) {
                document.getElementById('rank').innerText = playData.selectedRank;
                document.getElementById('playtime').innerText = Math.round(playData.totalPlaytime / 3600) + "h";
                document.getElementById('language').innerText = playData.language;
            } else {
                alert("Player not found or API error");
            }
        }

    } catch (err) {
        console.error("Full Error Details:", err);
        statusText.innerText = "Error";
        alert("Error: " + err.message + "\n\nTry visiting https://cors-anywhere.herokuapp.com/corsdemo if the screen is still blank.");
    }
}
