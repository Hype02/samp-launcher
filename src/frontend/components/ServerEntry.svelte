<script lang="ts">
    import type { ServerInfo } from "./api/SampApi";

    export let data : ServerInfo;

    function selectServer(){
        alert(data.title);
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
    <th>{data.worldTime}/{data.ping}</th>
    <th>{data.ip}</th>
</tr>