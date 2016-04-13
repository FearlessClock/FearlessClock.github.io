//"use strict";
// Modèle de données : chaque cellule est entourée de 0, 1, 2, 3 ou 4 murs.
// On code la présence de chaque mur par un chiffre binaire distinct :
// 1 pour le mur N, 10 (2) pour le mur E, 100 (4) pour le mur S, 1000 (8) pour le mur W.
// La valeur de chaque cellule est codée par simple somme de ces valeurs selon les murs présents ou pas.



// retourne un tableau de n lignes par m colonnes
function new_2d_array(n, m) {
	if (n === 0 || m === 0) return;
	var a = new Array(n);
	for (var i = 0; i < a.length; i++) a[i] = new Array(m);
	return a;
}

// initialise le tableau a en affectant à toutes ses cellules la valeur v
function init_2d_array(a, v) {
    var i, j;
	for (i = 0; i < a.length; i++)
		for (j = 0; j < a[i].length; j++)
			a[i][j] = v;
}

// initialise le tableau a en affectant à toutes ses cellules la valeur v
function random_init_maze(a) {
    var i, j;
	for (i = 0; i < a.length; i++)
		for (j = 0; j < a[i].length; j++)
			a[i][j] = Math.floor(Math.random() * 16);
}


// affiche un tableau 2D
function print_2d_array(a) {
	for (var i = 0; i < a.length; i++) {
		for (var j = 0; j < a[i].length; j++) {
			document.write(a[i][j] + " ");
		}
		document.write("<br/>");
	}
}


// fournir un corrigé de ce qui était demandé au TP 1
function has_N_wall(v) { return (v & 1) == 1; } // retourne vrai ssi le mur N existe
function has_E_wall(v) { return (v & 2) == 2; }
function has_S_wall(v) { return (v & 4) == 4; }
function has_W_wall(v) { return (v & 8) == 8; }

function css_cell_code(v) {
	return (has_N_wall(v) ? "N " : "")
	     + (has_E_wall(v) ? "E " : "")
	     + (has_S_wall(v) ? "S " : "")
	     + (has_W_wall(v) ? "W " : "");
}


function print_maze(a, fruits) {
	console.log("csz : " + csz + ", wsz : " + wsz);
    var i, j;

	document.write("<div id='maze'");
	//document.write(" style='width:" + (wsz + (csz + wsz) * a[0].length) + ";height:" + (wsz + (csz + wsz) * a.length) + ";'");
	document.write(" style='width:" + (csz * a[0].length) + ";height:" + (csz * a.length) + ";'");
	document.write(" class='maze'>");
	for (i = 0; i < a.length; i++) {
		for (j = 0; j < a[i].length; j++) {
			document.write("<div id='" + i + "_" + j + "'");
			document.write(" class='cell " + css_cell_code(a[i][j]) + "'");
			document.write(" style='top:" + (csz * i) + "; left:" + (csz * j) + ";");
			document.write(" width:" + csz + "px; height:" + csz + "px;' ");
			document.write("></div>");
		}
	}
	for (i = 1; i < a.length; i++) {
		for (j = 1; j < a[i].length; j++) {
			document.write("<div id='_" + i + "_" + j + "'");
			document.write(" class='cell_intersect'");
			document.write(" style='top:" + (csz * i - wsz) + "; left:" + (csz * j - wsz) + ";'");
			document.write("></div>");
		}
	}
	document.write("<div id='user' style='top:" + (csz * user_pos[0]) + "; left:" + (csz * user_pos[1]) + ";");
	document.write(" width:" + widthOfPlayer + "px; height:" + heightOfPlayer + "px;'></div>");
	
	//Draw the fruits
	for(var i = 0; i < fruits.length; i++)
	{
		document.write("<div id='fruit" + i + "'class='fruits' style='top:" + (csz * fruits[i][0]+5) + "; left:" + (csz * fruits[i][1]+5) + ";");
		document.write(" width:" + 32 + "px; height:" + 32 + "px;'></div>");
	}
	//Draw the ghosts
	for(var i = 0; i < ghosts.length; i++)
	{
		document.write("<div id='ghost_" + i + "'class='ghost' style='top:" + (csz * ghosts[i][0]+5) + "; left:" + (csz * ghosts[i][1]+5) + ";");
		document.write(" width:" + 32 + "px; height:" + 32 + "px;'></div>");
	}
	document.write("</div>");
	// premier pas en DOM : marquage de l'entrée et de la sortie :
	/*for (i = 0; i < a.length; i++)
		for (j = 0; j < a[i].length; j++)
			document.getElementById(i + "_" + j).style.backgroundColor =
                "rgb(" + 16 * a[i][j] + ", " + 16 * a[i][j] + ", " + 16 * a[i][j] + ")";*/
	for (i = 0; i < a.length && has_W_wall(a[i][0]); i++);
	document.getElementById(i + "_0").style.backgroundColor = "#99ff33";
	for (i = 0; i < a.length && has_E_wall(a[i][a[0].length - 1]); i++);
	document.getElementById(i + "_" + (a[0].length - 1)).style.backgroundColor = "#ff6666";

}

