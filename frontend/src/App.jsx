import { useEffect,useState } from 'react';
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
import { getStoredSession,logoutSession,verifySession,updateProfile } from './services/auth';
import { analyzeStudentProfile } from './services/gemini';

export default function App() {
  const [activeTab,setActiveTab]=useState('dashboard');
  const [theme,setTheme]=useState('light');
  const [session,setSession]=useState({isAuthenticated:false,user:null,token:null});
  const [studentProfile,setStudentProfile]=useState(null);
  const [aiAnalysis,setAiAnalysis]=useState(null);
  const [isAnalyzing,setIsAnalyzing]=useState(false);
  const [isProfileModalOpen,setIsProfileModalOpen]=useState(false);
  const [isSurveyOpen,setIsSurveyOpen]=useState(false);
  const [isLoginModalOpen,setIsLoginModalOpen]=useState(false);
  const [booting,setBooting]=useState(true);

  useEffect(()=>{
    const restore=async()=>{
      const stored=getStoredSession();
      if(!stored.user){setBooting(false);return;}
      const result=await verifySession();
      if(result.success&&result.user){setSession({isAuthenticated:true,user:result.user,token:null});setStudentProfile(result.user);setActiveTab(result.user.role==='admin'?'admin-analytics':'dashboard');}
      else await logoutSession();
      setBooting(false);
    };
    restore();
  },[]);

  const runAiAnalysis=async(profile)=>{
    if(!profile||profile.role==='admin')return;
    setIsAnalyzing(true);
    const summary=`Student: ${profile.name} (${profile.degree}, CGPA: ${profile.cgpa})
Target Role: ${profile.targetRole}
Current Skills: ${(profile.skills||[]).map(s=>`${s.name}: ${s.level}/100`).join(', ')}
Resume: ${profile.resumeText||''}`;
    const result=await analyzeStudentProfile(summary,profile.targetRole,'',profile);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleAuthSuccess=(user,token)=>{
    setSession({isAuthenticated:true,user,token});
    setStudentProfile(user);
    setActiveTab(user.role==='admin'?'admin-analytics':'dashboard');
    if(user.role!=='admin'){setIsSurveyOpen(true);runAiAnalysis(user);}
  };
  const handleLogout=async()=>{await logoutSession();setSession({isAuthenticated:false,user:null,token:null});setStudentProfile(null);setAiAnalysis(null);};
  const saveProfile=async(updated)=>{const result=await updateProfile(updated);const profile=result.success?result.user:updated;setStudentProfile(profile);setSession(s=>({...s,user:profile}));runAiAnalysis(profile);};
  const handleSelectTargetRole=(role)=>saveProfile({...studentProfile,targetRole:role});
  const isAdmin=studentProfile?.role==='admin';

  if(booting)return <div className="min-h-screen flex items-center justify-center bg-slate-100"><p className="text-slate-600">Loading your workspace…</p></div>;
  if(!session.isAuthenticated||!studentProfile)return <AuthPage onAuthSuccess={handleAuthSuccess}/>;

  return <div className={`min-h-screen flex flex-col ${theme==='light'?'bg-[#DFDFE3] text-slate-900':'bg-slate-950 text-slate-100'}`}>
    <Header currentUser={studentProfile} onLogout={handleLogout} onOpenProfileModal={()=>setIsProfileModalOpen(true)} onOpenSurveyModal={()=>setIsSurveyOpen(true)} theme={theme} setTheme={setTheme}/>
    <div className="flex flex-1 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onOpenProfileModal={()=>setIsProfileModalOpen(true)} currentUser={studentProfile}/>
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
        {isAdmin?<AdminDashboard onSelectStudent={student=>{setStudentProfile(student);setActiveTab('dashboard');runAiAnalysis(student);}}/>:<>
          {(activeTab==='dashboard'||activeTab==='skill-matrix')&&<SkillGapDashboard studentProfile={studentProfile} aiAnalysis={aiAnalysis} onSelectTargetRole={handleSelectTargetRole} onNavigateTab={setActiveTab} isAnalyzing={isAnalyzing} onReAnalyze={()=>runAiAnalysis(studentProfile)}/>}
          {activeTab==='courses'&&<CourseCatalog aiAnalysis={aiAnalysis}/>}
          {activeTab==='jobs'&&<JobMatcher studentProfile={studentProfile}/>}
          {activeTab==='resume'&&<ResumeEnhancer studentProfile={studentProfile}/>}
          {activeTab==='mock-interview'&&<MockInterview studentProfile={studentProfile}/>}
          {activeTab==='govt-opportunities'&&<GovtOpportunities/>}
        </>}
      </main>
    </div>
    <OnboardingSurveyModal isOpen={isSurveyOpen} onClose={()=>setIsSurveyOpen(false)} studentProfile={studentProfile} onCompleteSurvey={saveProfile}/>
    <ProfileUploadModal isOpen={isProfileModalOpen} onClose={()=>setIsProfileModalOpen(false)} studentProfile={studentProfile} onSaveProfile={saveProfile}/>
    <LoginModal isOpen={isLoginModalOpen} onClose={()=>setIsLoginModalOpen(false)} onLoginSuccess={handleAuthSuccess}/>
  </div>;
}
