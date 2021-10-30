<script lang="ts">
    import type { ServerInfo } from "./api/SampApi";
    import { currentServer } from "./stores";

    export let data : ServerInfo;

    function selectServer(){
        currentServer.set(data);
    }
</script>

<style>
    .serverentry:hover{
        background-color: var(--nord6);
    }

    :global(body.dark-mode) .serverentry:hover{
        background-color: var(--nord2);
    }
</style>

<!--<div class="serverentry" on:click={selectServer}>{data.ip}</div>-->
<tr class="serverentry" on:click={selectServer}>
    <th>{data.title}</th>
    <th>{data.playerCount}/{data.playerMax}</th>
    <th>{data.ip}</th>
</tr>