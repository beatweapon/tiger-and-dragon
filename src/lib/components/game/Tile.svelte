<script lang="ts">
	interface Props {
		tile: number | string;
		isClosed?: boolean;
	}
	let { tile, isClosed }: Props = $props();

	const isOdd = $derived.by(() => {
		return typeof tile === 'number' && tile % 2 !== 0;
	});

	const isEven = $derived.by(() => {
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

<style>
	.tile {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 60px;
		height: 80px;
		box-sizing: border-box;
		border: 1px solid black;
		background-color: white;
		border-radius: 4px;
	}

	.odd {
		color: red;
	}

	.even {
		color: blue;
	}
</style>
