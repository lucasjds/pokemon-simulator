class Pokemon {
    constructor(id, name, image,imageBack, types, height, weight, stats, moves) {
        this._id = id;
        this._name = name;
        this._image = image;
        this._types = types; //array type class
        this._height = height;
        this._weight = weight;
        this._stats = stats; //stats class
        this._moves = moves; //array move class
		this._imageBack = imageBack;
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name
    }

    getImage() {
        return this._image;
    }
	
	getImageBack() {
        return this._imageBack;
    }

    getTypes() {
        return this._types;
    }

    getHeight() {
        return this._height;
    }

    getWeight() {
        return this._weight;
    }

    getStats() {
        return this._stats;
    }

    getMoves() {
        return this._moves;
    }


    toString() {
        return this._name + "! A pokemon of " + this._types.map(a => a.getName()) + " type!";
    }
}

class Type {
    constructor() {

    }

    setName(name) {
        this._name = name;
    }

    getName() {
        return this._name;
    }
}

class Stats {
    constructor(speed, specialDefense, specialAttack, defense, attack, hp, accuracy, evasion) {

        this._speed = speed;
        this._specialDefense = specialDefense;
        this._specialAttack = specialAttack;
        this._defense = defense;
        this._attack = attack;
        this._hp = hp;
        this._accuracy = accuracy;
        this._evasion = evasion;
    }

    getEvasion() {
        return this._evasion;
    }

    getAccuracy() {
        return this._accuracy;
    }

    getSpeed() {
        return this._speed;
    }

    getSpecialDefense() {
        return this._specialDefense;
    }

    getSpecialAttack() {
        return this._specialAttack;
    }

    getDefense() {
        return this._defense;
    }

    getAttack() {
        return this._attack;
    }

    getHP() {
        return this._hp;
    }

    setEvasion(evasion) {
        this._evasion = evasion;
    }

    setAccuracy(accuracy) {
        this._accuracy = accuracy;
    }
	
	setHP(hp) {
        this._hp = hp;
    }
}

class Move {
    constructor(id, name, accuracy, pp, priority, power, criticalHit, statChanges , category) {
		this._id = id;
        this._name = name;
        this._accuracy = accuracy;
        this._pp = pp;
        this._priority = priority;
        this._power = power;
        this._statChanges = statChanges; // array Stats Class
		this._criticalHit = criticalHit;
		this._category = category;
    }
	
	getId(){
		return this._id;
	}

    getName() {
        return this._name;
    }

    getAccuracy() {
        return this._accuracy;
    }

    getPP() {
        return this._pp;
    }

    getPriority() {
        return this._priority;
    }

    getPower() {
        return this._power;
    }
	
	getCriticalHit(){
		return this._criticalHit;
	}

    getStatChanges() {
        return this._statChanges;
    }
	
	getCategory(){
		return this._category;
	}
	
	setPP(pp){
		this._pp = pp;
	}

}

class Battle{
	constructor(){
		this._pokemons = [];
	}
	
	setPokemon(pokemon, player){
		this._pokemons[player] = pokemon;
	}
	
	getPokemons(){
		return this._pokemons;
	}
	
	
}

const CriticalHitEnum = {0:'4.167', 1:'12.5', 2:'50', 3:'100' , 4:'100'};

