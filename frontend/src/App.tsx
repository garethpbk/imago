import "./App.css";
import Layout from "./components/Layout/Layout";
import ImageSetup from "./components/ImageSetup/ImageSetup";

function App() {
  return (
    <div id="App">
      <Layout>
        <h1 className="appTitle">ImaGo</h1>
        <ImageSetup />
      </Layout>
    </div>
  );
}

export default App;
