
class ServerInfo {
  ip: string;
  title: string;
  playerMax: number;
  playerCount: number;
  gameMode: string;
  language: string;
  lagcomp: boolean;
  version: string;
  webUrl: string
  logoUrl: string

  constructor(
    ip: string,
    title: string,
    worldTime: number,
    ping: number,
    gameMode: string,
    language: string,
    version: string,
    lagComp: boolean,
    webUrl: string
  ) {
    this.ip = ip;
    this.title = title;
    this.playerMax = worldTime;
    this.gameMode = gameMode;
    this.playerCount = ping;
    this.version = version;
    this.language = language;
    this.lagcomp = lagComp;
    this.webUrl = webUrl
    this.logoUrl = `https://s2.googleusercontent.com/s2/favicons?domain_url=${this.webUrl}`
    console.log(this.logoUrl)
    
  }
}



class SampApi {

  static AllServersList: ServerInfo[]

  constructor() {

  }

  static async FetchAllServersList<ServerInfo>() {
    let fetchedServersResponse = await fetch("https://api.open.mp/servers", {
      mode: "cors",
    });

    let fetchedServersArray: [] = []

    try {
      // security check - let's ensure data from website is not malicious
      fetchedServersArray = await fetchedServersResponse.json();
    }
    catch (err) {
      console.log("SECURITY ALERT: Code couldn't be fetch from database, because it contained malicious response:\n" + err)
    }



    if (fetchedServersArray == undefined)
      return


    let serversTypedArray: ServerInfo[] = [];
    // for (let i = 0; i < fetchedServersArray.length; i++) {

    //   const { ip, hn, pc, pm, gm, la, vn, pa } = fetchedServersArray[i] as any;


    //   let result = await fetch(`https://api.open.mp/server/${ip}`, {mode: 'cors'})
    //   let resultInJson = await result.json()
    

    //   let fetchedWebUrl: string = resultInJson.ru?.weburl
     
    
    //   let webUrl = (fetchedWebUrl as string)
    //   if(webUrl){
    //     webUrl = "http://" + webUrl
    //   }



    //   let serverToPush = new ServerInfo(ip, hn, pm, pc, gm, la, vn, pa, webUrl);


    //   if(fetchedWebUrl == ''){
    //     serverToPush.logoUrl = "https://s2.googleusercontent.com/s2/favicons?domain_url=http://sa-mp.com"
    //   }
  

    //   serversTypedArray.push(serverToPush as any);
    // }

    SampApi.AllServersList = serversTypedArray as any

    return serversTypedArray;
  }

  static GetAllServerList(): ServerInfo[] {
    return SampApi.AllServersList
  }

  // GetPublicServers
  // GetHostedServers
}

export { SampApi, ServerInfo };


