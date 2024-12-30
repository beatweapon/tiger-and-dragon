<script lang="ts">
	import { getContext } from 'svelte';
	import { page } from '$app/state';
	import type { Room } from '$lib/class/room.svelte';
	import { startGame } from '$lib/class/room.svelte';
	import { resetRound, play, pass } from '$lib/class/game';
	import Tile from '$lib/components/game/Tile.svelte';

	const room: Room = getContext('room');
	const roomId = page.params.roomId;
</script>

<h1>竜虎相搏つ -ゲーム画面-</h1>
{#if room.gameData}
	{#if room.gameData.gamePhase === 'gameSet'}
		<h2>ゲームセット</h2>
		<button onclick={() => resetRound(roomId)}>次のラウンド</button>
	{/if}

	{#if room.gameData.gamePhase === 'gameOver'}
		<h2>ゲームオーバー</h2>
		<button onclick={() => startGame(roomId)}>もう一度遊ぶ</button>
	{/if}

	{#each room.gameData.teams as team, i}
		<h2 class={team.isWinner ? 'winner' : ''}>
			<div>
				{#each team.players as player}
					{player.name}
				{/each}
			</div>
			<div>
				Point: {team.players.reduce((sum, player) => sum + player.point, 0)}
			</div>
		</h2>
	{/each}

	{#each room.gameData.players as player}
		<h2>
			{player.name}
			{#if player.hand.length === 0}
				勝利
			{:else if player.id === room.gameData.currentPlayerId}
				(あなたの{room.gameData.playPhase === 'attack' ? '攻め' : '守り'}ターンです)
			{/if}
		</h2>

		<div class="played">
			{#if !player.isStartingPlayer}
				<Tile tile="🔥" />
			{/if}
			{#each player.played as tile}
				<Tile tile={tile.number} isClosed={tile.isClosed} />
			{/each}
		</div>

		<div class="hand">
			{#each player.hand as tile, i}
				<button class="tile_button" onclick={() => play(roomId, i)}>
					<Tile {tile} />
				</button>
			{/each}
			{#if player.id !== room.gameData.lastAttack.playerId && player.id === room.gameData.currentPlayerId && room.gameData.playPhase === 'defend'}
				<button onclick={() => pass(roomId)}>パス</button>
			{/if}
		</div>
	{/each}

	{#each room.gameData.remainingTiles as tile, i}
		<Tile {tile} isClosed />
	{/each}
{:else}
	<p>ゲームデータがありません</p>
{/if}

<style>
	.winner {
		color: red;
	}

	.tile_button {
		border: none;
		background-color: inherit;
	}

	.played {
		margin: 2rem;
		display: grid;
		grid-auto-flow: column;
		grid-template-columns: repeat(7, 60px);
		grid-template-rows: repeat(2, 1fr);
	}
</style>
