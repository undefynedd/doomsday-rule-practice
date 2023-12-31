import { createSignal } from "solid-js";
import { getNewRecord, getStoredRecords, getTimeDiffInSeconds } from "./utils";
import { Options, Record, Weekday, InputMode } from "./models";
import { A } from "@solidjs/router";

function App() {
  const [records, setRecords] = createSignal<Record[]>(getStoredRecords());
  const [curRecord, setCurRecord] = createSignal<Record>(getNewRecord());
  const [inputValue, setInputValue] = createSignal("Day of week (0-6)");

  const options: Options = {
    inputMode: InputMode.TextInput,
    blindTime: 0,
  };

  function handleSubmit() {
    if (inputValue() === "r") {
      setCurRecord(getNewRecord());
      setInputValue("");
      return;
    }

    let day: Weekday = parseInt(inputValue());
    if (isNaN(day) || day < 0 || day > 7) {
      return;
    }

    day = day % 7;

    let record: Record = {
      ...curRecord(),
      endTime: new Date(),
      givenAnswer: day,
    };

    if (day !== record.targetDate.getDay()) {
      alert("Incorrect, was " + Weekday[record.targetDate.getDay()]);
    }

    setRecords([record, ...records()]);
    setCurRecord(getNewRecord());
    setInputValue("Day of week (0-6)");
    localStorage.setItem("records", JSON.stringify(records()));
  }

  setInterval(() => {
    setCurRecord({
      ...curRecord(),
      endTime: new Date(),
    });
  }, 1);

  addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
    if (parseInt(e.key) >= 0 && parseInt(e.key) <= 7) {
      setInputValue(e.key);
    }
    if (e.key === "r") {
      setInputValue(e.key);
    }
  });

  return (
    <>
      <h1>Doomsday Rule</h1>
      <div class="links">
        <A href="/stats">Stats</A>
        <A href="/options">Options</A>
      </div>

      <div id="center-thingy">
        <h2>{curRecord().targetDate.toISOString().slice(0, 10)}</h2>
        {options.inputMode === InputMode.TextInput && (
          <div
            class={"input" + (inputValue().length !== 1 ? " placeholder" : "")}
          >
            {inputValue()}
          </div>
        )}
        {getTimeDiffInSeconds(
          curRecord().startTime,
          curRecord().endTime,
        ).toFixed(3)}
        s
      </div>
    </>
  );
}

export default App;
