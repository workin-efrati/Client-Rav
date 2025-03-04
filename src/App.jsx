import { BrowserRouter, Routes, Route } from "react-router-dom";
import Years from "./pages/Years"
import Months from "./pages/Months";
import Days from "./pages/Days";
import AllQuestions from "./pages/AllQuestions";
import Match from "./pages/Match";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Years />} />
        <Route path="/:year">
          <Route index element={<Months />} />
          <Route path="/:year/:month">
            <Route index element={<Days />} />
            <Route path="/:year/:month/:day">
              <Route index element={<AllQuestions />} />
              <Route path="/:year/:month/:day/:id">
                <Route index element={<Match />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter >
  )
}

export default App
