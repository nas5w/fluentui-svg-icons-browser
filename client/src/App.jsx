import icons from "./icons.json";
import "./App.css";
import { useEffect, useRef, useState } from "react";

// Need to do some variant cleanup
const iconMap = {};

for (const icon of icons) {
  const parts = icon.split("_");
  const fill = parts.pop().replace(".svg", "");
  const size = parts.pop();
  const name = parts.join("_");
  if (!iconMap[name]) {
    iconMap[name] = { name, sizes: new Set(), fills: new Set() };
  }
  iconMap[name].sizes.add(parseInt(size));
  iconMap[name].fills.add(fill);
}

// Now compute the best image for each
const iconSet = Object.values(iconMap).map((icon) => {
  const size = icon.sizes.has(28) ? 28 : Math.max(...icon.sizes);
  return { ...icon, src: (f) => `${icon.name}_${size}_${f}.svg` };
});

export default function App() {
  const [input, setInput] = useState("");
  const [scrolls, setScrolls] = useState(1);
  const [fill, setFill] = useState("regular");
  const listRef = useRef();

  const filteredIcons = iconSet.filter(
    (icon) =>
      icon.fills.has(fill) &&
      icon.name.toLowerCase().includes(input.toLowerCase())
  );

  useEffect(() => {
    const list = listRef.current;

    const listener = (e) => {
      if (list.scrollHeight < e.target.scrollTop + list.clientHeight + 50) {
        setScrolls((s) => s + 1);
      }
    };

    list?.addEventListener("scroll", listener);
    return () => {
      list?.removeEventListener("scroll", listener);
    };
  }, [listRef]);

  return (
    <div className="App">
      <header>
        <div className="controls">
          <input
            className="search"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder="Find icon..."
          />
          <label>
            <input
              name="fills"
              type="radio"
              checked={fill === "regular"}
              onChange={() => {
                setFill("regular");
              }}
            ></input>{" "}
            Regular
          </label>
          <label>
            <input
              name="fills"
              type="radio"
              checked={fill === "filled"}
              onChange={() => {
                setFill("filled");
              }}
            ></input>{" "}
            Filled
          </label>
        </div>
        <h1>@fluentui/svg-icons</h1>
      </header>
      <ul ref={listRef} className="icon-list">
        {filteredIcons.slice(0, 200 * scrolls).map((icon) => (
          <li key={icon.name}>
            <div>
              {icon.name.replace(".svg", "")}
              <span>
                Sizes: {[...icon.sizes].join(", ")}
                <br />
                Fills: {[...icon.fills].join(", ")}
              </span>
            </div>
            <span>
              <img src={`/${icon.src(fill)}`} loading="lazy" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
