import type { RoomSettings } from './room';
import { Player } from './player';
import { winingPoint } from '$lib/logic/game/winingPoint';

export interface Team {
	isWinner: boolean;
	players: Player[];
}

export interface GameData {
	settings: RoomSettings['settings'];
	players: Player[];
	teams: Team[];
	remainingTiles: number[];
	currentPlayerId: string;
	lastAttack: {
		playerId: string;
		tile: number;
	};
	playPhase: 'attack' | 'defend';
	gamePhase: 'playing' | 'gameSet' | 'gameOver';
	winningPoints: number;
}

export class Game {
	public data: GameData = {
		settings: { battleField: 'default', isTeamBattle: true },
		teams: [],
		players: [],
		remainingTiles: [],
		currentPlayerId: '',
		lastAttack: { playerId: '', tile: 0 },
		playPhase: 'attack',
		gamePhase: 'playing',
		winningPoints: 0
	};

	constructor(roomSettings: RoomSettings) {
		this.newGame(roomSettings);
	}

	public newGame(roomSettings: RoomSettings) {
		const players: Player[] = [];
		Object.values(roomSettings.members).forEach((member) => {
			players.push(new Player(member.id, member.name));
		});

		const startingPlayer = players[this.pickRandomIndex(players)];
		startingPlayer.isStartingPlayer = true;
		const currentPlayerId = startingPlayer.id;

		const teams: Team[] = [];

		if (roomSettings.settings.isTeamBattle) {
			const shuffledPlayers = players
				.map((player) => ({ player, sort: Math.random() }))
				.sort((a, b) => a.sort - b.sort)
				.map(({ player }) => player);

			const mid = Math.ceil(shuffledPlayers.length / 2);
			teams.push({ isWinner: false, players: shuffledPlayers.slice(0, mid) });
			teams.push({ isWinner: false, players: shuffledPlayers.slice(mid) });
		} else {
			players.forEach((player) => {
				teams.push({ isWinner: false, players: [player] });
			});
		}

		this.data = {
			settings: roomSettings.settings,
			teams,
			players,
			remainingTiles: [],
			currentPlayerId,
			lastAttack: { playerId: currentPlayerId, tile: 0 },
			playPhase: 'attack',
			gamePhase: 'playing',
			winningPoints: roomSettings.settings.isTeamBattle ? 15 : 10
		};

		this.resetRound();
	}

	public resetRound() {
		this.data.gamePhase = 'playing';

		this.data.remainingTiles = Array.from({ length: 8 }, (_, i) => Array(i + 1).fill(i + 1)).flat();
		this.data.remainingTiles.push(0, 9);

		this.data.players.forEach((player) => {
			player.hand = [];
			player.played = [];
			player.isStartingPlayer = false;

			const maxHandSize = player.id === this.data.currentPlayerId ? 10 : 9;

			for (let i = 0; i < maxHandSize; i++) {
				const randomIndex = Math.floor(Math.random() * this.data.remainingTiles.length);
				player.hand.push(this.data.remainingTiles.splice(randomIndex, 1)[0]);
			}
		});

		const startingPlayer = this.data.players[this.pickRandomIndex(this.data.players)];
		startingPlayer.isStartingPlayer = true;
		this.data.currentPlayerId = startingPlayer.id;
		this.data.lastAttack = { playerId: startingPlayer.id, tile: 0 };
		this.data.playPhase = 'attack';
	}

	public play(index: number) {
		const currentPlayer = this.data.players.find(
			(player) => player.id === this.data.currentPlayerId
		);
		if (!currentPlayer) return;

		const tile = currentPlayer.hand[index];
		if (tile == null) return;

		const isLoopRound = this.data.lastAttack.playerId === currentPlayer.id;

		if (this.data.playPhase === 'defend') {
			if (!isLoopRound && !this.canDefend(tile)) {
				return;
			}

			currentPlayer.played.push({ number: tile, isClosed: isLoopRound });
			currentPlayer.hand.splice(index, 1);
			this.data.playPhase = 'attack';

			if (currentPlayer.hand.length === 0) {
				this.gameSet();
			}

			return;
		}

		if (this.data.playPhase === 'attack') {
			currentPlayer.played.push({ number: tile, isClosed: false });
			currentPlayer.hand.splice(index, 1);

			this.data.lastAttack.playerId = currentPlayer.id;
			this.data.lastAttack.tile = tile;

			this.data.currentPlayerId = this.getNextPlayerId();
			this.data.playPhase = 'defend';

			return;
		}
	}

	public canDefend(tile: number) {
		if (this.data.lastAttack?.tile % 2 === 1 && tile === 9) {
			return true;
		}

		if (this.data.lastAttack?.tile % 2 === 0 && tile === 0) {
			return true;
		}

		if (this.data.lastAttack?.tile === 0 && tile % 2 === 0) {
			return true;
		}

		if (this.data.lastAttack?.tile === 9 && tile % 2 === 1) {
			return true;
		}

		if (tile === this.data.lastAttack?.tile) {
			return true;
		}

		return false;
	}

	public pass() {
		this.data.currentPlayerId = this.getNextPlayerId();
	}

	public gameSet() {
		const winner = this.data.players.find((player) => player.id === this.data.currentPlayerId);

		if (!winner) return;

		winner.played[winner.played.length - 1].isClosed = false;
		const point = winingPoint.battleOfTheDojo(winner, this.data);

		winner.point += point;
		this.data.gamePhase = 'gameSet';

		this.data.teams.forEach((team) => {
			const teamPoints = team.players.reduce((sum, player) => sum + player.point, 0);
			if (teamPoints >= this.data.winningPoints) {
				team.isWinner = true;
				this.data.gamePhase = 'gameOver';
			}
		});
	}

	private getNextPlayerId() {
		const currentPlayerIndex = this.data.players.findIndex(
			(player) => player.id === this.data.currentPlayerId
		);
		const nextPlayerIndex = (currentPlayerIndex + 1) % this.data.players.length;

		return this.data.players[nextPlayerIndex].id;
	}

	private pickRandomIndex(array: any[]) {
		return Math.floor(Math.random() * array.length);
	}
}
