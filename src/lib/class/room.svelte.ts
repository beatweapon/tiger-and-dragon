import { v4 as uuidv4 } from 'uuid';
import { collection, doc, addDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '$lib/firebaseClient';
import type { GameData, Player, Team } from './game';
import { resetRound } from './game';
import { BattleFieldKey } from '$lib/logic/game/winingPoint';

export interface Room {
	masterId: string;
	playingGameId: string;
	members: { [key: string]: { id: string; name: string; isReady?: boolean } };
	state: 'standBy' | 'playing';
	settings: { battleField: BattleFieldKey; isTeamBattle: boolean; isAlternating: boolean };
	gameData?: GameData;
}

const DEFAULT_ROOM_SETTING: Room = {
	state: 'standBy',
	masterId: '',
	playingGameId: '',
	members: {},
	settings: { battleField: BattleFieldKey.道場の戦い, isTeamBattle: false, isAlternating: false },
	gameData: {
		settings: { battleField: BattleFieldKey.道場の戦い, isTeamBattle: false, isAlternating: false },
		players: [],
		teams: [],
		order: [],
		remainingTiles: [],
		currentPlayerId: '',
		playPhase: 'attack',
		gamePhase: 'playing',
		winningPoints: 0,
	},
};

let room = $state({ ...DEFAULT_ROOM_SETTING });

let unsubscribe: () => void;

export const createRoom = async (newMemberName: string) => {
	const memberId = uuidv4();
	const settings = {
		...DEFAULT_ROOM_SETTING,
		masterId: memberId,
		members: { [memberId]: { id: memberId, name: newMemberName } },
	};
	const { id: roomId } = await addDoc(collection(db, 'room'), settings);

	return { roomId, memberId };
};

export const joinRoom = async (roomId: string, newMemberName: string) => {
	const memberId = uuidv4();
	const roomDocRef = doc(db, 'room', roomId);

	await updateDoc(roomDocRef, {
		[`members.${memberId}`]: { id: memberId, name: newMemberName },
	});

	return { memberId };
};

export const setReady = (roomId: string, memberId: string, isReady: boolean) => {
	room.members[memberId].isReady = isReady;

	updateRoom(roomId, { members: room.members });
};

export const setField = (roomId: string, fieldKey: BattleFieldKey) => {
	const settings = room.settings;
	settings.battleField = fieldKey;

	updateRoom(roomId, { settings });
};

export const setIsTeamBattle = (roomId: string, isTeamBattle: boolean) => {
	const settings = room.settings;
	settings.isTeamBattle = isTeamBattle;

	updateRoom(roomId, { settings });
};

export const setIsAlternating = (roomId: string, isAlternating: boolean) => {
	const settings = room.settings;
	settings.isAlternating = isAlternating;

	updateRoom(roomId, { settings });
};

export const startGame = async (roomId: string) => {
	const gameData = createInitialGameData(room);
	room.gameData = gameData;
	resetRound(roomId);
};

export const resetGame = async (roomId: string) => {
	room.state = 'standBy';

	updateRoom(roomId, { state: room.state });
};

const createInitialGameData = (room: Room): GameData => {
	const players: Player[] = [];
	Object.values(room.members)
		.filter((m) => m.isReady)
		.forEach((member) => {
			players.push({
				id: member.id,
				name: member.name,
				hand: [],
				played: [],
				isStartingPlayer: false,
				point: 0,
			});
		});

	const teams: Team[] = [];
	const order: string[] = [];

	if (players.length !== 4) {
		room.settings.isTeamBattle = false;
	}

	if (room.settings.isTeamBattle) {
		const shuffledPlayerIds = players
			.map((player) => ({ playerId: player.id, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ playerId }) => playerId);

		const mid = Math.ceil(shuffledPlayerIds.length / 2);
		teams.push({ isWinner: false, playerIds: shuffledPlayerIds.slice(0, mid) });
		teams.push({ isWinner: false, playerIds: shuffledPlayerIds.slice(mid) });

		if (room.settings.isAlternating) {
			order.push(
				shuffledPlayerIds[0],
				shuffledPlayerIds[2],
				shuffledPlayerIds[1],
				shuffledPlayerIds[3],
			);
		} else {
			order.push(
				shuffledPlayerIds[0],
				shuffledPlayerIds[1],
				shuffledPlayerIds[2],
				shuffledPlayerIds[3],
			);
		}
	} else {
		players.forEach((player) => {
			teams.push({ isWinner: false, playerIds: [player.id] });
			order.push(player.id);
		});
	}

	return {
		settings: room.settings,
		teams,
		order,
		players,
		remainingTiles: [],
		currentPlayerId: '',
		lastAttack: { playerId: '', number: 0 },
		playPhase: 'attack',
		gamePhase: 'playing',
		winningPoints: room.settings.isTeamBattle ? 15 : 10,
	};
};

export const updateRoom = async (roomId: string, data: Partial<Room>) => {
	const roomDocRef = doc(db, 'room', roomId);

	await updateDoc(roomDocRef, data);
};

export const subscribeRoom = (roomId: string) => {
	const roomDocRef = doc(db, 'room', roomId);

	unsubscribe = onSnapshot(roomDocRef, (doc) => {
		Object.assign(room, doc.data() as Room);
	});
};

export { room };
