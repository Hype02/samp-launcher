<script lang="ts">
    import { Router } from "svelte-routing";
    
    import Tab from "./Tab.svelte";
</script>

<style>
    .header{
        background-color: var(--nord4);
        color: var(--nord0);

        padding:0px;
        display:flex;
    }

    :global(body.dark-mode) .header {
        background-color: var(--nord0);
        color: var(--nord4);
    }
</style>

<div class="header">
    <Router url="">
        <Tab id="master" name="Server list" ref="/" active={ true }/>
        <Tab id="fav" name="Favourites" ref="/favourites"/>
        <Tab id="local" name="Localhost" ref="#"/>
        <Tab id="options" name="Options" ref="/options"/>
    </Router>
</div>