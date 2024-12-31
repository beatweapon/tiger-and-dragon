<script lang="ts">
	interface Props {
		tile: number | string;
		isClosed?: boolean;
	}
	const { tile, isClosed }: Props = $props();

	const tileNum = $derived.by(() => {
		if (typeof tile === 'string') {
			const replaced = tile.replace(/[^0-9]/g, '');
			if (replaced === '') return;
			return Number(replaced);
		}
		return tile;
	});

	const isOdd = $derived.by(() => {
		if (tileNum == null) return;
		return tileNum % 2 !== 0;
	});

	const isEven = $derived.by(() => {
		if (tileNum == null) return;
		return tileNum % 2 === 0;
	});

	const tileString = $derived(String(tile).replace(/0/g, '🐅').replace(/9/g, '🐉'));
</script>

<div class="tile" class:odd={isOdd} class:even={isEven}>
	{#if isClosed}
		<span></span>
	{:else}
		{tileString}
	{/if}
</div>

<style scoped>
	.tile {
		font-size: 1rem;
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
		color: transparent;
		text-shadow: 0 0 0 var(--odd-color);
	}

	.even {
		color: transparent;
		text-shadow: 0 0 0 var(--even-color);
	}
</style>