// creusement de galeries
// toutes les cellules sont fermées (4 murs => valeur 15)
// on démarre par exemple par la cellule NW et on tire alétoirement l'une des 4 directions possibles
// en prenant soin d'éliminer celles qui mènes soit en dehors du tableau, soit vers une position déjà visitée
// on marque la position de départ comme visitée.
// on se déplace alors vers la position suivante, en faisant sauter une 'cloison'
// on recommence : tirage d'une direction parmi celles qui n'ont pas été déjà visitées.
// etc.. déjà fait - retrouver.
// si toutes les possibilités sont fermées, on revient en arrière (backtracking) jusqu'à la dernière position
// d'où pertaient plusieurs choix
// => A concevoir sur papier + réaliser et teste
// finalement : on se donne un point d'entrée et un point de sortie en désignant deux côtés
//


// une cellule a été explorée ssi elle n'a plus ses 4 murs (i.e. son code diffère de 15)
// donne la liste des cellules adjacentes à la cellule i, j qui n'ont pas encore été visitées
function explorable(laby, i, j) {
	var a = []; // création d'un tableau vide
	var k = 0;
	if (i > 0)                  if (laby[i - 1][j] == 15) a[k++] = 1;
	if (j < laby[0].length - 1) if (laby[i][j + 1] == 15) a[k++] = 2;
	if (i < laby.length - 1)    if (laby[i + 1][j] == 15) a[k++] = 4;
	if (j > 0)                  if (laby[i][j - 1] == 15) a[k++] = 8;
	return a;
}

// la seule raison de rendre cet algorithme récursif itératif (utiliser une pile) est d'échapper à la taille maximale de la pile d'appels (call stack)
// mais cette raison est motivée par la version mutijoueurs avec labyrinthe immense avec vues subjectives (1ère personne) pour les différents utilisateurs
// tirage aléatoire d'une direction parmi les 1, 2, 3 ou 4 fournies
function dig(laby, i, j) {
	//console.log("dig(" + i + ", " + j + ")");
	var a = explorable(laby, i, j); // on récupère celles des 4 cellules adjacentes qui n'ont pas encore été explorées
	// s'il n'en existe aucune, on ne poursuit pas et on retourne 0 (aucun mur na été creusé)
	if (a.length == 0) return 0;
	// s'il en existe au moins une, on effectue un tirage aléatoire pour choisir l'une d'entre elles
	var dir = Math.floor(Math.random() * a.length);
	// on fait tomber la cloison qui sépare la cellule courante de la cellule adjacente choisie
	laby[i][j] -= a[dir];
	// et on relance récursivement l'algorithme sur la cellule adjacente sélectionnée
	switch (a[dir]) {
		case 1 : laby[i - 1][j] -= 4; dig(laby, i - 1, j); break;
		case 2 : laby[i][j + 1] -= 8; dig(laby, i, j + 1); break;
		case 4 : laby[i + 1][j] -= 1; dig(laby, i + 1, j); break;
		case 8 : laby[i][j - 1] -= 2; dig(laby, i, j - 1); break;
	}
	// l'algorithme se relance sur la cellule courante (backtracking) au cas où il lui resterait des voisines à explorer
	dig(laby, i, j);
}

