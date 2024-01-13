<script>
import { useToast } from "vue-toastification";

export default {
    methods: {
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
    <div class="is-flex is-flex-direction-row gap-15">
      <input
        type="text"
        placeholder="Add financialmodelingprep.com API key"
        class="input width-400"
        v-model="apiKey"
      >
      <button class="button is-primary is-success" @click="setKey">Set</button>
    </div>
</template>