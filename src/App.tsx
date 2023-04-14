import {
  Component,
  createEffect,
  createMemo,
  createReaction,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  Suspense,
} from "solid-js";
import logo from "./logo.svg";
import styles from "./App.module.css";
import Game from "./components/Game/Game";

async function fetchData() {
  const url = `https://api.cricapi.com/v1/currentMatches?apikey=${
    import.meta.env.VITE_API_KEY
  }&offset=0`;
  const data = await fetch(url);
  const jsonData = await data.json();
  console.log(jsonData);
  return jsonData.data as GameType[];
}
function getMonthString(month: number) {
  let monthString = month.toString();
  for (let i = 0; i < 2 - monthString.length; i++) {
    monthString = "0" + monthString;
  }
  return monthString;
}
const App: Component = () => {
  const [data, { mutate, refetch }] = createResource(fetchData);
  const sortedData = createMemo(() => {
    const stuff = data();
    if (stuff == undefined) return;
    return stuff?.filter((element) => {
      const currentDate = new Date();
      const timeString = `${currentDate.getFullYear()}-${getMonthString(
        currentDate.getMonth() + 1
      )}-${currentDate.getDate()}`;
      if (element.date != timeString) return false;
      return true;
    });
  });
  const [index, setIndex] = createSignal(0);
  let interval: number;
  onMount(() => {
    interval = setInterval(() => {
      const ind = index();
      if (sortedData() == undefined) {
        return;
      }
      if (ind > sortedData()!.length - 2) {
        setIndex(0);
        return;
      }
      setIndex(ind + 1);
    }, 1000);
  });
  onCleanup(() => {
    clearInterval(interval);
  });
  createEffect(() => {
    console.log("data", data());
    console.log(sortedData()![index()]);
  });
  return (
    <div class={styles.App}>
      <Show when={sortedData() != undefined}>
        <div
          style={{
            display: "flex",
            "flex-direction": "row",
            "justify-content": "center",
          }}
        >
          {/* <header class={styles.header}>{sortedData()![index()].name}</header> */}
        </div>
        <Game game={sortedData()![index()]} />
      </Show>
    </div>
  );
};

export default App;
