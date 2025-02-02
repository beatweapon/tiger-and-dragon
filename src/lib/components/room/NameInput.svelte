<script lang="ts">
	import { setName } from '$lib/class/room.svelte';

	interface Props {
		roomId: string;
		playerId: string;
		name: string;
	}
	const { roomId, playerId, name }: Props = $props();

	let newName = $state(name);
</script>

<div>
	<input bind:value={newName} />
	<button onclick={() => setName(roomId, playerId, newName)}>名前変更</button>
</div>
