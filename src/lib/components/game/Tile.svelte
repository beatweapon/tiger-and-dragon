<script lang="ts">
	interface Props {
		tile: number | string;
		isClosed?: boolean;
		isCurrent?: boolean;
	}
	const { tile, isClosed, isCurrent }: Props = $props();

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

<div class="tile" class:current={isCurrent} class:odd={isOdd} class:even={isEven}>
	{#if isClosed}
		<span></span>
	{:else}
		<span class="char">{tileString}</span>
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

	.current {
		border: 0.3rem solid rgb(255, 123, 0);
	}

	.odd {
		.char {
			background-color: var(--odd-color);
			background-clip: text;
			color: transparent;
			text-shadow: 0 0 0 var(--odd-color);
		}
	}

	.even {
		.char {
			background-color: var(--even-color);
			background-clip: text;
			color: transparent;
			text-shadow: 0 0 0 var(--even-color);
		}
	}
</style>
