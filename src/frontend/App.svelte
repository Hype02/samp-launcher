<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Nord from "./components/Nord.svelte"

  import Header from "./components/Header.svelte";
  import ServerList from "./components/ServerList.svelte"
  import Options from "./components/Options.svelte"
  
  import SampTest from './components/SampTest.svelte'

  window.document.body.classList.toggle('dark-mode');

  window.document.body.classList.toggle('dark-mode');
  

</script>

<style>
  :global(body){
    margin:0px;
    padding:0px;
    overflow-y: hidden;
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
<SampTest/>
<Router url="">
  <Route path="/" component="{ServerList}" />
  <Route path="options" component="{Options}" />
</Router>