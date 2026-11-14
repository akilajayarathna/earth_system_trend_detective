import { Routes, Route } from "react-router";
import Layout from "../layout/Layout.jsx";
import HomePage from "../pages/HomePage.jsx";
import SelectionPage from "../pages/SelectionPage.jsx";
import RowEvidence from "../pages/RowEvidence.jsx";
import Trend from "../pages/Trend.jsx";
import Verdict from "../pages/Verdict.jsx";
import Compare from "../pages/Compare.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/choose" element={<SelectionPage />} />
        <Route path="/raw-evidence" element={<RowEvidence />} />
        <Route path="/trend" element={<Trend />} />
        <Route path="/verdict" element={<Verdict />} />
        <Route path="/compare" element={<Compare />} />
      </Route>
    </Routes>
  );
}