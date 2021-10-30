<script lang="ts">
    import { Router } from "svelte-routing";
    
    import Tab from "./Tab.svelte";

    window.document.body.classList.toggle('dark-mode');

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
        <Tab id="options" name="Options" ref="/options"/>
    </Router>
</div>