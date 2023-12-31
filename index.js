const { getLeague } = require('./src/get-league');
const { getTeams } = require('./src/get-teams');
const { getMarket } = require('./src/get-market');
const { showInfoTeam } = require('./src/show-info-team');
const { getPlayersInfo } = require('./src/get-player-info');
const { getMarketPlayerInfo } = require('./src/get-market-player-info');
const { showInfoMarket } = require('./src/show-info-market');
let league = {};
let teams, market = [];

async function fetchData(){
    try{
        league = await getLeague();
        teams = await getTeams(league.id)
        switch (process.argv[2]){
            case 'team':{
                let teamIndex = teams.findIndex(t => t.id === league.team.id.toString());
                if (process.argv[3]) {
                    teams[teamIndex] = await getPlayersInfo(teams[teamIndex]);
                    showInfoTeam(teams[teamIndex], process.argv[3]);
                }
                else {
                    teams[teamIndex] = await getPlayersInfo(teams[teamIndex]);
                    showInfoTeam(teams[teamIndex]);
                }
            break;
            }
            case 'others':{
                if (process.argv[3]){
                    if (process.argv[3] === 'all'){
                        for (t of teams) {
                            if (process.argv[4]) {
                                t = await getPlayersInfo(t);
                                await showInfoTeam(t, process.argv[4]);
                            }
                            else {
                                t = await getPlayersInfo(t);
                                await showInfoTeam(t);
                            }
                        }
                        return;
                    }
                    let teamIndex = teams.findIndex(t => t.manager.managerName === process.argv[3]);
                    if (process.argv[4]){
                        t = await getPlayersInfo(teams[teamIndex]);
                        await showInfoTeam(teams[teamIndex], process.argv[4]);
                    } 
                    else {
                        t = await getPlayersInfo(teams[teamIndex]);
                        await showInfoTeam(teams[teamIndex]);
                    }
                }
                else{
                    console.log('Es necesario que como tercer parámetro se pase el nombre del jugador que quieres analizar o bien usa "all".\nUSERS:');
                    teams.forEach(t => console.log(t.manager.managerName));
                }
            break;
            }
            case 'market':{
                market = await getMarket(league.id)
                market = await getMarketPlayerInfo(market);
                if (process.argv[3]){
                    await showInfoMarket(market, process.argv[3]);
                } 
                else {
                    await showInfoMarket(market);
                }
            break;
            }
            default:{
                console.log('El argumento no existe');
                process.exit(1)
            }
        }
    }
    catch (err){
        console.log(err);
    }
}

fetchData();
