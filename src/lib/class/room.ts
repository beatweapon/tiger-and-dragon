import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { collection, doc, addDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '$lib/firebaseClient';

export interface RoomSettings {
	masterId: string;
	playingGameId: string;
	members: { [key: string]: { id: string; name: string } };
	state: 'standBy' | 'playing';
	settings: { battleField: 'default'; isTeamBattle: boolean };
}

const DEFAULT_ROOM_SETTING: RoomSettings = {
	state: 'standBy',
	masterId: '',
	playingGameId: '',
	members: {},
	settings: { battleField: 'default', isTeamBattle: true }
};

export const room = writable(DEFAULT_ROOM_SETTING);

let unsubscribe;

export const createRoom = async (newMemberName: string) => {
	const memberId = uuidv4();
	const settings = {
		...DEFAULT_ROOM_SETTING,
		masterId: memberId,
		members: { [memberId]: { id: memberId, name: newMemberName } }
	};
	const { id: roomId } = await addDoc(collection(db, 'room'), settings);

	return { roomId, memberId };
};

export const joinRoom = async (roomId: string, newMemberName: string) => {
	const memberId = uuidv4();
	const roomDocRef = doc(db, 'room', roomId);

	await updateDoc(roomDocRef, {
		[`members.${memberId}`]: { id: memberId, name: newMemberName }
	});

	return { memberId };
};

export const startGame = async (roomId: string) => {
	const roomDocRef = doc(db, 'room', roomId);

	await updateDoc(roomDocRef, {
		state: 'playing'
	});
};

export const subscribeRoom = (roomId: string) => {
	const roomDocRef = doc(db, 'room', roomId);

	unsubscribe = onSnapshot(roomDocRef, (doc) => {
		room.set(doc.data() as RoomSettings);
	});
};
