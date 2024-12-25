<script lang="ts">
	import { Game } from '$lib/class/game';
	import { writable } from 'svelte/store';
	import Tile from '$lib/components/game/Tile.svelte';

	const gameClass = new Game();
	const game = writable(gameClass);

	game.update((g) => {
		g.newGame();
		return g;
	});

	const newGame = () => {
		game.update((g) => {
			g.newGame();
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
	<h1>ゲームセット</h1>
	<button onclick={() => newGame()}>もう一度</button>
{/if}

{#each $game.data.players as player}
	<h1>
		{player.name} Point: {player.point}
		{#if player.id === $game.data.currentPlayerId}
			(あなたの{$game.data.playPhase === 'attack' ? '攻め' : '守り'}ターンです)
		{/if}
	</h1>

	<div class="played">
		{#if !player.isStartingPlayer}
			<Tile tile="🔥" />
		{/if}
		{#each player.played as tile, i}
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

<p class="tile">{$game.data.remainingTiles}</p>

<style>
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
