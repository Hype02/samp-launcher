<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import path from 'path'
  import url from 'url'
  import Nord from "./components/Nord.svelte"
  import ServerList from "./components/ServerList.svelte"
  import Options from "./components/Options.svelte"

  import Header from "./components/Header.svelte";

  import {SampApi, ServerInfo}  from './components/api/SampApi'
//import ConnectServer from "./components/ConnectServer.svelte";

  let servers: ServerInfo[] = []

  let func: any = async function (){
    servers = await SampApi.GetAllServersList()
    
  }

  func()

  const { BrowserWindow } = require('electron');


  let mainWindow;
  // @ts-ignore
  function createWindow() {
  mainWindow = new BrowserWindow({
    width: 340,
    height: 380,
    resizable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createWindow()
}


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