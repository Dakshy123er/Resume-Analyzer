import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resumes?.map((resume) => JSON.parse(resume.value) as Resume);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);

  return (
    <main className="bg-gradient-to-b from-white via-indigo-50 to-indigo-100 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Track Your Applications &{" "}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Resume ATS Ratings
            </span>
          </h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              No resumes yet? Upload your first one and{" "}
              <span className="font-semibold text-sky-600">
                let AI review it instantly.
              </span>
            </p>
          ) : (
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Review your submissions, track progress, and see{" "}
              <span className="font-semibold text-sky-500">
                AI-powered insights
              </span>{" "}
              at a glance.
            </p>
          )}
        </motion.div>

        {/* Loader */}
        {loadingResumes && (
          <motion.div
            className="flex flex-col items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <img src="/images/resume-scan-2.gif" className="w-[220px]" />
            <p className="text-gray-600 text-lg font-medium">
              Scanning your resumes...
            </p>
          </motion.div>
        )}

        {/* Resume Cards */}
        {!loadingResumes && resumes.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
              >
                <ResumeCard resume={resume} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loadingResumes && resumes?.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center mt-12 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white shadow-md rounded-xl p-6 max-w-md text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Ready to get started?
              </h2>
              <p className="mt-2 text-gray-600">
                Upload your resume to receive instant, personalized feedback.
              </p>
              <Link
                to="/upload"
                className="mt-6 inline-block px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white text-lg font-semibold rounded-lg shadow-md transition-all duration-200"
              >
                Upload Resume
              </Link>
            </div>
          </motion.div>
        )}
      </section>
    </main>
  );
}