//const $pokemons = $("#pokemons");
const addPokemon = (pokemon,player) => {
    document.getElementById("idpokemon" + player).innerHTML = "#" + pokemon.getId();
    document.getElementById("pokename" + player).innerHTML = pokemon.getName();
    document.getElementById("pokeimage" + player).src = pokemon.getImage();
    document.getElementById("type" + player).innerHTML = pokemon.getTypes().map(a => a.getName());
    document.getElementById("height" + player).innerHTML = pokemon.getHeight();
    document.getElementById("weight" + player).innerHTML = pokemon.getWeight();
    document.getElementById("hp" + player).innerHTML = pokemon.getStats().getHP();
    document.getElementById("attack" + player).innerHTML = pokemon.getStats().getAttack();
    document.getElementById("defense" + player).innerHTML = pokemon.getStats().getDefense();
    document.getElementById("spattack" + player).innerHTML = pokemon.getStats().getSpecialAttack();
    document.getElementById("spdefense" + player).innerHTML = pokemon.getStats().getSpecialDefense();
    document.getElementById("speed" + player).innerHTML = pokemon.getStats().getSpeed();
	
	//battle
	document.getElementById("pokeimagebattle" + player).src = player == "2" ? pokemon.getImage() : pokemon.getImageBack();
	document.getElementById("playernamebattle" + player).innerHTML = pokemon.getName();
	document.getElementById("playerhpbattle" + player).innerHTML = pokemon.getStats().getHP() 
	document.getElementById("playerhporiginal" + player).innerHTML = pokemon.getStats().getHP();

    //responsiveVoice.speak(pokemon.toString());
};

const searchPokemon = (player) => {
	
    var param = document.getElementById("pokenumber" + player).value;
	if(localStorage.getItem("Pokemon" + player) != null && JSON.parse(localStorage.getItem("Pokemon" + player))._id == param)
		return retriveCache(JSON.parse(localStorage.getItem("Pokemon" +player)),  player);
	
	var pokeURL = "https://pokeapi.co/api/v2/pokemon/" + param;
    $.ajax({
        url: pokeURL,
        dataType: 'json',
        cache: true,
    }).then(data => {
        const types = createArrayType(data.types);
		const stats = createStats(data.stats);
        var moves= [];
		var move = null;
		var i = 0;
        while(i != 4) {
			move = searchMove(data.moves[Math.floor(0 + Math.random() * data.moves.length)].move.url);
			if(move != null){
				moves.push( move );
				i++;
			}
        }
		const pokemon = createPokemon(data, types, stats,moves); 
        addPokemonToBattle(pokemon,player);
		addPokemon(pokemon,player);
		localStorage.setItem("Pokemon" + player, JSON.stringify(pokemon));
    }).catch(e => console.log(e));
}

const searchMove = (url) => {
	var move = null;
	$.ajax({
        url: url,
        dataType: 'json',
		async: false,
		success: function (data) {
			//name,accuracy,pp,priority,power,statChanges
			var stat_changes = createStatChanges(data.stat_changes);
			if(data.meta.category.name == "damage" || data.meta.category.name == "net-good-stats")
				move = createMove(data, stat_changes);
			//console.log(move.getStatChanges());
		},
    }).catch(e => console.log(e));

	return move;
}

function retriveCache(data, player){
	const types = createArrayType(data._types);
	const stats = createStats(data._stats);
	var moves= [];
	var move = null;
	for (var i = 0; i < data._moves.length; i++) {
		var stat_changes = createStats(data._moves[i]._statChanges);
		move = createMove(data._moves[i], stat_changes);
		moves.push( move );
	}
	const pokemon = createPokemon(data, types, stats,moves); 
	addPokemonToBattle(pokemon, player);
	addPokemon(pokemon,player);
}

function createArrayType(data) {
    var types = [];
    var type = new Type();
    data.forEach(function(element) {
        type.setName( ((typeof element.type) == 'undefined') ? element._name : element.type.name);
        types.push(type);
        type = new Type();
    });
    return types;
}

function createStatChanges(data) {
    var stats = new Stats(0, 0, 0, 0, 0, 0, 0, 0);
    for (var i = 0; i < data.length; i++) {
        if (data[i].stat.name == "evasion") {
            stats.setEvasion(data[i].change);
        }
        if (data[i].stat.name == "accuracy") {
            stats.setAccuracy(data[i].change)
        }
    }
	return stats;
}

function createStats(data){
	const stats = new Stats(data._speed != null ? data._speed : data[0].base_stat,
							data._specialDefense != null ? data._specialDefense: data[1].base_stat ,
							data._specialAttack != null ? data._specialAttack : data[2].base_stat,
							data._defense != null ? data._defense : data[3].base_stat,
							data._attack != null ? data._attack : data[4].base_stat,
							data._hp != null ? data._hp : data[5].base_stat,
							data._accuracy != null ? data._accuracy : 0,
							data._evasion != null ? data._evasion : 0);
	return stats;
}

