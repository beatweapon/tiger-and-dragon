import type { GameData } from '$lib/class/game';
import type { Player } from '$lib/class/game';

export enum BattleFieldKey {
	道場の戦い = '道場の戦い',
	竹林の戦い = '竹林の戦い',
	火山の戦い = '火山の戦い',
	浜辺の戦い = '浜辺の戦い',
	草原の戦い = '草原の戦い',
	崖の上の戦い = '崖の上の戦い',
	嵐の戦い = '嵐の戦い',
	沼地の戦い = '沼地の戦い',
	濃霧の戦い = '濃霧の戦い',
	洞窟の戦い = '洞窟の戦い',
	ゲームマーケットの戦い = 'ゲームマーケットの戦い',
}

interface BattleField {
	key: BattleFieldKey;
	name: string;
	pointList: {
		[key: number | string]: { point: number; bonusRate: number; hasAllPlayerBonus: boolean };
	};
}

const battleFields: BattleField[] = [
	{
		key: BattleFieldKey.道場の戦い,
		name: '道場の戦い',
		pointList: {
			0: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
			1: { point: 10, bonusRate: 1, hasAllPlayerBonus: false },
			2: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			3: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			4: { point: 3, bonusRate: 1, hasAllPlayerBonus: false },
			5: { point: 3, bonusRate: 1, hasAllPlayerBonus: false },
			6: { point: 3, bonusRate: 1, hasAllPlayerBonus: false },
			7: { point: 4, bonusRate: 1, hasAllPlayerBonus: false },
			8: { point: 4, bonusRate: 1, hasAllPlayerBonus: false },
			9: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
		},
	},
	{
		key: BattleFieldKey.竹林の戦い,
		name: '竹林の戦い',
		pointList: {
			0: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
			1: { point: 10, bonusRate: 1, hasAllPlayerBonus: false },
			2: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			3: { point: 3, bonusRate: 1, hasAllPlayerBonus: false },
			4: { point: 4, bonusRate: 1, hasAllPlayerBonus: false },
			5: { point: 4, bonusRate: 1, hasAllPlayerBonus: false },
			6: { point: 4, bonusRate: 1, hasAllPlayerBonus: false },
			7: { point: 3, bonusRate: 1, hasAllPlayerBonus: false },
			8: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			9: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
		},
	},
	{
		key: BattleFieldKey.火山の戦い,
		name: '火山の戦い',
		pointList: {
			0: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
			1: { point: 10, bonusRate: 2, hasAllPlayerBonus: false },
			2: { point: 4, bonusRate: 2, hasAllPlayerBonus: false },
			3: { point: 4, bonusRate: 2, hasAllPlayerBonus: false },
			4: { point: 3, bonusRate: 2, hasAllPlayerBonus: false },
			5: { point: 3, bonusRate: 2, hasAllPlayerBonus: false },
			6: { point: 3, bonusRate: 2, hasAllPlayerBonus: false },
			7: { point: 2, bonusRate: 2, hasAllPlayerBonus: false },
			8: { point: 2, bonusRate: 2, hasAllPlayerBonus: false },
			9: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
		},
	},
	{
		key: BattleFieldKey.浜辺の戦い,
		name: '浜辺の戦い',
		pointList: {
			0: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
			1: { point: 10, bonusRate: 1, hasAllPlayerBonus: false },
			2: { point: 3, bonusRate: 1, hasAllPlayerBonus: false },
			3: { point: 4, bonusRate: 1, hasAllPlayerBonus: false },
			4: { point: 3, bonusRate: 1, hasAllPlayerBonus: false },
			5: { point: 4, bonusRate: 1, hasAllPlayerBonus: false },
			6: { point: 3, bonusRate: 1, hasAllPlayerBonus: false },
			7: { point: 4, bonusRate: 1, hasAllPlayerBonus: false },
			8: { point: 3, bonusRate: 1, hasAllPlayerBonus: false },
			9: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
		},
	},
	{
		key: BattleFieldKey.草原の戦い,
		name: '草原の戦い',
		pointList: {
			0: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
			1: { point: 10, bonusRate: 1, hasAllPlayerBonus: false },
			2: { point: 4, bonusRate: 1, hasAllPlayerBonus: false },
			3: { point: 3, bonusRate: 1, hasAllPlayerBonus: false },
			4: { point: 4, bonusRate: 1, hasAllPlayerBonus: false },
			5: { point: 3, bonusRate: 1, hasAllPlayerBonus: false },
			6: { point: 4, bonusRate: 1, hasAllPlayerBonus: false },
			7: { point: 3, bonusRate: 1, hasAllPlayerBonus: false },
			8: { point: 4, bonusRate: 1, hasAllPlayerBonus: false },
			9: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
		},
	},
	{
		key: BattleFieldKey.崖の上の戦い,
		name: '崖の上の戦い',
		pointList: {
			0: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
			1: { point: 10, bonusRate: 1, hasAllPlayerBonus: false },
			9: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
			open: { point: 6, bonusRate: 1, hasAllPlayerBonus: false },
			close: { point: 3, bonusRate: 1, hasAllPlayerBonus: false },
		},
	},
	{
		key: BattleFieldKey.嵐の戦い,
		name: '嵐の戦い',
		pointList: {
			0: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
			1: { point: 10, bonusRate: 1, hasAllPlayerBonus: false },
			2: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			3: { point: 5, bonusRate: 1, hasAllPlayerBonus: false },
			4: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			5: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			6: { point: 5, bonusRate: 1, hasAllPlayerBonus: false },
			7: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			8: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			9: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
		},
	},
	{
		key: BattleFieldKey.沼地の戦い,
		name: '沼地の戦い',
		pointList: {
			0: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
			1: { point: 10, bonusRate: 1, hasAllPlayerBonus: false },
			2: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			3: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			4: { point: 5, bonusRate: 1, hasAllPlayerBonus: false },
			5: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			6: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			7: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			8: { point: 5, bonusRate: 1, hasAllPlayerBonus: false },
			9: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
		},
	},
	{
		key: BattleFieldKey.濃霧の戦い,
		name: '濃霧の戦い',
		pointList: {
			0: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
			1: { point: 10, bonusRate: 1, hasAllPlayerBonus: false },
			2: { point: 2, bonusRate: 1, hasAllPlayerBonus: false },
			3: { point: 3, bonusRate: 1, hasAllPlayerBonus: false },
			4: { point: 4, bonusRate: 1, hasAllPlayerBonus: false },
			5: { point: 5, bonusRate: 1, hasAllPlayerBonus: false },
			6: { point: 6, bonusRate: 1, hasAllPlayerBonus: false },
			7: { point: 7, bonusRate: 1, hasAllPlayerBonus: false },
			8: { point: 8, bonusRate: 1, hasAllPlayerBonus: false },
			9: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
		},
	},
	{
		key: BattleFieldKey.洞窟の戦い,
		name: '洞窟の戦い',
		pointList: {
			0: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
			1: { point: 10, bonusRate: 1, hasAllPlayerBonus: true },
			2: { point: 2, bonusRate: 1, hasAllPlayerBonus: true },
			3: { point: 2, bonusRate: 1, hasAllPlayerBonus: true },
			4: { point: 2, bonusRate: 1, hasAllPlayerBonus: true },
			5: { point: 2, bonusRate: 1, hasAllPlayerBonus: true },
			6: { point: 2, bonusRate: 1, hasAllPlayerBonus: true },
			7: { point: 2, bonusRate: 1, hasAllPlayerBonus: true },
			8: { point: 2, bonusRate: 1, hasAllPlayerBonus: true },
			9: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
		},
	},
	{
		key: BattleFieldKey.ゲームマーケットの戦い,
		name: 'ゲームマーケットの戦い',
		pointList: {
			0: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
			1: { point: 10, bonusRate: 1, hasAllPlayerBonus: false },
			2: { point: 0, bonusRate: 1, hasAllPlayerBonus: false },
			3: { point: 0, bonusRate: 1, hasAllPlayerBonus: false },
			4: { point: 0, bonusRate: 1, hasAllPlayerBonus: false },
			5: { point: 0, bonusRate: 1, hasAllPlayerBonus: false },
			6: { point: 0, bonusRate: 1, hasAllPlayerBonus: false },
			7: { point: 0, bonusRate: 1, hasAllPlayerBonus: false },
			8: { point: 0, bonusRate: 1, hasAllPlayerBonus: false },
			9: { point: 1, bonusRate: 0, hasAllPlayerBonus: false },
		},
	},
] as const;

