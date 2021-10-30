<script lang="ts">
    import {SampApi, ServerInfo}  from './api/SampApi'
    import ServerEntry from "./ServerEntry.svelte"

    let servers: ServerInfo[] = []

    let func: any = async function (){
        servers = await SampApi.GetAllServersList()
    }

    func()
</script>

<style>
    .master{
        height:95%;
        overflow-y: scroll;
    }
    .serverlist{
        background-color: var(--nord5);
        color: var(--nord0);

        padding:5px;
        overflow-y:auto;
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