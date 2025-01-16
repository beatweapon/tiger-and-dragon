<script lang="ts">
	import { setContext } from 'svelte';
	import { page } from '$app/state';
	import { room, subscribeRoom, startGame, setField } from '$lib/class/room.svelte';
	import Regulation from '$lib/components/game/regulation/Regulation.svelte';
	import { winingPoint } from '$lib/logic/game/winingPoint';

	let { children } = $props();
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

	<div>
		<h2>戦場リスト</h2>

		{#each winingPoint.battleFields as field}
			<button onclick={() => setField(page.params.roomId, field.key)}>
				{field.name}
			</button>
		{/each}
	</div>

	<div>
		<button
			disabled={Object.values(room.members).length > 1}
			onclick={() => startGame(page.params.roomId)}>ゲームを開始する</button
		>
	</div>
{:else}
	{@render children()}
{/if}

<Regulation battleFieldKey={room.settings.battleField} />
