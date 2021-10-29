<script lang="ts">
    import { Router, Link } from "svelte-routing";

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

    .tab{
        padding:5px;
    }

    .active{
        background-color: var(--nord5);
    }

    :global(body.dark-mode) .active {
        background-color: var(--nord1);
    }
</style>

<div class="header">
    <Router url="">
        <div class="tab active"><Link to="/">Server list</Link></div>
        <div class="tab"><Link to="options">Options</Link></div>
    </Router>
</div>