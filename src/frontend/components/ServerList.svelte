<script lang="ts">
    import {SampApi, ServerInfo}  from './api/SampApi'

    let servers: ServerInfo[] = []

    let func: any = async function (){
        servers = await SampApi.GetAllServersList()
    }

    func()
</script>

<h1> Server list </h1>

{#each servers as server}
    <div>{server.ip}</div>
{/each}