<script lang="ts">
<<<<<<< HEAD
  export let name: string;
  name = "1234";
=======
  import { Router, Route } from "svelte-routing";
>>>>>>> 56f0328cad021068a8b07316909d08d28b44cf1d

  import Nord from "./Nord.svelte"
  import ServerList from "./ServerList.svelte"
  import Options from "./Options.svelte"

<<<<<<< HEAD
  let changeTest = () => {
    name="tekstsktd"
  }

  let fetchServerList = async () => {

    let serverList: any = await (await fetch("https://api.open.mp/servers", {"mode": 'cors'})).json()
    
   

  
  

    console.log("the list" + serverList[0].ip);
  };

  fetchServerList();
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
    how to build Svelte apps.
  </p>

    {#if name == "123"}
    <div>test</div>
    {/if}
    {#if name == "1234"}
    <div>1234</div>
    {/if}

  <button on:click={changeTest}>kliknij</button>



</main>

=======
  import Header from "./Header.svelte";
</script>

>>>>>>> 56f0328cad021068a8b07316909d08d28b44cf1d
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