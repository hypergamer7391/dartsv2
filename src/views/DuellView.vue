<template>
    <div id="app">
        <div class="right">
            <div class="legs-anzeigen">
                <div class="player_legs">{{ players[0]?.legs }}</div>
                <div class="first_to">First to {{ legs }} Legs</div>
                <div class="player_legs">{{ players[1]?.legs }}</div>

            </div>
            <div class="player-anzeigen">

                <div class="player-anzeige akt_player">
                    <div class="top-section">
                        <div class="player-name">{{ players[0]?.name }}</div>
                        <div class="score">{{ get_score_for_player(players[0]?.name) }}</div>
                    </div>
                    <div class="throws">
                        <div class="throw-box" :class="{ active: am_zug == 1 && bereits_geworfen == 0 }">

                            <div class="geworfen-score">{{ players[0]?.wurf1 }}</div>
                            <div class="needed-score">{{ players[0]?.wurf1_feld }}</div>
                        </div>
                        <div class="throw-box" :class="{ active: am_zug == 1 && bereits_geworfen == 1 }">
                            <div class="needed-score">{{ players[0]?.wurf2_feld }}</div>
                            <div class="geworfen-score">{{ players[0]?.wurf2 }}</div>
                        </div>
                        <div class="throw-box" :class="{ active: am_zug == 1 && bereits_geworfen == 2 }">
                            <div class="needed-score">{{ players[0]?.wurf3_feld }}</div>
                            <div class="geworfen-score">{{ players[0]?.wurf3 }}</div>
                        </div>
                    </div>
                    <div class="average">Average: {{ players[0]?.average }}</div>
                    <div class="average" v-if="am_zug == 1">Am Zug</div>


                </div>


                <div class="player-anzeige akt_player">
                    <div class="top-section">
                        <div class="player-name">{{ players[1]?.name }}</div>
                        <div class="score">{{ get_score_for_player(players[1]?.name) }}</div>
                    </div>
                    <div class="throws">
                        <div class="throw-box" :class="{ active: am_zug == 2 && bereits_geworfen == 0 }">

                            <div class="geworfen-score">{{ players[1]?.wurf1 }}</div>
                            <div class="needed-score">{{ players[1]?.wurf1_feld }}</div>
                        </div>
                        <div class="throw-box" :class="{ active: am_zug == 2 && bereits_geworfen == 1 }">
                            <div class="needed-score">{{ players[1]?.wurf2_feld }}</div>
                            <div class="geworfen-score">{{ players[1]?.wurf2 }}</div>
                        </div>
                        <div class="throw-box" :class="{ active: am_zug == 2 && bereits_geworfen == 2 }">
                            <div class="needed-score">{{ players[1]?.wurf3_feld }}</div>
                            <div class="geworfen-score">{{ players[1]?.wurf3 }}</div>
                        </div>
                    </div>
                    <div class="average">Average: {{ players[1]?.average }}</div>
                    <div class="average" v-if="am_zug == 2">Am Zug</div>

                </div>
            </div>





            <div class="input">
                <div class="numbers">
                    <button @click="button_click(number)" class="number" v-for="number in inputs" :key="number"
                        :class="{ orange: isHighlighted(number) }">
                        {{ number }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <Popup ref="WinScreen">
        <h1>Spiel beendet!</h1>
        <p>Der Spieler {{ rangliste[0].name }} hat gewonnen</p>
        <li v-for="player in rangliste" :key="player.name" class="player-item">
            <span class="name">{{ player.name }}</span>
            <span class="average">&#8709; {{ player.average }}</span>
            <span class="score">{{ player.score }}</span>
        </li>
        <button class="newgame" @click="newgame">Neues Spiel</button>
        <button class="newgame" @click="handleRematch">Spiel wiederholen</button>

    </Popup>

</template>



<script setup>
import { ref, onMounted } from 'vue'
import Popup from '../components/PopUp.vue'

import { useRoute, useRouter } from 'vue-router'

const fullscreenElement = ref(null)

function toggleFullscreen() {
    const el = fullscreenElement.value

    if (!document.fullscreenElement) {
        el?.requestFullscreen().catch(err => {
            console.error(`Fehler beim Aktivieren von Fullscreen: ${err.message}`)
        })
    } else {
        document.exitFullscreen()
    }
}

const router = useRouter()
const route = useRoute()

const url = window.location.href;
const id = ref(url.split("/").slice(-1)[0])
console.log(id);


const start_score = ref(0)


/* Component deklarierungen */
const WinScreen = ref(false)
const NewGamePopupopen = ref(false)
const rangliste = ref([])



const game = ref(null)


const players = ref([])
const inputs = ref([1, 2, 3, 4, 5, "2x", 6, 7, 8, 9, 10, "3x", 11, 12, 13, 14, 15, "Bull", 16, 17, 18, 19, 20, "0"])
const am_zug = ref(1)
const bereits_geworfen = ref(0)
const multiplikator = ref(1)
const roundData = ref()
const menu_auf = ref(false)
const start = ref(501)
const legs = ref(0)

const emit = defineEmits(["roundCreated", "cancle-create"]);

onMounted(() => {

    load_all_players()

    toggleFullscreen()

});




function startseite() {
    router.push(`/`);
}


async function handleRematch() {
    start.value = players.value[1].start
    console.log(start.value)

    let playernames = [players.value[0].name, players.value[1].name]
    emit("roundCreated", playernames.value, start.value);
    const neuesSpiel = {
        spieler: [playernames[0], playernames[1]],
        punkte: [start.value, start.value],
        am_zug: 1,
        bereits_geworfen: 0,
        start: start.value,
        legs: legs.value,
        plegs1: 0,
        plegs2: 0,


    }

    const res = await fetch('https://dartsv2backend.onrender.com/api/games', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(neuesSpiel)
    })

    const hinzugefuegt = await res.json()
    console.log(hinzugefuegt)

    router.push(`/duell/${hinzugefuegt.id}`).then(() => {
        window.location.reload();
    });

}