// creuse une entrée et une sortie
function dig_ES(laby) {
	entry_pos[0] = Math.floor(Math.random() * laby.length);
	entry_pos[1] = 0;
	//laby[entry_pos[0]][entry_pos[1]] -= 8; // réactiver ouvrirait l'entrée et permettrait à l'utilisateur de naviguer en dehors de l'enceinte du labyrinthe

	exit_pos[0] = Math.floor(Math.random() * laby.length);
	exit_pos[1] = laby[0].length - 1;
	laby[exit_pos[0]][exit_pos[1]] -= 2;

	user_pos[0] = entry_pos[0];
	user_pos[1] = entry_pos[1];
}

var laby;
var csz = 50;		// côté d'une cellule
var heightOfPlayer = 57;
var widthOfPlayer = 41;
var wsz = 4;		// épaisseur d'un mur
var psz = 0.5;		// épaisseur d'une porte
var entry_pos = [];
var exit_pos = [];
var user_pos = [];
var score = 0;

var fruit = [];
var vie = 20;

var ghosts = [];

var isAlive = 1;

var timer = 600;

function modifyStyleSheet() {
	var ss = document.styleSheets[0];
	console.log('nb css : ' + document.styleSheets.length);
	console.log('css href : ' + document.styleSheets[0].href);
	console.log('css title : ' + document.styleSheets[0].title);
	console.log('css type : ' + document.styleSheets[0].type);
	console.log('css rules : ' + document.styleSheets[0].rules);
	if (!ss) console.log('Pas de ss');
	else console.log('nb rules : ' + ss + ' of size ' + ss.cssRules.length);
	var i = 0;
	while (ss.rules[i].selectorText != "div.N") i++;
	ss.cssRules[i].style.borderTop = "10px solid";
}

function UpTimer()
{
	timer--;
	document.getElementById("timer").innerHTML = "Time Left : " + timer + " seconds";
	if(timer <= 0)
    	{
    		isAlive = 0;
    		window.alert("Tu as perdu avec une score de " + score);
    		clearInterval(timeoutVar);
    	}
}
var timeoutVar;
function new_game(X,Y) {
	laby = new_2d_array(X, Y);
	init_2d_array(laby, 15);
	dig(laby, 0, 0);
	dig_ES(laby);
	GenerateFruits();
	GenerateGhosts();
	//modifyStyleSheet();
	timeoutVar = setInterval(UpTimer, 1000);
	print_maze(laby, fruit);
	//print_2d_array(laby);
}

function GenerateFruits()
{
	var MaxFruits = 10;
	var amount = Math.floor(Math.random()*MaxFruits+1);
	for(var i = 0; i < amount; i++)
	{
		fruit[i] = new Array();
		fruit[i][0] = Math.floor(Math.random()*laby.length);
		fruit[i][1] = Math.floor(Math.random()*laby.length);
	}
}

function GenerateGhosts()
{
	var MaxGhosts = 4;
	var amount = Math.floor(Math.random()*MaxGhosts+1);
	for(var i = 0; i < amount; i++)
	{
		ghosts[i] = new Array();
		ghosts[i][0] = Math.floor(Math.random()*laby.length);
		ghosts[i][1] = Math.floor(Math.random()*laby.length);
	}
}

