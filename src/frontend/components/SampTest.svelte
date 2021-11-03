<style>

</style>

<script lang="ts">
    let {exec} = require('child_process')

  

   exec('wine "/home/hjp/.local/share/Steam/steamapps/common/Grand Theft Auto San Andreas/gta-sa.exe" 127.0.0.1 HYPE', (err: any, data: any)=>{
    if(err){
        console.log(err)
        // game is already running
    }
    console.log(data.toString())
   })


</script>

<div>

</div>