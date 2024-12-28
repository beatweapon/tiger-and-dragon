<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { RoomSettings } from '$lib/class/room';
	import { Game } from '$lib/class/game';
	import { writable } from 'svelte/store';
	import Tile from '$lib/components/game/Tile.svelte';

	const room: Writable<RoomSettings> = getContext('room');
	const gameClass = new Game($room);
	const game = writable(gameClass);

	game.update((g) => {
		g.resetRound();
		return g;
	});

	const newGame = () => {
		game.update((g) => {
			g.newGame($room);
			return g;
		});
	};

	const resetRound = () => {
		game.update((g) => {
			g.resetRound();
			return g;
		});
	};

	const play = (index: number) => {
		game.update((g) => {
			g.play(index);
			return g;
		});
	};

	const pass = () => {
		game.update((g) => {
			g.pass();
			return g;
		});
	};
</script>

<h1>竜虎相搏つ -ゲーム画面-</h1>

{#if $game.data.gamePhase === 'gameSet'}
	<h2>ゲームセット</h2>
	<button onclick={() => resetRound()}>次のラウンド</button>
{/if}

{#if $game.data.gamePhase === 'gameOver'}
	<h2>ゲームオーバー</h2>
	<button onclick={() => newGame()}>もう一度遊ぶ</button>
{/if}

{#each $game.data.teams as team, i}
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

{#each $game.data.players as player}
	<h2>
		{player.name}
		{#if player.hand.length === 0}
			勝利
		{:else if player.id === $game.data.currentPlayerId}
			(あなたの{$game.data.playPhase === 'attack' ? '攻め' : '守り'}ターンです)
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
			<button class="tile_button" onclick={() => play(i)}>
				<Tile {tile} />
			</button>
		{/each}
		{#if player.id !== $game.data.lastAttack.playerId && player.id === $game.data.currentPlayerId && $game.data.playPhase === 'defend'}
			<button onclick={pass}>パス</button>
		{/if}
	</div>
{/each}

{#each $game.data.remainingTiles as tile, i}
	<Tile {tile} isClosed />
{/each}

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
