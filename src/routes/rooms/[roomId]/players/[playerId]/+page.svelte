<script lang="ts">
	import { getContext } from 'svelte';
	import { page } from '$app/state';
	import type { Room } from '$lib/class/room.svelte';
	import { resetGame } from '$lib/class/room.svelte';
	import { resetRound, play, pass, undo, getTeamMembers, canPlay } from '$lib/class/game';
	import Tile from '$lib/components/game/Tile.svelte';
	import { send, receive } from '$lib/animation/titleTransition';

	const room: Room = getContext('room');
	const roomId = page.params.roomId;
	const playerId = page.params.playerId;

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
			<button onclick={() => resetGame(roomId)}>もう一度遊ぶ</button>
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

		<div class="players_area">
			{#each room.gameData.players as player}
				<div
					class="player_area {player.id === room.gameData.currentPlayerId ? 'current_player' : ''}"
				>
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
						{#each player.played as tile, i (tile.id)}
							<div in:receive={{ key: tile.id }} out:send={{ key: tile.id }}>
								{#if tile.isClosed && (room.gameData.gamePhase !== 'playing' ? true : playerId === player.id)}
									<Tile tile="({tile.number})" />
								{:else}
									<Tile
										tile={tile.number}
										isClosed={tile.isClosed}
										isCurrent={room.gameData.lastAttack?.playerId === player.id &&
											i === player.played.length - 1}
									/>
								{/if}
							</div>
						{/each}
					</div>

					<div class="hand">
						{#each player.hand as tile, i (tile.id)}
							<div in:receive={{ key: tile.id }} out:send={{ key: tile.id }}>
								<button
									class="tile_button"
									disabled={playerId === player.id &&
										!!room.gameData.lastAttack?.playerId &&
										playerId !== room.gameData.lastAttack?.playerId &&
										playerId === room.gameData.currentPlayerId &&
										!canPlay(tile.number, room.gameData.lastAttack?.number)}
									onclick={() => playHand(roomId, i)}
								>
									<Tile
										tile={tile.number}
										isClosed={room.gameData.gamePhase !== 'playing'
											? false
											: playerId !== player.id}
									/>
								</button>
							</div>
						{/each}
						{#if player.id !== room.gameData.lastAttack?.playerId && playerId === room.gameData.currentPlayerId && player.id === room.gameData.currentPlayerId && room.gameData.playPhase === 'defend'}
							<button onclick={() => pass(roomId)}>パス</button>
						{/if}
						{#if player.played[player.played.length - 1].isClosed && playerId === room.gameData.currentPlayerId && player.id === room.gameData.currentPlayerId && room.gameData.playPhase === 'attack'}
							<button onclick={() => undo(roomId)}>戻す</button>
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

	.current_player {
		border: 0.5rem solid rgb(255, 123, 0);
	}

	@container (width > 700px) {
		.players_area {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 1fr 1fr;
		}
	}
</style>
