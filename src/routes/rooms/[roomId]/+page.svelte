<script lang="ts">
	import { joinRoom } from '$lib/class/room.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Title from '$lib/components/Title.svelte';

	const roomId = page.params.roomId;
	let name = $state('');

	const submit = async () => {
		const res = await joinRoom(roomId, name);
		goto(`/rooms/${roomId}/players/${res.memberId}`);
	};
</script>

<Title />

<form class="from_area" onsubmit={() => submit()}>
	<label for="name">名前</label>
	<input type="text" id="name" bind:value={name} />
	<button type="submit" disabled={!name}>ゲームに参加する</button>
</form>

<style scoped>
	.from_area {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
</style>