const calcWinningPoint = (winner: Player, gameData: GameData) => {
	if (gameData.settings.battleField === BattleFieldKey.崖の上の戦い) {
		return gake(winner, gameData);
	} else if (gameData.settings.battleField === BattleFieldKey.ゲームマーケットの戦い) {
		return gameMarket(winner, gameData);
	} else {
		return normal(winner, gameData);
	}
};

/**
 * 基本的な勝利点計算
 */
const normal = (winner: Player, gameData: GameData) => {
	const lastPlayTileNumber = winner.played[winner.played.length - 1].number;

	const pointList = battleFields.find((bf) => gameData.settings.battleField === bf.key)!.pointList;

	const point = pointList[lastPlayTileNumber].point;
	const bonusTargetPlayers = pointList.hasAllPlayerBonus ? gameData.players : [winner];

	const bonusPoint = bonusTargetPlayers.reduce((total, p) => {
		return total + calcBonus(p, pointList[lastPlayTileNumber].bonusRate);
	}, 0);

	return point + bonusPoint;
};

/**
 * 崖の上の戦い用の勝利点計算
 */
const gake = (winner: Player, gameData: GameData) => {
	const lastPlayTileNumber = winner.played[winner.played.length - 1].number;

	const pointList = battleFields.find((bf) => gameData.settings.battleField === bf.key)!.pointList;

	const bonus = calcBonus(winner, pointList[lastPlayTileNumber].bonusRate);
	if (lastPlayTileNumber === 1) {
		return 10 + bonus;
	}

	if (lastPlayTileNumber === 0 || lastPlayTileNumber === 9) {
		return 1;
	}

	if (winner.played[winner.played.length - 1].isForetold) {
		return 6 + bonus;
	} else {
		return 3 + bonus;
	}
};

/**
 * ゲームマーケットの戦い用の勝利点計算
 */
const gameMarket = (winner: Player, gameData: GameData) => {
	const lastAttackTileNumber = winner.played[winner.played.length - 2].number;
	const lastDefenseTileNumber = winner.played[winner.played.length - 1].number;

	const pointList = battleFields.find((bf) => gameData.settings.battleField === bf.key)!.pointList;

	const bonus = calcBonus(winner, pointList[lastDefenseTileNumber].bonusRate);

	if (lastDefenseTileNumber === 1) {
		return 10 + bonus;
	}

	if (
		lastAttackTileNumber === 0 ||
		lastAttackTileNumber === 9 ||
		lastDefenseTileNumber === 0 ||
		lastDefenseTileNumber === 9
	) {
		return 1;
	}

	return Math.abs(lastAttackTileNumber - lastDefenseTileNumber) + bonus;
};

const calcBonus = (player: Player, bonusRate: number) => {
	return player.played.filter((play) => play.isClosed).length * bonusRate;
};

export const winingPoint = {
	battleFields,
	calcWinningPoint,
};
