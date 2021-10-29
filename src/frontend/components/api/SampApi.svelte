<script lang="ts">
  class ServerInfo {
    ip: string;
    title: string;
    worldTime: number;
    ping: number;
    gameMode: string;
    language: string;
    lagcomp: boolean;
    version: string;

    constructor(
      ip: string,
      title: string,
      worldTime: number,
      ping: number,
      gameMode: string,
      language: string,
      version: string,
      lagComp: boolean
    ) {
      this.ip = ip;
      this.title = title;
      this.worldTime = worldTime;
      this.gameMode = gameMode;
      this.ping = ping;
      this.version = version;
      this.language = language;
      this.lagcomp = lagComp;
    }
  }

  class SampApi {
    constructor() {}

    async GetAllServersList<ServerInfo>() {
      let fetchedServersResponse = await fetch("https://api.open.mp/servers", {
        mode: "cors",
      });
      let fetchedServersArray: [] = await fetchedServersResponse.json();

      let serversTypedArray: ServerInfo[] = [];

      for (let server in fetchedServersArray) {
        const { ip, hn, pc, pm, gm, la, vn, pa } = server as any;

        let serverToPush = new ServerInfo(ip, hn, pc, pm, gm, la, vn, pa);

        serversTypedArray.push(serverToPush as any);

        console.log("DEBUG: " + JSON.stringify(serverToPush));
      }

      return serversTypedArray;
    }

    // GetPublicServers
    // GetHostedServers
  }

  export { SampApi };
</script>

<div />

<style>
</style>
