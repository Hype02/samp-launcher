<script lang="ts">
    import { currentServer } from "./stores";
    import type { ServerInfo } from "./api/SampApi";

    let server : ServerInfo;

    currentServer.subscribe(value => {
        window.dispatchEvent(new Event('resize'));
        server = value;
    });

    /*window.addEventListener('resize', function(_event) {
        document.querySelectorAll(".desc").forEach(function(item) {
            if(isOverflown(item))
            {
                item.innerHTML = "...";
            }
        });
    });

    function isOverflown(element : any) {
        return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    }*/

</script>

<style>
    .servertitle{
        margin-top:10px;
        padding:0px 35px 0px 35px;
        text-align:center;
        font-size:x-large;
    }

    .serverstats{
        padding:15px 25px 15px 25px;

        display:flex;
        flex-direction: row;
        flex-wrap:wrap;
    }

    .button{
        background-color: var(--nord5);
        box-shadow: 0px 1px 1px 1px rgba(0,0,0,0.15);

        margin: 0px 25px 0px 25px;

        margin-top:15px;
        padding:15px;
        text-align:center;
        font-size:large;
    }

    :global(body.dark-mode) .button{
        background-color: var(--nord1);
    }

    .desc{
        overflow-x:auto;
    }

    .desc::-webkit-scrollbar {
        display:none;
    }
</style>


<div class="servertitle">
    {server.title}
</div>
<div class="serverstats">
    <div class="desc" style="width:50%; ">Players</div>
    <div class="desc" style="width:50%; text-align:right;">{server.playerCount}/{server.playerMax}</div>
    <div class="desc" style="width:50%; ">IP</div>
    <div class="desc" style="width:50%; text-align:right;">{server.ip}</div>
    <div class="desc" style="width:50%; ">Version</div>
    <div class="desc" style="width:50%; text-align:right;">{server.version}</div>
    <div class="desc" style="width:50%; ">GameMode</div>
    <div class="desc" style="width:50%; text-align:right;">{server.gameMode}</div>
    <div class="desc" style="width:50%; ">Language</div>
    <div class="desc" style="width:50%; text-align:right;">{server.language}</div>
</div>
<a href="#"><div class="button">
    Connect
</div></a>