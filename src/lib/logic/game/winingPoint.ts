import type { GameData } from '$lib/class/game';
import type { Player } from '$lib/class/player';

const battleOfTheDojo = (winner: Player, gameData: GameData) => {
	const lastPlayTileNumber = winner.played[winner.played.length - 1].number;

	const pointList: Record<number, { point: number; bonusRate: number }> = {
		0: { point: 1, bonusRate: 0 },
		1: { point: 10, bonusRate: 1 },
		2: { point: 1, bonusRate: 1 },
		3: { point: 1, bonusRate: 1 },
		4: { point: 2, bonusRate: 1 },
		5: { point: 2, bonusRate: 1 },
		6: { point: 2, bonusRate: 1 },
		7: { point: 3, bonusRate: 1 },
		8: { point: 3, bonusRate: 1 },
		9: { point: 1, bonusRate: 0 }
	};

	const point = pointList[lastPlayTileNumber].point;
	const bonusPoint =
		winner.played.filter((play) => play.isClosed).length * pointList[lastPlayTileNumber].bonusRate;

	return point + bonusPoint;
};

export const winingPoint = {
	battleOfTheDojo
};