function MoveGhosts()
{
	for(var i = 0; i < ghosts.length; i++)
	{
		var ghost_style = document.getElementById("ghost_" + i).style;
		var X = -1;
		var Y = -1;
		if(Math.random() < 0.5)
		{
			X = Math.round(Math.random());
		}
		else
		{
			Y = Math.round(Math.random());
		}
		if(X == 0)
		{
			if (!has_W_wall(laby[ghosts[i][0]][ghosts[i][1]])) {
    			ghosts[i][1]--;
    			ghost_style.left = (csz * ghosts[i][1]) + "px";
    		}
    	}
    	else if (X == 1)
    	{
			if (!has_E_wall(laby[ghosts[i][0]][ghosts[i][1]])) {
    			ghosts[i][1]++;
    			ghost_style.left = (csz * ghosts[i][1]) + "px";
    		}
    	}
    	else if(Y == 0)
    	{
    		if (!has_N_wall(laby[ghosts[i][0]][ghosts[i][1]])) {
    			ghosts[i][0]--;
    			ghost_style.top = (csz * ghosts[i][0]) + "px";
    		}
    	}
    	else if(Y == 1)
    	{
    		if (!has_S_wall(laby[ghosts[i][0]][ghosts[i][1]])) {
    			ghosts[i][0]++;
    			ghost_style.top = (csz * ghosts[i][0]) + "px";
    		}
		}
	}
}

function uniCharCode(event) {
    var char = event.which || event.keyCode;
    document.getElementById("board").innerHTML = "The Unicode CHARACTER code is: " + char;
}

function uniKeyCode(event) {
    if(isAlive == 1)
    {
    var key = event.keyCode;
    //document.getElementById("board").innerHTML = "The Unicode KEY code is: " + key;
    // N : 38, E : 39, S : 40, W : 37
    var user_style = document.getElementById("user").style;
    var goodMove = 0;
    switch (key) {
    	case 37 :
    		if (!has_W_wall(laby[user_pos[0]][user_pos[1]])) {
    			user_pos[1]--;
    			user_style.left = (csz * user_pos[1]) + "px";
    			goodMove = 1;
    		}
    		break;
    	case 39 :
    		if (!has_E_wall(laby[user_pos[0]][user_pos[1]])) {
    			user_pos[1]++;
    			user_style.left = (csz * user_pos[1]) + "px";
    			goodMove = 1;
    		}
    		break;
    	case 38 :
    		if (!has_N_wall(laby[user_pos[0]][user_pos[1]])) {
    			user_pos[0]--;
    			user_style.top = (csz * user_pos[0]) + "px";
    			goodMove = 1;
    		}
    		break;
    	case 40 :
    		if (!has_S_wall(laby[user_pos[0]][user_pos[1]])) {
    			user_pos[0]++;
    			user_style.top = (csz * user_pos[0]) + "px";
    			goodMove = 1;
    		}
    		break;

    }
    MoveGhosts();
    if(goodMove == 1)
    {
    	UpScore();
    	DownLife();
    }
    OnFruitGetVie(user_pos, 10);
    OnGhostPlayerDie(user_pos, vie);
       	if(user_pos[0] == exit_pos[0] && user_pos[1] == exit_pos[1]+1)
    	{
    		isFinished = 1;
    		isAlive = 0;
    		window.alert("Tu as gagné avec un score de " + score);
    	}
    	if(vie <= 0 || timer <= 0)
    	{
    		isAlive = 0;
    		window.alert("Tu as perdu avec un score de " + score);
    	}
    }
}
function OnFruitGetVie(pos, points)
{
	for(var i = 0; i < fruit.length; i++)
	{
		if(pos[0] == fruit[i][0] && pos[1] == fruit[i][1])
		{
			fruit[i][0] = -2;
			fruit[i][1] = -2;
			var element = document.getElementById("fruit"+i);
			element.parentNode.removeChild(element);
			vie += points;
			document.getElementById("HP").innerHTML = "Essence : " + vie;
		}
	}
}

function OnGhostPlayerDie(pos, points)
{
	for(var i = 0; i < ghosts.length; i++)
	{
		if(pos[0] == ghosts[i][0] && pos[1] == ghosts[i][1])
		{
			vie -= points;
			document.getElementById("HP").innerHTML = "Essence : " + vie;
		}
	}
}

function DownLife()
{
	vie--;
	document.getElementById("HP").innerHTML = "Essence : " + vie;
}

function UpScore()
{
	score++;
    document.getElementById("score").innerHTML = "Score : " + score;
	return score;
}





