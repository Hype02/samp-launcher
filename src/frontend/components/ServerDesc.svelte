<script lang="ts">
    import { currentServer } from "./stores";
    import type { ServerInfo } from "./api/SampApi";

    let server : ServerInfo;

    currentServer.subscribe(value => {
        server = value;
    });
</script>

<style>
    .servertitle{
        margin-top:10px;
        padding:0px 35px 0px 35px;
        text-align:center;
        font-size:x-large;
    }

    .serverstats{
        padding:15px 35px 15px 35px;
    }

    .statstable{
        width:100%;
        text-align:left;
        overflow-x: wrap;
    }

    .button{
        background-color: var(--nord5);
        box-shadow: 0px 1px 1px 1px rgba(0,0,0,0.15);

        margin-top:15px;
        padding:15px;
        text-align:center;
        font-size:large;
    }

    :global(body.dark-mode) .button{
        background-color: var(--nord1);
    }
</style>


<div class="servertitle">
    {server.title}
</div>
<div class="serverstats">
    <table class="statstable">
        <tr>
            <th>Players</th>
            <th style="float:right">{server.playerCount}/{server.playerMax}</th>
        </tr>
        <tr>
            <th>IP</th>
            <th style="float:right">{server.ip}</th>
        </tr>
        <tr>
            <th>Version</th>
            <th style="float:right">{server.version}</th>
        </tr>
        <tr>
            <th>GameMode</th>
            <th style="float:right">{server.gameMode}</th>
        </tr>
        <tr>
            <th>Language</th>
            <th style="float:right">{server.language}</th>
        </tr>
    </table>
    <a href="#"><div class="button">
        Connect
    </div></a>
</div>
