<script lang="ts">
    import { link } from "svelte-routing";
    import { currentTab } from "./stores.js";

    export let name : string;
    export let id : string;
    export let ref : string;
    export let active : Boolean = false;

    currentTab.subscribe(value => {
        if(id == value) {
            document.getElementById(id)?.classList.add('active');
        }
        else {
            document.getElementById(id)?.classList.remove('active');
        }
    });

    function updateTabs(){
        currentTab.set(id); 
    }
</script>

<style>
    .tab{
        padding: 5px 10px 5px 10px;
    }

    .active{
        background-color: var(--nord5);
    }

    :global(body.dark-mode) .active {
        background-color: var(--nord1);
    }
</style>

{#if active}
<a href={ ref } use:link><div id={ id } class="tab active" on:click={updateTabs}>{ name }</div></a>
{:else}
<a href={ ref } use:link><div id={ id } class="tab" on:click={updateTabs}>{ name }</div></a>
{/if}