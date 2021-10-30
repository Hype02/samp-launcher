
  class ServerInfo {
    ip: string;
    title: string;
    playerMax: number;
    playerCount: number;
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
      this.playerMax = worldTime;
      this.gameMode = gameMode;
      this.playerCount = ping;
      this.version = version;
      this.language = language;
      this.lagcomp = lagComp;
    }
  }

  class SampApi {
    constructor() {}

    static async GetAllServersList<ServerInfo>() {
      let fetchedServersResponse = await fetch("https://api.open.mp/servers", {
        mode: "cors",
      });

      let fetchedServersArray: [] = []

      try{
         // security check - let's ensure data from website is not malicious
         fetchedServersArray  = await fetchedServersResponse.json();
      }
      catch(err){
        console.log("SECURITY ALERT: Code couldn't be fetch from database, because it contained malicious response:\n"+err)
      }
        

       
      if(fetchedServersArray == undefined)
      return
   

      let serversTypedArray: ServerInfo[] = [];
      for(let i=0; i<fetchedServersArray.length; i++){
        
        const { ip, hn, pc, pm, gm, la, vn, pa } = fetchedServersArray[i] as any;
        
        let serverToPush = new ServerInfo(ip, hn, pm, pc, gm, la, vn, pa);

       
        

        serversTypedArray.push(serverToPush as any);
      }
    
      return serversTypedArray;
    }

    // GetPublicServers
    // GetHostedServers
  }

  export { SampApi, ServerInfo };


