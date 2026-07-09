'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Trash2, Plus, LogOut, CheckCircle, RefreshCw, Edit } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  demoLink: string | null;
  githubLink: string | null;
  tags: string;
  featured: boolean;
  order: number;
}

interface Profile {
  name: string;
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDesc: string;
  aboutTitle: string;
  aboutFocus: string;
  aboutLocation: string;
  techStack: string;
  aboutImageUrl: string | null;
  bio: string;
  cvUrl: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
}

import { useGetProfile, useUpdateProfile, useUploadCv, useUploadAboutImage } from '../../api/userApi';
import { useGetProjects, useCreateProject, useDeleteProject, useUpdateProject } from '../../api/projectApi';
import Image from 'next/image';

export default function CMSPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Custom API Hooks
  const { profile, fetchProfile } = useGetProfile();
  const { projects, fetchProjects } = useGetProjects();
  const { updateProfile, isLoading: isUpdatingProfile } = useUpdateProfile();
  const { uploadCv, isLoading: isUploadingCv } = useUploadCv();
  const { uploadAboutImage, isLoading: isUploadingAboutImage } = useUploadAboutImage();
  const { createProject, uploadProjectImage, isLoading: isCreatingProject } = useCreateProject();
  const { deleteProject } = useDeleteProject();
  const { updateProject, isLoading: isUpdatingProject } = useUpdateProject();

  const [editableProfile, setEditableProfile] = useState<Profile>({
    name: '',
    title: '',
    heroTitle: 'CREATIVE\nDEVELOPER',
    heroSubtitle: 'Full Stack Web Developer',
    heroDesc: 'SPECIALIZED IN CRAFTING PREMIUM INTERACTIVE WEBSITE SYSTEMS, WEBGL SHADER STRUCTURES, AND FLUID SCROLL GRID ANIMATIONS.',
    aboutTitle: 'A software engineer building premium visual systems for the web.',
    aboutFocus: 'Frontend Architectures & Interactive WebGL',
    aboutLocation: 'Kathmandu, Nepal',
    techStack: 'Next.js / React 19:OPTIMAL\nWebGL / GLSL:ADVANCED\nGSAP / Motion Engine:ADVANCED\nTailwind CSS v4:OPTIMAL',
    aboutImageUrl: null,
    bio: '',
    cvUrl: null,
    email: '',
    github: '',
    linkedin: '',
  });

  const [heroStatus, setHeroStatus] = useState('');
  const [profileStatus, setProfileStatus] = useState('');
  
  // Project creation form state
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    demoLink: '',
    githubLink: '',
    tags: '',
    featured: false,
    order: 0,
  });
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [projectStatus, setProjectStatus] = useState('');

  // Project editing form state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectImageFile, setEditProjectImageFile] = useState<File | null>(null);
  const [editProjectStatus, setEditProjectStatus] = useState('');

  // CV File Upload State
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvStatus, setCvStatus] = useState('');

  // About Image File Upload State
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [aboutImageStatus, setAboutImageStatus] = useState('');

  // Sync edit form fields when database profile loads
  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditableProfile(profile);
    }
  }, [profile]);

  const fetchCMSData = async () => {
    try {
      await fetchProfile();
      await fetchProjects();
    } catch (err) {
      console.error('Error fetching CMS data:', err);
    }
  };

  useEffect(() => {
    let savedToken = localStorage.getItem('portfolio_token');
    if (!savedToken) {
      const match = document.cookie.match(/(^|;)\s*portfolio_token\s*=\s*([^;]+)/);
      if (match) {
        savedToken = match[2];
        localStorage.setItem('portfolio_token', savedToken);
      }
    }
    if (savedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(savedToken);
      fetchCMSData().finally(() => {
        setIsCheckingAuth(false);
      });
    } else {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('portfolio_token');
    document.cookie = 'portfolio_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
    setToken(null);
    router.push('/');
  };

  const handleUpdateHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeroStatus('');
    try {
      if (!token) return;
      await updateProfile(editableProfile, token);
      setHeroStatus('Hero updated successfully!');
      setTimeout(() => setHeroStatus(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setHeroStatus(`Error: ${errorMsg}`);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus('');
    try {
      if (!token) return;
      await updateProfile(editableProfile, token);
      setProfileStatus('Profile updated successfully!');
      setTimeout(() => setProfileStatus(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setProfileStatus(`Error: ${errorMsg}`);
    }
  };

  const handleUploadAboutImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutImageFile || !token) return;
    setAboutImageStatus('');
    try {
      await uploadAboutImage(aboutImageFile, token);
      setAboutImageStatus('About image uploaded successfully!');
      setAboutImageFile(null);
      setTimeout(() => setAboutImageStatus(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setAboutImageStatus(`Error: ${errorMsg}`);
    }
  };

  const handleUploadCv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile || !token) return;
    setCvStatus('');
    try {
      await uploadCv(cvFile, token);
      setCvStatus('CV uploaded successfully!');
      setCvFile(null);
      setTimeout(() => setCvStatus(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setCvStatus(`Error: ${errorMsg}`);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectStatus('');
    try {
      if (!token) return;
      let imageUrl = null;

      if (projectImageFile) {
        imageUrl = await uploadProjectImage(projectImageFile, token);
      }

      await createProject({
        ...newProject,
        imageUrl,
      }, token);

      setProjectStatus('Project added successfully!');
      setNewProject({
        title: '',
        description: '',
        demoLink: '',
        githubLink: '',
        tags: '',
        featured: false,
        order: 0,
      });
      setProjectImageFile(null);
      setTimeout(() => setProjectStatus(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setProjectStatus(`Error: ${errorMsg}`);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setEditProjectStatus('');
    try {
      if (!token) return;
      let imageUrl = editingProject.imageUrl;

      if (editProjectImageFile) {
        imageUrl = await uploadProjectImage(editProjectImageFile, token);
      }

      await updateProject(editingProject.id, {
        title: editingProject.title,
        description: editingProject.description,
        demoLink: editingProject.demoLink,
        githubLink: editingProject.githubLink,
        tags: editingProject.tags,
        featured: editingProject.featured,
        order: editingProject.order,
        imageUrl,
      }, token);

      setEditProjectStatus('Project updated successfully!');
      setEditingProject(null);
      setEditProjectImageFile(null);
      setTimeout(() => setEditProjectStatus(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setEditProjectStatus(`Error: ${errorMsg}`);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      if (!token) return;
      await deleteProject(id, token);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      alert(errorMsg);
    }
  };

  // --- AUTH CHECK LOADING ---
  if (isCheckingAuth) {
    return (
      <main className="flex h-screen w-full items-center justify-center bg-[#050507] text-[#e2e8f0] font-mono">
        <div className="flex items-center gap-3">
          <RefreshCw className="animate-spin text-sky-400" size={20} />
          <span className="text-xs uppercase tracking-widest text-zinc-500">Authenticating Terminal Session...</span>
        </div>
      </main>
    );
  }

  // --- ADMIN PANEL VIEW ---
  return (
    <main className="min-h-screen bg-[#050507] text-[#e2e8f0] py-12 px-6 lg:px-16 font-sans">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between border-b border-zinc-800 pb-6 mb-12">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-sky-400 via-rose-500 to-emerald-400">
            PORTFOLIO CENTRAL CMS
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-1 uppercase tracking-widest">
            Active Server: {process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 px-4 py-2 rounded text-sm hover:bg-zinc-900 hover:text-red-400 transition-all font-mono"
          >
            <LogOut size={16} /> LOGOUT
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Profile & CV (5 Columns) */}
        <div className="lg:col-span-5 space-y-12">

          {/* 🌟 Hero Section Editor */}
          <section className="border border-violet-800/60 bg-violet-950/20 backdrop-blur p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-1 text-violet-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" /> Hero Section
            </h2>
            <p className="text-zinc-600 text-xs font-mono mb-6">Controls the giant title and subtitle on your landing page.</p>
            {heroStatus && (
              <div className="mb-4 text-xs font-mono bg-zinc-900 p-2 border border-zinc-800 text-violet-300 rounded flex items-center gap-2">
                <CheckCircle size={14} /> {heroStatus}
              </div>
            )}
            <form onSubmit={handleUpdateHero} className="space-y-4 font-mono text-sm">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">
                  Hero Title <span className="text-violet-500 ml-1">(one line = one row of text)</span>
                </label>
                <textarea
                  value={editableProfile.heroTitle}
                  onChange={(e) => setEditableProfile({ ...editableProfile, heroTitle: e.target.value })}
                  rows={2}
                  className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-violet-500 text-sm resize-none uppercase tracking-widest font-extrabold"
                  placeholder={"CREATIVE\nDEVELOPER"}
                />
                <p className="text-[10px] text-zinc-600 mt-1 font-mono">Press Enter to split text onto a new line in the hero.</p>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Hero Subtitle</label>
                <input
                  type="text"
                  value={editableProfile.heroSubtitle}
                  onChange={(e) => setEditableProfile({ ...editableProfile, heroSubtitle: e.target.value })}
                  className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-violet-500 text-sm"
                  placeholder="Full Stack Web Developer"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Hero Description</label>
                <textarea
                  value={editableProfile.heroDesc}
                  onChange={(e) => setEditableProfile({ ...editableProfile, heroDesc: e.target.value })}
                  rows={2}
                  className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-violet-500 text-xs"
                  placeholder="SPECIALIZED IN CRAFTING..."
                />
              </div>
              {/* Live Preview */}
              <div className="border border-zinc-800/60 bg-zinc-950 rounded-lg p-4">
                <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest mb-3">Live Preview</p>
                <div className="text-2xl font-extrabold tracking-tighter leading-none text-transparent bg-clip-text bg-linear-to-r from-white via-sky-400 to-rose-400 uppercase">
                  {(editableProfile.heroTitle || '').split('\n').filter(Boolean).map((line, i, arr) => (
                    <div key={i}>
                      {line}{i === arr.length - 1 && <span className="text-sky-400">.</span>}
                    </div>
                  ))}
                </div>
                <p className="text-zinc-500 text-xs font-mono mt-2">{editableProfile.heroSubtitle}</p>
              </div>
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full flex items-center justify-center gap-2 bg-violet-500 text-zinc-950 font-bold py-2.5 rounded hover:bg-violet-400 transition-colors uppercase tracking-wider text-xs"
              >
                {isUpdatingProfile ? <RefreshCw className="animate-spin" size={14} /> : 'SAVE HERO SECTION'}
              </button>
            </form>
          </section>

          {/* Profile Details Card */}
          <section className="border border-zinc-800 bg-zinc-950/40 backdrop-blur p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-6 text-sky-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" /> Profile Settings
            </h2>
            {profileStatus && (
              <div className="mb-4 text-xs font-mono bg-zinc-900 p-2 border border-zinc-800 text-sky-300 rounded flex items-center gap-2">
                <CheckCircle size={14} /> {profileStatus}
              </div>
            )}
            <form onSubmit={handleUpdateProfile} className="space-y-4 font-mono text-sm">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Name</label>
                <input
                  type="text"
                  value={editableProfile.name}
                  onChange={(e) => setEditableProfile({ ...editableProfile, name: e.target.value })}
                  className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-sky-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Job Title</label>
                <input
                  type="text"
                  value={editableProfile.title}
                  onChange={(e) => setEditableProfile({ ...editableProfile, title: e.target.value })}
                  className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-sky-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Biography</label>
                <textarea
                  value={editableProfile.bio}
                  onChange={(e) => setEditableProfile({ ...editableProfile, bio: e.target.value })}
                  rows={4}
                  className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-sky-500 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">About Section Title</label>
                <textarea
                  value={editableProfile.aboutTitle}
                  onChange={(e) => setEditableProfile({ ...editableProfile, aboutTitle: e.target.value })}
                  rows={2}
                  className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-sky-500 text-sm resize-none"
                  placeholder="A software engineer building..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Core Focus</label>
                  <input
                    type="text"
                    value={editableProfile.aboutFocus}
                    onChange={(e) => setEditableProfile({ ...editableProfile, aboutFocus: e.target.value })}
                    className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-sky-500 text-sm"
                    placeholder="Frontend Architectures & Interactive WebGL"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Location</label>
                  <input
                    type="text"
                    value={editableProfile.aboutLocation}
                    onChange={(e) => setEditableProfile({ ...editableProfile, aboutLocation: e.target.value })}
                    className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-sky-500 text-sm"
                    placeholder="Kathmandu, Nepal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Tech Stack Config (Format: Name:Level per line)</label>
                <textarea
                  value={editableProfile.techStack}
                  onChange={(e) => setEditableProfile({ ...editableProfile, techStack: e.target.value })}
                  rows={4}
                  className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-sky-500 text-xs resize-none font-mono"
                  placeholder="Next.js / React 19:OPTIMAL&#10;WebGL / GLSL:ADVANCED"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={editableProfile.email || ''}
                  onChange={(e) => setEditableProfile({ ...editableProfile, email: e.target.value })}
                  className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-sky-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">GitHub Profile</label>
                  <input
                    type="url"
                    value={editableProfile.github || ''}
                    onChange={(e) => setEditableProfile({ ...editableProfile, github: e.target.value })}
                    className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-sky-500 text-xs"
                    placeholder="https://"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={editableProfile.linkedin || ''}
                    onChange={(e) => setEditableProfile({ ...editableProfile, linkedin: e.target.value })}
                    className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-sky-500 text-xs"
                    placeholder="https://"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full flex items-center justify-center gap-2 bg-sky-500 text-zinc-950 font-bold py-2.5 rounded hover:bg-sky-400 transition-colors mt-6 uppercase tracking-wider text-xs"
              >
                {isUpdatingProfile ? <RefreshCw className="animate-spin" size={14} /> : 'SAVE CHANGES'}
              </button>
            </form>
          </section>

          {/* CV Document Uploader Card */}
          <section className="border border-zinc-800 bg-zinc-950/40 backdrop-blur p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Curriculum Vitae (CV)
            </h2>
            <p className="text-zinc-500 text-xs mb-6 font-mono">
              Current CV Location:{' '}
              {profile.cvUrl ? (
                <a
                  href={profile.cvUrl.startsWith('http') ? profile.cvUrl : `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}${profile.cvUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 underline hover:text-emerald-300"
                >
                  View uploaded PDF
                </a>
              ) : (
                'No CV File Uploaded'
              )}
            </p>
            {cvStatus && (
              <div className="mb-4 text-xs font-mono bg-zinc-900 p-2 border border-zinc-800 text-emerald-300 rounded flex items-center gap-2">
                <CheckCircle size={14} /> {cvStatus}
              </div>
            )}
            <form onSubmit={handleUploadCv} className="space-y-4 font-mono">
              <div className="border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 p-6 rounded-lg text-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => e.target.files && setCvFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto text-zinc-600 mb-2" size={24} />
                <span className="text-xs text-zinc-400 block">
                  {cvFile ? cvFile.name : 'Click to select CV document (.PDF)'}
                </span>
              </div>
              {cvFile && (
                <button
                  type="submit"
                  disabled={isUploadingCv}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-zinc-950 font-bold py-2.5 rounded hover:bg-emerald-400 transition-colors uppercase tracking-wider text-xs"
                >
                  {isUploadingCv ? <RefreshCw className="animate-spin" size={14} /> : 'UPLOAD PDF'}
                </button>
              )}
            </form>
          </section>

          {/* 🌟 About Image CRUD Section */}
          <section className="border border-zinc-800 bg-zinc-950/40 backdrop-blur p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 text-sky-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" /> About Section Image
            </h2>
            <p className="text-zinc-500 text-xs mb-6 font-mono">
              Upload a custom abstract cover image to represent your biography column.
            </p>
            {profile.aboutImageUrl ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-zinc-900 mb-6 bg-zinc-900 select-none">
                <Image
                  src={profile.aboutImageUrl.startsWith('http') ? profile.aboutImageUrl : `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}${profile.aboutImageUrl}`}
                  alt="About cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover grayscale brightness-75"
                />
              </div>
            ) : (
              <div className="w-full aspect-video rounded-lg border border-zinc-900 bg-zinc-900/40 mb-6 flex items-center justify-center font-mono text-[10px] text-zinc-600 select-none">
                USING DEFAULT UNSPLASH ARCHITECTURAL IMAGE
              </div>
            )}

            {aboutImageStatus && (
              <div className="mb-4 text-xs font-mono bg-zinc-900 p-2 border border-zinc-800 text-sky-300 rounded flex items-center gap-2">
                <CheckCircle size={14} /> {aboutImageStatus}
              </div>
            )}
            <form onSubmit={handleUploadAboutImage} className="space-y-4 font-mono">
              <div className="border-2 border-dashed border-zinc-800 hover:border-sky-500/50 p-6 rounded-lg text-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setAboutImageFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto text-zinc-600 mb-2" size={24} />
                <span className="text-xs text-zinc-400 block">
                  {aboutImageFile ? aboutImageFile.name : 'Click to select cover image (.PNG, .JPG)'}
                </span>
              </div>
              {aboutImageFile && (
                <button
                  type="submit"
                  disabled={isUploadingAboutImage}
                  className="w-full flex items-center justify-center gap-2 bg-sky-500 text-zinc-950 font-bold py-2.5 rounded hover:bg-sky-400 transition-colors uppercase tracking-wider text-xs"
                >
                  {isUploadingAboutImage ? <RefreshCw className="animate-spin" size={14} /> : 'UPLOAD COVER IMAGE'}
                </button>
              )}
            </form>
          </section>
        </div>

        {/* Right Column: Projects (7 Columns) */}
        <div className="lg:col-span-7 space-y-12">
          {editingProject ? (
            /* Edit Existing Project Form */
            <section id="projects-form-container" className="border border-zinc-800 bg-zinc-950/40 backdrop-blur p-8 rounded-xl">
              <h2 className="text-xl font-bold mb-6 text-amber-500 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Edit size={20} /> Edit Portfolio Project
                </span>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="text-xs border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-zinc-300 px-3 py-1.5 rounded transition-all"
                >
                  CANCEL EDIT
                </button>
              </h2>
              {editProjectStatus && (
                <div className="mb-4 text-xs font-mono bg-zinc-900 p-2 border border-zinc-800 text-amber-300 rounded flex items-center gap-2">
                  <CheckCircle size={14} /> {editProjectStatus}
                </div>
              )}
              <form onSubmit={handleUpdateProject} className="space-y-4 font-mono text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs text-zinc-500 mb-1">Project Title</label>
                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      required
                      className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Order Index</label>
                    <input
                      type="number"
                      value={editingProject.order}
                      onChange={(e) => setEditingProject({ ...editingProject, order: parseInt(e.target.value, 10) || 0 })}
                      className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Short Description</label>
                  <input
                    type="text"
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    required
                    className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Live Demo URL</label>
                    <input
                      type="url"
                      value={editingProject.demoLink || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, demoLink: e.target.value || null })}
                      className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-amber-500 text-xs"
                      placeholder="https://"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Source Code URL (GitHub)</label>
                    <input
                      type="url"
                      value={editingProject.githubLink || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, githubLink: e.target.value || null })}
                      className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-amber-500 text-xs"
                      placeholder="https://"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={editingProject.tags}
                    onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value })}
                    required
                    className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-amber-500 text-xs"
                    placeholder="React, Three.js, GSAP"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Project Screenshot</label>
                  <div className="border border-zinc-800 bg-zinc-900/40 hover:border-amber-500/50 p-4 rounded text-center cursor-pointer transition-colors relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && setEditProjectImageFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-400 block">
                      {editProjectImageFile ? editProjectImageFile.name : (editingProject.imageUrl ? 'Keep Current Screenshot or Select New' : 'Select JPG/PNG Screenshot')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="edit-featured"
                    checked={editingProject.featured}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="h-4 w-4 bg-zinc-900 border-zinc-800 rounded accent-amber-500"
                  />
                  <label htmlFor="edit-featured" className="text-xs text-zinc-400 select-none cursor-pointer">
                    Feature this project prominently on landing page
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isUpdatingProject}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 text-zinc-950 font-bold py-2.5 rounded hover:bg-amber-400 transition-colors mt-4 uppercase tracking-wider text-xs"
                >
                  {isUpdatingProject ? <RefreshCw className="animate-spin" size={14} /> : 'UPDATE PROJECT DETAILS'}
                </button>
              </form>
            </section>
          ) : (
            /* Add New Project Card */
            <section id="projects-form-container" className="border border-zinc-800 bg-zinc-950/40 backdrop-blur p-8 rounded-xl">
              <h2 className="text-xl font-bold mb-6 text-rose-500 flex items-center gap-2">
                <Plus size={20} /> Add Portfolio Project
              </h2>
              {projectStatus && (
                <div className="mb-4 text-xs font-mono bg-zinc-900 p-2 border border-zinc-800 text-rose-300 rounded flex items-center gap-2">
                  <CheckCircle size={14} /> {projectStatus}
                </div>
              )}
              <form onSubmit={handleCreateProject} className="space-y-4 font-mono text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs text-zinc-500 mb-1">Project Title</label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      required
                      className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-rose-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Order Index</label>
                    <input
                      type="number"
                      value={newProject.order}
                      onChange={(e) => setNewProject({ ...newProject, order: parseInt(e.target.value, 10) })}
                      className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-rose-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Short Description</label>
                  <input
                    type="text"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    required
                    className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-rose-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Live Demo URL</label>
                    <input
                      type="url"
                      value={newProject.demoLink}
                      onChange={(e) => setNewProject({ ...newProject, demoLink: e.target.value })}
                      className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-rose-500 text-xs"
                      placeholder="https://"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Source Code URL (GitHub)</label>
                    <input
                      type="url"
                      value={newProject.githubLink}
                      onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                      className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-rose-500 text-xs"
                      placeholder="https://"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                    required
                    className="w-full border border-zinc-800 bg-zinc-900/60 p-2.5 rounded focus:outline-none focus:border-rose-500 text-xs"
                    placeholder="React, Three.js, GSAP"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Project Screenshot</label>
                  <div className="border border-zinc-800 bg-zinc-900/40 hover:border-rose-500/50 p-4 rounded text-center cursor-pointer transition-colors relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && setProjectImageFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-400 block">
                      {projectImageFile ? projectImageFile.name : 'Select JPG/PNG Screenshot'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newProject.featured}
                    onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                    className="h-4 w-4 bg-zinc-900 border-zinc-800 rounded accent-rose-500"
                  />
                  <label htmlFor="featured" className="text-xs text-zinc-400 select-none cursor-pointer">
                    Feature this project prominently on landing page
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isCreatingProject}
                  className="w-full flex items-center justify-center gap-2 bg-rose-500 text-zinc-950 font-bold py-2.5 rounded hover:bg-rose-400 transition-colors mt-4 uppercase tracking-wider text-xs"
                >
                  {isCreatingProject ? <RefreshCw className="animate-spin" size={14} /> : 'ADD PROJECT LINK'}
                </button>
              </form>
            </section>
          )}

          {/* Active Projects List */}
          <section className="border border-zinc-800 bg-zinc-950/40 backdrop-blur p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-6 text-zinc-300">Active Portfolio Projects ({projects.length})</h2>
            <div className="space-y-4">
              {projects.length === 0 ? (
                <p className="text-zinc-600 font-mono text-xs text-center py-4">No projects added yet.</p>
              ) : (
                projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="flex items-center justify-between border border-zinc-900 bg-zinc-900/30 p-4 rounded-lg hover:border-zinc-800 transition-all font-mono"
                  >
                    <div className="max-w-[80%]">
                      <span className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-0.5">ORDER {proj.order}</span>
                      <h3 className="text-sm font-bold text-zinc-200">{proj.title}</h3>
                      <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.tags.split(',').map((tag) => (
                          <span key={tag} className="text-[9px] bg-zinc-800/80 text-zinc-400 px-1.5 py-0.5 rounded">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          // Scroll smoothly to projects section edit area
                          const projSection = document.getElementById('projects-form-container');
                          if (projSection) {
                            projSection.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="text-zinc-600 hover:text-amber-500 p-2 hover:bg-zinc-800/40 rounded transition-all"
                        title="Edit Project"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-zinc-600 hover:text-red-500 p-2 hover:bg-zinc-800/40 rounded transition-all"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