async function load_all_players() {
    const res = await fetch(`https://dartsv2backend.onrender.com/api/games/${id.value}`)
    game.value = await res.json()
    console.log(game.value)
    players.value = game.value.players
    players.value.forEach(element => {
        console.log(element.score)
        if (element.score === 0) {
            erstelleRangliste()

            return
        }
    });
    am_zug.value = game.value.am_zug
    bereits_geworfen.value = game.value.bereits_geworfen
    legs.value = game.value.max_legs
    console.log(game)
}

async function save_changes(players, am_zug, bereits_geworfen) {
    console.log("save")
    console.trace()
    localStorage.setItem('player', JSON.stringify(players));
    localStorage.setItem('am_zug', JSON.stringify(am_zug));
    localStorage.setItem('bereits_geworfen', JSON.stringify(bereits_geworfen));
    let data = Number(id.value)
    const res = await fetch('https://dartsv2backend.onrender.com/api/game/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: data, players: players, am_zug: am_zug, bereits_geworfen: bereits_geworfen, max_legs: legs.value })
    })


}

const isHighlighted = (value) => {
    if (typeof value === "string" && value.includes("x")) {
        const num = parseInt(value); // Extrahiert die Zahl vor 'x'
        return num === multiplikator.value;
    }
    return false;
};

function erstelleRangliste() {
    console.log("test")
    WinScreen.value.open()
    rangliste.value = [...players.value]
        .sort((a, b) => a.score - b.score)
        .map((player, index) => ({ ...player, rank: index + 1 }))

}

