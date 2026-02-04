// ⚡ CHANGE THIS
const BASE_URL = "https://api.craftersmc.net";

// ============================
// PROFILE
// ============================

async function loadProfile(){

    const id = document.getElementById("profileId").value;
    const output = document.getElementById("profileOutput");

    if(!id){
        alert("Enter profile ID");
        return;
    }

    output.textContent = "Loading...";

    try{

        const res = await fetch(`${BASE_URL}/v1/skyblock/profile/${id}`);

        if(!res.ok)
            throw new Error("API Error");

        const data = await res.json();

        // Pretty print JSON
        output.textContent = JSON.stringify(data, null, 2);

    }catch(err){

        output.textContent = "Failed to load profile.\n" + err;
    }
}



// ============================
// BAZAAR
// ============================

async function loadBazaar(){

    const container = document.getElementById("bazaarOutput");
    container.innerHTML = "Loading...";

    try{

        const res = await fetch(`${BASE_URL}/v1/skyblock/bazaar`);

        const data = await res.json();

        container.innerHTML = "";

        // Adjust depending on API structure
        const items = data.products || data;

        Object.keys(items).slice(0,20).forEach(item=>{

            const price =
                items[item]?.sellPrice ??
                items[item]?.quick_status?.sellPrice ??
                "N/A";

            const div = document.createElement("div");
            div.className="item";

            div.innerHTML=`
                <span>${item}</span>
                <strong>${price}</strong>
            `;

            container.appendChild(div);
        });

    }catch(err){

        container.innerHTML="Failed to load bazaar.";
    }
}



// ============================
// FAKE LEADERBOARD
// (Later replace with real stats)
// ============================

function generateLeaderboard(){

    const board = document.getElementById("leaderboard");
    board.innerHTML="";

    const fakePlayers=[
        "Technoblade",
        "Dream",
        "Notch",
        "BuilderBoy",
        "BazaarKing"
    ];

    fakePlayers
        .sort(()=>Math.random()-0.5)
        .forEach((p,i)=>{

            const li=document.createElement("li");
            li.textContent=`#${i+1} ${p}`;
            board.appendChild(li);
        });
}