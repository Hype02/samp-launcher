<script lang="ts">
  import { Router, Route } from "svelte-routing";

  import Nord from "./components/Nord.svelte"
  import ServerList from "./components/ServerList.svelte"
  import Options from "./components/Options.svelte"

  import Header from "./components/Header.svelte";

  import {SampApi, ServerInfo}  from './components/api/SampApi'

  let servers: ServerInfo[] = []

  let func: any = async function (){
    servers = await SampApi.GetAllServersList()
    
  }

  func()



</script>

<style>
  :global(body){
    margin:0px;
    padding:0px;
  }

  :global(a){
    color:inherit;
  }

  :global(a:hover){
    text-decoration: none;
  }
</style>

<Nord />
<Header />
<!-- test -->
{#each servers as server}
<div>{server.ip}</div>

{/each}

<Router url="">
  <Route path="options" component="{Options}" />
  <Route path="/"><ServerList /> </Route>
</Router>