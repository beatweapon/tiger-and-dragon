import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import {
	collection,
	doc,
	getDocs,
	addDoc,
	updateDoc,
	Timestamp,
	query,
	orderBy,
	onSnapshot
} from 'firebase/firestore';
import { db } from '$lib/firebaseClient';

export interface RoomSettings {
	battleField: string;
}

const DEFAULT_ROOM_SETTING = {
	state: 'standBy',
	masterId: '',
	playingGameId: '',
	members: {},
	settings: { battleField: 'default', isTeamBattle: true }
};

export const room = writable([]);

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
