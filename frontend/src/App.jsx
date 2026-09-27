import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SkillGapDashboard from './components/SkillGapDashboard';
import CourseCatalog from './components/CourseCatalog';
import JobMatcher from './components/JobMatcher';
import ResumeEnhancer from './components/ResumeEnhancer';
import MockInterview from './components/MockInterview';
import GovtOpportunities from './components/GovtOpportunities';
import ProfileUploadModal from './components/ProfileUploadModal';
import OnboardingSurveyModal from './components/OnboardingSurveyModal';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import AuthPage from './components/AuthPage';
import { logoutSession } from './services/auth';
import { analyzeStudentProfile } from './services/gemini';

export default function App() {
  const [activeTab,setActiveTab]=useState('dashboard');
  const [apiKey,setApiKey]=useState('');
  const [theme,setTheme]=useState('light');
  const [session,setSession]=useState({isAuthenticated:false,user:null,token:null});
  const [currentToken,setCurrentToken]=useState(null);
  const [studentProfile,setStudentProfile]=useState(null);
  const [aiAnalysis,setAiAnalysis]=useState(null);
  const [isAnalyzing,setIsAnalyzing]=useState(false);
  const [isProfileModalOpen,setIsProfileModalOpen]=useState(false);
  const [isSurveyOpen,setIsSurveyOpen]=useState(false);
  const [isLoginModalOpen,setIsLoginModalOpen]=useState(false);

  const runAiAnalysis=async(profileToAnalyze=studentProfile)=>{
    if(!profileToAnalyze||profileToAnalyze.role==='admin')return;
    setIsAnalyzing(true);
    const profileSummaryText=`Student: ${profileToAnalyze.name} (${profileToAnalyze.degree}, CGPA: ${profileToAnalyze.cgpa})
Sector: ${profileToAnalyze.sector||'technical'}
Target Role: ${profileToAnalyze.targetRole}
Current Skills: ${profileToAnalyze.skills?profileToAnalyze.skills.map(s=>`${s.name}: ${s.level}/100`).join(', '):''}
Academic History: ${profileToAnalyze.academicHistory?profileToAnalyze.academicHistory.map(h=>`${h.subject} (${h.grade})`).join(', '):''}
Resume: ${profileToAnalyze.resumeText}`;
    const result=await analyzeStudentProfile(profileSummaryText,profileToAnalyze.targetRole,apiKey,profileToAnalyze);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  useEffect(()=>{if(studentProfile&&studentProfile.role!=='admin')runAiAnalysis()},[studentProfile?.id,studentProfile?.targetRole,studentProfile?.sector,apiKey]);

  const handleSelectTargetRole=newRole=>{const updated={...studentProfile,targetRole:newRole};setStudentProfile(updated);runAiAnalysis(updated)};
  const handleSaveProfile=updated=>{setStudentProfile(updated);runAiAnalysis(updated)};
  const handleCompleteSurvey=updated=>{setStudentProfile(updated);runAiAnalysis(updated)};
  const handleAuthSuccess=(user,token)=>{
    setCurrentToken(token);setStudentProfile(user);setSession({isAuthenticated:true,user,token});
    if(user.role==='admin')setActiveTab('admin-analytics');else{setActiveTab('dashboard');setIsSurveyOpen(true)}
  };
  const handleLogout=()=>{logoutSession();setSession({isAuthenticated:false,user:null,token:null});setCurrentToken(null);setStudentProfile(null)};

  if(!session?.isAuthenticated||!studentProfile)return <AuthPage onAuthSuccess={handleAuthSuccess}/>;
  const isAdmin=studentProfile?.role==='admin';

  return <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme==='light'?'app-light bg-[#DFDFE3] text-slate-900':'app-dark bg-slate-950 text-slate-100'}`}>
    <Header currentUser={studentProfile} onOpenLoginModal={()=>setIsLoginModalOpen(true)} onLogout={handleLogout} onOpenProfileModal={()=>setIsProfileModalOpen(true)} onOpenSurveyModal={()=>setIsSurveyOpen(true)} theme={theme} setTheme={setTheme}/>
    <div className="flex flex-1 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onOpenProfileModal={()=>setIsProfileModalOpen(true)} onOpenSurveyModal={()=>setIsSurveyOpen(true)} currentUser={studentProfile}/>
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
        {isAdmin?<AdminDashboard onSelectStudent={student=>{setStudentProfile(student);setActiveTab('dashboard')}}/>:<>
          {(activeTab==='dashboard'||activeTab==='skill-matrix')&&<SkillGapDashboard studentProfile={studentProfile} aiAnalysis={aiAnalysis} onSelectTargetRole={handleSelectTargetRole} onNavigateTab={setActiveTab} isAnalyzing={isAnalyzing} onReAnalyze={()=>runAiAnalysis()} onOpenSurveyModal={()=>setIsSurveyOpen(true)} theme={theme}/>}
          {activeTab==='courses'&&<CourseCatalog aiAnalysis={aiAnalysis}/>}
          {activeTab==='jobs'&&<JobMatcher studentProfile={studentProfile}/>}
          {activeTab==='resume'&&<ResumeEnhancer studentProfile={studentProfile} apiKey={apiKey}/>}
          {activeTab==='mock-interview'&&<MockInterview studentProfile={studentProfile} apiKey={apiKey}/>}
          {activeTab==='govt-opportunities'&&<GovtOpportunities/>}
        </>}
      </main>
    </div>
    <OnboardingSurveyModal isOpen={isSurveyOpen} onClose={()=>setIsSurveyOpen(false)} studentProfile={studentProfile} onCompleteSurvey={handleCompleteSurvey}/>
    <ProfileUploadModal isOpen={isProfileModalOpen} onClose={()=>setIsProfileModalOpen(false)} studentProfile={studentProfile} onSaveProfile={handleSaveProfile}/>
    <LoginModal isOpen={isLoginModalOpen} onClose={()=>setIsLoginModalOpen(false)} currentToken={currentToken} onLoginSuccess={handleAuthSuccess}/>
  </div>;
}
