<script>
import RotatingTimer from '../components/RotatingTimer.vue';
import  SettingsParser  from '../widgets/SettingsParser.js';

export default{
    components: {RotatingTimer},

    data(){
        return {
            timers: []
        }
    },

    mounted(){
     
    },

    methods:{
        parseSettings(){
            const parser = new SettingsParser();
            const timerss = document.querySelectorAll('.make-timer');
            for(let i = 0; i < timerss.length; i++){
                this.timers.push(parser.parse(timerss[i].innerText, ["csv", "hyphencamel"]));
                timerss[i].list = Array.from(timerss[i].getElementsByTagName('li'), li => li.innerHTML);
                timerss[i].innerHTML = ""
            }
        },
    }
}
</script>

<template>
    <div>
        <div class="initial-data">
            <div class="make-timer extra-wide-timer">
                <span class="settings">type=rotate epoch=2016-01-25T00:00:00S change-at=00:00E label=Price</span>
                <ul>
                <li>Outside Tir Chonaill Inn</li>
                <li>Dugald Aisle Logging Camp Hut</li>
                <li>Dunbarton East Potato Field</li>
                <li>Dragon Ruins - House at 5 o'clock</li>
                <li>Bangor Bar</li>
                <li>Sen Mag 5th house from West</li>
                <li>Emain Macha - Alley Behind Weapon Shop</li>
                <li>Ceo Island</li>
                <li>Emain Macha - Island in South Pathway</li>
                <li>Sen Mag 5th house from West</li>
                <li>Dragon Ruins - House at 5 o'clock</li>
                <li>Outside Barri Dungeon</li>
                <li>Dunbarton School Stairway</li>
                <li>Dugald Aisle Logging Camp Hut</li>
                </ul>
            </div>
        </div>
        <div class="initial-data">
            <div class="make-timer extra-wide-timer">
                <span class="settings">type=rotate epoch=2016-01-25T00:00:00S change-at=00:00E label=Price</span>
                <ul>
                <li>Outside Tir Chonaill Inn</li>
                <li>Dugald Aisle Logging Camp Hut</li>
                <li>Dunbarton East Potato Field</li>
                <li>Dragon Ruins - House at 5 o'clock</li>
                <li>Bangor Bar</li>
                <li>Sen Mag 5th house from West</li>
                <li>Emain Macha - Alley Behind Weapon Shop</li>
                <li>Ceo Island</li>
                <li>Emain Macha - Island in South Pathway</li>
                <li>Sen Mag 5th house from West</li>
                <li>Dragon Ruins - House at 5 o'clock</li>
                <li>Outside Barri Dungeon</li>
                <li>Dunbarton School Stairway</li>
                <li>Dugald Aisle Logging Camp Hut</li>
                </ul>
            </div>
        </div>
        <div v-if="this.timers[1]">
            <div v-for="timer in timers">
                <h1>{{timer}}</h1>
                <RotatingTimer :args="timer.list"  />
            </div>
        </div>
       
    </div>

    <button @click="parseSettings"></button>
    
</template>

<style scoped>

</style>
