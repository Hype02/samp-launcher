<script lang="ts">
  export let name: string;
  name = "123";

 

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

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