async function wurf(value, faktor, orginal_value) {

    save_changes(players.value, am_zug.value, bereits_geworfen.value)
    console.log(bereits_geworfen.value)
    let punkte_voher = players.value[am_zug.value - 1].score
    let condition1 = punkte_voher < value
    let condition2_1 = punkte_voher === value && faktor !== 2
    let condition2_2 = punkte_voher === value && orginal_value == "Bull" && faktor === 2
    let condition2 = condition2_1 && condition2_2
    let condition3 = punkte_voher - value == 1 && bereits_geworfen.value == 2
    console.log(condition1, condition2_1, condition2_2, condition3)
    if (condition1 || condition2 || condition3) {
        players.value[am_zug.value - 1].score
        bereits_geworfen.value = 3
        players.value[am_zug.value - 1].score = players.value[am_zug.value - 1].score_voher
    }
    else {

        bereits_geworfen.value++

        players.value[am_zug.value - 1].score = punkte_voher - value
        let wurf = `wurf${bereits_geworfen.value}`;
        players.value[am_zug.value - 1][wurf] = value
        let new_value = 0
        if (faktor !== 1) {
            if (faktor === 2) {
                let wurf = `wurf${bereits_geworfen.value}_feld`;
                new_value = `D${orginal_value}`
                players.value[am_zug.value - 1][wurf] = new_value
            }
            else {
                let wurf = `wurf${bereits_geworfen.value}_feld`;
                new_value = `T${orginal_value}`
                players.value[am_zug.value - 1][wurf] = new_value
            }
        }
        else {
            let wurf = `wurf${bereits_geworfen.value}_feld`;
            new_value = `${orginal_value}`
            players.value[am_zug.value - 1][wurf] = new_value
        }
        players.value[am_zug.value - 1].alle_wurfe.push(value)
        let gesamt = 0
        players.value[am_zug.value - 1].alle_wurfe.forEach(element => {
            gesamt = gesamt + parseInt(element)
            console.log(gesamt)
        });
        console.log(players.value[am_zug.value - 1].alle_wurfe.length)
        let average = Math.round((gesamt / players.value[am_zug.value - 1].alle_wurfe.length) * 100) / 100;
        players.value[am_zug.value - 1].average = average

        save_changes(players.value, am_zug.value, bereits_geworfen.value)
    }
   

    if (players.value[am_zug.value - 1].score === 0) {
        players.value[am_zug.value - 1].legs++
        if (players.value[am_zug.value - 1].legs < legs.value) {
            start.value = players.value[1].start
            console.log(start.value)

            let playernames = [players.value[0].name, players.value[1].name]
            emit("roundCreated", playernames.value, start.value);
            const neuesSpiel = {
                spieler: [playernames[0], playernames[1]],
                punkte: [start.value, start.value],
                am_zug: 1,
                bereits_geworfen: 0,
                start: start.value,
                legs: legs.value,
                plegs1: players.value[0].legs,
                plegs2: players.value[1].legs,
                


            }

            const res = await fetch('https://dartsv2backend.onrender.com/api/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(neuesSpiel)
            })

            const hinzugefuegt = await res.json()
            console.log(hinzugefuegt)

            router.push(`/duell/${hinzugefuegt.id}`).then(() => {
                window.location.reload();})
            }
        
        else{
            WinScreen.value.open()
            erstelleRangliste()
        }
    }

        
    


        if (bereits_geworfen.value === 3) {


            bereits_geworfen.value = 0
            console.log(players.value.length)
            console.log(am_zug.value)
            if (am_zug.value == players.value.length) {
                console.log("test")


                am_zug.value = 1
                var i = 0
                players.value.forEach(element => {

                    players.value[i].wurf1 = 0
                    players.value[i].wurf2 = 0
                    players.value[i].wurf3 = 0
                    players.value[i].wurf1_feld = 0
                    players.value[i].wurf2_feld = 0
                    players.value[i].wurf3_feld = 0
                    i++
                });
                save_changes(players.value, am_zug.value, bereits_geworfen.value)
            }
            else {
                am_zug.value++

            }
            players.value[am_zug.value - 1].score_voher = players.value[am_zug.value - 1].score
            save_changes(players.value, am_zug.value, bereits_geworfen.value)



        }
        save_changes(players.value, am_zug.value, bereits_geworfen.value)


    }

    function button_click(value) {
        if (!isNaN(value)) {
            wurf(value * multiplikator.value, multiplikator.value, value)
            multiplikator.value = 1
        }
        else if (value == "2x") {
            if (multiplikator.value !== 2) {
                multiplikator.value = 2
            }
            else {
                multiplikator.value = 1
            }
        }
        else if (value == "3x") {
            if (multiplikator.value !== 3) {
                multiplikator.value = 3
            }
            else {
                multiplikator.value = 1
            }
        }
        else if (value == "Bull" && multiplikator.value === 1) {
            wurf(25, 1, "Bull")
            multiplikator.value = 1
        }
        else if (value == "Bull" && multiplikator.value === 2) {
            wurf(50, 1, "Bulls-Eye")
            multiplikator.value = 1
        }
    }

    function next_player() {
        let nextplayer = undefined
        if (am_zug.value == players.value.length) {
            nextplayer = 0
        }
        else {
            nextplayer = am_zug.value
        }



        return nextplayer
    }

    function get_score_for_player(player) {


        let score = 0
        players.value.forEach((element => {
            if (element.name === player) {
                score = element.score
            }
        }))

        return score
    }

    function newgame() {
        WinScreen.value.close()
        router.push(`/fast-duell/create`);
    }

