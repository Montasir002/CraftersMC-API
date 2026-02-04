const btn = document.getElementById("fetchBtn");
const output = document.getElementById("output");

btn.onclick = async () => {

    const apiKey = document.getElementById("apiKey").value.trim();
    const username = document.getElementById("username").value.trim();

    if(!apiKey || !username){
        alert("Enter API key and username");
        return;
    }

    output.textContent = "Loading...";

    try{

        // Step 1 — Get Player
        const playerRes = await fetch(
            `https://api.craftersmc.net/v1/player/${username}`,
            {
                headers:{
                    "X-API-Key": apiKey
                }
            }
        );

        const playerData = await playerRes.json();

        if(playerData.error){
            output.textContent = JSON.stringify(playerData,null,2);
            return;
        }

        const profileId = playerData.profiles?.[0]?.profileId;

        if(!profileId){
            output.textContent = "No Skyblock profile found.";
            return;
        }

        // Step 2 — Get Skyblock Profile
        const profileRes = await fetch(
            `https://api.craftersmc.net/v1/skyblock/profile/${profileId}`,
            {
                headers:{
                    "X-API-Key": apiKey
                }
            }
        );

        const profileData = await profileRes.json();

        // Show EVERYTHING for now
        output.textContent = JSON.stringify(profileData,null,2);

    }catch(err){

        output.textContent = err.message;

    }

};