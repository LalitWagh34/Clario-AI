import { BrowserRouter, Routes ,Route } from "react-router";
import Auth from "./Pages/Auth";
import Dashboard from "./Pages/Dashboard"
import Terms from "./Pages/Terms";
import Privacy from "./Pages/Privacy";
export function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/auth" element={<Auth/>}/>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/terms" element={<Terms />} />
<Route path="/privacy" element={<Privacy />} />
    </Routes>
   </BrowserRouter>
  );
}

export default App;
