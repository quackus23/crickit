export default function Game(props: { game: GameType }) {
  return <div class="flex-column">{props.game.name}</div>;
}
