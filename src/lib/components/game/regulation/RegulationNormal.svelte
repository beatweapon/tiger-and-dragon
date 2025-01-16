<script lang="ts">
	import type { BattleField } from '$lib/logic/game/winingPoint';
	import Tile from '$lib/components/game/Tile.svelte';

	interface Props {
		battleField: BattleField;
	}

	const { battleField }: Props = $props();

	const pointList = $derived.by(() => {
		const pointList: Record<string, number[]> = {};
		Array.from({ length: 10 }, (_, i) => i).forEach((i) => {
			const key = `${battleField?.pointList[i].point} + bonus * ${battleField?.pointList[i].bonusRate}`;
			if (pointList[key]) {
				pointList[key].push(i);
			} else {
				pointList[key] = [i];
			}
		});

		return pointList;
	});
</script>

<div class="point_list">
	{#each Object.entries(pointList) as [key, value]}
		<div>
			{#each value as v}
				<Tile tile={v} />
			{/each}
			{key}
		</div>
	{/each}
</div>
