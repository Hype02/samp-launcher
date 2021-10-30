<script lang="ts">
    import {SampApi, ServerInfo}  from './api/SampApi'
    import ServerEntry from "./ServerEntry.svelte"
    import ServerDesc from "./ServerDesc.svelte"

    let servers: ServerInfo[]  =  []
    SampApi.FetchAllServersList().then((res)=>{
        servers = res as ServerInfo[]
    })  

  
</script>

<style>
    .master{
        height:100%;
        width:75%;
        overflow-y: scroll;
        float:left;
    }
    .serverlist{
        background-color: var(--nord5);
        color: var(--nord0);

        padding:5px;
        overflow-y:auto;

        font-weight: normal;
    }

    .serverdesc{
        background-color: var(--nord4);
        color: var(--nord0);

        height:100%;
        width:25%;

        float:left;
    }

    :global(body.dark-mode) .serverdesc{
        background-color: var(--nord0);
        color: var(--nord4);
    }

    :global(th){
        font-weight:normal;
    }

    :global(body.dark-mode) .serverlist{
        background-color: var(--nord1);
        color: var(--nord4);
    }

    table{
        text-align:left;
    }
</style>

<div class="master">
    <div class="serverlist">
        <table>
            <tr>
                <th>Server Name</th>
                <th>Players</th>
                <th>Server IP</th>
            </tr>
            <br />
            {#each servers as server}
                <ServerEntry data={server} />
            {/each}
        </table>
    </div>
</div>
<div class="serverdesc">
    <ServerDesc />
</div>