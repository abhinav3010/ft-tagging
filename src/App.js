import "./App.css";
import TaggableImage from "./Components/taggable-image/index";
import SampleImageUrl from "./group-sample.jpeg";

function App() {
  return (
    <div className="App">
      <TaggableImage src={SampleImageUrl} />
    </div>
  );
}

export default App;
