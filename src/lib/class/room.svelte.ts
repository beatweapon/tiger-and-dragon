import { v4 as uuidv4 } from 'uuid';
import { collection, doc, addDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '$lib/firebaseClient';
import type { GameData, Player, Team } from './game';
import { resetRound } from './game';
import { BattleFieldKey } from '$lib/logic/game/winingPoint';

export interface Room {
	masterId: string;
	playingGameId: string;
	members: { [key: string]: { id: string; name: string } };
	state: 'standBy' | 'playing';
	settings: { battleField: BattleFieldKey; isTeamBattle: boolean };
	gameData?: GameData;
}

const DEFAULT_ROOM_SETTING: Room = {
	state: 'standBy',
	masterId: '',
	playingGameId: '',
	members: {},
	settings: { battleField: BattleFieldKey.道場の戦い, isTeamBattle: true },
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

export const startGame = async (roomId: string) => {
	const gameData = createInitialGameData(room);
	room.gameData = gameData;
	resetRound(roomId);
};

const createInitialGameData = (room: Room): GameData => {
	const players: Player[] = [];
	Object.values(room.members).forEach((member) => {
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

	if (room.settings.isTeamBattle) {
		const shuffledPlayers = players
			.map((player) => ({ playerId: player.id, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ playerId }) => playerId);

		const mid = Math.ceil(shuffledPlayers.length / 2);
		teams.push({ isWinner: false, playerIds: shuffledPlayers.slice(0, mid) });
		teams.push({ isWinner: false, playerIds: shuffledPlayers.slice(mid) });
	} else {
		players.forEach((player) => {
			teams.push({ isWinner: false, playerIds: [player.id] });
		});
	}

	return {
		settings: room.settings,
		teams,
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
