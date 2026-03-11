/* ROSIE AI: COLORADO SPRINGS GEOLOGICAL SPECIALIST */

const JERRY_WISDOM = {
    "soil": "In the Springs, we deal with high-plasticity Bentonite. Without a 1994-standard granite lift, the 'heave' will destroy your asphalt in three winters.",
    "bentonite": "Bentonite is the enemy of Colorado infrastructure. We mitigate this with a specific over-excavation and a non-expansive granite sub-base.",
    "monument": "Up in Monument or Woodmoor, the drainage is as critical as the mix. We engineer for the heavier snow load and the rapid spring runoff.",
    "black forest": "Black Forest terrain requires careful root-zone management. We use a reinforced structural base to ensure your driveway doesn't buckle.",
    "price": "Geological integrity cannot be ballparked. Jerry only provides quotes after a technical review of the soil and slope profile.",
    "commercial": "Our commercial spec is built for 80,000-lb freight rotations. Most lots in the Springs fail because they use residential thickness.",
    "pothole": "Potholes are just the surface symptom. The real failure is usually a saturated subgrade. We fix the water, then we fix the road.",
    "drainage": "Water is the only thing that can kill a Dawley road. We use precision laser grading to ensure 100% moisture shedding."
};

function toggleRosie() {
    const win = document.getElementById('rosie-window');
    if (win) {
        win.style.display = (win.style.display === 'none' || win.style.display === '') ? 'flex' : 'none';
    }
}

function handleRosieChat(e) {
    if (e.key === 'Enter') {
        const input = document.getElementById('rosie-user-input');
        const history = document.getElementById('rosie-chat-history');
        const userMsg = input.value.toLowerCase();

        if (userMsg.trim() !== "") {
            history.innerHTML += `<p style="text-align:right; font-style:italic; color:#888; margin-top:10px;">${input.value}</p>`;
            
            let response = "I hear you. To provide a thoughtful answer regarding your specific property, Jerry requires a full technical brief. Would you like to start that via the button below?";
            
            for (let key in JERRY_WISDOM) {
                if (userMsg.includes(key)) {
                    response = JERRY_WISDOM[key] + " <br><br>Would you like to provide your property context so Jerry can review this further?";
                    break;
                }
            }

            setTimeout(() => {
                history.innerHTML += `<p style="margin-top:10px; border-left: 2px solid #1a1a1a; padding-left: 10px;">${response}</p>`;
                history.scrollTop = history.scrollHeight;
            }, 600);

            input.value = "";
            history.scrollTop = history.scrollHeight;
        }
    }
}