<script lang="ts">
  import { Router, Route } from "svelte-routing";

  import Nord from "./Nord.svelte"
  import ServerList from "./ServerList.svelte"
  import Options from "./Options.svelte"

  import Header from "./Header.svelte";
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

<Router url="">
  <Route path="options" component="{Options}" />
  <Route path="/"><ServerList /> </Route>
</Router>