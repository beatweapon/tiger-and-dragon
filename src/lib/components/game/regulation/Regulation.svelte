<script lang="ts">
	import { winingPoint } from '$lib/logic/game/winingPoint';
	import { BattleFieldKey } from '$lib/logic/game/winingPoint';
	import RegulationNormal from './RegulationNormal.svelte';

	interface Props {
		battleFieldKey: BattleFieldKey;
	}

	const { battleFieldKey }: Props = $props();

	const battleField = $derived(winingPoint.battleFields.find((bf) => bf.key === battleFieldKey));
</script>

<div class="regulation">
	{#if battleField}
		<h2>{battleField.name}</h2>
		{#if battleField.key === BattleFieldKey.崖の上の戦い}
			<div>開発中</div>
		{:else if battleField.key === BattleFieldKey.ゲームマーケットの戦い}
			<div>開発中</div>
		{:else}
			<RegulationNormal {battleField} />
		{/if}
	{/if}
</div>
