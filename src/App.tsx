import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { decryptResponse } from "./utils/decryptorUtil";
import { getTopCompanies } from "./externalApis/levelsFyiClient";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ForgotPassword from "./users/components/ForgotPassword";
import SeekerDetailPage from "./public/pages/SeekerDetailPage";
import RecruiterDetailPage from "./public/pages/RecruiterDetailPage";
import WelcomePage from "./public/pages/WelcomePage";
import SearchPage from "./public/pages/SearchPage";
import SignInPage from "./users/pages/SignInPage";
import SignUpPage from "./users/pages/SignUpPage";
import Layout from "./layouts/ParentLayout";
import CreateRecruiter from "./recruiters/CreateRecruiter";
import CreateSeeker from "./seekers/CreateSeeker";

import CreateJobPosting from "./jobPostings/jobPosting";
import SeekerDetail from "./public/components/SeekerDetail";
import RecruiterDetail from "./public/components/RecruiterDetail";


function App() {
  const test = () => {
    let payload =
      "PGF/4hzKuy89+4RiRL0I/FNOde3SCoZvSJHnCnvdPtOUbWkCh9LrNVXSDDUkchmE8HR9MUYeGpTAv9LCp6fVDjdQXuezZQk2bR4yWFP9PktIuKqngYCnSibUlz1ZzwlAeW3GWyFWLHRYKR5r5qMjqIQnT2Z3xL53sq9crdRlrH5yR2Kk05xid8/fdQvMQFKUnc81BZD8z70nRBfMplORE7nBrArCKiNPXN43E6+GVzM=";

    console.log(decryptResponse({ payload: payload }));
  };

  const testApiCall = async () => {
    const res = await getTopCompanies();
    console.log(res);
  };

  return (
    <div className="App">
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/seekers/:username" element={<SeekerDetailPage />} />
            <Route path="/recruiters/:username" element={<RecruiterDetailPage />} />
            <Route path="/jobPosting" element={<CreateJobPosting />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/create-recruiter" element={<CreateRecruiter />} />
            <Route path="/create-seeker" element={<CreateSeeker />} />
            <Route path="/seekerDetail" element={<SeekerDetail />} />
            <Route path="/recruiterDetail" element={<RecruiterDetail />} />
          </Routes>
        </BrowserRouter>
      </Layout>
    </div>
  );
}

export default App;
