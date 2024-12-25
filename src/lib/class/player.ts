export class Player {
	public id: string;
	public name: string;
	public hand: number[];
	public played: { number: number; isClosed: boolean }[] = [];
	public isStartingPlayer = false;
	public point = 0;

	constructor(playerId: string, name: string) {
		this.id = playerId;
		this.name = name;
		this.hand = [];
		this.played = [];
	}
}
