<template>
    <div v-if="visible" class="popup">
        <div class="popup-content">
            <div class="container">
                <h2 class="header">Neue Runde erstellen</h2>

                <input v-model="pointsstart"  placeholder="Startpunkte eingeben"
                class="input startpoints" />
                <input v-model="legs"  placeholder="Legs eingeben"
                class="input startpoints" />

                <button @click="toggle_doppelout" v-if="doppelout == true"class="doppelout-round-button">
                    Doppel-Out
                </button>

                <button @click="toggle_doppelout" v-if="doppelout == false"class="doppelout-round-button nicht-aktiv">
                    Kein Doppel-Out
                </button>

                <div class="input-container">
                    <input v-model="newPlayer" @keyup.enter="addPlayer" placeholder="Spielername eingeben"
                        class="input" />
                    <button @click="addPlayer" class="add-button">+</button>
                </div>

                <ul class="player-list">
                    <li v-for="(player, index) in players" :key="index" draggable="true" @dragstart="dragStart(index)"
                        @dragover.prevent @drop="drop(index)" class="player-item">
                        <span class="player-name">{{ player }}</span>
                        <button @click="removePlayer(index)" class="remove-button">&times;</button>
                    </li>
                </ul>

                <button @click="createRound" :disabled="players.length < 2" class="create-round-button">
                    Runde erstellen 
                </button>
                <button @click="cancel"  class="create-round-button">
                    Zurück
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const newPlayer = ref("");
const players = ref([]);
const visible = ref(true)
const draggedIndex = ref(null);
const pointsstart = ref()
const doppelout = ref(false)
const legs = ref()

const emit = defineEmits(["roundCreated", "cancle-create"]);
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()


function open(){
    visible.value = true
}
function close(){
    visible.value = false
}

const addPlayer = () => {
    if (newPlayer.value.trim() !== "" && !players.value.includes(newPlayer.value.trim())) {
        players.value.push(newPlayer.value.trim());
        newPlayer.value = "";
    }
};

const removePlayer = (index) => {
    players.value.splice(index, 1);
};

function toggle_doppelout(){
    doppelout.value = !doppelout.value
}

async function createRound() {
    emit("roundCreated", players.value, pointsstart.value);
    const neuesSpiel = {
    spieler: [players.value[0], players.value[1]],
    punkte: [pointsstart.value, pointsstart.value],
    am_zug: 1,
    bereits_geworfen: 0,
    start: pointsstart.value,
    legs: legs.value,
    plegs1: 0,
    plegs2: 0,
    doppelout: doppelout.value


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
  router.push(`/duell/${hinzugefuegt.id}`);
   
};

const cancel = () => {
    router.push('/')
    console.log("123")
}

const dragStart = (index) => {
    draggedIndex.value = index;
};

const drop = (index) => {
    if (draggedIndex.value !== null) {
        const movedPlayer = players.value.splice(draggedIndex.value, 1)[0];
        players.value.splice(index, 0, movedPlayer);
        draggedIndex.value = null;
    }
};
</script>

<style scoped>

.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  .popup-content {
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
  
  padding: 40px;
  background-color: #333;
  border-radius: 5px;
  align-items: center;
  color: white;
  
}
.container {
    padding: 1.5rem;
    background-color: #333;
    
    max-width: 28rem;
    margin: auto;
    
}

.header {
    font-size: 1.5rem;
    font-weight: 800;
    text-align: center;
    color: #FFD700;
    margin-bottom: 1.5rem;
}

.input-container {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}


.input {
    border-style: none;
    background-color: #FFD700;
    padding: 0.75rem;
    border-radius: 0.75rem;
    flex-grow: 1;
    outline: none;
    transition: border-color 0.3s ease;
}

.startpoints{
    margin-bottom: 10px;
    width: 100%;
}

.input:focus {
    border-color: #3182ce;
}

.add-button {
    background-color: #FFD700;
    border-style: none;
    color: black;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    transition: background-color 0.3s ease;
}

.add-button:hover {
    background-color: #38a169;
}

.player-list {
    margin-top: 1rem;
    padding: 0;
    list-style: none;
}

.player-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #FFD700;
    padding: 0.75rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    cursor: move;
    transition: background-color 0.3s ease;
    margin-top: 5px;
}

.player-item:hover {
    background-color: #d6b600;
}

.player-name {
    font-weight: 600;
    color: #333;
}

.remove-button {
    font-size: 1.25rem;
    color: #f56565;
    transition: color 0.3s ease;
    border-style: none;
    background-color: #FFD700;
}

.remove-button:hover {
    background-color: #d6b600;
}

.create-round-button {
    margin-top: 1.5rem;
    background-color: #FFD700;
    color: #333;
    padding: 0.75rem 1.25rem;
    border-radius: 0.75rem;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.doppelout-round-button {
    margin-bottom: 10px;
    background-color: #FFD700;
    color: #333;
    padding: 0.75rem 1.25rem;
    border-radius: 0.75rem;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.nicht-aktiv{
    background-color: #e2e8f07a;
}
.create-round-button:disabled {
    background-color: #e2e8f07a;
    cursor: not-allowed;
    color: #333;
}

.create-round-button:hover:enabled {
    background-color: #d6b600;
}
</style>