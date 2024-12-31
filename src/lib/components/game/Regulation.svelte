<script lang="ts">
	import { winingPoint } from '$lib/logic/game/winingPoint';
	import type { BattleFieldKey } from '$lib/logic/game/winingPoint';
	import Tile from '$lib/components/game/Tile.svelte';

	interface Props {
		battleFieldKey: BattleFieldKey;
	}

	const { battleFieldKey }: Props = $props();

	const battleField = winingPoint.battleFields.find((bf) => bf.key === battleFieldKey);

	const pointList: Record<string, number[]> = {};
	Array.from({ length: 10 }, (_, i) => i).forEach((i) => {
		const key = `${battleField?.pointList[i].point} + bonus * ${battleField?.pointList[i].bonusRate}`;
		if (pointList[key]) {
			pointList[key].push(i);
		} else {
			pointList[key] = [i];
		}
	});
</script>

<div class="regulation">
	{#if battleField}
		<h2>{battleField.name}</h2>
		{#each Object.entries(pointList) as [key, value]}
			<div>
				{#each value as v}
					<Tile tile={v} />
				{/each}
				{key}
			</div>
		{/each}
	{/if}
</div>
