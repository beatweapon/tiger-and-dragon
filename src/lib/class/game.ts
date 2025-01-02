import { pickRandomIndex } from '$lib/utils';
import type { Room } from './room.svelte';
import { room, updateRoom } from './room.svelte';
import { winingPoint } from '$lib/logic/game/winingPoint';

export interface Player {
	id: string;
	name: string;
	hand: number[];
	played: { number: number; isClosed: boolean }[];
	isStartingPlayer: boolean;
	point: number;
}

export interface Team {
	isWinner: boolean;
	playerIds: string[];
}

export interface GameData {
	settings: Room['settings'];
	players: Player[];
	teams: Team[];
	remainingTiles: number[];
	currentPlayerId: string;
	lastAttack?: {
		playerId: string;
		tile: number;
	};
	playPhase: 'attack' | 'defend';
	gamePhase: 'playing' | 'gameSet' | 'gameOver';
	winningPoints: number;
}

export const resetRound = (roomId: string) => {
	if (!room.gameData) return;

	const lastStartingPlayer = room.gameData.players.find((player) => player.isStartingPlayer);
	const startingPlayer = lastStartingPlayer
		? getNextPlayer(room.gameData.players, lastStartingPlayer.id)
		: room.gameData.players[pickRandomIndex(room.gameData.players)];

	const remainingTiles = Array.from({ length: 8 }, (_, i) => Array(i + 1).fill(i + 1)).flat();
	remainingTiles.push(0, 9);

	room.gameData.players.forEach((player) => {
		player.hand = [];
		player.played = [];
		player.isStartingPlayer = startingPlayer.id === player.id ? true : false;

		const maxHandSize = player.id === startingPlayer.id ? 10 : 9;

		const hand = [];
		for (let i = 0; i < maxHandSize; i++) {
			const randomIndex = Math.floor(Math.random() * remainingTiles.length);
			hand.push(remainingTiles.splice(randomIndex, 1)[0]);
		}

		player.hand = hand.sort((a, b) => a - b);
	});

	room.gameData.remainingTiles = remainingTiles;
	room.gameData.gamePhase = 'playing';
	room.gameData.playPhase = 'attack';
	room.gameData.currentPlayerId = startingPlayer.id;

	room.state = 'playing';

	updateRoom(roomId, { state: room.state, gameData: room.gameData });
};

export const play = (roomId: string, handIndex: number) => {
	if (!room.gameData) return;

	const currentPlayer = room.gameData.players.find(
		(player) => player.id === room.gameData?.currentPlayerId
	);
	if (!currentPlayer) return;

	const tile = currentPlayer.hand[handIndex];
	if (tile == null) return;

	const isLoopRound = room.gameData.lastAttack?.playerId === currentPlayer.id;

	if (room.gameData.playPhase === 'defend') {
		if (!isLoopRound && !canPlay(tile, room.gameData.lastAttack)) {
			return;
		}

		currentPlayer.played.push({ number: tile, isClosed: isLoopRound });
		currentPlayer.hand.splice(handIndex, 1);
		room.gameData.playPhase = 'attack';
		delete room.gameData.lastAttack;

		if (currentPlayer.hand.length === 0) {
			gameSet();
		}

		updateRoom(roomId, { gameData: room.gameData });

		return;
	}

	if (room.gameData.playPhase === 'attack') {
		currentPlayer.played.push({ number: tile, isClosed: false });
		currentPlayer.hand.splice(handIndex, 1);

		room.gameData.lastAttack = {
			playerId: currentPlayer.id,
			tile
		};

		room.gameData.currentPlayerId = getNextPlayer(
			room.gameData.players,
			room.gameData.currentPlayerId
		).id;
		room.gameData.playPhase = 'defend';

		updateRoom(roomId, { gameData: room.gameData });

		return;
	}
};

export const canPlay = (tile: number, lastAttack?: { tile: number }) => {
	if (!lastAttack) return true;

	if (lastAttack.tile % 2 === 1 && tile === 9) {
		return true;
	}

	if (lastAttack.tile % 2 === 0 && tile === 0) {
		return true;
	}

	if (lastAttack.tile === 0 && tile % 2 === 0) {
		return true;
	}

	if (lastAttack.tile === 9 && tile % 2 === 1) {
		return true;
	}

	if (tile === lastAttack.tile) {
		return true;
	}

	return false;
};

export const pass = (roomId: string) => {
	if (!room.gameData) return;

	room.gameData.currentPlayerId = getNextPlayer(
		room.gameData.players,
		room.gameData.currentPlayerId
	).id;

	updateRoom(roomId, { gameData: room.gameData });
};

export const getTeamMembers = (team: Team) => {
	return room.gameData!.players.filter((player) => team.playerIds.includes(player.id));
};

const gameSet = () => {
	if (!room.gameData) return;

	const currentPlayerId = room.gameData.currentPlayerId;
	const winner = room.gameData.players.find((player) => player.id === currentPlayerId);

	if (!winner) return;

	winner.played[winner.played.length - 1].isClosed = false;
	const point = winingPoint.battleOfTheDojo(winner, room.gameData);

	winner.point += point;
	room.gameData.gamePhase = 'gameSet';

	room.gameData.teams.forEach((team) => {
		const teamPlayers = getTeamMembers(team);
		const teamPoints = teamPlayers.reduce((sum, player) => sum + player.point, 0);
		if (teamPoints >= room.gameData!.winningPoints) {
			team.isWinner = true;
			room.gameData!.gamePhase = 'gameOver';
		}
	});
};

const getNextPlayer = (players: Player[], currentPlayerId: string) => {
	const currentPlayerIndex = players.findIndex((player) => player.id === currentPlayerId);
	const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

	return players[nextPlayerIndex];
};
