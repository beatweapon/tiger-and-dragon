<script lang="ts">
	import { setContext } from 'svelte';
	import { page } from '$app/state';
	import { room, subscribeRoom, startGame } from '$lib/class/room.svelte';
	import Regulation from '$lib/components/game/Regulation.svelte';

	subscribeRoom(page.params.roomId);

	setContext('room', room);

	const copyRoomUrl = () => {
		navigator.clipboard.writeText(`${location.origin}/rooms/${page.params.roomId}/`);

		alert('URLをコピーしました');
	};
</script>

{#if room.state === 'standBy'}
	<h1>竜虎相搏つ -待機画面-</h1>
	<h2>参加メンバー</h2>

	<div>
		{#each Object.values(room.members) as member}
			<div>{member.name}</div>
		{/each}

		<button onclick={copyRoomUrl}>部屋のURLをコピー</button>
	</div>

	<button
		disabled={Object.values(room.members).length > 1}
		onclick={() => startGame(page.params.roomId)}>ゲームを開始する</button
	>
{:else}
	<slot />
{/if}

<Regulation battleFieldKey={room.settings.battleField} />
