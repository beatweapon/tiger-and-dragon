import { pickRandomIndex } from '$lib/utils';
import type { Room } from './room.svelte';
import { room, updateRoom } from './room.svelte';
import { winingPoint, BattleFieldKey } from '$lib/logic/game/winingPoint';

export interface Player {
	id: string;
	name: string;
	hand: { id: string; number: number; isForetold: boolean }[];
	played: { id: string; number: number; isClosed: boolean; isForetold: boolean }[];
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
	order: string[];
	remainingTiles: number[];
	currentPlayerId: string;
	lastAttack?: {
		playerId: string;
		number: number;
	};
	playPhase: 'attack' | 'defend';
	gamePhase: 'playing' | 'gameSet' | 'gameOver';
	winningPoints: number;
}

export const resetRound = (roomId: string) => {
	if (!room.gameData) return;

	const MAX_HAND_SIZES = {
		5: 7,
		4: 9,
		3: 11,
		2: 13,
	};

	const baseMaxHandSize = MAX_HAND_SIZES[room.gameData?.players.length as 5 | 4 | 3 | 2];

	const lastStartingPlayer = room.gameData.players.find((player) => player.isStartingPlayer);
	const startingPlayer = lastStartingPlayer
		? room.gameData.players.find(
				(p) => p.id === getNextPlayer(room.gameData!.order, lastStartingPlayer.id),
			)
		: room.gameData.players[pickRandomIndex(room.gameData.players)];

	const remainingTiles = Array.from({ length: 8 }, (_, i) => Array(i + 1).fill(i + 1)).flat();
	remainingTiles.push(0, 9);

	room.gameData.players.forEach((player) => {
		player.hand = [];
		player.played = [];
		player.isStartingPlayer = startingPlayer!.id === player.id ? true : false;

		const maxHandSize = player.id === startingPlayer!.id ? baseMaxHandSize + 1 : baseMaxHandSize;

		const hand = [];
		for (let i = 0; i < maxHandSize; i++) {
			const randomIndex = Math.floor(Math.random() * remainingTiles.length);
			hand.push({
				id: `${player.id}_${i}`,
				number: remainingTiles.splice(randomIndex, 1)[0],
				isForetold: false,
			});
		}

		player.hand = hand.sort((a, b) => a.number - b.number);
	});

	room.gameData.remainingTiles = remainingTiles;
	room.gameData.gamePhase = 'playing';
	room.gameData.playPhase = 'attack';
	room.gameData.currentPlayerId = startingPlayer!.id;

	room.state = 'playing';

	updateRoom(roomId, { state: room.state, gameData: room.gameData });
};

export const play = (roomId: string, handIndex: number) => {
	if (!room.gameData) return;

	const currentPlayer = room.gameData.players.find(
		(player) => player.id === room.gameData?.currentPlayerId,
	);
	if (!currentPlayer) return;

	const tile = currentPlayer.hand[handIndex];
	if (tile == null) return;

	const isLoopRound = room.gameData.lastAttack?.playerId === currentPlayer.id;

	if (room.gameData.playPhase === 'defend') {
		if (!isLoopRound && !canPlay(tile.number, room.gameData.lastAttack?.number)) {
			return;
		}

		currentPlayer.played.push({ ...tile, isClosed: isLoopRound });
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
		currentPlayer.played.push({ ...tile, isClosed: false });
		currentPlayer.hand.splice(handIndex, 1);

		room.gameData.lastAttack = {
			playerId: currentPlayer.id,
			number: tile.number,
		};

		room.gameData.currentPlayerId = getNextPlayer(
			room.gameData.order,
			room.gameData.currentPlayerId,
		);
		room.gameData.playPhase = 'defend';

		updateRoom(roomId, { gameData: room.gameData });

		return;
	}
};

export const canPlay = (playTileNumber: number, lastAttackNumber?: number) => {
	if (lastAttackNumber == null) return true;

	if (lastAttackNumber % 2 === 1 && playTileNumber === 9) {
		return true;
	}

	if (lastAttackNumber % 2 === 0 && playTileNumber === 0) {
		return true;
	}

	if (lastAttackNumber === 0 && playTileNumber % 2 === 0) {
		return true;
	}

	if (lastAttackNumber === 9 && playTileNumber % 2 === 1) {
		return true;
	}

	if (playTileNumber === lastAttackNumber) {
		return true;
	}

	return false;
};

export const undo = (roomId: string) => {
	if (!room.gameData) return;

	if (room.gameData.playPhase !== 'attack') return;

	const currentPlayer = room.gameData.players.find(
		(player) => player.id === room.gameData?.currentPlayerId,
	);
	if (!currentPlayer) return;

	const lastPlayedTile = currentPlayer.played.pop();

	if (!lastPlayedTile) return;

	currentPlayer.hand.push({
		id: lastPlayedTile.id,
		number: lastPlayedTile.number,
		isForetold: lastPlayedTile.isForetold,
	});

	room.gameData.lastAttack = {
		playerId: currentPlayer.id,
		number: currentPlayer.played[currentPlayer.played.length - 1].number,
	};

	room.gameData.playPhase = 'defend';

	updateRoom(roomId, { gameData: room.gameData });
};

export const pass = (roomId: string) => {
	if (!room.gameData) return;

	room.gameData.currentPlayerId = getNextPlayer(room.gameData.order, room.gameData.currentPlayerId);

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
	const point = winingPoint.calcWinningPoint(winner, room.gameData);

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

const getNextPlayer = (order: string[], currentPlayerId: string) => {
	const currentPlayerIndex = order.findIndex((id) => id === currentPlayerId);
	const nextPlayerIndex = (currentPlayerIndex + 1) % order.length;

	return order[nextPlayerIndex];
};
