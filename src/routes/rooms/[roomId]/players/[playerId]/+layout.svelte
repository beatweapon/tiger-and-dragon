<script lang="ts">
	import { setContext } from 'svelte';
	import { page } from '$app/state';
	import {
		room,
		subscribeRoom,
		startGame,
		setField,
		setIsTeamBattle,
		setIsAlternating,
		setReady,
	} from '$lib/class/room.svelte';
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
			<label>
				<input
					type="checkbox"
					checked={member.isReady}
					onchange={() => setReady(page.params.roomId, member.id, !member.isReady)}
				/>
				{member.name}
			</label>
		{/each}

		<div>
			<button onclick={copyRoomUrl}>部屋のURLをコピー</button>
		</div>
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
		<label>
			<input
				type="checkbox"
				checked={room.settings.isTeamBattle}
				disabled={Object.values(room.members).length !== 4}
				onchange={() => setIsTeamBattle(page.params.roomId, !room.settings.isTeamBattle)}
			/>
			チーム戦
		</label>

		<label>
			<input
				type="checkbox"
				checked={room.settings.isAlternating}
				disabled={Object.values(room.members).length !== 4}
				onchange={() => setIsAlternating(page.params.roomId, !room.settings.isAlternating)}
			/>
			席順交互
		</label>
	</div>

	<div>
		<button
			disabled={Object.values(room.members).length < 2}
			onclick={() => startGame(page.params.roomId)}>ゲームを開始する</button
		>
	</div>
{:else}
	{@render children()}
{/if}

<Regulation battleFieldKey={room.settings.battleField} />
