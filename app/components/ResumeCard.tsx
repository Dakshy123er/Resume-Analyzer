import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };
    loadResume();
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="block group mb-6 transform transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex flex-col gap-1">
            {companyName && (
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {companyName}
              </h2>
            )}
            {jobTitle && (
              <h3 className="text-sm font-medium text-gray-500">
                {jobTitle}
              </h3>
            )}
            {!companyName && !jobTitle && (
              <h2 className="text-lg font-bold text-gray-900">Resume</h2>
            )}
          </div>

          {feedback?.overallScore !== undefined && (
            <ScoreCircle score={feedback.overallScore} />
          )}
        </div>

        {/* Image */}
        {resumeUrl && (
          <div className="relative">
            <img
              src={resumeUrl}
              alt="resume preview"
              className="w-full h-[350px] max-sm:h-[200px] object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 text-sm text-gray-500 flex justify-between items-center">
          <span>View Resume</span>
          <span className="text-blue-500 group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;
