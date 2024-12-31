<script lang="ts">
	interface Props {
		tile: number | string;
		isClosed?: boolean;
	}
	const { tile, isClosed }: Props = $props();

	const isOdd = $derived.by(() => {
		if (typeof tile === 'string') return Number(tile.replace(/[^0-9]/g, '')) % 2 !== 0;
		return typeof tile === 'number' && tile % 2 !== 0;
	});

	const isEven = $derived.by(() => {
		if (typeof tile === 'string') return Number(tile.replace(/[^0-9]/g, '')) % 2 === 0;
		return typeof tile === 'number' && tile % 2 === 0;
	});
</script>

<div class="tile" class:odd={isOdd} class:even={isEven}>
	{#if isClosed}
		<span></span>
	{:else if tile === 0}
		🐅
	{:else if tile === 9}
		🐉
	{:else}
		{tile}
	{/if}
</div>

<style scoped>
	.tile {
		font-weight: bold;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: var(--tile-width);
		height: var(--tile-height);
		box-sizing: border-box;
		border: 1px solid black;
		background-color: white;
		border-radius: 4px;
	}

	.odd {
		color: var(--odd-color);
	}

	.even {
		color: var(--even-color);
	}
</style>
