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
        cursor:pointer;
    }

    :global(body.dark-mode) .serverentry:hover{
        background-color: var(--nord2);
    }
</style>

<!--<div class="serverentry" on:click={selectServer}>{data.ip}</div>-->
<tr class="serverentry" on:click={selectServer}>
    <th> <img src={data.logoUrl} height=".1rem" width=".1rem" alt={data.title} /> </th>
    <th>{data.title}</th>
    <th>{data.playerCount}/{data.playerMax}</th>
    <th>{data.ip}</th>
</tr>