<script lang="ts">
	import { createRoom } from '$lib/class/room.svelte';
	import { goto } from '$app/navigation';
	let name = $state('');

	const submit = async () => {
		const res = await createRoom(name);
		goto(`/rooms/${res.roomId}/players/${res.memberId}`);
	};
</script>

<h1>竜虎相搏つ</h1>

<form onsubmit={() => submit()}>
	<label for="name">名前</label>
	<input type="text" id="name" bind:value={name} />
	<button type="submit">ゲームを始める</button>
</form>