function createPokemon(data, types, stats,moves){
	const pokemon = new Pokemon(data._id  != null ? data._id : data.id,
								data._name != null ? data._name.toUpperCase() : data.name.toUpperCase(),
								data._image != null ? data._image : data.sprites.front_default,
								data._imageBack != null? data._imageBack : data.sprites.back_default,
								types,
								data._height != null ? data._height : data.height,
								data._weight != null ? data._weight : data.weight,
								stats,
								moves);
	return pokemon;
}

function createMove(data, stat_changes){
	const move = new Move(data._id != null ? data._id : data.id,
						data._name != null ? data._name : data.name,
						data._accuracy != null ? data._accuracy : data.accuracy,
						data._pp != null ? data._pp : data.pp,
						data._priority != null ? data._priority : data.priority,
						data._power != null ? data._power : data.power,
						data._criticalHit != null ? data._criticalHit : data.meta.crit_rate,
						stat_changes,
						data._category != null ? data._category : data.meta.category.name);
	return move;
}

function addPokemonToBattle(pokemon,player){
	if (player.length == 0){
		battle.setPokemon(pokemon,0);
	}else{
		battle.setPokemon(pokemon,1);
	}
	console.log(battle);
}

// START BATTLE FUNCTIONS

function chooseMove(player){
	var chosen = false;
	var posMove ;
	while(!chosen){
		var checkMoves = 0;
		for (var i in player.getMoves()){
			if(player.getMoves()[i].getPP() == 0){
				checkMoves++;
			}
		}
		if (checkMoves == 4)
			return [null,null];
		posMove = Math.floor(0 + Math.random() * 4);
		var move = null;
		if(player.getMoves()[posMove].getPP() > 0){
			move = player.getMoves()[posMove];
			chosen = true;
		}
	}
	return [move,posMove];
}

function decideWhoStarts( movePlayer,player){
	if( (movePlayer[0].getPriority() == movePlayer[1].getPriority() && player[0].getStats().getSpeed() > player[1].getStats().getSpeed())
		 || ( movePlayer[0].getPriority() > movePlayer[1].getPriority())){
		return [0,1];
	}
	if( ( movePlayer[0].getPriority() == movePlayer[1].getPriority() && player[0].getStats().getSpeed() < player[1].getStats().getSpeed())
		|| (movePlayer[0].getPriority() < movePlayer[1].getPriority()) ){
		return [1,0];
	}
	return [0,1];
}


function setInformationBox(id, message){
	document.getElementById(id).innerHTML = message;
}

function calculateAccuracy(movePlayer, playerTurn, playerNext){
	if( movePlayer.getAccuracy() != undefined){
		var adjusted_stages = playerTurn.getStats().getAccuracy() - ( playerNext.getStats().getEvasion());
		adjusted_stages = adjusted_stages > 0 ? ((3 + adjusted_stages)/ 3) : (adjusted_stages < 0 ? (3 / ( 3 - adjusted_stages)) : 1 );
		var accuracyMove = movePlayer.getAccuracy() * (  adjusted_stages  );
		resultAccuracyMove = Math.floor(0 + Math.random() * 101) <= accuracyMove ? true : false;
		console.log("resultAccuracyMove1 " + resultAccuracyMove);
		return resultAccuracyMove;
	}
	return true;
}

function calculateCriticalHit(movePlayer){
	var criticalHit = CriticalHitEnum[movePlayer.getCriticalHit()];
	var criticalMove =  Math.floor(0 + Math.random() * 101) <= criticalHit ? 1.5 : 1;
	return criticalMove;
}

function calculateModifier(criticalMove){
	return criticalMove * ( Math.floor(85 + Math.random() * 16)/100);
}

