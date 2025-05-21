import DataTable from "./components/DataTable/DataTable.tsx"
import SearchComponent from "./components/SearchComponent/SearchComponent.tsx"
import './App.css'

function App() {

  return (
    <div className="app">
      <SearchComponent/>
      <DataTable/>
    </div>
  )
}

export default App