</script>


<style>
body,
html {
    margin: 0;
    padding: 0;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    display: flex;
    align-items: center;
    color: white;
    max-height: 100vh;
    width: 100vw;
    font-family: Arial, sans-serif;
}
</style>
<style scoped>
.newgame {
    width: 100%;
    padding: 15px;
    font-size: 14px;
    background-color: #FF9D00;
    color: black;
    border: 2px solid black;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    /* Übergang für die Hintergrundfarbe */
    margin-top: 20px;
}

.newgame:hover {
    background-color: #F39C12;
    /* Ändert die Hintergrundfarbe beim Hover */
}



#app {
    display: flex;
    max-height: 100vh;
    box-sizing: border-box;

}

.sidebar {
    background-color: aqua;
    width: 100%;
    height: 100%;
    background: #333;
    display: flex;
    flex-direction: column;
    align-content: space-between;
    justify-content: space-between;

}

.spieler-liste {
    margin: 10%;
}



.player-item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    transition: transform 0.3s ease;
    /* Übergang für Transformation */
}

.player-item:hover {
    transform: scale(1.05);
    /* Vergrößert das Element */
    background-color: #191919;
    /* Ändert die Hintergrundfarbe beim Hover */
}

.menu {
    margin-left: 5%;
    margin-bottom: 5%;
    width: 90%;
    height: 20%;
    display: flex;
    flex-direction: column;
    justify-content: end;
    color: black;

}

.menubutton {
    width: 100%;
    height: 25%;
    background: #FFD700;
    transition: transform 0.3s ease;
    /* Übergang für Transformation */
    color: black;
}

.menubutton:hover {
    transform: scale(1.05);
    /* Vergrößert das Element */
    background-color: #F39C12;
    /* Ändert die Hintergrundfarbe beim Hover */
}

.name {
    font-weight: bold;
}


.player-anzeige {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #333;
    padding: 20px;

    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    gap: 10px;
    height: 100%;
    width: 50vw;

}

.player-anzeigen {
    display: flex;
    flex-direction: row;
    height: 30vh;
}

.legs-anzeigen {
    display: flex;
    flex-direction: row;
    height: 10vh;
    width: 100%;
    background: #333;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
}

.player_legs {
    font-size: 2em;
    font-weight: bold;
    color: #FFD700;
    margin: 0%;
}

.akt_player {
    border-bottom: 1px solid #ccc;

}

.top-section {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.player-name {
    font-size: 1.5em;
    font-weight: bold;
}

.score {
    font-size: 2em;
    font-weight: bold;
    color: #FFD700;
}

.throws {
    display: flex;
    gap: 10px;
}

.throw-box {
    width: 100px;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #444;
    border-radius: 5px;
    font-size: 1.2em;
    font-weight: bold;
    color: white;
    position: relative;
    transition: transform 0.3s ease-in-out;
    /* Übergang für Transformation */
}

.throw-box:hover {
    transform: scale(1.05);
    /* Vergrößert die Box beim Hover */
    background-color: #191919;
    /* Ändert die Hintergrundfarbe */
}

.needed-score {
    font-size: 0.8em;
    color: #FFD700;
    position: absolute;
    bottom: 5px;
}

.average {
    font-size: 1.2em;
    color: #AAA;
}


.left {
    flex: 1;
    display: flex;
    align-items: center;
    /* Optional */
    width: 30%;
    height: 100%;
}

.right {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100vw;

}

.numbers {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    /* 5 Spalten */
    grid-template-rows: repeat(4, 1fr);
    /* 4 Reihen */


    /* Breite anpassen */
    height: 60vh;
    /* Höhe anpassen */

    background: #333;
    /* Hintergrund für bessere Sichtbarkeit */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}



.number {
    background-color: #FFD700;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    border-radius: 5px;
    transition: all 0.3s ease;
    /* Übergang für alle Eigenschaften */
}

/*.number:hover {
    background-color: #FF9D00;
    
} */

.orange {
    background-color: #ff9d00;
}

.active {
    background-color: #af700b;
}

/* Animation für das Einblenden */
@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(20px);
        /* Startet leicht unterhalb */
    }

    100% {
        opacity: 1;
        transform: translateY(0);
        /* Normaler Zustand */
    }
}
</style>
