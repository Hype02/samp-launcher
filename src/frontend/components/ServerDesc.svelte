<script lang="ts">
    import { currentServer } from "./stores";
    import type { ServerInfo } from "./api/SampApi";

    let server : ServerInfo;

    currentServer.subscribe(value => {
        window.dispatchEvent(new Event('resize'));
        server = value;
    });

</script>

<style>
    .servertitle{
        margin-top:10px;
        margin: 0px 25px 0px 25px;
        text-align:center;
        font-size:x-large;
        overflow-x:hidden;
    }

    .serverstats{
        padding:15px 25px 15px 25px;

        display:flex;
        flex-direction: row;
        flex-wrap:wrap;

        overflow-x:hidden !important;
    }

    .button{
        background-color: var(--nord5);
        box-shadow: 0px 1px 1px 1px rgba(0,0,0,0.15);

        margin: 0px 25px 0px 25px;

        margin-top:10px;
        padding:15px;
        text-align:center;
        font-size:large;

        overflow-x:hidden;
    }

    .button:hover{
        cursor:pointer;
    }

    :global(body.dark-mode) .button{
        background-color: var(--nord1);
    }

    .desc{
        overflow-x:auto;
    }

    .desc:hover{
        position:relative;
        overflow-x:visible;
    }

    .desc::-webkit-scrollbar {
        display:none;
    }

    .servertitleparent{
        overflow-x: hidden;
    }
</style>


<div class="servertitleparent">
    <div class="servertitle">
        {server.title}
    </div>
</div>

<div class="serverstats">
    <div class="desc" style="width:40%; ">Players</div>
    <div class="desc" style="width:60%; text-align:right;">{server.playerCount}/{server.playerMax}</div>
    <div class="desc" style="width:40%; ">IP</div>
    <div class="desc" style="width:60%; text-align:right;">{server.ip}</div>
    <div class="desc" style="width:40%; ">Version</div>
    <div class="desc" style="width:60%; text-align:right;">{server.version}</div>
    <div class="desc" style="width:40%; ">GameMode</div>
    <div class="desc" style="width:60%; text-align:right;">{server.gameMode}</div>
    <div class="desc" style="width:40%; ">Language</div>
    <div class="desc" style="width:60%; text-align:right;">{server.language}</div>
</div>

<div class="button">
    Connect
</div>

