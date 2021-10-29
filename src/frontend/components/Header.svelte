<script lang="ts">
    import { Router, link } from "svelte-routing";

    window.document.body.classList.toggle('dark-mode');

    function updateTab(){
        if(window.location.pathname == '/options')
        {
            document.getElementById("options")?.classList.add("active");
            document.getElementById("master")?.classList.remove("active");
        }
        if(window.location.pathname == '/')
        {
            document.getElementById("master")?.classList.add("active");
            document.getElementById("options")?.classList.remove("active");
        }
    };
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
        <div id="master" class="tab active"><a href="/" on:click={() => setTimeout(updateTab, 10)} use:link>Server list</a></div>
        <div id="options" class="tab"><a href="/options" on:click={() => setTimeout(updateTab, 10)} use:link>Options</a></div>
    </Router>
</div>