function calculateDamage(movePlayer, playerTurn, playerNext, modifierAttack){
	if(movePlayer.getPower() != undefined){
		var damageAttack = (( ( ((2/5) + 2) * movePlayer.getPower() * ( playerTurn.getStats().getAttack()/playerNext.getStats().getDefense() ))/50) + 2 ) * modifierAttack;
		damageAttack = Math.round(damageAttack * 100) / 100; //decimal point
		return damageAttack;
	}
	return 0;
}

function applyDamage(playerNext,damageAttack){
	var currentHP = playerNext.getStats().getHP();
	var newHP = (Math.round((currentHP - damageAttack) * 100) / 100);
	return (newHP < 0) ? 0 : newHP;
}

function updateHPAndProgressBar(playerNext,player){
	var result = player.getStats().getHP() * 100 ;
	var progress;
	if (playerNext == 0){
		progress = result / $("#playerhporiginal").html();
		document.getElementById("playerhpbattle").innerHTML = player.getStats().getHP();
	}else{
		progress = result / $("#playerhporiginal2").html();
		document.getElementById("playerhpbattle2").innerHTML = player.getStats().getHP();
	}
	$("#progress-bar-porcentage"+playerNext).attr("style", "width:" + progress + "%;");
}

function calculateNetGoodStats(playerAccuracy,playerEvasion,movePlayerTurn){
	var accuracy = movePlayerTurn.getStatChanges().getAccuracy();
	var evasion = movePlayerTurn.getStatChanges().getEvasion();

	var currentAccuracy = playerAccuracy.getStats().getAccuracy();
	var currentEvasion =  playerEvasion.getStats().getEvasion();
	var resultAccuracy = currentAccuracy + accuracy;
	var resultEvasion = currentEvasion + evasion;
	return [resultAccuracy,resultEvasion];
}

function whomNetGoodWillApplyFor(movePlayerTurn,playerTurn,playerNext){
	var accuracy = movePlayerTurn.getStatChanges().getAccuracy();
	var evasion = movePlayerTurn.getStatChanges().getEvasion();
	var userAppliedAccuracy = accuracy > 0 ? playerTurn : playerNext; 
	var userAppliedEvasion = evasion > 0 ? playerTurn : playerNext; 
	return [userAppliedAccuracy,userAppliedEvasion];
}

function messageAccuracy(accuracy , player, movePlayerTurn){
	if(movePlayerTurn.getStatChanges().getAccuracy() == 0)
		return;
	if(accuracy <0)
		setInformationBox("informationboard", player.getName() + " had its accuracy decreased ");
	if(accuracy >0)
		setInformationBox("informationboard", player.getName() + " had its accuracy increased ");
}

function messageEvasion(evasion , player, movePlayerTurn){
	if(movePlayerTurn.getStatChanges().getEvasion() == 0)
		return;
	if(evasion <0)
		setInformationBox("informationboard", player.getName() + " had its evasion decreased ");
	if(evasion >0)
		setInformationBox("informationboard", player.getName() + " had its evasion increased ");
}

async function winner(player){
	var winner = player[1].getName();
	if (  player[0].getStats().getHP() > 0 )
		winner = player[0].getName();
	
	setInformationBox("informationboard",  winner + " WINS!!");
	await sleep(5000);
	stop();
}

