<script lang="ts">
	import Tile from '$lib/components/game/Tile.svelte';
</script>

<div class="title_area">
	<Tile tile="0" /> & <Tile tile="9" />
</div>

<style scoped>
	.title_area {
		height: 50dvh;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		font-weight: bold;
	}
</style>
