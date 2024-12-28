<script lang="ts">
	import { joinRoom } from '$lib/class/room';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	const roomId = $page.params.roomId;
	let name = $state('');

	const submit = async () => {
		const res = await joinRoom(roomId, name);
		goto(`/rooms/${roomId}/players/${res.memberId}`);
	};
</script>

<h1>竜虎相搏つ</h1>

<form onsubmit={() => submit()}>
	<label for="name">名前</label>
	<input type="text" id="name" bind:value={name} />
	<button type="submit">ゲームに参加する</button>
</form>
