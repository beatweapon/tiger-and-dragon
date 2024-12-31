<script lang="ts">
	import { getContext } from 'svelte';
	import { page } from '$app/state';
	import type { Room } from '$lib/class/room.svelte';
	import { startGame } from '$lib/class/room.svelte';
	import { resetRound, play, pass, getTeamMembers, canDefend } from '$lib/class/game';
	import Tile from '$lib/components/game/Tile.svelte';

	const room: Room = getContext('room');
	const roomId = page.params.roomId;
	const playerId = page.params.playerId;

	const lastAttackerName = $derived.by(() => {
		const lastAttack = room.gameData?.lastAttack;
		if (!lastAttack) return '';

		return room.gameData?.players.find((player) => player.id === lastAttack.playerId)?.name;
	});

	const playHand = (roomId: string, i: number) => {
		if (room.gameData?.currentPlayerId !== playerId) return;

		play(roomId, i);
	};
</script>

<div class="play_area">
	{#if room.gameData}
		{#if room.gameData.gamePhase === 'gameSet'}
			<h2>ゲームセット</h2>
			<button onclick={() => resetRound(roomId)}>次のラウンド</button>
		{/if}

		{#if room.gameData.gamePhase === 'gameOver'}
			<h2>ゲームオーバー</h2>
			<button onclick={() => startGame(roomId)}>もう一度遊ぶ</button>
		{/if}

		<div class="team_area">
			{#each room.gameData.teams as team}
				<div class="team {team.isWinner ? 'winner' : ''}">
					<div class="team_name">
						{#each getTeamMembers(team) as player}
							<div class="player_name">{player.name}</div>
						{/each}
					</div>
					<div>
						Point: {getTeamMembers(team).reduce((sum, player) => sum + player.point, 0)}
					</div>
				</div>
			{/each}
		</div>

		<div class="latest_attack">
			<div>現在の攻撃</div>
			{lastAttackerName}の<Tile tile={room.gameData.lastAttack.tile} />
		</div>

		<div class="players_area">
			{#each room.gameData.players as player}
				<div class="player_area">
					<span class="player_name">{player.name}</span>
					{#if player.hand.length === 0}
						勝利
					{:else if player.id === room.gameData.currentPlayerId}
						{room.gameData.playPhase === 'attack' ? '👊' : '✋'}
					{/if}

					<div class="played">
						<div class="area_mark">👊</div>
						<div class="area_mark">✋</div>
						{#if !player.isStartingPlayer}
							<Tile tile="🔥" />
						{/if}
						{#each player.played as tile}
							{#if tile.isClosed && (room.gameData.gamePhase !== 'playing' ? true : playerId === player.id)}
								<Tile tile="({tile.number})" />
							{:else}
								<Tile tile={tile.number} isClosed={tile.isClosed} />
							{/if}
						{/each}
					</div>

					<div class="hand">
						{#each player.hand as tile, i}
							<button
								class="tile_button"
								disabled={playerId === room.gameData.currentPlayerId &&
									!canDefend(room.gameData.lastAttack, tile)}
								onclick={() => playHand(roomId, i)}
							>
								<Tile
									{tile}
									isClosed={room.gameData.gamePhase !== 'playing' ? false : playerId !== player.id}
								/>
							</button>
						{/each}
						{#if player.id !== room.gameData.lastAttack.playerId && playerId === room.gameData.currentPlayerId && player.id === room.gameData.currentPlayerId && room.gameData.playPhase === 'defend'}
							<button onclick={() => pass(roomId)}>パス</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<div>
			<div>余り牌</div>
			{#each room.gameData.remainingTiles as tile, i}
				<Tile {tile} isClosed={room.gameData.gamePhase !== 'playing' ? false : true} />
			{/each}
		</div>
	{:else}
		<p>ゲームデータがありません</p>
	{/if}
</div>

<style scoped>
	.play_area {
		container-type: inline-size;
	}

	.team_area {
		display: flex;
		padding: 1em;

		.team {
			padding: 1em;
			border: 1px solid black;
			border-radius: 4px;

			.team_name {
				font-weight: bold;
				display: flex;
				justify-content: space-between;
				gap: 0.5em;
			}
		}
	}

	.winner {
		color: red;
	}

	.player_area {
		padding: 1rem;
		border: 1px solid #fff;

		.player_name {
			font-weight: bold;
		}

		.tile_button {
			border: none;
			background-color: inherit;
			padding: 0;

			&:disabled {
				opacity: 0.5;
			}
		}

		.played {
			margin: 1rem;
			display: grid;
			grid-auto-flow: column;
			grid-template-columns: repeat(7, var(--tile-width));
			grid-template-rows: repeat(2, 1fr);

			.area_mark {
				display: flex;
				justify-content: center;
				align-items: center;
				width: var(--tile-width);
				height: var(--tile-height);
			}
		}

		.hand {
			margin: 1rem;
			display: flex;
		}
	}

	@container (width > 700px) {
		.players_area {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 1fr 1fr;
		}
	}
</style>