const startBattle = async (battle) => {
	if (battle.getPokemons().length < 2)
		return alert("Choose 2 pokemons to start a battle");
	$("#battle").show();
	play();
	
	//type pokemon class 
	var player = [];
	player[0] = battle.getPokemons()[0];
	player[1] = battle.getPokemons()[1];
	var playerTurn = 0,playerNext = 1;
	while(player[0].getStats().getHP() > 0 && player[1].getStats().getHP() > 0 ){
		//controlling variables - choosing the move
		var positionMove = [];
		var movePlayer = [];
		var decidingMove;
		for(var i = 0 ; i < 2; i++){
			decidingMove = chooseMove(player[i]);
			if ( decidingMove[0] == null){
				player[i].getStats().setHP( 0 );
				return winner(player);
			}
			movePlayer[i] = decidingMove[0];
			positionMove[i] = decidingMove[1];
		}
		for(var i = 0 ; i < 2; i++){
			//defining who starts first
			if (i == 0){
				playerTurn = decideWhoStarts( movePlayer,player)[0];
				playerNext = decideWhoStarts( movePlayer,player)[1];
			}
			setInformationBox("informationboard", player[playerTurn].getName() + "'s turn");
			await sleep(2000);
			
			//decreasing pp
			player[playerTurn].getMoves()[positionMove[playerTurn]].setPP(movePlayer[playerTurn].getPP()-1);
			
			//calculating accuracy - formula total = accuracy * ( accuracy_stat - ( evasion_stat))
			var resultAccuracyMove = calculateAccuracy(movePlayer[playerTurn], player[playerTurn] ,player[playerNext]);
			//validation ACCURACY
			if(resultAccuracyMove){
				setInformationBox("informationboard", player[playerTurn].getName() + " used " + movePlayer[playerTurn].getName().toUpperCase());
				await sleep(2000);
				if (movePlayer[playerTurn].getCategory() == "damage"){
					//calculating critical hit
					var criticalMove = calculateCriticalHit(movePlayer[playerTurn]);
					
					//calculating modifier
					var modifierAttack = calculateModifier(criticalMove);
					console.log("modifierAttack1 " + modifierAttack);
					
					//calculating damage
					var damageAttack = calculateDamage(movePlayer[playerTurn], player[playerTurn], player[playerNext], modifierAttack);
					
					setInformationBox("informationboard", "The damage was " + damageAttack);
					await sleep(2000);
					
					//apply damage
					var newHP = applyDamage(player[playerNext],damageAttack);
					player[playerNext].getStats().setHP( newHP );

					//progress bar //update HP on the screen
					updateHPAndProgressBar(playerNext,player[playerNext]);
					setInformationBox("informationboard", player[0].getName() + " : " + player[0].getStats().getHP() + " VS " + player[1].getName() + " : " + player[1].getStats().getHP());
					await sleep(3000);
				}
				if(movePlayer[playerTurn].getCategory() == "net-good-stats"){
					var resultPokemonAffectedByNet = whomNetGoodWillApplyFor(movePlayer[playerTurn],playerTurn,playerNext);					
					var resultNetEffect = calculateNetGoodStats(player[resultPokemonAffectedByNet[0]],player[resultPokemonAffectedByNet[1]], movePlayer[playerTurn]);
					player[resultPokemonAffectedByNet[0]].getStats().setAccuracy(resultNetEffect[0] );
					player[resultPokemonAffectedByNet[1]].getStats().setEvasion( resultNetEffect[1]);
					messageAccuracy(resultNetEffect[0], player[resultPokemonAffectedByNet[0]] , movePlayer[playerTurn]);
					messageEvasion(resultNetEffect[1] , player[resultPokemonAffectedByNet[1]] , movePlayer[playerTurn]);
					
					await sleep(2000);
				}
				//check whether or not the target is dead
				if( player[playerNext].getStats().getHP() <= 0)
					i = 2;
				
				var aux = playerTurn;
				playerTurn = playerNext;
				playerNext = aux;
			}else{
				setInformationBox("informationboard",  player[playerTurn].getName() + " missed");
				await sleep(2000);
			}
		}
	}
	winner(player);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function play(){
	var audio = document.getElementById("audio");
	audio.play();
}

function stop(){
	var audio = document.getElementById("audio");
	audio.pause();
}

var battle = new Battle();

window.onload = function() {
	
	$("#battle").hide();
	document.getElementById("pokeform").addEventListener('submit', function(event){
															event.preventDefault();
															searchPokemon("");
														});
	document.getElementById("pokeform2").addEventListener('submit', function(event){
															event.preventDefault();
															searchPokemon("2");
														});
														
	document.getElementById("startbattle").addEventListener('click', function(event){
															event.preventDefault();
															startBattle(battle);
														});
}