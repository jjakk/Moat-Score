<script>
import { useToast } from "vue-toastification";

export default {
    data(){
        return {
            show: false,
            apiKey: null
        };
    },
    methods: {
        toggleShow() { this.show = !this.show },
        setKey() {
            const toast = useToast();

            localStorage.setItem("apiKey", this.apiKey);
            this.apiKey = null;
            toast.success("API key set successfully!", { timeout: 2000 });
        }
    }
};
</script>

<template>
    <main>
        <a @click="toggleShow">{{ show ? "Hide" : "Show" }} Settings</a>
        <ul
            v-if="show"
            class="box has-background-light is-shadowless mt-2 p-3"
        >
            <li class="is-flex is-flex-direction-row is-align-items-center gap-15">
                <label>API Key</label>
                <input
                  type="text"
                  placeholder="Add financialmodelingprep.com API key"
                  class="input width-400"
                  v-model="apiKey"
                >
                <button class="button is-primary is-success" @click="setKey">Set</button>
            </li>
        </ul>
    </main>
</template>