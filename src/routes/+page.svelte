<script lang="ts">
	import { createRoom } from '$lib/class/room.svelte';
	import { goto } from '$app/navigation';
	import Title from '$lib/components/Title.svelte';
	let name = $state('');

	const submit = async () => {
		const res = await createRoom(name);
		goto(`/rooms/${res.roomId}/players/${res.memberId}`);
	};
</script>

<Title />

<form class="from_area" onsubmit={() => submit()}>
	<label for="name">名前</label>
	<input type="text" id="name" bind:value={name} />
	<button type="submit" disabled={!name}>ゲームを始める</button>
</form>

<style scoped>
	.from_area {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
</style>
